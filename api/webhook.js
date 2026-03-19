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

  const prompt = `You are a Michigan construction lien document preparation specialist with deep knowledge of the Michigan Construction Lien Act (MCL 570.1101 et seq.). You prepare documents that are filed with county Registers of Deeds and served on property owners. Accuracy and proper statutory language are critical — errors can void lien rights.

CASE DETAILS:
Claimant name: ${claimantName}
Claimant address: ${claimantAddress}
Claimant phone: ${claimantPhone}
Claimant role: ${role}
Property owner: ${ownerName}
Owner mailing address: ${ownerAddress || 'Same as property address'}
Property address: ${propertyAddress}, ${propertyCity}, Michigan
County: ${propertyCounty} County
Work/materials furnished: ${workDescription}
First date of furnishing: ${dateFirst}
Last date of furnishing: ${dateLast}
Amount unpaid: $${parseInt(amountOwed).toLocaleString()}
Today's date: ${today}
Claim of Lien deadline: ${lienDeadlineStr} (${daysRemaining} days remaining)

Generate the documents below, separated exactly by the string ---DOCUMENT BREAK--- on its own line.

═══════════════════════════════════════
DOCUMENT 1: NOTICE OF INTENT TO FILE MECHANICS LIEN
═══════════════════════════════════════

Format this as a formal business letter. Structure:

[Claimant letterhead block: name, address, phone, date]

VIA CERTIFIED MAIL — RETURN RECEIPT REQUESTED

[Owner name and address block]

RE: Notice of Intent to File Mechanics Lien
    Property: ${propertyAddress}, ${propertyCity}, Michigan
    Amount Due: $${parseInt(amountOwed).toLocaleString()}

Dear ${ownerName}:

Write 3-4 paragraphs that:
1. State that ${claimantName} furnished [work description] at the above property between ${dateFirst} and ${dateLast}
2. State that $${parseInt(amountOwed).toLocaleString()} remains unpaid despite the work being completed
3. Cite MCL 570.1101 et seq. and state that ${claimantName} intends to file a Claim of Lien with the ${propertyCounty} County Register of Deeds unless payment in full is received within 10 days of this letter
4. State that once a lien is filed it becomes a cloud on the property title and must be resolved before any sale or refinancing can occur

Close professionally. End with:

Sincerely,

_______________________________
${claimantName}
${claimantAddress}
${claimantPhone}

Enclosure: Copy retained for lien filing records

---DOCUMENT BREAK---

${packageType === 'full' ? `═══════════════════════════════════════
DOCUMENT 2: CLAIM OF LIEN
Pursuant to MCL 570.1107
═══════════════════════════════════════

Format this as an official legal document suitable for recording with the ${propertyCounty} County Register of Deeds. Use this exact structure:

CLAIM OF LIEN
STATE OF MICHIGAN
COUNTY OF ${propertyCounty.toUpperCase()}

The undersigned claimant states as follows:

1. CLAIMANT INFORMATION
   Name: ${claimantName}
   Address: ${claimantAddress}
   Phone: ${claimantPhone}
   Claimant's role: ${role}

2. PROPERTY OWNER INFORMATION
   Name: ${ownerName}
   Address: ${ownerAddress || propertyAddress + ', ' + propertyCity + ', Michigan'}

3. PROPERTY SUBJECT TO LIEN
   Street address: ${propertyAddress}, ${propertyCity}, Michigan
   County: ${propertyCounty}
   [Note to reviewer: Insert legal description from county records if available. If not available, note "Legal description to be confirmed from ${propertyCounty} County records prior to filing."]

4. NATURE OF WORK OR MATERIALS FURNISHED
   ${workDescription}

5. DATES OF FURNISHING
   First date labor or materials were furnished: ${dateFirst}
   Last date labor or materials were furnished: ${dateLast}

6. AMOUNT OF LIEN CLAIM
   Total amount unpaid and due: $${parseInt(amountOwed).toLocaleString()}

7. STATEMENT OF CLAIM
   The above amount is justly due and owing to claimant for labor, materials, and/or services furnished as described above, no part of which has been paid except as stated, and claimant claims a lien on the above-described premises pursuant to the Michigan Construction Lien Act, MCL 570.1101 et seq.

8. CLAIM OF LIEN DEADLINE
   This Claim of Lien is filed within 90 days of the last date of furnishing as required by MCL 570.1111. The deadline for filing is ${lienDeadlineStr}.

VERIFICATION

I, the undersigned, state that I am the claimant named above (or authorized agent thereof), that I have read this Claim of Lien and know the contents thereof, and that the statements made herein are true to the best of my knowledge, information, and belief.

Signed this _______ day of _________________, 20____


_______________________________
Signature of Claimant or Authorized Agent

_______________________________
Printed Name

_______________________________
Title (if signing on behalf of entity)


NOTARIZATION BLOCK:

State of Michigan
County of ___________________

Subscribed and sworn to before me this _______ day of _________________, 20____.


_______________________________
Notary Public, State of Michigan
County of ___________________
My commission expires: ___________________

---DOCUMENT BREAK---

═══════════════════════════════════════
DOCUMENT 3: FILING INSTRUCTIONS FOR ${claimantName.toUpperCase()}
═══════════════════════════════════════

Write clear, plain-language step-by-step instructions. Write as if explaining to someone who has never filed a legal document. Use numbered steps. Cover:

STEP 1 — SEND THE DEMAND LETTER TODAY
Explain how to send the demand letter via certified mail with return receipt. Explain why certified mail matters (proof of delivery).

STEP 2 — WAIT 10 DAYS
Explain that if payment arrives, great. If not, proceed to filing. Note the lien deadline is ${lienDeadlineStr} — ${daysRemaining} days from today.

STEP 3 — GET THE CLAIM OF LIEN NOTARIZED
Explain what notarization means in plain terms. List common places to get documents notarized in Michigan (UPS Store, bank branches, credit unions, AAA offices, most law offices). Explain they must bring a valid photo ID and sign in front of the notary.

STEP 4 — CONFIRM THE LEGAL DESCRIPTION
Explain that the legal description of the property (not just the street address) is required for the lien to be recorded. Tell them to look it up at the ${propertyCounty} County Register of Deeds website or call the office. Provide the general Register of Deeds contact approach for ${propertyCounty} County.

STEP 5 — FILE WITH THE ${propertyCounty.toUpperCase()} COUNTY REGISTER OF DEEDS
Explain the filing process: bring the notarized Claim of Lien, pay the recording fee (typically $15-30 in Michigan), get a stamped copy back for their records. Note that some Michigan counties accept e-recording.

STEP 6 — SERVE A COPY ON THE PROPERTY OWNER
Explain that after filing, a copy must be served on the property owner within 15 days per MCL 570.1111. Certified mail is acceptable.

STEP 7 — WHAT IF THEY STILL DON'T PAY?
Explain that a filed lien is powerful leverage. The property cannot be sold or refinanced with a lien on it. If payment still does not come, the next step is lien enforcement through a Michigan circuit court, which requires an attorney. Provide this context without being alarmist.

IMPORTANT DEADLINE REMINDER:
${daysRemaining <= 14 
  ? `WARNING: You have only ${daysRemaining} days until your filing deadline of ${lienDeadlineStr}. Do not delay. Get the document notarized and filed immediately.`
  : `Your filing deadline is ${lienDeadlineStr} — ${daysRemaining} days from today. Do not wait until the last week.`
}` : ''}

Output only the documents. No preamble, no commentary, no explanations outside the documents themselves.`;

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
