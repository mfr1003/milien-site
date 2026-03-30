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

CRITICAL FORMATTING RULE — BRACKETS:
Only use square brackets [ ] for these specific items that the admin must fill in from county records before sending:
1. Owner name not confirmed: [TO BE CONFIRMED — verify owner name from county records]
2. Legal description: [LEGAL DESCRIPTION — obtain from county Register of Deeds]
3. Tax Parcel ID: [TAX PARCEL ID — obtain from county records]
For ALL other content — signature lines, date fields, notarization blanks, process notes — use plain text or blank underlines (___________). Do not bracket anything else.

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
   Name: [TO BE CONFIRMED — verify owner name from ${propertyCounty} County property records before filing]
   Address: ${ownerAddress || propertyAddress + ', ' + propertyCity + ', ' + module.name}

3. PROPERTY SUBJECT TO LIEN
   Address: ${propertyAddress}, ${propertyCity}, ${module.name}
   County: ${propertyCounty}
   Legal description: [LEGAL DESCRIPTION — obtain from deed or ${propertyCounty} County ${module.filingOffice} records before filing]
   Tax Parcel ID: [TAX PARCEL ID — obtain from ${propertyCounty} County records before filing]

4. NATURE OF WORK/MATERIALS FURNISHED
   ${workDescription}

5. DATES OF FURNISHING
   First: ${dateFirst}
   Last: ${dateLast}

6. AMOUNT CLAIMED: $${parseInt(amountOwed).toLocaleString()}

7. VERIFICATION STATEMENT (use ${module.name}-specific statutory language)
${stateCode === 'OH' ? `
8. NOTICE OF COMMENCEMENT NOTE
   [NOTICE OF COMMENCEMENT — state whether a Notice of Commencement was filed by the property owner. If filed, confirm whether a Notice of Furnishing was served within 21 days. If not filed, state that no Notice of Furnishing was required.]
` : ''}${stateCode === 'IN' ? `
8. OWNER INFORMATION NOTE
   [INDIANA OWNER VERIFICATION — Indiana law requires owner name and address as shown on county TAX RECORDS. Verify against ${propertyCounty} County assessor records before filing.]
` : ''}
8. SIGNATURE AND NOTARIZATION BLOCK

CRITICAL NOTARIZATION INSTRUCTION: For the notarization block, do NOT use any brackets. Use only blank underlines (___________) for the fields the notary and claimant fill in by hand. Format it exactly like this:

Signed: ___________________________________________
Printed Name: _____________________________________
Date: ____________________________________________

State of ${module.name}
County of ________________________________________

Subscribed and sworn to before me this _______ day of _________________, 20____.

Notary Public, State of ${module.name}
My commission expires: ____________________________

[Notary Seal Area — affix seal here]

Do not add any other brackets anywhere in the notarization block.

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
    statute: 'Ohio Revised Code § 4505.101',
    filingAgency: 'County Clerk of Courts',
    deadlines: {
      filingDeadline: 15,
      unclaimed: 15,
      description: 'Vehicle must remain unclaimed for 15 days after completion of repair before notice is sent. After notice is sent and received, owner has 15 days to claim vehicle before shop may apply for title.',
    },
  },
  IN: {
    name: 'Indiana',
    statute: "Indiana Code § 9-22-6-2",
    filingAgency: 'Indiana Bureau of Motor Vehicles (BMV)',
    deadlines: {
      filingDeadline: 30,
      description: 'Advertisement must run and certified notice sent within 30 days of vehicle coming into possession for repair. Sale at public auction after notice period.',
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

  // ── State-specific prompt blocks ──────────────────────────────────────────

  const stateRequirements = {
    MI: `- Claimant must be a licensed repair facility under the Motor Vehicle Service and Repair Act (MCL 257.1301)
- Lien attaches to the VEHICLE, not real property
- Application filed with MDOS using form BDVR-35 within 105 days of last work
- MDOS issues TR-42 Certificate of Foreclosure of Garage Keeper's Lien and Bill of Sale
- Within 30 days of TR-42 issuance: send certified letter to all owners, lienholders, and MDOS
- Certified letter must include: itemized amount due, demand for payment, notice to all lienholders, daily storage fees, date/time/manner/location of vehicle sale
- Vehicle sale must occur at least 75 days after TR-42 issuance
- Sale must be a public sale per MCL 570.305
- Total process cannot exceed 225 days from lien attachment date`,

    OH: `- Lien attaches to the VEHICLE, not real property
- Applies to vehicles left unclaimed for 15+ days after completion of repair
- Prior to sending notice, shop must search title records via Ohio BMV to identify all owners and lienholders
- Send certified notice (return receipt requested) to owner and all lienholders at last known address
- Notice must state: location of vehicle and vehicle value
- If person who requested repair is NOT the titled owner, shop must also notify local law enforcement
- Owner and lienholders have 15 days after receipt of notice to claim the vehicle
- If unclaimed after 15 days: shop executes an affidavit (form established by Ohio Registrar of Motor Vehicles)
- Affidavit must set forth: itemized vehicle value, length of time unclaimed, confirmation notice was sent, confirmation title search was made
- Affidavit is presented to the County Clerk of Courts to obtain a clean title free of all liens
- This process applies to vehicles with wholesale value under $3,500 per O.R.C. § 4505.101
- For vehicles over $3,500, a different process applies — consult an Ohio attorney
- Signed work order from vehicle owner is required to assert lien rights`,

    IN: `- Lien attaches to the VEHICLE (possessory lien — shop must retain possession of vehicle)
- Repair must have been performed at the REQUEST of the vehicle owner (signed work order required)
- Shop must first conduct title search per I.C. § 9-22-1-19 to identify all owners and lienholders
- ADVERTISEMENT: Must place ad in English-language newspaper of general circulation in city/town where shop is located (or county if shop is outside city/town limits)
- Ad must contain: vehicle description (make, year, VIN), amount of unpaid charges, time/place/date of sale
- NOTICE: In addition to newspaper ad, must notify owner and all lienholders of record by certified mail, return receipt requested, at last known address
- Notice must state vehicle will be sold at public auction on a specified date
- Actual receipt by owner is not required if properly addressed notice was mailed
- Actual receipt by lienholders IS required (unless refused or returned undeliverable)
- Sale is at public auction — highest and best bidder
- After sale: deduct lien amount, sale costs, and ad costs from proceeds; pay surplus to first lienholder of record, then owner; if owner unknown, pay to Clerk of Courts
- Shop must execute a SALES CERTIFICATE in BMV-designated form for the purchaser
- BMV issues new certificate of title upon receipt of sales certificate and application
- Violating this section is a Class A infraction under Indiana law`
  };

  const doc2Content = {
    MI: `═══════════════════════════════════════
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
- The TR-42 is the document that authorizes the public sale of the vehicle`,

    OH: `═══════════════════════════════════════
DOCUMENT 2: OHIO UNCLAIMED VEHICLE AFFIDAVIT GUIDE
O.R.C. § 4505.101 — Clerk of Courts Filing
═══════════════════════════════════════

Prepare a detailed guide for completing the Ohio unclaimed vehicle affidavit under O.R.C. § 4505.101. This affidavit is filed with the County Clerk of Courts to obtain a clean certificate of title. Format this as a clear reference document:

BEFORE YOU FILE — REQUIRED STEPS:
1. Confirm vehicle has been unclaimed for 15+ days after repair completion
2. Search Ohio BMV title records to identify all owners and lienholders
3. Send certified notice (return receipt requested) to owner and all lienholders
4. Wait 15 days after notice receipt before proceeding
5. If the person who brought the vehicle in is NOT the titled owner, notify local law enforcement

AFFIDAVIT INFORMATION (form established by Ohio Registrar of Motor Vehicles):
Shop Name: ${claimantName}
Shop Address: ${claimantAddress}
Shop Phone: ${claimantPhone}
Vehicle: ${vehicleDescription}
VIN: ${vin}
Titled Owner: ${ownerName}
Owner Last Known Address: ${ownerAddress}
Repair Completed: ${dateLast}
Amount of Charges: $${parseInt(amountOwed).toLocaleString()}
Work Performed: ${workDescription}

AFFIDAVIT MUST CERTIFY:
- Itemized statement of vehicle's wholesale value (use recognized valuation guide like KBB or NADA minus estimated repair costs)
- That certified notice was sent to owner and all lienholders per O.R.C. § 4513.601
- Length of time vehicle has remained unclaimed after notice receipt
- That a search of applicable title records was made for outstanding liens

WHERE TO FILE:
Present the completed affidavit to the County Clerk of Courts in the county where your shop is located. The Clerk will issue a certificate of title free and clear of all liens and encumbrances.

IMPORTANT: This process applies to vehicles with a wholesale value under $3,500. If the vehicle's value exceeds $3,500, a different legal process is required — consult an Ohio attorney.`,

    IN: `═══════════════════════════════════════
DOCUMENT 2: INDIANA VEHICLE LIEN PROCESS GUIDE
I.C. § 9-22-6-2 — Newspaper Ad & BMV Sales Certificate
═══════════════════════════════════════

Prepare a detailed guide for the Indiana vehicle mechanic's lien process under I.C. § 9-22-6-2. Format this as a clear reference document:

STEP-BY-STEP CHECKLIST:

STEP A — CONDUCT TITLE SEARCH (per I.C. § 9-22-1-19)
Search Indiana BMV records to identify all owners and lienholders on the vehicle title. Document your search results. You cannot proceed without knowing who holds liens on the vehicle.

STEP B — PLACE NEWSPAPER ADVERTISEMENT
Run an ad in an English-language newspaper of general circulation in the city or town where your shop is located (or county-wide paper if outside city limits). The ad must contain:
- Vehicle description: ${vehicleDescription}
- VIN: ${vin}
- Amount of unpaid charges: $${parseInt(amountOwed).toLocaleString()}
- Time, place, and date of the public auction sale

Contact your local newspaper's legal notices department. Get a certification from the newspaper confirming the ad ran — you will need this for the BMV sales certificate.

STEP C — SEND CERTIFIED NOTICE
Send certified mail, return receipt requested, to:
- Vehicle owner: ${ownerName} at ${ownerAddress}
- All lienholders of record on the certificate of title

Notice must state the vehicle will be sold at public auction on a specified date to satisfy the mechanic's lien. Keep all return receipts and tracking records.

STEP D — CONDUCT PUBLIC AUCTION
Sell the vehicle at public auction to the highest and best bidder. You may bid on and purchase the vehicle yourself.

STEP E — APPLY SALE PROCEEDS
From sale proceeds, deduct in this order:
1. Your mechanic's lien amount ($${parseInt(amountOwed).toLocaleString()})
2. Sale and disposal costs
3. Cost of newspaper advertisement
Pay surplus first to first lienholder of record, then to vehicle owner if address known, then to Clerk of Courts if address unknown.

STEP F — EXECUTE BMV SALES CERTIFICATE
Execute a Sales Certificate in the form designated by the Indiana BMV, including:
- Facts of the sale
- VIN: ${vin}
- Certificate of title (if available)
- Newspaper certification showing ad ran as required
Purchaser uses this to apply for a new certificate of title from the Indiana BMV.`
  };

  const doc3Content = {
    MI: `═══════════════════════════════════════
DOCUMENT 3: FILING INSTRUCTIONS FOR ${claimantName.toUpperCase()}
Michigan Garage Keeper's Lien — Step by Step
═══════════════════════════════════════

STEP 1 — SEND THE DEMAND LETTER TODAY
Send via certified mail with return receipt requested. Keep the return receipt as evidence. Certified mail creates a verifiable record of the date and delivery.

STEP 2 — WAIT 10 DAYS FOR PAYMENT
If payment arrives, release the vehicle. If no payment, proceed. Your BDVR-35 deadline is ${filingDeadlineStr} — ${daysRemaining} days from today. Do not wait until the last week.

STEP 3 — VERIFY YOUR MVSR LICENSE COMPLIANCE
Under MCL 570.309, a garage keeper regulated by the Motor Vehicle Service and Repair Act cannot use the Garage Keeper's Lien Act unless in full compliance with the MVSR Act for the entire period of the claim. Confirm your license is current.

STEP 4 — COMPLETE AND SUBMIT FORM BDVR-35
Use the completed guide in Document 2. Submit to any Secretary of State branch office or mail to MDOS Customer Records Division. Include signed repair authorization, itemized invoice, and any written estimates.

STEP 5 — RECEIVE THE TR-42 FROM MDOS
MDOS will issue a TR-42 Certificate of Foreclosure of Garage Keeper's Lien and Bill of Sale. This authorizes the vehicle sale. Keep the original.

STEP 6 — SEND CERTIFIED LETTER WITHIN 30 DAYS OF TR-42
Within 30 days of TR-42 issuance, send certified letters return receipt requested to: (1) all vehicle owners, (2) all lienholders on title, and (3) MDOS. Letter must include itemized charges, demand for payment, storage fees, and date/time/manner/location of sale.

STEP 7 — SCHEDULE AND CONDUCT THE PUBLIC SALE
Sale cannot occur until at least 75 days after the TR-42 date. Must be a public sale per MCL 570.305.

STEP 8 — AFTER THE SALE
Apply proceeds to your lien first. Remit any excess to the vehicle owner or lienholder. Keep complete records.

DEADLINE REMINDER:
${daysRemaining <= 21
  ? `URGENT: Only ${daysRemaining} days until your 105-day BDVR-35 filing deadline of ${filingDeadlineStr}. File immediately.`
  : `Your BDVR-35 filing deadline is ${filingDeadlineStr} — ${daysRemaining} days from today. Do not wait.`}

LICENSING NOTE: You must be in compliance with the Motor Vehicle Service and Repair Act (MCL 257.1301 et seq.) for the entire period of your claim.`,

    OH: `═══════════════════════════════════════
DOCUMENT 3: FILING INSTRUCTIONS FOR ${claimantName.toUpperCase()}
Ohio Unclaimed Vehicle Process — Step by Step
O.R.C. § 4505.101
═══════════════════════════════════════

STEP 1 — SEND THE DEMAND LETTER TODAY
Send via certified mail with return receipt requested to ${ownerName} at ${ownerAddress}. Keep the return receipt. Most disputes resolve here.

STEP 2 — WAIT 10 DAYS FOR PAYMENT
If paid, release the vehicle. If not paid and the vehicle has been at your shop for 15+ days after repair completion, proceed to Step 3.

STEP 3 — SEARCH TITLE RECORDS
Before sending any official notice, search Ohio BMV title records to identify all owners and lienholders. This is required by O.R.C. § 4513.601. Contact your county Clerk of Courts or use Ohio's online title search system. Document your search.

STEP 4 — SEND CERTIFIED NOTICE TO OWNER AND ALL LIENHOLDERS
Send certified mail with return receipt requested to the owner and every lienholder identified in your title search. Notice must state: where the vehicle is located and the vehicle's estimated value. If the person who brought the vehicle in is NOT the titled owner, also notify your local law enforcement agency.

STEP 5 — WAIT 15 DAYS AFTER NOTICE IS RECEIVED
Once the owner and lienholders receive your notice, they have 15 days to claim the vehicle. If unclaimed after 15 days, proceed.

STEP 6 — COMPLETE THE AFFIDAVIT
Use the guide in Document 2 to complete the Ohio Registrar of Motor Vehicles affidavit form. The affidavit must certify the vehicle value, time unclaimed, that notice was sent, and that a title search was made.

STEP 7 — FILE WITH COUNTY CLERK OF COURTS
Present your completed affidavit to the County Clerk of Courts. The Clerk will issue a certificate of title to your shop, free and clear of all liens.

IMPORTANT: This process applies to vehicles with a wholesale value under $3,500. For higher-value vehicles, consult an Ohio attorney.

DEADLINE NOTE: There is no fixed filing deadline under O.R.C. § 4505.101 but the vehicle must have remained unclaimed for 15+ days after repair completion and 15+ days after notice receipt before you can file.`,

    IN: `═══════════════════════════════════════
DOCUMENT 3: FILING INSTRUCTIONS FOR ${claimantName.toUpperCase()}
Indiana Vehicle Mechanic's Lien — Step by Step
I.C. § 9-22-6-2
═══════════════════════════════════════

STEP 1 — SEND THE DEMAND LETTER TODAY
Send via certified mail with return receipt requested to ${ownerName} at ${ownerAddress}. Keep all receipts. Most disputes resolve here before the formal process is needed.

STEP 2 — WAIT 10 DAYS FOR PAYMENT
If paid, release the vehicle. If not paid, proceed. You must retain possession of the vehicle throughout this process — Indiana's lien is possessory.

STEP 3 — CONDUCT A TITLE SEARCH (per I.C. § 9-22-1-19)
Search Indiana BMV records to identify all owners and lienholders on the vehicle's certificate of title. You cannot properly advertise or give notice without knowing all interested parties.

STEP 4 — PLACE NEWSPAPER ADVERTISEMENT
Contact your local newspaper's legal notices department and place an advertisement per Document 2 instructions. Get a written certification from the newspaper confirming the ad ran — you need this for the BMV later. The ad must include the vehicle description, VIN, unpaid amount, and auction date.

STEP 5 — SEND CERTIFIED NOTICE TO ALL PARTIES
Simultaneously with or immediately after placing the newspaper ad, send certified mail, return receipt requested, to the vehicle owner and all lienholders of record. Notice must state the auction date.

STEP 6 — CONDUCT THE PUBLIC AUCTION
Hold the vehicle sale at public auction. You may bid on the vehicle yourself. Announce the sale publicly and document the proceedings.

STEP 7 — APPLY PROCEEDS AND EXECUTE SALES CERTIFICATE
Deduct your lien, sale costs, and ad costs from proceeds. Pay surplus to first lienholder, then owner, then Clerk of Courts if owner unknown. Complete the Indiana BMV Sales Certificate form — the buyer cannot get a new title without it.

STEP 8 — BMV TITLE ISSUANCE
The buyer presents your Sales Certificate plus an application to the Indiana BMV for a new certificate of title.

IMPORTANT: Violating I.C. § 9-22-6-2 procedures is a Class A infraction. Follow each step precisely. If you have released the vehicle and the owner still owes you, a different lien process applies (I.C. § 32-33-10). Consult an Indiana attorney in that situation.`
  };

  const requirements = stateRequirements[stateCode] || stateRequirements.MI;
  const doc2 = doc2Content[stateCode] || doc2Content.MI;
  const doc3 = doc3Content[stateCode] || doc3Content.MI;

  const licenseField = stateCode === 'MI'
    ? `MVSR License number: ${licenseNumber || 'TO BE CONFIRMED BEFORE FILING'}`
    : `Facility license/registration: ${licenseNumber || 'N/A'}`;

  const prompt = `You are a ${module.name} vehicle mechanic's lien document preparation specialist with deep knowledge of ${module.statute}.

APPLICABLE LAW: ${module.statute}
FILING AGENCY: ${module.filingAgency}
${stateCode === 'MI' ? `BDVR-35 FILING DEADLINE: ${filingDeadlineStr} (${daysRemaining} days remaining)
TOTAL PROCESS LIMIT: 225 days from lien attachment date` : ''}

KEY ${module.name.toUpperCase()} REQUIREMENTS:
${requirements}

CASE DETAILS:
Repair facility: ${claimantName}
Facility address: ${claimantAddress}
Facility phone: ${claimantPhone}
Facility email: ${claimantEmail}
${licenseField}
Vehicle: ${vehicleDescription}
VIN: ${vin}
Vehicle owner: ${ownerName}
Owner address: ${ownerAddress}
Work performed: ${workDescription}
Last date work performed: ${dateLast}
Amount owed: $${parseInt(amountOwed).toLocaleString()}
Today's date: ${today}

Generate the documents below, separated exactly by the string ---DOCUMENT BREAK--- on its own line.

CRITICAL FORMATTING RULE — NO BRACKETS:
Do NOT use square brackets [ ] anywhere in these documents except for these two cases only:
1. Missing MVSR license number: [ENTER MVSR LICENSE NUMBER]
2. Unknown lienholder details: [LIENHOLDER NAME — obtain from title search]
For ALL other content — signature lines, date fields, storage rates, next steps, process instructions, amounts to be determined — use plain text descriptions or blank underlines (___________). Never wrap instructions or action items in brackets. The shop owner will read this document directly; bracket notations will confuse them.

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
3. Cite ${module.statute} and state that ${claimantName} holds a lien on the vehicle and will initiate the ${module.name} legal process to recover the vehicle's value unless payment in full is received within 10 days
4. State that failure to pay will result in the statutory process being initiated, which may result in the vehicle being sold or titled to the shop, and any proceeds exceeding the amount owed will be remitted as required by law

Close professionally with signature block.

---DOCUMENT BREAK---

${packageType === 'full' ? `${doc2}

---DOCUMENT BREAK---

${doc3}` : ''}

Output only the documents. No preamble, no commentary outside the documents.`;

  return { prompt, filingDeadlineStr, daysRemaining };
}


export { STATE_MODULES, getLienDeadlineDays, getNoticeDeadlineDays, buildDocumentPrompt, buildAutoDocumentPrompt };
