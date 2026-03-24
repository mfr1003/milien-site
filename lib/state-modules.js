const STATE_MODULES = {

  MI: {
    name: 'Michigan',
    statute: 'Michigan Construction Lien Act (MCL 570.1101 et seq.)',
    documentName: 'Claim of Lien',
    filingOffice: 'Register of Deeds',
    deadlines: {
      noticeOfFurnishing: {
        days: 20,
        who: 'subcontractors and suppliers',
        description: 'Notice of Furnishing must be served within 20 days of first furnishing labor or materials.',
        required: true,
      },
      claimOfLien: {
        residential: 90,
        commercial: 90,
        description: 'Claim of Lien must be recorded within 90 days of last furnishing.',
      },
      serveOwner: {
        days: null,
        description: 'No separate service requirement after filing in Michigan.',
      },
      enforce: {
        description: 'Lien enforcement action must be filed within 1 year of recording.',
      },
    },
    counties: [
      'Wayne', 'Oakland', 'Macomb', 'Kent', 'Washtenaw', 'Ingham',
      'Kalamazoo', 'Genesee', 'Ottawa', 'Saginaw', 'Muskegon', 'St. Clair',
      'Jackson', 'Monroe', 'Berrien', 'Calhoun', 'Eaton', 'Bay',
      'Livingston', 'Allegan', 'Other Michigan County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Michigan construction lien document preparation specialist with deep knowledge of the Michigan Construction Lien Act (MCL 570.1101 et seq.).

APPLICABLE LAW: Michigan Construction Lien Act, MCL 570.1101 et seq.
FILING OFFICE: ${data.propertyCounty} County Register of Deeds
CLAIM OF LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
STATUTE OF LIMITATIONS: 1 year from recording to enforce lien

KEY MICHIGAN REQUIREMENTS:
- Subcontractors and suppliers must serve Notice of Furnishing within 20 days of first furnishing
- Claim of Lien must be recorded within 90 days of last furnishing
- Filed with the county Register of Deeds
- Must include legal description of property

NOTARIZATION BLOCK FORMAT:
State of Michigan
County of ___________________
Subscribed and sworn to before me this _______ day of _________________, 20____.
Notary Public, State of Michigan
County of ___________________
My commission expires: ___________________
`,
  },

  OH: {
    name: 'Ohio',
    statute: 'Ohio Mechanics Lien Law (O.R.C. §§ 1311.01 et seq.)',
    documentName: 'Affidavit of Mechanics Lien',
    filingOffice: 'County Recorder',
    deadlines: {
      noticeOfFurnishing: {
        days: 21,
        who: 'subcontractors and suppliers (if owner filed Notice of Commencement)',
        description: 'Notice of Furnishing must be served within 21 days of first furnishing, or within 21 days of the Notice of Commencement being filed.',
        required: true,
        conditionalNote: 'Not required if property owner failed to file a Notice of Commencement.',
      },
      claimOfLien: {
        residential: 60,
        commercial: 75,
        description: 'Affidavit of Mechanics Lien must be filed within 75 days of last furnishing (commercial) or 60 days (residential).',
      },
      serveOwner: {
        days: 30,
        description: 'Copy of filed lien affidavit must be served on property owner within 30 days of filing.',
      },
      enforce: {
        description: 'Lien enforcement action must be filed within 6 years of filing, or 60 days if owner files Notice to Commence Suit.',
      },
    },
    counties: [
      'Franklin', 'Cuyahoga', 'Hamilton', 'Summit', 'Montgomery',
      'Lucas', 'Butler', 'Stark', 'Lorain', 'Lake', 'Mahoning',
      'Medina', 'Warren', 'Clark', 'Delaware', 'Licking', 'Allen',
      'Trumbull', 'Greene', 'Clermont', 'Other Ohio County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are an Ohio construction lien document preparation specialist with deep knowledge of Ohio Mechanics Lien Law (O.R.C. §§ 1311.01 et seq.).

APPLICABLE LAW: Ohio Mechanics Lien Law, O.R.C. §§ 1311.01 et seq.
FILING OFFICE: ${data.propertyCounty} County Recorder
LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE TYPE: ${data.projectType === 'residential' ? '60 days from last furnishing (residential)' : '75 days from last furnishing (commercial)'}
STATUTE OF LIMITATIONS: 6 years from filing to enforce (or 60 days if owner files Notice to Commence Suit)

KEY OHIO REQUIREMENTS:
- Document is called "Affidavit of Mechanics Lien" (not "Claim of Lien")
- Filed with the County Recorder (not Register of Deeds)
- Subcontractors must serve Notice of Furnishing within 21 days of first furnishing IF owner filed a Notice of Commencement
- After filing the lien, claimant must serve a copy on the property owner within 30 days
- Ohio law does not permit collection of attorney fees or interest on the lien itself
- Residential deadline is 60 days; commercial deadline is 75 days

NOTARIZATION BLOCK FORMAT:
State of Ohio
County of ___________________
Sworn to and subscribed before me this _______ day of _________________, 20____.
Notary Public, State of Ohio
My commission expires: ___________________
`,
  },

  IN: {
    name: 'Indiana',
    statute: 'Indiana Mechanic\'s Lien Statute (Ind. Code § 32-28-3)',
    documentName: 'Sworn Statement and Notice of Intention to Hold a Lien',
    filingOffice: 'County Recorder',
    deadlines: {
      preLienNotice: {
        residential_remodel: 30,
        residential_new: 60,
        commercial: null,
        description: 'Pre-Lien Notice required for residential projects only. 30 days from first furnishing for remodels, 60 days for new construction. Not required for commercial projects or if contractor is in direct contract with the owner.',
        required: false,
        conditionalNote: 'Only required for subcontractors/suppliers not in direct contract with the owner on residential projects.',
      },
      claimOfLien: {
        residential: 60,
        commercial: 90,
        description: 'Sworn Statement must be filed within 60 days of last furnishing (residential/Class 2 structures) or 90 days (commercial/other).',
      },
      serveOwner: {
        days: null,
        description: 'No separate post-filing service requirement, but actual receipt of pre-lien notice is essential.',
      },
      enforce: {
        description: 'Lien enforcement action must be filed within 1 year of filing, or 30 days if owner serves Notice to Foreclose.',
      },
    },
    counties: [
      'Marion', 'Lake', 'Allen', 'Hamilton', 'St. Joseph', 'Elkhart',
      'Tippecanoe', 'Vanderburgh', 'Monroe', 'Hendricks', 'Johnson',
      'Kosciusko', 'Porter', 'Madison', 'Delaware', 'Vigo', 'Bartholomew',
      'Howard', 'Clark', 'Floyd', 'Other Indiana County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are an Indiana mechanics lien document preparation specialist with deep knowledge of Indiana's Mechanic's Lien Statute (Ind. Code § 32-28-3).

APPLICABLE LAW: Indiana Mechanic's Lien Statute, Ind. Code § 32-28-3
FILING OFFICE: ${data.propertyCounty} County Recorder
LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE TYPE: ${data.projectType === 'residential' ? '60 days from last furnishing (residential/Class 2 structure)' : '90 days from last furnishing (commercial/other)'}
STATUTE OF LIMITATIONS: 1 year from filing to enforce (or 30 days if owner serves Notice to Foreclose)

KEY INDIANA REQUIREMENTS:
- Document is called "Sworn Statement and Notice of Intention to Hold a Lien" (not "Claim of Lien")
- Filed with the County Recorder
- Must include property owner's name and address as shown on property TAX RECORDS of the county
- Must include legal description of property
- Pre-lien notice only required for residential projects where claimant is NOT in direct contract with owner
- Commercial projects: no pre-lien notice required
- The lien document itself must be SWORN (notarized)

NOTARIZATION BLOCK FORMAT:
State of Indiana
County of ___________________
Before me, the undersigned notary public, personally appeared the above-named claimant who, being duly sworn, states that the foregoing is true and correct to the best of their knowledge and belief.
Subscribed and sworn to before me this _______ day of _________________, 20____.
Notary Public, State of Indiana
My commission expires: ___________________
`,
  },
};

function getLienDeadlineDays(stateCode, projectType) {
  const module = STATE_MODULES[stateCode];
  if (!module) throw new Error(`Unsupported state: ${stateCode}`);
  return projectType === 'residential'
    ? module.deadlines.claimOfLien.residential
    : module.deadlines.claimOfLien.commercial;
}

function getNoticeDeadlineDays(stateCode, role, projectType, projectSubtype) {
  const module = STATE_MODULES[stateCode];
  if (!module) return null;

  if (stateCode === 'MI') {
    return (role !== 'General Contractor / Prime') ? 20 : null;
  }
  if (stateCode === 'OH') {
    return (role !== 'General Contractor / Prime') ? 21 : null;
  }
  if (stateCode === 'IN') {
    if (projectType !== 'residential') return null;
    if (role === 'General Contractor / Prime') return null;
    return projectSubtype === 'new_construction' ? 60 : 30;
  }
  return null;
}

function buildDocumentPrompt(stateCode, metadata) {
  const module = STATE_MODULES[stateCode];
  if (!module) throw new Error(`Unsupported state: ${stateCode}`);

  const {
    role, propertyAddress, propertyCity, propertyCounty,
    ownerName, ownerAddress, dateFirst, dateLast,
    amountOwed, workDescription, claimantName,
    claimantAddress, claimantPhone, claimantEmail,
    packageType, projectType
  } = metadata;

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const lastDate = new Date(dateLast);
  const todayDate = new Date();
  const daysElapsed = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
  const deadlineDays = getLienDeadlineDays(stateCode, projectType);
  const daysRemaining = deadlineDays - daysElapsed;
  const lienDeadline = new Date(lastDate);
  lienDeadline.setDate(lienDeadline.getDate() + deadlineDays);
  const lienDeadlineStr = lienDeadline.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const stateContext = module.documentPrompt(metadata, today, lienDeadlineStr, daysRemaining);

  const prompt = `${stateContext}

CASE DETAILS:
Claimant name: ${claimantName}
Claimant address: ${claimantAddress}
Claimant phone: ${claimantPhone}
Claimant role: ${role}
Property owner: ${ownerName}
Owner mailing address: ${ownerAddress || 'Same as property address'}
Property address: ${propertyAddress}, ${propertyCity}, ${module.name}
County: ${propertyCounty} County
Work/materials furnished: ${workDescription}
First date of furnishing: ${dateFirst}
Last date of furnishing: ${dateLast}
Amount unpaid: $${parseInt(amountOwed).toLocaleString()}
Project type: ${projectType}
Today's date: ${today}
${module.documentName} deadline: ${lienDeadlineStr} (${daysRemaining} days remaining)

Generate the documents below, separated exactly by the string ---DOCUMENT BREAK--- on its own line.

═══════════════════════════════════════
DOCUMENT 1: NOTICE OF INTENT TO FILE ${module.documentName.toUpperCase()}
═══════════════════════════════════════

Format as a formal business letter. Include:
- Claimant letterhead: name, address, phone, date (${today})
- VIA CERTIFIED MAIL — RETURN RECEIPT REQUESTED
- Owner name and address
- RE: Notice of Intent to File Mechanics Lien / Property: ${propertyAddress}, ${propertyCity}, ${module.name} / Amount Due: $${parseInt(amountOwed).toLocaleString()}

Write 3-4 paragraphs:
1. ${claimantName} furnished ${workDescription} at the property between ${dateFirst} and ${dateLast}
2. $${parseInt(amountOwed).toLocaleString()} remains unpaid
3. Cite ${module.statute} and state intent to file a ${module.documentName} with the ${propertyCounty} County ${module.filingOffice} unless paid within 10 days
4. Once filed, lien becomes a cloud on title preventing sale or refinancing

---DOCUMENT BREAK---

${packageType === 'full' ? `═══════════════════════════════════════
DOCUMENT 2: ${module.documentName.toUpperCase()}
Pursuant to ${module.statute}
═══════════════════════════════════════

Format as an official legal document for filing with the ${propertyCounty} County ${module.filingOffice}. Include all required fields per ${module.statute}:

1. CLAIMANT INFORMATION
   Name: ${claimantName}
   Address: ${claimantAddress}
   Phone: ${claimantPhone}
   Role: ${role}

2. PROPERTY OWNER INFORMATION
   Name: ${ownerName}
   Address: ${ownerAddress || propertyAddress + ', ' + propertyCity + ', ' + module.name}

3. PROPERTY SUBJECT TO LIEN
   Address: ${propertyAddress}, ${propertyCity}, ${module.name}
   County: ${propertyCounty}
   [Note to reviewer: Insert legal description from county records before filing]

4. NATURE OF WORK/MATERIALS FURNISHED
   ${workDescription}

5. DATES OF FURNISHING
   First: ${dateFirst}
   Last: ${dateLast}

6. AMOUNT CLAIMED: $${parseInt(amountOwed).toLocaleString()}

7. VERIFICATION STATEMENT (use ${module.name}-specific statutory language)
${stateCode === 'OH' ? `
8. NOTICE OF COMMENCEMENT NOTE
   [Note to reviewer: If the property owner filed a Notice of Commencement, the claimant was required to serve a Notice of Furnishing within 21 days of first furnishing. Include a note stating whether a Notice of Commencement was filed and whether a Notice of Furnishing was served. If no Notice of Commencement was filed, state that no Notice of Furnishing was required.]
` : ''}${stateCode === 'IN' ? `
8. OWNER INFORMATION NOTE
   [Note to reviewer: Indiana law requires that owner name and address be as shown on the property TAX RECORDS of the county, not necessarily as provided by the claimant. Verify owner information against county tax records before filing.]
` : ''}
8. SIGNATURE BLOCK AND ${module.name.toUpperCase()} NOTARIZATION BLOCK

---DOCUMENT BREAK---

═══════════════════════════════════════
DOCUMENT 3: FILING INSTRUCTIONS FOR ${claimantName.toUpperCase()}
═══════════════════════════════════════

Plain-language step-by-step instructions specific to ${module.name} law covering:

STEP 1 — SEND THE DEMAND LETTER TODAY (certified mail, why it matters)
STEP 2 — WAIT 10 DAYS (if paid, great; if not, proceed)
${stateCode === 'IN' && metadata.role !== 'General Contractor / Prime' && metadata.projectType === 'residential' ? `STEP 3 — PRE-LIEN NOTICE REQUIREMENT (Indiana residential only)
For subcontractors and suppliers not in direct contract with the owner on residential projects, a Pre-Lien Notice must have been served within 30 days of first furnishing (remodels) or 60 days (new construction). Explain whether this was done and flag if it was missed, as it may affect lien rights.
STEP 4 — GET THE DOCUMENT NOTARIZED` : `STEP 3 — GET THE DOCUMENT NOTARIZED`} (what notarization means, where to go in ${module.name})
${stateCode === 'IN' && metadata.role !== 'General Contractor / Prime' && metadata.projectType === 'residential' ? 'STEP 5' : 'STEP 4'} — CONFIRM THE LEGAL DESCRIPTION (how to look it up at ${propertyCounty} County ${module.filingOffice})
${stateCode === 'IN' && metadata.role !== 'General Contractor / Prime' && metadata.projectType === 'residential' ? 'STEP 6' : 'STEP 5'} — FILE WITH THE ${propertyCounty.toUpperCase()} COUNTY ${module.filingOffice.toUpperCase()} (process, fees ~$15-30, get stamped copy)
${stateCode === 'OH' ? 'STEP 6 — SERVE COPY ON PROPERTY OWNER within 30 days of filing (required in Ohio)\n' : ''}STEP ${stateCode === 'OH' ? '7' : stateCode === 'IN' && metadata.role !== 'General Contractor / Prime' && metadata.projectType === 'residential' ? '7' : '6'} — WHAT IF THEY STILL DON\'T PAY (lien as leverage, enforcement requires attorney${stateCode === 'OH' ? ', 6 year deadline or 60 days if owner files Notice to Commence Suit' : stateCode === 'IN' ? ', 1 year deadline or 30 days if owner serves Notice to Foreclose' : ', 1 year deadline'})

DEADLINE REMINDER:
${daysRemaining <= (stateCode === 'OH' && metadata.projectType === 'residential' ? 9 : 14)
  ? `WARNING: Only ${daysRemaining} days until your deadline of ${lienDeadlineStr}. File immediately.`
  : `Your filing deadline is ${lienDeadlineStr} — ${daysRemaining} days from today. Do not wait.`
}` : ''}

Output only the documents. No preamble, no commentary outside the documents.`;

  return { prompt, lienDeadlineStr, daysRemaining };
}

module.exports = { STATE_MODULES, getLienDeadlineDays, getNoticeDeadlineDays, buildDocumentPrompt, buildAutoDocumentPrompt };

// ── AUTOMOTIVE MODULE ──────────────────────────────────────────────────────

const AUTO_MODULES = {
  MI: {
    name: 'Michigan',
    statute: "Michigan Garage Keeper's Lien Act (MCL 570.301 et seq.)",
    filingAgency: 'Michigan Department of State (MDOS)',
    deadlines: {
      filingDeadline: 105,
      description: 'Application to MDOS (form BDVR-35) must be filed within 105 days of last day work was performed.',
      certifiedLetterDeadline: 30,
      certifiedLetterDescription: 'After MDOS issues the TR-42, certified letter must be sent to owner, lienholders, and MDOS within 30 days.',
      saleDeadline: 75,
      saleDescription: 'Vehicle sale must occur at least 75 days after TR-42 issuance.',
      totalProcess: 225,
      totalDescription: 'Entire process cannot exceed 225 days from lien attachment date.',
    },
  },
  OH: {
    name: 'Ohio',
    statute: "Ohio Garage Keeper's Lien (O.R.C. §§ 4505.20 et seq.)",
    filingAgency: 'Ohio Bureau of Motor Vehicles (BMV)',
    deadlines: {
      filingDeadline: 90,
      description: 'Ohio garage keeper lien must be filed with the BMV within 90 days of last work performed.',
    },
  },
  IN: {
    name: 'Indiana',
    statute: "Indiana Mechanic's Lien on Motor Vehicles (Ind. Code § 9-22-6)",
    filingAgency: 'Indiana Bureau of Motor Vehicles (BMV)',
    deadlines: {
      filingDeadline: 90,
      description: 'Indiana vehicle lien must be filed with the BMV within 90 days of last work performed.',
    },
  },
};

function buildAutoDocumentPrompt(stateCode, metadata) {
  const module = AUTO_MODULES[stateCode] || AUTO_MODULES['MI'];
  const filingDeadlineDays = module.deadlines.filingDeadline || 105;

  const {
    vehicleDescription, vin, ownerName, ownerAddress,
    dateLast, amountOwed, workDescription,
    claimantName, claimantAddress, claimantPhone, claimantEmail,
    licenseNumber, packageType
  } = metadata;

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const lastDate = new Date(dateLast);
  const todayDate = new Date();
  const daysElapsed = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
  const daysRemaining = filingDeadlineDays - daysElapsed;
  const filingDeadline = new Date(lastDate);
  filingDeadline.setDate(filingDeadline.getDate() + filingDeadlineDays);
  const filingDeadlineStr = filingDeadline.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const prompt = `You are a ${module.name} garage keeper's lien document preparation specialist with deep knowledge of ${module.statute}.

APPLICABLE LAW: ${module.statute}
FILING AGENCY: ${module.filingAgency}
FILING DEADLINE: ${filingDeadlineStr} (${daysRemaining} days remaining from last date of work)
${stateCode === 'MI' ? 'TOTAL PROCESS LIMIT: 225 days from lien attachment date' : ''}

KEY ${module.name.toUpperCase()} GARAGE KEEPER\'S LIEN REQUIREMENTS:
- Lien attaches to the VEHICLE, not real property
- Application filed with ${module.filingAgency} within ${filingDeadlineDays} days of last work
${stateCode === 'MI' ? `- Claimant must be a licensed repair facility under the Motor Vehicle Service and Repair Act (MCL 257.1301)
- MDOS issues TR-42 Certificate of Foreclosure of Garage Keeper's Lien and Bill of Sale
- Within 30 days of TR-42 issuance: send certified letter to all owners, lienholders, and MDOS
- Certified letter must include: itemized amount due, demand for payment, notice to all lienholders, daily storage fees statement, date/time/manner/location of vehicle sale
- Vehicle sale must occur at least 75 days after TR-42 issuance
- Sale must be a public sale per MCL 570.305
- Claimant must be in compliance with Motor Vehicle Service and Repair Act for entire period of the claim` : `- Follow ${module.name} state requirements for garage keeper liens under ${module.statute}
- Consult ${module.filingAgency} for current forms and procedures`}
- Claimant must be in compliance with Motor Vehicle Service and Repair Act for entire period of the claim

CASE DETAILS:
Repair facility: ${claimantName}
Facility address: ${claimantAddress}
Facility phone: ${claimantPhone}
Facility email: ${claimantEmail}
MVSR License number: ${licenseNumber || 'TO BE CONFIRMED BEFORE FILING'}
Vehicle: ${vehicleDescription}
VIN: ${vin}
Vehicle owner: ${ownerName}
Owner address: ${ownerAddress}
Work performed: ${workDescription}
Last date work performed: ${dateLast}
Amount owed: $${parseInt(amountOwed).toLocaleString()}
Today's date: ${today}
BDVR-35 filing deadline: ${filingDeadlineStr} (${daysRemaining} days remaining)

Generate the documents below, separated exactly by the string ---DOCUMENT BREAK--- on its own line.

═══════════════════════════════════════
DOCUMENT 1: DEMAND LETTER
═══════════════════════════════════════

Format as a formal business letter. Include:
- Repair facility letterhead: name, address, phone, date (${today})
- VIA CERTIFIED MAIL — RETURN RECEIPT REQUESTED
- Owner name and address
- RE: Demand for Payment — Vehicle Repair Services / Vehicle: ${vehicleDescription} / VIN: ${vin} / Amount Due: $${parseInt(amountOwed).toLocaleString()}

Write 3-4 paragraphs:
1. ${claimantName} performed ${workDescription} on the above vehicle on or around ${dateLast}
2. $${parseInt(amountOwed).toLocaleString()} remains unpaid despite completion of services
3. Cite MCL 570.301 et seq. and state that ${claimantName} has a possessory lien on the vehicle and intends to initiate Garage Keeper's Lien proceedings with the Michigan Department of State unless payment in full is received within 10 days
4. State that failure to pay will result in the vehicle being sold at public sale after proper legal process is followed, and that any proceeds exceeding the amount owed will be remitted to the owner

Close professionally with signature block.

---DOCUMENT BREAK---

${packageType === 'full' ? `═══════════════════════════════════════
DOCUMENT 2: BDVR-35 PREPARATION GUIDE
Michigan Department of State — Garage Keeper Lien Application
═══════════════════════════════════════

Prepare a completed BDVR-35 form guide with all required fields filled in based on the case details. The BDVR-35 is the official Michigan Department of State form for applying for a Garage Keeper's Lien. Format this as a clear reference document showing exactly what to enter in each field:

SECTION 1 — GARAGE KEEPER INFORMATION:
Business Name: ${claimantName}
Business Address: ${claimantAddress}
Phone: ${claimantPhone}
MVSR License Number: ${licenseNumber || '[ENTER YOUR MICHIGAN MVSR LICENSE NUMBER]'}

SECTION 2 — VEHICLE INFORMATION:
Year/Make/Model: ${vehicleDescription}
VIN: ${vin}
Last day work performed (lien attachment date): ${dateLast}
Amount of lien claim (labor and parts): $${parseInt(amountOwed).toLocaleString()}
Daily storage fee (if applicable): $[ENTER DAILY STORAGE RATE IF CHARGING STORAGE]

SECTION 3 — VEHICLE OWNER INFORMATION:
Owner name as shown on title: ${ownerName}
Owner last known address: ${ownerAddress}

Then provide a note explaining:
- Where to submit: Mail or deliver to any Secretary of State branch office, or mail to Michigan Department of State, Customer Records Division
- What happens next: MDOS will process and issue a TR-42 Certificate of Foreclosure of Garage Keeper's Lien and Bill of Sale
- Important: Keep a copy of the BDVR-35 and all supporting documentation (repair orders, invoices, signed authorizations)
- The TR-42 is the document that authorizes the public sale of the vehicle

---DOCUMENT BREAK---

═══════════════════════════════════════
DOCUMENT 3: FILING INSTRUCTIONS FOR ${claimantName.toUpperCase()}
Michigan Garage Keeper's Lien — Step by Step
═══════════════════════════════════════

Plain-language step-by-step instructions covering the full Michigan Garage Keeper's Lien process:

STEP 1 — SEND THE DEMAND LETTER TODAY
Explain how to send via certified mail with return receipt. Explain why certified mail matters (proof of delivery and date). Keep the return receipt as evidence.

STEP 2 — WAIT 10 DAYS FOR PAYMENT
If payment arrives, great. Release the vehicle upon payment. If no payment, proceed to Step 3. Your BDVR-35 filing deadline is ${filingDeadlineStr} — ${daysRemaining} days from today. Do not wait until the last week.

STEP 3 — VERIFY YOUR MVSR LICENSE COMPLIANCE
Explain that under MCL 570.309, a garage keeper regulated by the Motor Vehicle Service and Repair Act cannot use the Garage Keeper's Lien Act unless they were in full compliance with the MVSR Act for the entire period of the claim. Confirm your license is current and that all repair authorizations, estimates, and invoices comply with MCL 257.1301 requirements.

STEP 4 — COMPLETE AND SUBMIT FORM BDVR-35
Explain that the BDVR-35 is the Michigan Department of State application for a Garage Keeper's Lien. Use the completed BDVR-35 guide in Document 2. Submit to any Secretary of State branch office or mail to MDOS Customer Records Division. Include all supporting documentation: signed repair authorization, itemized invoice, and any written estimates provided.

STEP 5 — RECEIVE THE TR-42 FROM MDOS
MDOS will process the application and issue a TR-42 Certificate of Foreclosure of Garage Keeper's Lien and Bill of Sale. This document authorizes you to sell the vehicle. Keep the original in a safe place.

STEP 6 — SEND CERTIFIED LETTER WITHIN 30 DAYS OF TR-42
Within 30 days of the TR-42 issuance date, send a certified letter return receipt requested to: (1) all vehicle owners, (2) all lienholders on the title, and (3) the Michigan Department of State. The letter must include: itemized amount due, demand for payment, statement that all lienholders are being notified, daily storage fee amount, and the date, time, manner, and location of the vehicle sale.

STEP 7 — SCHEDULE AND CONDUCT THE PUBLIC SALE
The vehicle sale must occur at least 75 days after the TR-42 issuance date. The sale must be a public sale per MCL 570.305. Follow the specific public sale requirements carefully — improper sale procedures can invalidate the lien.

STEP 8 — AFTER THE SALE
Apply sale proceeds first to your lien amount (labor, parts, storage). Any excess proceeds must be remitted to the vehicle owner or lienholder. Keep complete records of the sale.

IMPORTANT DEADLINE REMINDER:
${daysRemaining <= 21
  ? `URGENT: You have only ${daysRemaining} days until the 105-day BDVR-35 filing deadline of ${filingDeadlineStr}. File immediately.`
  : `Your BDVR-35 filing deadline is ${filingDeadlineStr} — ${daysRemaining} days from today. Do not wait until the last week.`
}

IMPORTANT LICENSING NOTE:
You must be in compliance with the Motor Vehicle Service and Repair Act (MCL 257.1301 et seq.) for the entire period covered by your lien claim. If there is any question about your compliance, consult a Michigan attorney before filing.` : ''}

Output only the documents. No preamble, no commentary outside the documents.`;

  return { prompt, filingDeadlineStr, daysRemaining };
}
