import { list, put, del } from '@vercel/blob';
import { Resend } from 'resend';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

const resend = new Resend(process.env.RESEND_API_KEY);

// ── HTML → PDF ────────────────────────────────────────────────────────────────
async function htmlToPdf(htmlContent) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  try {
    const page = await browser.newPage();

    // Inject base styles to ensure fonts and layout render correctly
    const styledHtml = htmlContent.replace(
      '<head>',
      `<head>
      <style>
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>`
    );

    await page.setContent(styledHtml, { waitUntil: 'networkidle0', timeout: 30000 });

    const pdfBuffer = await page.pdf({
      format: 'Letter',
      margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
      printBackground: true,
      displayHeaderFooter: false,
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

// ── Email body (simple wrapper — documents are the attachment) ─────────────────
function buildEmailBody(metadata) {
  const {
    claimantName, workType, vehicleDescription, propertyAddress,
    propertyCity, propertyCounty, amountOwed,
  } = metadata;

  const isAuto = workType === 'automotive';
  const matterLine = isAuto
    ? `${vehicleDescription}`
    : `${propertyAddress}, ${propertyCity} — ${propertyCounty} County`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;max-width:600px;margin:0 auto;padding:40px 20px;">

  <div style="margin-bottom:32px;">
    <span style="font-size:18px;font-weight:700;color:#0d1117;">Lodge<span style="color:#f5a623;">Mi</span>Lien</span>
    <span style="font-size:13px;color:#888;margin-left:8px;">Document Preparation Service</span>
  </div>

  <h2 style="font-size:22px;font-weight:700;color:#0d1117;margin-bottom:8px;">Your Documents Are Ready</h2>
  <p style="color:#555;font-size:15px;line-height:1.6;margin-bottom:24px;">
    Your lien documents for <strong>${matterLine}</strong> have been reviewed and are attached to this email as a PDF.
  </p>

  <div style="background:#f4f1ec;border-radius:8px;padding:20px 24px;margin-bottom:24px;">
    <table style="width:100%;font-size:14px;border-collapse:collapse;">
      <tr>
        <td style="color:#777;padding:5px 0;width:140px;">Prepared for</td>
        <td style="font-weight:600;color:#0d1117;">${claimantName}</td>
      </tr>
      <tr>
        <td style="color:#777;padding:5px 0;">Matter</td>
        <td style="color:#0d1117;">${matterLine}</td>
      </tr>
      <tr>
        <td style="color:#777;padding:5px 0;">Amount in dispute</td>
        <td style="color:#0d1117;">$${parseInt(amountOwed).toLocaleString()}</td>
      </tr>
    </table>
  </div>

  <p style="color:#555;font-size:14px;line-height:1.6;margin-bottom:8px;">
    Please review your documents carefully before filing or serving. If you have any questions or need to make corrections, reply to this email.
  </p>

  <p style="color:#555;font-size:14px;line-height:1.6;margin-bottom:32px;">
    <strong>Next step:</strong> Follow the filing instructions included in your documents.
  </p>

  <hr style="border:none;border-top:1px solid #e0e0e0;margin-bottom:24px;">
  <p style="font-size:12px;color:#999;line-height:1.7;">
    LodgeMiLien LLC · Troy, Michigan<br>
    This is a document preparation service. LodgeMiLien is not a law firm and this is not legal advice.<br>
    Serving Michigan, Indiana &amp; Ohio · Florida coming soon
  </p>

</body>
</html>`;
}

// ── Main Handler ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { sessionId, editedHtml } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

  try {
    // ── Fetch order data ──
    const { blobs } = await list({ prefix: `orders/${sessionId}` });
    if (!blobs || blobs.length === 0) {
      return res.status(404).json({ error: 'Order not found or already processed' });
    }

    const blobRes = await fetch(blobs[0].url);
    const orderData = await blobRes.json();
    const metadata = orderData.metadata || {};

    // ── Get HTML documents ──
    let htmlDocuments = editedHtml;

    if (!htmlDocuments) {
      // Fetch from completed blob if already generated, or pending
      const docsBlobs = await list({ prefix: `documents/${sessionId}` });
      if (docsBlobs.blobs && docsBlobs.blobs.length > 0) {
        const docsRes = await fetch(docsBlobs.blobs[0].url);
        htmlDocuments = await docsRes.text();
      }
    }

    if (!htmlDocuments) {
      return res.status(400).json({ error: 'No documents found for this order. Regenerate from the document panel first.' });
    }

    const email = metadata.claimantEmail || orderData.emailSentTo;
    if (!email) return res.status(400).json({ error: 'No email address on order' });

    const claimantName = metadata.claimantName || 'Client';

    // ── Generate PDF ──
    const pdfBuffer = await htmlToPdf(htmlDocuments);

    const isAuto = metadata.workType === 'automotive';
    const safeFileName = claimantName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    const pdfFileName = `LodgeMiLien_${safeFileName}_Lien_Documents.pdf`;

    // ── Send email with PDF attachment ──
    await resend.emails.send({
      from: 'LodgeMiLien <docs@lodgemilien.com>',
      to: [email],
      subject: `Your Lien Documents — ${claimantName}`,
      html: buildEmailBody(metadata),
      attachments: [
        {
          filename: pdfFileName,
          content: pdfBuffer.toString('base64'),
        },
      ],
    });

    // ── Archive order to completed/ ──
    await put(
      `completed/${sessionId}.json`,
      JSON.stringify({
        ...orderData,
        completedAt: new Date().toISOString(),
        emailSentTo: email,
        pdfGenerated: true,
      }),
      { access: 'public', contentType: 'application/json' }
    );

    // ── Remove from pending queue ──
    await del(blobs[0].url);

    return res.status(200).json({ success: true, emailSentTo: email, pdfGenerated: true });

  } catch (err) {
    console.error('Approve error:', err);
    return res.status(500).json({ error: err.message });
  }
}
