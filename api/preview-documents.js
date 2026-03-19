import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const {
    role, propertyAddress, propertyCity, propertyCounty,
    ownerName, ownerAddress, dateFirst, dateLast,
    amountOwed, workDescription, claimantName,
    claimantAddress, claimantPhone, claimantEmail,
    packageType
  } = req.body;

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const lastDate = new Date(dateLast);
  const todayDate = new Date();
  const daysElapsed = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
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
Explain that the legal description of the property (not just the street address) is required for the lien to be recorded. Tell them to look it up at the ${propertyCounty} County Register of Deeds website or call the office.

STEP 5 — FILE WITH THE ${propertyCounty.toUpperCase()} COUNTY REGISTER OF DEEDS
Explain the filing process: bring the notarized Claim of Lien, pay the recording fee (typically $15-30 in Michigan), get a stamped copy back for their records.

STEP 6 — SERVE A COPY ON THE PROPERTY OWNER
Explain that after filing, a copy must be served on the property owner within 15 days per MCL 570.1111. Certified mail is acceptable.

STEP 7 — WHAT IF THEY STILL DON'T PAY?
Explain that a filed lien is powerful leverage. The property cannot be sold or refinanced with a lien on it. If payment still does not come, the next step is lien enforcement through a Michigan circuit court, which requires an attorney.

IMPORTANT DEADLINE REMINDER:
${daysRemaining <= 14
  ? `WARNING: You have only ${daysRemaining} days until your filing deadline of ${lienDeadlineStr}. Do not delay. Get the document notarized and filed immediately.`
  : `Your filing deadline is ${lienDeadlineStr} — ${daysRemaining} days from today. Do not wait until the last week.`
}` : ''}

Output only the documents. No preamble, no commentary, no explanations outside the documents themselves.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].text;
    const docs = raw.split('---DOCUMENT BREAK---').map(d => d.trim()).filter(Boolean);

    res.status(200).json({ documents: docs, raw });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Document generation failed: ' + err.message });
  }
}
