import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { put } from '@vercel/blob';
import { buildDocumentPrompt, buildAutoDocumentPrompt, STATE_MODULES } from '../lib/state-modules.js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: { bodyParser: false },
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function generateDocuments(metadata) {
  const stateCode = metadata.stateCode || 'MI';
  const isAuto = metadata.workType === 'automotive';

  const { prompt, lienDeadlineStr, daysRemaining, filingDeadlineStr } = isAuto
    ? buildAutoDocumentPrompt(stateCode, metadata)
    : buildDocumentPrompt(stateCode, metadata);

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });

  return {
    raw: message.content[0].text,
    deadlineStr: isAuto ? filingDeadlineStr : lienDeadlineStr,
    daysRemaining,
    isAuto,
  };
}

function formatDocumentsAsHtml(rawDocuments, metadata) {
  const { claimantName, amountOwed, stateCode, workType, vehicleDescription, propertyAddress, propertyCity } = metadata;
  const isAuto = workType === 'automotive';
  const stateModule = STATE_MODULES[stateCode || 'MI'];
  const docs = rawDocuments.split('---DOCUMENT BREAK---').map(d => d.trim()).filter(Boolean);

  const docSections = docs.map(doc => `
    <div style="background:#f9f9f9;border:1px solid #e0e0e0;border-radius:8px;padding:32px;margin-bottom:32px;font-family:Georgia,serif;font-size:14px;line-height:1.8;white-space:pre-wrap;">
      ${doc}
    </div>
  `).join('');

  const subjectLine = isAuto
    ? `${vehicleDescription} — $${parseInt(amountOwed).toLocaleString()}`
    : `${propertyAddress}, ${propertyCity} — $${parseInt(amountOwed).toLocaleString()}`;

  const statuteNote = isAuto
    ? "Michigan Garage Keeper's Lien Act (MCL 570.301 et seq.)"
    : stateModule.statute;

  const docSections = docs.map(doc => `
    <div style="background:#f9f9f9;border:1px solid #e0e0e0;border-radius:8px;padding:32px;margin-bottom:32px;font-family:Georgia,serif;font-size:14px;line-height:1.8;white-space:pre-wrap;">
      ${doc}
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>LodgeMiLien Documents — ${claimantName}</title>
    </head>
    <body style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:40px 20px;color:#1a1a1a;">
      <div style="background:#0d1117;padding:20px 28px;border-radius:8px;margin-bottom:32px;">
        <span style="font-size:24px;font-weight:800;color:#fff;">Lodge<span style="color:#f5a623;">Mi</span>Lien</span>
        <p style="color:rgba(255,255,255,0.6);margin:8px 0 0;font-size:13px;">${isAuto ? "Michigan Garage Keeper's Lien Service" : stateModule.name + ' Mechanics Lien Document Service'}</p>
      </div>

      <h2 style="font-size:20px;font-weight:700;margin-bottom:4px;">Your Documents Are Ready</h2>
      <p style="color:#555;font-size:14px;margin-bottom:8px;">
        Prepared for <strong>${claimantName}</strong> regarding
        <strong>${subjectLine}</strong>
      </p>
      <p style="color:#555;font-size:13px;margin-bottom:32px;">
        Applicable law: ${statuteNote}
      </p>

      ${docSections}

      <div style="background:#fff8e8;border:1px solid #f5a623;border-radius:8px;padding:20px;margin-top:32px;">
        <p style="font-size:13px;color:#7a5c00;margin:0;line-height:1.6;">
          <strong>Important:</strong> These documents have been prepared by LodgeMiLien LLC and reviewed for accuracy.
          LodgeMiLien is a document preparation service and not a law firm.
          This is not legal advice. If you have questions about your specific situation,
          consult a licensed Michigan attorney.
        </p>
      </div>

      <p style="font-size:12px;color:#999;margin-top:32px;text-align:center;">
        LodgeMiLien LLC · lodgemilien.com · hello@lodgemilien.com
      </p>
    </body>
    </html>
  `;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata;

    try {
      const { raw, deadlineStr, daysRemaining, isAuto } = await generateDocuments(metadata);
      const htmlDocuments = formatDocumentsAsHtml(raw, metadata);

      await put(
        `orders/${session.id}.json`,
        JSON.stringify({ sessionId: session.id, metadata, htmlDocuments }),
        { access: 'public', contentType: 'application/json' }
      );

      const stateModule = STATE_MODULES[metadata.stateCode || 'MI'];
      const proofUrl = metadata.proofUrl || 'No proof uploaded';
      const orderType = isAuto ? "Garage Keeper's Lien" : 'Mechanics Lien';
      const subjectDesc = isAuto
        ? `${metadata.vehicleDescription}`
        : `${metadata.propertyAddress}, ${metadata.propertyCity}`;

      const detailRows = isAuto ? `
        <tr><td style="padding:8px 0;color:#666;width:140px;">Type</td><td style="padding:8px 0;font-weight:500;">Garage Keeper's Lien — Michigan</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Shop</td><td style="padding:8px 0;font-weight:500;">${metadata.claimantName}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;">${metadata.claimantEmail}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Phone</td><td style="padding:8px 0;">${metadata.claimantPhone}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Vehicle</td><td style="padding:8px 0;">${metadata.vehicleDescription}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">VIN</td><td style="padding:8px 0;font-family:monospace;">${metadata.vin}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Owner</td><td style="padding:8px 0;">${metadata.ownerName}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Amount</td><td style="padding:8px 0;font-weight:600;">$${parseInt(metadata.amountOwed).toLocaleString()}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">MVSR License</td><td style="padding:8px 0;">${metadata.licenseNumber || 'Not provided'}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">BDVR-35 deadline</td><td style="padding:8px 0;${daysRemaining <= 21 ? 'color:#e84040;font-weight:600;' : ''}">${deadlineStr} (${daysRemaining} days)</td></tr>
      ` : `
        <tr><td style="padding:8px 0;color:#666;width:140px;">Type</td><td style="padding:8px 0;font-weight:500;">Mechanics Lien — ${stateModule.name}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Customer</td><td style="padding:8px 0;font-weight:500;">${metadata.claimantName}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;">${metadata.claimantEmail}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Phone</td><td style="padding:8px 0;">${metadata.claimantPhone}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Property</td><td style="padding:8px 0;">${metadata.propertyAddress}, ${metadata.propertyCity}, ${metadata.propertyCounty} County</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Owner</td><td style="padding:8px 0;">${metadata.ownerName}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Amount disputed</td><td style="padding:8px 0;font-weight:600;">$${parseInt(metadata.amountOwed).toLocaleString()}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Project type</td><td style="padding:8px 0;">${metadata.projectType || 'Not specified'}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Filing coordination</td><td style="padding:8px 0;${metadata.filingCoordination === 'true' ? 'color:#f5a623;font-weight:600;' : 'color:#666;'}">${metadata.filingCoordination === 'true' ? 'YES — you need to coordinate filing' : 'No'}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Lien deadline</td><td style="padding:8px 0;${daysRemaining <= 14 ? 'color:#e84040;font-weight:600;' : ''}">${deadlineStr} (${daysRemaining} days)</td></tr>
      `;

      await resend.emails.send({
        from: 'LodgeMiLien <hello@lodgemilien.com>',
        to: process.env.NOTIFICATION_EMAIL,
        subject: `[REVIEW REQUIRED] ${orderType} — ${metadata.claimantName} — ${subjectDesc}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
            <div style="background:#0d1117;padding:16px 24px;border-radius:8px;margin-bottom:24px;">
              <span style="font-size:20px;font-weight:800;color:#fff;">Lodge<span style="color:#f5a623;">Mi</span>Lien</span>
              <p style="color:rgba(255,255,255,0.5);margin:4px 0 0;font-size:12px;">Manual Review Required — ${orderType}</p>
            </div>

            <h2 style="margin-bottom:4px;">New Order Pending Approval</h2>
            <p style="color:#666;margin-bottom:24px;">Review the proof of work and approve in your admin dashboard.</p>

            <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px;">
              ${detailRows}
            </table>

            <div style="background:#f5f5f5;border-radius:8px;padding:16px;margin-bottom:24px;">
              <p style="font-size:13px;font-weight:600;margin-bottom:8px;">Proof of Work:</p>
              <a href="${proofUrl}" style="color:#1a6ef5;font-size:13px;word-break:break-all;">${proofUrl}</a>
            </div>

            <a href="https://lodgemilien.com/admin" style="display:inline-block;background:#f5a623;color:#0d1117;font-weight:700;font-size:16px;padding:14px 28px;border-radius:8px;text-decoration:none;">
              Review &amp; Approve in Dashboard
            </a>

            <p style="font-size:12px;color:#999;margin-top:24px;">Session ID: ${session.id}</p>
          </div>
        `,
      });

    } catch (err) {
      console.error('Webhook processing error:', err);
      return res.status(500).json({ error: 'Failed to process order' });
    }
  }

  res.status(200).json({ received: true });
}
