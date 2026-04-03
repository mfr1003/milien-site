import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { put, list } from '@vercel/blob';
import Stripe from 'stripe';
import { buildDocumentPrompt, buildAutoDocumentPrompt, STATE_MODULES } from '../lib/state-modules.js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

function packageFromAmount(amountTotal) {
  switch (amountTotal) {
    case 9700:  return { packageType: 'demand', filingCoordination: 'false' };
    case 17200: return { packageType: 'demand', filingCoordination: 'true' };
    case 19700: return { packageType: 'full',   filingCoordination: 'false' };
    case 27200: return { packageType: 'full',   filingCoordination: 'true' };
    default:    return { packageType: 'full',   filingCoordination: 'false' };
  }
}

async function getIntakeByEmail(email) {
  const safeEmail = email.toLowerCase().trim().replace(/[^a-z0-9._+-]/g, '_');
  const prefix = `intakes/${safeEmail}/`;
  try {
    const { blobs } = await list({ prefix });
    if (!blobs || blobs.length === 0) return null;
    blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    const res = await fetch(blobs[0].url);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Intake lookup error:', err);
    return null;
  }
}

// ── Logo Scraper ─────────────────────────────────────────────────────────────
async function scrapeLogoFromWebsite(websiteUrl) {
  if (!websiteUrl) return null;

  try {
    // Normalize URL
    let url = websiteUrl.trim();
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LodgeMiLien/1.0)' },
    });
    clearTimeout(timeout);

    if (!response.ok) return null;

    const html = await response.text();
    const baseUrl = new URL(url).origin;

    // Priority 1: og:image meta tag
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (ogMatch) {
      const src = resolveUrl(ogMatch[1], baseUrl);
      if (src) return src;
    }

    // Priority 2: logo in header/nav by class or id
    const logoPatterns = [
      /<(?:img|source)[^>]+(?:class|id)=["'][^"']*logo[^"']*["'][^>]+src=["']([^"']+)["']/gi,
      /src=["']([^"']+)["'][^>]*(?:class|id)=["'][^"']*logo[^"']*["']/gi,
      /<(?:img)[^>]+(?:class|id)=["'][^"']*brand[^"']*["'][^>]+src=["']([^"']+)["']/gi,
    ];

    for (const pattern of logoPatterns) {
      const match = pattern.exec(html);
      if (match) {
        const src = resolveUrl(match[1], baseUrl);
        if (src) return src;
      }
    }

    // Priority 3: apple-touch-icon
    const appleMatch = html.match(/<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/i);
    if (appleMatch) {
      const src = resolveUrl(appleMatch[1], baseUrl);
      if (src) return src;
    }

    // Priority 4: favicon (better than nothing)
    const faviconMatch = html.match(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']+)["']/i);
    if (faviconMatch) {
      const src = resolveUrl(faviconMatch[1], baseUrl);
      if (src) return src;
    }

    return null;
  } catch (err) {
    console.error('Logo scrape failed:', err.message);
    return null;
  }
}

function resolveUrl(src, baseUrl) {
  if (!src || src.startsWith('data:')) return null;
  try {
    return src.startsWith('http') ? src : new URL(src, baseUrl).href;
  } catch {
    return null;
  }
}

// ── Document Generation ──────────────────────────────────────────────────────
async function generateDocuments(metadata) {
  const stateCode = metadata.stateCode || 'MI';
  const isAuto = metadata.workType === 'automotive';

  const result = isAuto
    ? buildAutoDocumentPrompt(stateCode, metadata)
    : buildDocumentPrompt(stateCode, metadata);

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4000,
    messages: [{ role: 'user', content: result.prompt }],
  });

  return {
    raw: message.content[0].text,
    deadlineStr: isAuto ? result.filingDeadlineStr : result.lienDeadlineStr,
    daysRemaining: result.daysRemaining,
    isAuto,
  };
}

// ── Professional HTML Document Formatter ─────────────────────────────────────
function formatDocumentsAsHtml(rawDocuments, metadata, logoUrl) {
  const {
    claimantName, claimantEmail, claimantPhone,
    amountOwed, stateCode, workType,
    vehicleDescription, propertyAddress, propertyCity,
    websiteUrl,
  } = metadata;

  const isAuto = workType === 'automotive';
  const stateModule = STATE_MODULES[stateCode || 'MI'];
  const docs = rawDocuments.split('---DOCUMENT BREAK---').map(d => d.trim()).filter(Boolean);
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const subjectLine = isAuto
    ? `${vehicleDescription} — $${parseInt(amountOwed).toLocaleString()}`
    : `${propertyAddress}, ${propertyCity} — $${parseInt(amountOwed).toLocaleString()}`;

  const statuteNote = isAuto
    ? `${(stateModule || STATE_MODULES['MI']).name} Garage Keeper's Lien`
    : (stateModule || STATE_MODULES['MI']).statute;

  // Logo block — uses scraped logo if available, falls back to text
  const logoBlock = logoUrl
    ? `<img src="${logoUrl}" alt="${claimantName}" style="max-height:60px;max-width:240px;object-fit:contain;display:block;">`
    : `<span style="font-size:22px;font-weight:700;color:#0d1117;letter-spacing:-0.5px;">${claimantName}</span>`;

  // Document sections with legal formatting
  const docSections = docs.map((doc, i) => `
    <div style="page-break-inside:avoid;margin-bottom:48px;">
      <div style="border-top:2px solid #0d1117;padding-top:24px;margin-bottom:24px;">
        <span style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#666;">
          Document ${i + 1} of ${docs.length}
        </span>
      </div>
      <div style="
        font-family:'Times New Roman',Times,serif;
        font-size:13px;
        line-height:2;
        color:#1a1a1a;
        white-space:pre-wrap;
        background:#fff;
        padding:40px 48px;
        border:1px solid #d0d0d0;
        border-radius:4px;
        box-shadow:0 1px 4px rgba(0,0,0,0.06);
      ">${doc}</div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Lien Documents — ${claimantName}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">

  <div style="max-width:760px;margin:0 auto;background:#fff;padding:0 0 60px;">

    <!-- Header: Client logo + LodgeMiLien brand -->
    <div style="background:#fff;border-bottom:1px solid #e0e0e0;padding:28px 40px;display:flex;align-items:center;justify-content:space-between;">
      <div>${logoBlock}</div>
      <div style="text-align:right;">
        <span style="font-size:13px;font-weight:800;color:#0d1117;letter-spacing:-0.3px;">
          Lodge<span style="color:#f5a623;">Mi</span>Lien
        </span>
        <div style="font-size:11px;color:#888;margin-top:2px;">Document Preparation Service</div>
      </div>
    </div>

    <!-- Status banner -->
    <div style="background:#0d1117;padding:20px 40px;">
      <div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:4px;">Your Documents Are Ready</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.55);">Prepared for ${claimantName} &nbsp;·&nbsp; ${today}</div>
    </div>

    <!-- Matter summary -->
    <div style="padding:28px 40px;background:#fafafa;border-bottom:1px solid #e8e8e8;">
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr>
          <td style="padding:6px 0;color:#888;width:160px;">Matter</td>
          <td style="padding:6px 0;font-weight:600;">${subjectLine}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#888;">Governing Law</td>
          <td style="padding:6px 0;">${statuteNote}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#888;">Prepared By</td>
          <td style="padding:6px 0;">LodgeMiLien LLC &nbsp;·&nbsp; Reviewed ${today}</td>
        </tr>
      </table>
    </div>

    <!-- Documents -->
    <div style="padding:40px 40px 0;">
      ${docSections}
    </div>

    <!-- Disclaimer -->
    <div style="margin:0 40px;background:#fff8e8;border:1px solid #f5c842;border-radius:6px;padding:18px 24px;">
      <p style="font-size:12px;color:#7a5c00;margin:0;line-height:1.7;">
        <strong>Important Notice:</strong> These documents were prepared by LodgeMiLien LLC and reviewed by a human
        before delivery. LodgeMiLien is a document preparation service — not a law firm — and this is not legal advice.
        If you have questions about enforcing your lien rights or face a complex dispute, consult a licensed attorney.
      </p>
    </div>

    <!-- Footer -->
    <div style="margin-top:40px;padding:0 40px;">
      <div style="border-top:1px solid #e0e0e0;padding-top:20px;display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:11px;color:#aaa;">
          LodgeMiLien LLC &nbsp;·&nbsp; Troy, Michigan &nbsp;·&nbsp; lodgemilien.com
        </div>
        <div style="font-size:11px;color:#aaa;">
          Prepared ${today}
        </div>
      </div>
    </div>

  </div>
</body>
</html>`;
}

// ── Admin notification email (unchanged) ─────────────────────────────────────
function buildNotificationEmail(metadata, sessionId, deadlineStr, daysRemaining, isAuto, proofUrl) {
  const stateModule = STATE_MODULES[metadata.stateCode || 'MI'] || STATE_MODULES['MI'];
  const orderType = isAuto ? "Garage Keeper's Lien" : 'Mechanics Lien';
  const subjectDesc = isAuto
    ? metadata.vehicleDescription
    : `${metadata.propertyAddress}, ${metadata.propertyCity}`;

  const detailRows = isAuto ? `
    <tr><td style="padding:8px 0;color:#666;width:140px;">Type</td><td style="padding:8px 0;font-weight:500;">Garage Keeper's Lien — ${stateModule.name}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">Shop</td><td style="padding:8px 0;font-weight:500;">${metadata.claimantName}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;">${metadata.claimantEmail}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">Phone</td><td style="padding:8px 0;">${metadata.claimantPhone}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">Website</td><td style="padding:8px 0;">${metadata.websiteUrl || '—'}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">Vehicle</td><td style="padding:8px 0;">${metadata.vehicleDescription}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">VIN</td><td style="padding:8px 0;font-family:monospace;">${metadata.vin}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">Owner</td><td style="padding:8px 0;">${metadata.ownerName}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">Amount</td><td style="padding:8px 0;font-weight:600;">$${parseInt(metadata.amountOwed).toLocaleString()}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">MVSR License</td><td style="padding:8px 0;">${metadata.licenseNumber || 'Not provided'}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">Filing deadline</td><td style="padding:8px 0;${daysRemaining <= 21 ? 'color:#e84040;font-weight:600;' : ''}">${deadlineStr} (${daysRemaining} days)</td></tr>
  ` : `
    <tr><td style="padding:8px 0;color:#666;width:140px;">Type</td><td style="padding:8px 0;font-weight:500;">Mechanics Lien — ${stateModule.name}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">Customer</td><td style="padding:8px 0;font-weight:500;">${metadata.claimantName}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;">${metadata.claimantEmail}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">Phone</td><td style="padding:8px 0;">${metadata.claimantPhone}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">Website</td><td style="padding:8px 0;">${metadata.websiteUrl || '—'}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">Property</td><td style="padding:8px 0;">${metadata.propertyAddress}, ${metadata.propertyCity}, ${metadata.propertyCounty} County</td></tr>
    <tr><td style="padding:8px 0;color:#666;">Owner</td><td style="padding:8px 0;">${metadata.ownerName}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">Amount</td><td style="padding:8px 0;font-weight:600;">$${parseInt(metadata.amountOwed).toLocaleString()}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">Package</td><td style="padding:8px 0;">${metadata.packageType === 'demand' ? 'Demand Letter' : 'Full Package'}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">Filing coordination</td><td style="padding:8px 0;${metadata.filingCoordination === 'true' ? 'color:#f5a623;font-weight:600;' : ''}">${metadata.filingCoordination === 'true' ? 'YES — coordinate filing' : 'No'}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">Lien deadline</td><td style="padding:8px 0;${daysRemaining <= 14 ? 'color:#e84040;font-weight:600;' : ''}">${deadlineStr} (${daysRemaining} days)</td></tr>
  `;

  return {
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
        <p style="font-size:12px;color:#999;margin-top:24px;">Session ID: ${sessionId}</p>
      </div>
    `,
  };
}

// ── Main Handler ─────────────────────────────────────────────────────────────
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

  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true });
  }

  const session = event.data.object;

  try {
    let metadata;

    if (session.payment_link) {
      const email = session.customer_details?.email || session.customer_email;
      if (!email) throw new Error('No customer email in payment link session');
      const intake = await getIntakeByEmail(email);
      if (!intake) throw new Error(`No intake found for email: ${email}`);
      const { packageType, filingCoordination } = packageFromAmount(session.amount_total);
      metadata = { ...intake, packageType, filingCoordination };
    } else {
      metadata = session.metadata;
      if (!metadata || !metadata.claimantEmail) {
        throw new Error('No metadata in dynamic checkout session');
      }
    }

    // Scrape logo from client website (non-blocking — failure is fine)
    const logoUrl = await scrapeLogoFromWebsite(metadata.websiteUrl).catch(() => null);

    // Generate documents
    const { raw, deadlineStr, daysRemaining, isAuto } = await generateDocuments(metadata);
    const htmlDocuments = formatDocumentsAsHtml(raw, metadata, logoUrl);

    // Store order in Blob
    await put(
      `orders/${session.id}.json`,
      JSON.stringify({
        sessionId: session.id,
        metadata,
        htmlDocuments,
        logoUrl: logoUrl || null,
        paidAt: new Date().toISOString(),
      }),
      { access: 'public', contentType: 'application/json' }
    );

    // Notify admin
    const proofUrl = metadata.proofUrl || 'No proof uploaded';
    const { subject, html } = buildNotificationEmail(metadata, session.id, deadlineStr, daysRemaining, isAuto, proofUrl);

    await resend.emails.send({
      from: 'LodgeMiLien <hello@lodgemilien.com>',
      to: process.env.NOTIFICATION_EMAIL,
      subject,
      html,
    });

  } catch (err) {
    console.error('Webhook processing error:', err);
    return res.status(500).json({ error: 'Failed to process order' });
  }

  res.status(200).json({ received: true });
}
