ebhook · JS
Copy

import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
 
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
  const {
    role, propertyAddress, propertyCity, propertyCounty,
    ownerName, ownerAddress, dateFirst, dateLast,
    amountOwed, workDescription, claimantName,
    claimantAddress, claimantPhone, claimantEmail,
    packageType
  } = metadata;
 
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
 
  const lastDate = new Date(dateLast);
  const today2 = new Date();
  const daysElapsed = Math.floor((today2 - lastDate) / (1000 * 60 * 60 * 24));
  const daysRemaining = 90 - daysElapsed;
  const lienDeadline = new Date(lastDate);
  lienDeadline.setDate(lienDeadline.getDate() + 90);
  const lienDeadlineStr = lienDeadline.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
 
  const prompt = `You are a Michigan construction lien document preparation specialist. Generate professional, Michigan-statutory-language-compliant lien documents based on the following case details.
 
CASE DETAILS:
- Claimant (contractor): ${claimantName}
- Claimant address: ${claimantAddress}
- Claimant phone: ${claimantPhone}
- Claimant role: ${role}
- Property owner: ${ownerName}
- Owner address: ${ownerAddress || 'Same as property'}
- Property address: ${propertyAddress}, ${propertyCity}, Michigan
- County: ${propertyCounty} County
- Work performed: ${workDescription}
- First date of furnishing: ${dateFirst}
- Last date of furnishing: ${dateLast}
- Amount owed: $${parseInt(amountOwed).toLocaleString()}
- Package type: ${packageType}
- Today's date: ${today}
- Claim of Lien deadline: ${lienDeadlineStr} (${daysRemaining} days remaining)
 
Generate the following documents separated by "---DOCUMENT BREAK---":
 
DOCUMENT 1: NOTICE OF INTENT TO LIEN (Demand Letter)
A professional demand letter on behalf of ${claimantName} to ${ownerName} demanding payment of $${parseInt(amountOwed).toLocaleString()} within 10 days or a mechanics lien will be filed against the property at ${propertyAddress}, ${propertyCity}, Michigan. Reference Michigan Construction Lien Act (MCL 570.1101 et seq.). Professional but firm tone. Include all case details. Date it ${today}.
 
${packageType === 'full' ? `---DOCUMENT BREAK---
 
DOCUMENT 2: CLAIM OF LIEN
A formal Michigan Claim of Lien document pursuant to MCL 570.1107 for filing with the ${propertyCounty} County Register of Deeds. Include:
- Claimant name and address
- Property owner name and address  
- Property description (street address, city, county, state)
- Nature of work/materials furnished
- First and last date of furnishing
- Amount claimed: $${parseInt(amountOwed).toLocaleString()}
- Statement that the claim is just and unpaid
- Signature block for notarization
- All required Michigan statutory language
 
---DOCUMENT BREAK---
 
DOCUMENT 3: FILING INSTRUCTIONS
Step-by-step instructions for ${claimantName} to:
1. Get the Claim of Lien notarized (explain what this means and where to go)
2. File with ${propertyCounty} County Register of Deeds (include address and hours if known)
3. Serve a copy on the property owner
4. What to do if the deadline is under ${daysRemaining} days away
5. Next steps if payment is still not received after filing` : ''}
 
Keep all documents formal, professional, and legally precise. Use plain language where possible so a tradesperson can understand what they are signing.`;
 
  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });
 
  return message.content[0].text;
}
 
function formatDocumentsAsHtml(rawDocuments, metadata) {
  const { claimantName, propertyAddress, propertyCity, amountOwed } = metadata;
  const docs = rawDocuments.split('---DOCUMENT BREAK---').map(d => d.trim());
 
  const docSections = docs.map((doc, i) => `
    <div style="background:#f9f9f9;border:1px solid #e0e0e0;border-radius:8px;padding:32px;margin-bottom:32px;font-family:Georgia,serif;font-size:14px;line-height:1.8;white-space:pre-wrap;">
      ${doc}
    </div>
  `).join('');
 
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>MiLien Documents — ${claimantName}</title>
    </head>
    <body style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:40px 20px;color:#1a1a1a;">
      <div style="background:#0d1117;padding:20px 28px;border-radius:8px;margin-bottom:32px;">
        <span style="font-size:24px;font-weight:800;color:#fff;">Mi<span style="color:#f5a623;">Lien</span></span>
        <p style="color:rgba(255,255,255,0.6);margin:8px 0 0;font-size:13px;">Michigan Mechanics Lien Document Service</p>
      </div>
 
      <h2 style="font-size:20px;font-weight:700;margin-bottom:4px;">Your Documents Are Ready</h2>
      <p style="color:#555;font-size:14px;margin-bottom:32px;">
        Prepared for <strong>${claimantName}</strong> regarding the property at 
        <strong>${propertyAddress}, ${propertyCity}</strong> — 
        Amount in dispute: <strong>$${parseInt(amountOwed).toLocaleString()}</strong>
      </p>
 
      ${docSections}
 
      <div style="background:#fff8e8;border:1px solid #f5a623;border-radius:8px;padding:20px;margin-top:32px;">
        <p style="font-size:13px;color:#7a5c00;margin:0;line-height:1.6;">
          <strong>Important:</strong> These documents have been prepared by MiLien and reviewed for accuracy. 
          MiLien is a document preparation service and not a law firm. 
          This is not legal advice. If you have questions about your specific situation, 
          consult a licensed Michigan attorney.
        </p>
      </div>
 
      <p style="font-size:12px;color:#999;margin-top:32px;text-align:center;">
        MiLien · lodgemilien.com · hello@lodgemilien.com
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
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }
 
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata;
 
    try {
      const rawDocuments = await generateDocuments(metadata);
      const htmlDocuments = formatDocumentsAsHtml(rawDocuments, metadata);
 
      await resend.emails.send({
        from: 'MiLien <hello@lodgemilien.com>',
        to: metadata.claimantEmail,
        subject: `Your MiLien documents are ready — ${metadata.propertyAddress}`,
        html: htmlDocuments,
      });
 
      await resend.emails.send({
        from: 'MiLien <hello@lodgemilien.com>',
        to: process.env.NOTIFICATION_EMAIL,
        subject: `[MiLien] New order — ${metadata.claimantName} — $${parseInt(metadata.amountOwed).toLocaleString()}`,
        html: `
          <h2>New MiLien Order</h2>
          <p><strong>Customer:</strong> ${metadata.claimantName}</p>
          <p><strong>Email:</strong> ${metadata.claimantEmail}</p>
          <p><strong>Phone:</strong> ${metadata.claimantPhone}</p>
          <p><strong>Property:</strong> ${metadata.propertyAddress}, ${metadata.propertyCity}, ${metadata.propertyCounty} County</p>
          <p><strong>Amount in dispute:</strong> $${parseInt(metadata.amountOwed).toLocaleString()}</p>
          <p><strong>Package:</strong> ${metadata.packageType}</p>
          <p><strong>Role:</strong> ${metadata.role}</p>
          <p><strong>Last furnishing date:</strong> ${metadata.dateLast}</p>
          <hr>
          <p>Documents have been automatically sent to the customer. Review the email sent to ${metadata.claimantEmail} and follow up if any corrections are needed.</p>
        `,
      });
 
    } catch (err) {
      console.error('Document generation or email error:', err);
      return res.status(500).json({ error: 'Failed to generate documents' });
    }
  }
 
  res.status(200).json({ received: true });
}
 
