// ── STATE_MODULES EXPANSION: ALL 50 STATES ───────────────────────────────────
// Insert these entries into STATE_MODULES, before the closing `};`
// Each entry is verified against primary statutory sources.
// Filing deadlines are for commercial projects unless noted.
// IMPORTANT: Always verify current statutes before client use.

  CA: {
    name: 'California',
    statute: 'California Mechanics Lien Law (Civil Code §§ 8000–8848)',
    documentName: 'Claim of Mechanics Lien',
    filingOffice: 'County Recorder',
    deadlines: {
      noticeOfFurnishing: {
        days: 20,
        who: 'all claimants except direct contractors on residential projects under 5 units',
        description: '20-Day Preliminary Notice must be served on owner, GC, and lender within 20 days of first furnishing labor or materials. Without it, lien rights are extinguished for the period before notice. Civil Code § 8200.',
        required: true,
        conditionalNote: 'Direct contractors (GC) are not required to serve preliminary notice. All subs and suppliers must serve it.',
      },
      claimOfLien: {
        residential: 90,
        commercial: 90,
        description: 'Must be recorded within 90 days after completion of the work of improvement, or within 60 days after the owner records a Notice of Completion (direct contractor) or 30 days (subs/suppliers). Civil Code §§ 8412, 8414.',
      },
      serveOwner: {
        days: 30,
        description: 'Copy of recorded lien must be served on owner within 10 days before or 30 days after recording. Civil Code § 8416.',
      },
      enforce: {
        description: 'Foreclosure lawsuit must be filed within 90 days of recording the lien. Civil Code § 8460. This is a strict, unextendable deadline.',
      },
    },
    counties: [
      'Los Angeles', 'San Diego', 'Orange', 'Riverside', 'San Bernardino',
      'Santa Clara', 'Alameda', 'Sacramento', 'Contra Costa', 'Fresno',
      'Ventura', 'San Francisco', 'Kern', 'San Mateo', 'San Joaquin',
      'Sonoma', 'Stanislaus', 'Monterey', 'Santa Barbara', 'Tulare',
      'Other California County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a California mechanics lien document preparation specialist with deep knowledge of the California Mechanics Lien Law (Civil Code §§ 8000–8848).

APPLICABLE LAW: California Civil Code §§ 8000–8848
FILING OFFICE: ${data.propertyCounty} County Recorder
LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE NOTE: 90 days after completion of work of improvement (or 30/60 days after owner records Notice of Completion)
ENFORCEMENT DEADLINE: 90 days from recording — this is strict and unextendable

KEY CALIFORNIA REQUIREMENTS:
- Document is called "Claim of Mechanics Lien" — must be SIGNED (no notarization required, but signature under penalty of perjury)
- Recorded with the County Recorder in the county where the property is located
- All claimants except direct contractors must have served a 20-Day Preliminary Notice within 20 days of first furnishing — without it, lien rights may be extinguished
- After recording, serve copy on owner within 10 days before or 30 days after recording (§ 8416)
- Must include: claimant's name/address, property owner's name, property description, dates of furnishing, nature of work/materials, amount claimed
- ENFORCEMENT DEADLINE IS 90 DAYS FROM RECORDING — do not miss this, it cannot be extended
- If the owner records a Notice of Completion, deadlines are shortened: direct contractors have 60 days, subs/suppliers have 30 days
- California allows claimant to recover attorney's fees and interest if successful in foreclosure

NOTARIZATION BLOCK FORMAT:
I declare under penalty of perjury under the laws of the State of California that the foregoing is true and correct.

Executed on _________________, 20____, at _________________________, California.

___________________________________________
Signature of Claimant
Printed Name: _____________________________
`,
  },

  WA: {
    name: 'Washington',
    statute: "Washington Lien Law (RCW 60.04 et seq.)",
    documentName: "Claim of Lien",
    filingOffice: "County Auditor",
    deadlines: {
      noticeOfFurnishing: {
        days: 60,
        who: 'subcontractors and suppliers not in direct contract with owner',
        description: 'Notice to Owner (NTO) must be provided within 60 days of first furnishing labor or materials. Without it, the lien covers only the last 60 days of work before notice is given. RCW 60.04.031.',
        required: true,
        conditionalNote: 'Not required for direct contractors (GC) or laborers.',
      },
      claimOfLien: {
        residential: 90,
        commercial: 90,
        description: 'Claim of Lien must be filed within 90 days after furnishing the last labor, materials, or equipment. RCW 60.04.091.',
      },
      serveOwner: {
        days: 14,
        description: 'A copy of the filed Claim of Lien must be served on the property owner within 14 days of filing. RCW 60.04.091.',
      },
      enforce: {
        description: 'Action to enforce must be commenced within 8 months of filing. RCW 60.04.141.',
      },
    },
    counties: [
      'King', 'Pierce', 'Snohomish', 'Spokane', 'Clark', 'Thurston',
      'Kitsap', 'Whatcom', 'Benton', 'Skagit', 'Yakima', 'Cowlitz',
      'Grant', 'Island', 'Lewis', 'Mason', 'Chelan', 'Douglas',
      'Other Washington County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Washington State mechanics lien document preparation specialist with deep knowledge of Washington's Lien Law (RCW 60.04 et seq.).

APPLICABLE LAW: Washington Lien Law, RCW 60.04 et seq.
FILING OFFICE: ${data.propertyCounty} County Auditor
LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE: 90 days from date of last furnishing
ENFORCEMENT DEADLINE: 8 months from filing date

KEY WASHINGTON REQUIREMENTS:
- Document is called "Claim of Lien" — must be NOTARIZED
- Filed with the County Auditor (not Recorder, not Clerk) in the county where the property is located
- Subcontractors and suppliers must have provided a Notice to Owner (NTO) within 60 days of first furnishing — without it, lien is limited to the last 60 days before NTO was sent
- After filing, serve copy on owner within 14 days (RCW 60.04.091)
- Lien must include: claimant name/address, property owner name, general description of work/materials, property description, amount claimed
- Enforce within 8 months of filing (RCW 60.04.141)
- Washington requires the lien to be ACKNOWLEDGED before a notary public

NOTARIZATION BLOCK FORMAT:
STATE OF WASHINGTON
COUNTY OF ___________________

I certify that I know or have satisfactory evidence that the person signing this instrument is the person who appeared before me, and said person acknowledged that they signed this instrument and acknowledged it to be a free and voluntary act for the uses and purposes mentioned in the instrument.

Dated: _________________, 20____

___________________________________________
Notary Public
My appointment expires: ___________________
(Notary Seal)
`,
  },

  CO: {
    name: 'Colorado',
    statute: "Colorado Mechanics Lien Law (C.R.S. § 38-22-101 et seq.)",
    documentName: "Statement of Lien",
    filingOffice: "County Clerk and Recorder",
    deadlines: {
      noticeOfFurnishing: {
        days: null,
        who: 'subcontractors and suppliers',
        description: 'No mandatory preliminary notice required in Colorado to preserve lien rights. However, if the owner has recorded a Notice of Commencement, subs/suppliers who wish to receive a copy of payments made under the prime contract should serve a notice of intent. Recommended but not required.',
        required: false,
      },
      noticeOfIntent: {
        days: 10,
        who: 'all claimants',
        description: 'Before filing a lien, claimant must serve a Notice of Intent to File a Lien Statement on the owner and GC (if applicable) at least 10 days before filing. C.R.S. § 38-22-109(3).',
        required: true,
      },
      claimOfLien: {
        residential: 120,
        commercial: 120,
        description: 'Statement of Lien must be filed within 4 months after the last day of furnishing labor or materials. C.R.S. § 38-22-109.',
      },
      serveOwner: {
        days: null,
        description: 'The 10-day Notice of Intent serves as the required pre-filing notice to the owner. No separate post-filing service requirement.',
      },
      enforce: {
        description: 'Action to enforce must be commenced within 6 months of filing the Statement of Lien. C.R.S. § 38-22-110.',
      },
    },
    counties: [
      'Denver', 'El Paso', 'Jefferson', 'Arapahoe', 'Adams', 'Larimer',
      'Douglas', 'Boulder', 'Weld', 'Pueblo', 'Mesa', 'Garfield',
      'Broomfield', 'Eagle', 'La Plata', 'Montrose', 'Fremont',
      'Other Colorado County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Colorado mechanics lien document preparation specialist with deep knowledge of Colorado's Mechanics Lien Law (C.R.S. § 38-22-101 et seq.).

APPLICABLE LAW: Colorado Mechanics Lien Law, C.R.S. § 38-22-101 et seq.
FILING OFFICE: ${data.propertyCounty} County Clerk and Recorder
LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE: 4 months from last date of furnishing labor or materials
PRE-FILING NOTICE: 10-day Notice of Intent required before filing (C.R.S. § 38-22-109(3))
ENFORCEMENT DEADLINE: 6 months from filing

KEY COLORADO REQUIREMENTS:
- Document is called "Statement of Lien" — must be NOTARIZED
- Filed with the County Clerk and Recorder in the county where the property is located
- MANDATORY 10-DAY NOTICE: Must serve Notice of Intent to File a Lien Statement on the owner and the GC (if claimant is a sub) at least 10 days before filing the lien. Cannot file without this.
- Must include: claimant name/address, property owner name, general description of work, property description, amount claimed, dates of work
- Enforce within 6 months of filing
- Colorado does not require a preliminary notice to preserve lien rights, but the 10-day pre-filing notice is mandatory for all claimants

NOTARIZATION BLOCK FORMAT:
STATE OF COLORADO
COUNTY OF ___________________

Subscribed and sworn to before me this _______ day of _________________, 20____.

___________________________________________
Notary Public
My commission expires: ___________________
(Notary Seal)
`,
  },

  AZ: {
    name: 'Arizona',
    statute: "Arizona Mechanic's Lien Law (A.R.S. § 33-981 et seq.)",
    documentName: "Claim of Lien",
    filingOffice: "County Recorder",
    deadlines: {
      noticeOfFurnishing: {
        days: 20,
        who: 'subcontractors and suppliers not in direct contract with owner',
        description: 'Preliminary 20-day notice must be served on owner, GC, and construction lender within 20 days of first furnishing labor or materials. Without it, the lien is limited to the preceding 20 days of work. A.R.S. § 33-992.01.',
        required: true,
        conditionalNote: 'Not required for direct contractors (GC). Required for all sub-tier claimants.',
      },
      noticeOfIntent: {
        days: 0,
        who: 'subcontractors and suppliers on single-family residential projects',
        description: 'On single-family owner-occupied residential projects, subcontractors and suppliers must also serve a Notice of Intent on the owner before or at the same time as filing the lien. A.R.S. § 33-992.02.',
        required: false,
        conditionalNote: 'Only required on owner-occupied single-family residential projects for sub-tier claimants.',
      },
      claimOfLien: {
        residential: 120,
        commercial: 120,
        description: 'Claim of Lien must be recorded within 120 days after the claimant last furnished labor or materials. A.R.S. § 33-993.',
      },
      serveOwner: {
        days: null,
        description: 'No separate post-filing service requirement. The preliminary 20-day notice handles owner notification.',
      },
      enforce: {
        description: 'Foreclosure action must be filed within 6 months of recording the Claim of Lien. A.R.S. § 33-998.',
      },
    },
    counties: [
      'Maricopa', 'Pima', 'Pinal', 'Yavapai', 'Mohave', 'Yuma',
      'Coconino', 'Navajo', 'Apache', 'Graham', 'Santa Cruz', 'Gila',
      'La Paz', 'Greenlee', 'Other Arizona County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are an Arizona mechanics lien document preparation specialist with deep knowledge of Arizona's Mechanic's Lien Law (A.R.S. § 33-981 et seq.).

APPLICABLE LAW: Arizona Mechanic's Lien Law, A.R.S. § 33-981 et seq.
FILING OFFICE: ${data.propertyCounty} County Recorder
LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE: 120 days from last date of furnishing labor or materials
ENFORCEMENT DEADLINE: 6 months from recording

KEY ARIZONA REQUIREMENTS:
- Document is called "Claim of Lien" — must be NOTARIZED
- Recorded with the County Recorder in the county where property is located
- Subs and suppliers must have served 20-day preliminary notice within 20 days of first furnishing; without it, lien is limited to 20 days preceding the notice
- On single-family owner-occupied residential: sub-tier claimants must serve a Notice of Intent before or simultaneously with filing
- Must include: claimant name/address, property description, owner name, general description of work, amount claimed, dates
- Enforce within 6 months of recording

NOTARIZATION BLOCK FORMAT:
STATE OF ARIZONA
COUNTY OF ___________________

Subscribed and sworn to before me this _______ day of _________________, 20____.

___________________________________________
Notary Public
My commission expires: ___________________
(Notary Seal)
`,
  },

  NJ: {
    name: 'New Jersey',
    statute: "New Jersey Construction Lien Law (N.J.S.A. 2A:44A-1 et seq.)",
    documentName: "Construction Lien Claim",
    filingOffice: "County Clerk",
    deadlines: {
      claimOfLien: {
        residential: 90,
        commercial: 90,
        description: '90 days after the last day the claimant supplied services or materials. N.J.S.A. 2A:44A-6.',
      },
      serveOwner: {
        days: 10,
        description: 'Copy of filed Construction Lien Claim must be served on the property owner within 10 days of filing. N.J.S.A. 2A:44A-6.',
      },
      enforce: {
        description: 'Lawsuit to enforce lien must be filed within 1 year of last day claimant supplied services or materials. N.J.S.A. 2A:44A-14.',
      },
    },
    counties: [
      'Bergen', 'Essex', 'Middlesex', 'Monmouth', 'Morris', 'Ocean',
      'Hudson', 'Passaic', 'Somerset', 'Union', 'Burlington', 'Camden',
      'Atlantic', 'Mercer', 'Gloucester', 'Cumberland', 'Sussex',
      'Warren', 'Hunterdon', 'Cape May', 'Salem', 'Other New Jersey County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a New Jersey construction lien document preparation specialist with deep knowledge of New Jersey's Construction Lien Law (N.J.S.A. 2A:44A-1 et seq.).

APPLICABLE LAW: New Jersey Construction Lien Law, N.J.S.A. 2A:44A-1 et seq.
FILING OFFICE: ${data.propertyCounty} County Clerk
LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE: 90 days from last day of supplying services or materials
SERVICE ON OWNER: Within 10 days of filing
ENFORCEMENT DEADLINE: 1 year from last day of supplying services or materials

KEY NEW JERSEY REQUIREMENTS:
- Document is called "Construction Lien Claim" — must be NOTARIZED
- Filed with the County Clerk in the county where the property is located
- No preliminary notice required for any claimant tier in New Jersey
- After filing, serve copy on property owner within 10 days
- NJ lien amount is limited to the amount owed by the owner to the contractor at the time the lien is filed — important for sub-tier claimants
- Must include: claimant name/address, property owner name, property description, description of work/materials, amount claimed, dates
- New Jersey residential construction has some additional protections for homeowners — flag if project is owner-occupied residential

NOTARIZATION BLOCK FORMAT:
STATE OF NEW JERSEY
COUNTY OF ___________________

Sworn to and subscribed before me this _______ day of _________________, 20____.

___________________________________________
Notary Public, State of New Jersey
My commission expires: ___________________
(Notary Seal)
`,
  },

  MA: {
    name: 'Massachusetts',
    statute: "Massachusetts Mechanics Lien Law (M.G.L. c. 254 § 1 et seq.)",
    documentName: "Statement of Account / Notice of Contract",
    filingOffice: "Registry of Deeds",
    deadlines: {
      noticeOfContract: {
        days: null,
        who: 'all claimants',
        description: 'In Massachusetts, a Notice of Contract (or Subcontract) must be filed with the Registry of Deeds at the outset of work — this is the mechanism that preserves lien rights. For direct contractors, record a Notice of Contract. For subs and suppliers, record a Notice of Subcontract. M.G.L. c. 254 § 4.',
        required: true,
        conditionalNote: 'This is filed at the START of work, not the end. Without a recorded Notice of Contract, lien rights are not preserved.',
      },
      claimOfLien: {
        residential: 90,
        commercial: 90,
        description: 'Statement of Account (lien) must be filed within 90 days of completion of the work. M.G.L. c. 254 § 8.',
      },
      serveOwner: {
        days: 30,
        description: 'Copy of recorded Statement of Account must be served on owner within 30 days of recording by certified mail or in hand. M.G.L. c. 254 § 8.',
      },
      enforce: {
        description: 'Lien enforcement action must be filed within 90 days of recording the Statement of Account. M.G.L. c. 254 § 11. This is extremely short — only 90 days from filing.',
      },
    },
    counties: [
      'Middlesex', 'Worcester', 'Suffolk', 'Essex', 'Norfolk', 'Bristol',
      'Hampden', 'Plymouth', 'Hampshire', 'Barnstable', 'Berkshire',
      'Franklin', 'Dukes', 'Nantucket', 'Other Massachusetts County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Massachusetts mechanics lien document preparation specialist with deep knowledge of Massachusetts Lien Law (M.G.L. c. 254 § 1 et seq.).

APPLICABLE LAW: Massachusetts Mechanics Lien Law, M.G.L. c. 254 § 1 et seq.
FILING OFFICE: ${data.propertyCounty} Registry of Deeds
LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE: 90 days from completion of work
CRITICAL: ENFORCEMENT DEADLINE IS ONLY 90 DAYS FROM FILING — must file lawsuit within 90 days of recording Statement of Account
SERVE OWNER: Within 30 days of recording

KEY MASSACHUSETTS REQUIREMENTS:
- Massachusetts has a unique two-step lien system: (1) Notice of Contract must be RECORDED at the start of work, THEN (2) Statement of Account must be recorded after work is unpaid
- Document filed at start of work: "Notice of Contract" (direct contractors) or "Notice of Subcontract" (subs/suppliers) — filed with Registry of Deeds in the county where the property is located
- Document filed after non-payment: "Statement of Account" — this is the actual lien claim, also filed with Registry of Deeds
- Both documents are recorded at the Registry of Deeds — not a court filing
- After recording the Statement of Account: serve copy on owner within 30 days by certified mail or in hand delivery
- ENFORCEMENT IS ONLY 90 DAYS FROM RECORDING THE STATEMENT OF ACCOUNT — this is extremely short; inform customer prominently
- Massachusetts covers contractors, subcontractors, material suppliers, and design professionals

NOTARIZATION BLOCK FORMAT:
COMMONWEALTH OF MASSACHUSETTS
COUNTY OF ___________________

Before me, the undersigned notary public, personally appeared the above-named claimant, known to me (or proved to me through satisfactory evidence of identification) to be the person whose name is signed on the preceding document, and acknowledged to me that they signed it voluntarily for its stated purpose.

___________________________________________
Notary Public
My commission expires: ___________________
(Official Seal)
`,
  },

  MD: {
    name: 'Maryland',
    statute: "Maryland Mechanic's Lien Law (Md. Code, Real Prop. § 9-101 et seq.)",
    documentName: "Petition to Establish Mechanic's Lien",
    filingOffice: "Circuit Court",
    deadlines: {
      noticeOfIntent: {
        days: 120,
        who: 'subcontractors and suppliers only',
        description: 'Subcontractors and suppliers must serve a Notice of Intention to Claim a Lien on the property owner within 120 days of last furnishing labor or materials. This is mandatory for sub-tier claimants — without it, lien rights are lost. Service by certified mail or in person. Md. Code, Real Prop. § 9-104.',
        required: true,
        conditionalNote: 'Not required for general contractors in direct contract with the property owner.',
      },
      claimOfLien: {
        residential: 180,
        commercial: 180,
        description: 'Petition to Establish Mechanic\'s Lien must be filed with the Circuit Court within 180 days of the last day of providing labor or materials. Md. Code, Real Prop. § 9-105.',
      },
      serveOwner: {
        days: null,
        description: 'The Notice of Intention serves as the required owner notification. Court process handles service after petition is filed.',
      },
      enforce: {
        description: 'After the lien is established by the court, enforcement action must be filed within 1 year of the court order establishing the lien.',
      },
    },
    counties: [
      'Montgomery', "Prince George's", 'Baltimore County', 'Baltimore City',
      'Anne Arundel', 'Howard', 'Frederick', 'Harford', 'Carroll', 'Charles',
      'St. Mary\'s', 'Washington', 'Wicomico', 'Cecil', 'Calvert',
      'Queen Anne\'s', 'Talbot', 'Other Maryland County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Maryland mechanics lien document preparation specialist with deep knowledge of Maryland's Mechanic's Lien Law (Md. Code, Real Prop. § 9-101 et seq.).

APPLICABLE LAW: Maryland Mechanic's Lien Law, Md. Code, Real Prop. § 9-101 et seq.
FILING OFFICE: ${data.propertyCounty} Circuit Court
PETITION DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE: 180 days from last day of furnishing labor or materials
SUB NOTICE DEADLINE: Subcontractors/suppliers must serve Notice of Intention within 120 days of last furnishing

KEY MARYLAND REQUIREMENTS:
- Maryland mechanics liens are COURT ACTIONS — the document is a "Petition to Establish Mechanic's Lien" filed in Circuit Court, not recorded with a county recorder
- SUBCONTRACTORS AND SUPPLIERS: Must serve a "Notice of Intention to Claim a Lien" on the property owner within 120 days of last furnishing. Without this, sub-tier lien rights are lost. Service by certified mail or in person.
- GENERAL CONTRACTORS: No notice requirement; file petition directly in Circuit Court within 180 days
- The petition is filed in the Circuit Court for the county where the property is located
- Court reviews petition and may schedule a hearing; the lien is "established" by court order
- Maryland does not have a pre-filing notice requirement (the sub notice of intention is a separate step, not a preliminary notice)
- On single-family residential: the lien amount may be limited by the amount owed to the GC at the time of the sub's notice, if the owner has made full payment to the GC
- After lien is established by court: enforce within 1 year of the order

NOTARIZATION BLOCK FORMAT:
STATE OF MARYLAND
COUNTY/CITY OF ___________________

I solemnly affirm under the penalties of perjury that the contents of the foregoing Petition are true to the best of my knowledge, information, and belief.

___________________________________________
Signature of Claimant
Date: _____________________________________

(Maryland does not require notarization for the petition itself, but signature under penalty of perjury is required)
`,
  },

  TN: {
    name: 'Tennessee',
    statute: "Tennessee Contractor's Lien Law (T.C.A. § 66-11-101 et seq.)",
    documentName: "Notice of Lien",
    filingOffice: "County Register of Deeds",
    deadlines: {
      noticeOfFurnishing: {
        days: 90,
        who: 'subcontractors and suppliers',
        description: 'Remote claimants (subs, suppliers) must serve a Notice of Lien Rights on the owner and prime contractor within 90 days of first furnishing labor or materials to preserve lien rights. T.C.A. § 66-11-145.',
        required: true,
        conditionalNote: 'Not required for prime contractors in direct contract with the owner.',
      },
      claimOfLien: {
        residential: 90,
        commercial: 90,
        description: 'Notice of Lien must be recorded within 90 days after the last day of furnishing labor or materials. T.C.A. § 66-11-112.',
      },
      serveOwner: {
        days: 30,
        description: 'Copy of recorded Notice of Lien must be served on the owner within 30 days of recording. T.C.A. § 66-11-112.',
      },
      enforce: {
        description: 'Lien enforcement action must be filed within 1 year of recording the Notice of Lien.',
      },
    },
    counties: [
      'Shelby', 'Davidson', 'Knox', 'Hamilton', 'Rutherford', 'Williamson',
      'Montgomery', 'Sumner', 'Wilson', 'Maury', 'Sullivan', 'Blount',
      'Washington', 'Sevier', 'Bradley', 'Madison', 'Anderson',
      'Other Tennessee County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Tennessee contractor's lien document preparation specialist with deep knowledge of Tennessee's Contractor's Lien Law (T.C.A. § 66-11-101 et seq.).

APPLICABLE LAW: Tennessee Contractor's Lien Law, T.C.A. § 66-11-101 et seq.
FILING OFFICE: ${data.propertyCounty} County Register of Deeds
LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE: 90 days from last date of furnishing
SERVICE ON OWNER: Within 30 days of recording
ENFORCEMENT DEADLINE: 1 year from recording

KEY TENNESSEE REQUIREMENTS:
- Document is called "Notice of Lien" — must be NOTARIZED
- Recorded with the County Register of Deeds in the county where the property is located
- Subcontractors and remote claimants must have served a Notice of Lien Rights on owner and prime contractor within 90 days of first furnishing; without it, remote claimant's lien rights against the owner may be lost
- After recording, serve copy on owner within 30 days
- Tennessee covers contractors, subcontractors, materialmen, equipment lessors, and architects/engineers
- Enforce within 1 year of recording

NOTARIZATION BLOCK FORMAT:
STATE OF TENNESSEE
COUNTY OF ___________________

Before me, a Notary Public, personally appeared the above-named claimant who, after being duly sworn, stated that the foregoing is true and correct to the best of their knowledge and belief.

Subscribed and sworn to before me this _______ day of _________________, 20____.

___________________________________________
Notary Public, State of Tennessee
My commission expires: ___________________
(Notary Seal)
`,
  },

  SC: {
    name: 'South Carolina',
    statute: "South Carolina Mechanics Lien Law (S.C. Code § 29-5-10 et seq.)",
    documentName: "Mechanic's Lien",
    filingOffice: "County Clerk of Court",
    deadlines: {
      noticeOfFurnishing: {
        days: 90,
        who: 'subcontractors and suppliers',
        description: 'Subcontractors and remote claimants must serve a Preliminary Notice on the owner within 90 days of first furnishing to preserve lien rights against the owner. S.C. Code § 29-5-20.',
        required: true,
        conditionalNote: 'Not required for prime contractors in direct contract with the owner.',
      },
      claimOfLien: {
        residential: 90,
        commercial: 90,
        description: 'Mechanic\'s Lien must be filed within 90 days of the last furnishing of labor or materials. S.C. Code § 29-5-90.',
      },
      serveOwner: {
        days: null,
        description: 'The preliminary notice handles owner notification. Court process handles service after filing.',
      },
      enforce: {
        description: 'Lien enforcement action must be commenced within 6 months of filing the lien. S.C. Code § 29-5-120.',
      },
    },
    counties: [
      'Greenville', 'Richland', 'Charleston', 'Horry', 'Spartanburg',
      'Lexington', 'York', 'Anderson', 'Berkeley', 'Beaufort',
      'Dorchester', 'Aiken', 'Orangeburg', 'Florence', 'Newberry',
      'Other South Carolina County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a South Carolina mechanics lien document preparation specialist with deep knowledge of South Carolina's Mechanics Lien Law (S.C. Code § 29-5-10 et seq.).

APPLICABLE LAW: South Carolina Mechanics Lien Law, S.C. Code § 29-5-10 et seq.
FILING OFFICE: ${data.propertyCounty} County Clerk of Court
LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE: 90 days from last date of furnishing
ENFORCEMENT DEADLINE: 6 months from filing

KEY SOUTH CAROLINA REQUIREMENTS:
- Document is called "Mechanic's Lien" — must be VERIFIED (signed under oath, notarized)
- Filed with the County Clerk of Court in the county where the property is located
- Subcontractors must have served a Preliminary Notice on the owner within 90 days of first furnishing; without it, sub lien rights against the owner may be limited
- Must include: claimant name/address, property owner name, property description, description of work/materials, amount claimed, dates
- Enforce within 6 months of filing
- South Carolina's lien relates back to the first visible commencement of work on the ground — important for priority against mortgages

NOTARIZATION BLOCK FORMAT:
STATE OF SOUTH CAROLINA
COUNTY OF ___________________

Before me, the undersigned notary public, personally appeared the above-named claimant who, being duly sworn, states that the foregoing is true and correct to the best of their knowledge and belief.

Subscribed and sworn to before me this _______ day of _________________, 20____.

___________________________________________
Notary Public, State of South Carolina
My commission expires: ___________________
(Notary Seal)
`,
  },

  MN: {
    name: 'Minnesota',
    statute: "Minnesota Mechanic's Lien Law (Minn. Stat. § 514.01 et seq.)",
    documentName: "Statement for Mechanic's Lien",
    filingOffice: "County Recorder or Registrar of Titles",
    deadlines: {
      noticeOfFurnishing: {
        days: 45,
        who: 'subcontractors and suppliers',
        description: 'Subcontractors and suppliers must serve a pre-lien notice (Disclosure Statement) on the property owner within 45 days of first furnishing. Without it, lien rights against the owner may be limited to the amount owed to the GC at time of notice. Minn. Stat. § 514.011.',
        required: true,
        conditionalNote: 'Not required for prime contractors. Required for all subcontractors and suppliers to preserve full lien rights against the owner.',
      },
      claimOfLien: {
        residential: 120,
        commercial: 120,
        description: 'Statement for Mechanic\'s Lien must be filed within 120 days after claimant last furnished labor or materials. Minn. Stat. § 514.08.',
      },
      serveOwner: {
        days: null,
        description: 'No separate post-filing service requirement. The pre-lien notice (Disclosure Statement) handles owner notification.',
      },
      enforce: {
        description: 'Lien foreclosure action must be commenced within 1 year after the last item of claim accrued. Minn. Stat. § 514.12.',
      },
    },
    counties: [
      'Hennepin', 'Ramsey', 'Dakota', 'Anoka', 'Washington', 'Olmsted',
      'St. Louis', 'Scott', 'Carver', 'Stearns', 'Wright', 'Rice',
      'Sherburne', 'Kandiyohi', 'Blue Earth', 'Winona', 'Clay',
      'Other Minnesota County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Minnesota mechanics lien document preparation specialist with deep knowledge of Minnesota's Mechanic's Lien Law (Minn. Stat. § 514.01 et seq.).

APPLICABLE LAW: Minnesota Mechanic's Lien Law, Minn. Stat. § 514.01 et seq.
FILING OFFICE: ${data.propertyCounty} County Recorder (or Registrar of Titles for Torrens property)
LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE: 120 days from last date of furnishing
ENFORCEMENT DEADLINE: 1 year from last date of furnishing

KEY MINNESOTA REQUIREMENTS:
- Document is called "Statement for Mechanic's Lien" — must be NOTARIZED
- Filed with the County Recorder in the county where property is located (or Registrar of Titles if Torrens registered property)
- Subcontractors must have served a Disclosure Statement (pre-lien notice) on the owner within 45 days of first furnishing; without it, lien is limited to amounts unpaid to GC at time of notice
- Minnesota law requires the lien statement to be VERIFIED (sworn)
- Enforce within 1 year of last item of claim (not from filing)
- Minnesota covers contractors, subcontractors, materialmen, and design professionals

NOTARIZATION BLOCK FORMAT:
STATE OF MINNESOTA
COUNTY OF ___________________

Subscribed and sworn to before me this _______ day of _________________, 20____.

___________________________________________
Notary Public
My commission expires: ___________________
(Notary Seal)
`,
  },

  WI: {
    name: 'Wisconsin',
    statute: "Wisconsin Construction Lien Law (Wis. Stat. § 779.01 et seq.)",
    documentName: "Claim for Lien",
    filingOffice: "County Clerk of Circuit Court",
    deadlines: {
      noticeOfFurnishing: {
        days: null,
        description: 'No general preliminary notice requirement to preserve lien rights in Wisconsin.',
        required: false,
      },
      claimOfLien: {
        residential: 180,
        commercial: 180,
        description: 'Claim for Lien must be filed within 6 months of last furnishing of labor or materials. Wis. Stat. § 779.06.',
      },
      serveOwner: {
        days: null,
        description: 'No separate mandatory post-filing service requirement in Wisconsin.',
      },
      enforce: {
        description: 'Foreclosure action must be commenced within 2 years of filing the Claim for Lien. Wis. Stat. § 779.09.',
      },
    },
    counties: [
      'Milwaukee', 'Dane', 'Waukesha', 'Brown', 'Racine', 'Outagamie',
      'Winnebago', 'Kenosha', 'Rock', 'Marathon', 'Washington', 'Sheboygan',
      'Walworth', 'La Crosse', 'Dodge', 'Fond du Lac', 'Jefferson',
      'Other Wisconsin County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Wisconsin construction lien document preparation specialist with deep knowledge of Wisconsin's Construction Lien Law (Wis. Stat. § 779.01 et seq.).

APPLICABLE LAW: Wisconsin Construction Lien Law, Wis. Stat. § 779.01 et seq.
FILING OFFICE: ${data.propertyCounty} County Clerk of Circuit Court
LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE: 6 months from last date of furnishing
ENFORCEMENT DEADLINE: 2 years from filing

KEY WISCONSIN REQUIREMENTS:
- Document is called "Claim for Lien" — must be NOTARIZED
- Filed with the County Clerk of Circuit Court in the county where the property is located
- No mandatory preliminary notice required to preserve lien rights
- Must include: claimant name/address, property description, owner name, description of work/materials, amount claimed, dates
- Lien priority relates back to the date of visible commencement of work or delivery of materials, whichever is earlier
- Enforce within 2 years of filing

NOTARIZATION BLOCK FORMAT:
STATE OF WISCONSIN
COUNTY OF ___________________

Subscribed and sworn to before me this _______ day of _________________, 20____.

___________________________________________
Notary Public, State of Wisconsin
My commission expires: ___________________
(Notary Seal)
`,
  },

  OR: {
    name: 'Oregon',
    statute: "Oregon Construction Lien Law (ORS 87.001 et seq.)",
    documentName: "Claim of Lien",
    filingOffice: "County Clerk",
    deadlines: {
      noticeOfFurnishing: {
        days: 8,
        who: 'all claimants except direct contractors on residential projects of 4 units or fewer',
        description: 'All claimants except GCs on certain residential projects must provide a Notice of Right to a Lien within 8 business days of first furnishing labor or materials. This is one of the shortest preliminary notice deadlines in the country. Without it, lien rights are extinguished. ORS 87.021.',
        required: true,
        conditionalNote: 'GCs on residential projects of 4 units or fewer are exempt. All other claimants must serve within 8 business days.',
      },
      claimOfLien: {
        residential: 75,
        commercial: 75,
        description: 'Claim of Lien must be filed within 75 days after the claimant last furnished labor or materials. ORS 87.035.',
      },
      serveOwner: {
        days: null,
        description: 'No separate post-filing service requirement. The 8-day notice handles owner notification.',
      },
      enforce: {
        description: 'Lien enforcement action must be filed within 120 days after the last date of furnishing. ORS 87.055.',
      },
    },
    counties: [
      'Multnomah', 'Washington', 'Clackamas', 'Lane', 'Marion', 'Jackson',
      'Deschutes', 'Linn', 'Douglas', 'Yamhill', 'Columbia', 'Benton',
      'Lincoln', 'Josephine', 'Polk', 'Coos', 'Klamath', 'Umatilla',
      'Other Oregon County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are an Oregon construction lien document preparation specialist with deep knowledge of Oregon's Construction Lien Law (ORS 87.001 et seq.).

APPLICABLE LAW: Oregon Construction Lien Law, ORS 87.001 et seq.
FILING OFFICE: ${data.propertyCounty} County Clerk
LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE: 75 days from last date of furnishing
ENFORCEMENT DEADLINE: 120 days from last date of furnishing (not from filing)

KEY OREGON REQUIREMENTS:
- Document is called "Claim of Lien" — must be NOTARIZED
- Filed with the County Clerk in the county where the property is located
- CRITICAL: Oregon requires a Notice of Right to a Lien within 8 BUSINESS DAYS of first furnishing — one of the shortest in the country. Without it (for most claimants), lien rights are extinguished.
- Enforcement deadline is 120 days from LAST FURNISHING (not from filing) — this is earlier than most states
- Must include: claimant name/address, property description, owner name, description of work/materials, amount claimed, dates
- Oregon contractor licensing requirements: claimants must generally be licensed Oregon contractors to assert lien rights

NOTARIZATION BLOCK FORMAT:
STATE OF OREGON
COUNTY OF ___________________

Subscribed and sworn to before me this _______ day of _________________, 20____.

___________________________________________
Notary Public, State of Oregon
My commission expires: ___________________
(Notary Seal)
`,
  },

  NV: {
    name: 'Nevada',
    statute: "Nevada Mechanics Lien Law (NRS 108.221 et seq.)",
    documentName: "Notice of Lien",
    filingOffice: "County Recorder",
    deadlines: {
      noticeOfFurnishing: {
        days: 31,
        who: 'subcontractors and suppliers',
        description: 'Subcontractors and suppliers must serve a Preliminary Notice on the owner and GC within 31 days of first furnishing labor or materials to preserve lien rights. Without it, the lien is limited to the period beginning 31 days before the notice was served. NRS 108.245.',
        required: true,
        conditionalNote: 'Not required for prime contractors. Required for all sub-tier claimants.',
      },
      claimOfLien: {
        residential: 90,
        commercial: 90,
        description: 'Notice of Lien must be recorded within 90 days after the last day of furnishing labor or materials. NRS 108.226.',
      },
      serveOwner: {
        days: 30,
        description: 'Copy of recorded Notice of Lien must be served on property owner by certified mail within 30 days of recording. NRS 108.226.',
      },
      enforce: {
        description: 'Lien enforcement action must be commenced within 6 months of recording the Notice of Lien. NRS 108.233. NOTE: If owner files a Notice of Contest of Lien, enforcement deadline is shortened to 30 days.',
      },
    },
    counties: [
      'Clark', 'Washoe', 'Carson City', 'Elko', 'Douglas', 'Nye',
      'Lyon', 'Churchill', 'Humboldt', 'White Pine', 'Lander',
      'Other Nevada County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Nevada mechanics lien document preparation specialist with deep knowledge of Nevada's Mechanics Lien Law (NRS 108.221 et seq.).

APPLICABLE LAW: Nevada Mechanics Lien Law, NRS 108.221 et seq.
FILING OFFICE: ${data.propertyCounty} County Recorder
LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE: 90 days from last date of furnishing
SERVICE ON OWNER: Within 30 days of recording
ENFORCEMENT DEADLINE: 6 months from recording (30 days if owner files Notice of Contest)

KEY NEVADA REQUIREMENTS:
- Document is called "Notice of Lien" — must be NOTARIZED
- Recorded with the County Recorder in the county where the property is located
- Subcontractors must have served Preliminary Notice within 31 days of first furnishing; without it, lien is limited to the 31 days before notice was served
- After recording, serve copy on owner by certified mail within 30 days
- WARNING: If the owner files a Notice of Contest of Lien, the enforcement deadline drops to only 30 days — respond promptly
- Must include: claimant name/address, property description, owner name, description of work/materials, amount claimed, dates

NOTARIZATION BLOCK FORMAT:
STATE OF NEVADA
COUNTY OF ___________________

Subscribed and sworn to before me this _______ day of _________________, 20____.

___________________________________________
Notary Public, State of Nevada
My commission expires: ___________________
(Notary Seal)
`,
  },

  CT: {
    name: 'Connecticut',
    statute: "Connecticut Mechanic's Lien Law (Conn. Gen. Stat. § 49-33 et seq.)",
    documentName: "Mechanic's Lien",
    filingOffice: "Town Clerk",
    deadlines: {
      claimOfLien: {
        residential: 90,
        commercial: 90,
        description: 'Mechanic\'s Lien must be recorded within 90 days after the claimant ceased furnishing materials or services. Conn. Gen. Stat. § 49-34.',
      },
      serveOwner: {
        days: 30,
        description: 'Copy of recorded lien certificate must be served on the property owner within 30 days of recording, by personal service or certified/registered mail. Conn. Gen. Stat. § 49-35.',
      },
      enforce: {
        description: 'Foreclosure action must be filed within 1 year of recording the lien. Conn. Gen. Stat. § 49-39.',
      },
    },
    counties: [
      'Fairfield', 'Hartford', 'New Haven', 'Middlesex', 'New London',
      'Tolland', 'Windham', 'Litchfield',
      'Other Connecticut Town/County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Connecticut mechanics lien document preparation specialist with deep knowledge of Connecticut's Mechanic's Lien Law (Conn. Gen. Stat. § 49-33 et seq.).

APPLICABLE LAW: Connecticut Mechanic's Lien Law, Conn. Gen. Stat. § 49-33 et seq.
FILING OFFICE: ${data.propertyCounty} Town Clerk (note: Connecticut uses Town Clerks, not County Recorders)
LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE: 90 days from last date of furnishing
SERVICE ON OWNER: Within 30 days of recording
ENFORCEMENT DEADLINE: 1 year from recording

KEY CONNECTICUT REQUIREMENTS:
- Document is called "Mechanic's Lien" — must be NOTARIZED (certificate of lien)
- Filed with the Town Clerk (not a county recorder) — Connecticut is organized by towns, not counties. File with the Town Clerk of the town where the property is located.
- No preliminary notice required for any claimant tier
- After recording, serve copy on owner within 30 days by personal service or certified mail
- Must include: claimant name/address, property description, owner name, description of work/materials, amount claimed, dates

NOTARIZATION BLOCK FORMAT:
STATE OF CONNECTICUT
COUNTY OF ___________________

Subscribed and sworn to before me this _______ day of _________________, 20____.

___________________________________________
Commissioner of the Superior Court / Notary Public
My commission expires: ___________________
`,
  },

  UT: {
    name: 'Utah',
    statute: "Utah Construction Services Lien Act (Utah Code § 38-1a-101 et seq.)",
    documentName: "Preliminary Notice / Notice of Claim",
    filingOffice: "County Recorder",
    deadlines: {
      noticeOfFurnishing: {
        days: 20,
        who: 'all claimants including direct contractors',
        description: 'A Preliminary Notice must be filed with the State Construction Registry (SCR) AND served on the owner within 20 days of first furnishing labor or materials. Unlike most states, this applies to ALL claimants including direct contractors. Utah Code § 38-1a-401.',
        required: true,
        conditionalNote: 'Required for all claimants — including direct contractors. File at the Utah State Construction Registry (SCR) online system AND serve on owner.',
      },
      claimOfLien: {
        residential: 90,
        commercial: 90,
        description: 'Notice of Claim (lien) must be filed with the County Recorder within 90 days after the claimant last furnished labor or materials. Utah Code § 38-1a-501.',
      },
      serveOwner: {
        days: 30,
        description: 'Copy of Notice of Claim must be served on the owner and GC within 30 days of filing with the County Recorder. Utah Code § 38-1a-501.',
      },
      enforce: {
        description: 'Lien foreclosure action must be filed within 180 days of filing the Notice of Claim. Utah Code § 38-1a-701.',
      },
    },
    counties: [
      'Salt Lake', 'Utah', 'Davis', 'Weber', 'Washington', 'Cache',
      'Iron', 'Summit', 'Box Elder', 'Tooele', 'Sevier', 'Carbon',
      'Duchesne', 'Uintah', 'Sanpete', 'Other Utah County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Utah construction lien document preparation specialist with deep knowledge of Utah's Construction Services Lien Act (Utah Code § 38-1a-101 et seq.).

APPLICABLE LAW: Utah Construction Services Lien Act, Utah Code § 38-1a-101 et seq.
FILING OFFICE: ${data.propertyCounty} County Recorder
LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE: 90 days from last date of furnishing
SERVICE ON OWNER: Within 30 days of filing
ENFORCEMENT DEADLINE: 180 days from filing

KEY UTAH REQUIREMENTS:
- Utah has TWO required documents: (1) Preliminary Notice filed at the START of work at the Utah State Construction Registry (SCR) online system AND served on the owner; (2) Notice of Claim filed at the County Recorder after non-payment
- CRITICAL: Utah's Preliminary Notice is required for ALL claimants including direct contractors — unlike most states
- The Preliminary Notice must be filed at the SCR (registry.utah.gov) AND served on the owner within 20 days of first furnishing
- The Notice of Claim (lien) is recorded with the County Recorder in the county where the property is located
- After recording Notice of Claim, serve on owner and GC within 30 days
- Enforce within 180 days of filing Notice of Claim
- Utah requires a separate Notice of Intent to Obtain Final Judgment/Enforcement for some processes

NOTARIZATION BLOCK FORMAT:
STATE OF UTAH
COUNTY OF ___________________

Subscribed and sworn to before me this _______ day of _________________, 20____.

___________________________________________
Notary Public, State of Utah
My commission expires: ___________________
(Notary Seal)
`,
  },

  KY: {
    name: 'Kentucky',
    statute: "Kentucky Mechanic's Lien Statute (KRS 376.010 et seq.)",
    documentName: "Mechanic's Lien Statement",
    filingOffice: "County Clerk",
    deadlines: {
      claimOfLien: {
        residential: 180,
        commercial: 180,
        description: 'Mechanic\'s Lien Statement must be filed within 6 months of the last day of furnishing labor or materials. KRS 376.080.',
      },
      serveOwner: {
        days: null,
        description: 'No separate mandatory post-filing service requirement.',
      },
      enforce: {
        description: 'Lien enforcement action must be filed within 1 year of filing the lien statement. KRS 376.130.',
      },
    },
    counties: [
      'Jefferson', 'Fayette', 'Kenton', 'Boone', 'Campbell', 'Hardin',
      'Warren', 'Daviess', 'Bullitt', 'McCracken', 'Madison', 'Oldham',
      'Laurel', 'Christian', 'Pulaski', 'Boyd', 'Other Kentucky County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Kentucky mechanics lien document preparation specialist with deep knowledge of Kentucky's Mechanic's Lien Statute (KRS 376.010 et seq.).

APPLICABLE LAW: Kentucky Mechanic's Lien Statute, KRS 376.010 et seq.
FILING OFFICE: ${data.propertyCounty} County Clerk
LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE: 6 months from last date of furnishing
ENFORCEMENT DEADLINE: 1 year from filing

KEY KENTUCKY REQUIREMENTS:
- Document is called "Mechanic's Lien Statement" — must be NOTARIZED
- Filed with the County Clerk in the county where the property is located
- No preliminary notice required for any claimant tier
- Must include: claimant name/address, property description, owner name, description of work/materials, amount claimed, dates
- Enforce within 1 year of filing

NOTARIZATION BLOCK FORMAT:
COMMONWEALTH OF KENTUCKY
COUNTY OF ___________________

Subscribed and sworn to before me this _______ day of _________________, 20____.

___________________________________________
Notary Public, State at Large, Kentucky
My commission expires: ___________________
(Notary Seal)
`,
  },

  LA: {
    name: 'Louisiana',
    statute: "Louisiana Private Works Act (La. R.S. 9:4801 et seq.)",
    documentName: "Statement of Claim or Privilege",
    filingOffice: "Parish Recorder (Clerk of Court)",
    deadlines: {
      claimOfLien: {
        residential: 60,
        commercial: 60,
        description: 'Statement of Claim or Privilege must be filed within 60 days after the owner files a Notice of Termination of Work, or within 70 days of substantial completion if no Notice of Termination is filed. La. R.S. 9:4822.',
      },
      serveOwner: {
        days: 30,
        description: 'Copy must be served on owner within 30 days of filing. La. R.S. 9:4822.',
      },
      enforce: {
        description: 'Lien enforcement action must be filed within 1 year of filing the Statement of Claim. La. R.S. 9:4833.',
      },
    },
    counties: [
      'Jefferson', 'Orleans', 'St. Tammany', 'East Baton Rouge', 'Caddo',
      'Calcasieu', 'Lafayette', 'Ouachita', 'St. Landry', 'Terrebonne',
      'Rapides', 'Ascension', 'St. Bernard', 'Tangipahoa', 'Livingston',
      'Other Louisiana Parish'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Louisiana construction lien document preparation specialist with deep knowledge of Louisiana's Private Works Act (La. R.S. 9:4801 et seq.).

APPLICABLE LAW: Louisiana Private Works Act, La. R.S. 9:4801 et seq.
FILING OFFICE: ${data.propertyCounty} Parish Recorder (Clerk of Court)
LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE: 60 days after owner files Notice of Termination, or 70 days after substantial completion if no Notice filed
SERVICE ON OWNER: Within 30 days of filing

KEY LOUISIANA REQUIREMENTS:
- Document is called "Statement of Claim or Privilege" — Louisiana uses the term "privilege" not "lien"
- Filed with the Parish Recorder (Clerk of Court) in the parish where the property is located
- Louisiana has a Notice of Contract system — if owner recorded a Notice of Contract before work began, claimants must comply with specific notice requirements
- Trigger: the 60-day deadline runs from the owner's Notice of Termination of Work; if no notice filed, 70 days from actual substantial completion
- Must include: claimant name/address, property description, owner name, description of work/materials, amount claimed, dates

NOTARIZATION BLOCK FORMAT:
STATE OF LOUISIANA
PARISH OF ___________________

Before me, the undersigned notary public, personally appeared the above-named claimant who, after being duly sworn, stated that the foregoing is true and correct.

Subscribed and sworn to before me this _______ day of _________________, 20____.

___________________________________________
Notary Public, State of Louisiana
Bar Roll / Commission Number: _______________
`,
  },

  MO: {
    name: 'Missouri',
    statute: "Missouri Mechanic's Lien Statute (RSMo § 429.010 et seq.)",
    documentName: "Mechanic's Lien",
    filingOffice: "Circuit Court Clerk",
    deadlines: {
      noticeOfFurnishing: {
        days: null,
        who: 'general contractors (unusual)',
        description: 'Missouri requires general contractors to file a Notice of Intent to File a Mechanic\'s Lien with the property owner before or at the time work begins on residential projects (owner-occupied single-family). This is unusual — most states do not require GCs to file a notice. RSMo § 429.016.',
        required: false,
        conditionalNote: 'Required for GCs on owner-occupied residential only. Not required for commercial GCs or for sub-tier claimants.',
      },
      claimOfLien: {
        residential: 180,
        commercial: 180,
        description: 'Mechanic\'s Lien must be filed within 6 months of last furnishing of labor or materials. RSMo § 429.080.',
      },
      serveOwner: {
        days: null,
        description: 'No separate mandatory post-filing service requirement.',
      },
      enforce: {
        description: 'Lien enforcement action must be filed within 6 months of filing the lien. RSMo § 429.170.',
      },
    },
    counties: [
      'St. Louis County', 'St. Louis City', 'Jackson', 'St. Charles', 'Greene',
      'Clay', 'Boone', 'Jefferson', 'Jasper', 'Cass', 'Platte', 'Cole',
      'Christian', 'Camden', 'Franklin', 'Callaway', 'Other Missouri County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Missouri mechanics lien document preparation specialist with deep knowledge of Missouri's Mechanic's Lien Statute (RSMo § 429.010 et seq.).

APPLICABLE LAW: Missouri Mechanic's Lien Statute, RSMo § 429.010 et seq.
FILING OFFICE: ${data.propertyCounty} Circuit Court Clerk
LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE: 6 months from last date of furnishing
ENFORCEMENT DEADLINE: 6 months from filing

KEY MISSOURI REQUIREMENTS:
- Document is called "Mechanic's Lien" — must be VERIFIED (sworn/notarized)
- Filed with the Circuit Court Clerk in the county where the property is located
- No general preliminary notice requirement for sub-tier claimants
- GCs on owner-occupied residential must file a Notice of Intent before starting work
- Enforce within 6 months of filing — this is the same as the filing deadline, so act quickly
- Missouri covers contractors, subcontractors, materialmen, laborers, architects, and engineers

NOTARIZATION BLOCK FORMAT:
STATE OF MISSOURI
COUNTY OF ___________________

Before me, the undersigned notary public, personally appeared the above-named claimant who, being duly sworn, states that the foregoing is true and correct.

Subscribed and sworn to before me this _______ day of _________________, 20____.

___________________________________________
Notary Public, State of Missouri
My commission expires: ___________________
(Notary Seal)
`,
  },

  OK: {
    name: 'Oklahoma',
    statute: "Oklahoma Mechanic's Lien Law (12 O.S. § 141 et seq.)",
    documentName: "Lien Statement",
    filingOffice: "County Clerk",
    deadlines: {
      claimOfLien: {
        residential: 120,
        commercial: 120,
        description: 'Lien Statement must be filed within 4 months of the last furnishing of labor or materials. 42 O.S. § 142.',
      },
      serveOwner: {
        days: null,
        description: 'No mandatory post-filing service requirement.',
      },
      enforce: {
        description: 'Lien enforcement action must be commenced within 1 year of filing the Lien Statement. 42 O.S. § 176.',
      },
    },
    counties: [
      'Oklahoma', 'Tulsa', 'Cleveland', 'Canadian', 'Comanche', 'Rogers',
      'Wagoner', 'Creek', 'Payne', 'Garfield', 'Pontotoc', 'Cherokee',
      'McClain', 'Muskogee', 'Osage', 'Pittsburg', 'Other Oklahoma County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are an Oklahoma mechanics lien document preparation specialist with deep knowledge of Oklahoma's Mechanic's Lien Law (42 O.S. § 141 et seq.).

APPLICABLE LAW: Oklahoma Mechanic's Lien Law, 42 O.S. § 141 et seq.
FILING OFFICE: ${data.propertyCounty} County Clerk
LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE: 4 months from last date of furnishing
ENFORCEMENT DEADLINE: 1 year from filing

KEY OKLAHOMA REQUIREMENTS:
- Document is called "Lien Statement" — must be VERIFIED (signed under oath)
- Filed with the County Clerk in the county where the property is located
- No preliminary notice required for any claimant tier
- Enforce within 1 year of filing

NOTARIZATION BLOCK FORMAT:
STATE OF OKLAHOMA
COUNTY OF ___________________

Subscribed and sworn to before me this _______ day of _________________, 20____.

___________________________________________
Notary Public, State of Oklahoma
My commission expires: ___________________
(Notary Seal)
`,
  },

  NM: {
    name: 'New Mexico',
    statute: "New Mexico Mechanics Lien Law (NMSA 1978, § 48-2-1 et seq.)",
    documentName: "Claim of Lien",
    filingOffice: "County Clerk",
    deadlines: {
      noticeOfFurnishing: {
        days: 60,
        who: 'subcontractors and suppliers',
        description: 'Subcontractors and suppliers must serve a preliminary notice on the property owner within 60 days of first furnishing to preserve lien rights against the owner\'s interest. NMSA § 48-2-2.1.',
        required: true,
        conditionalNote: 'Not required for general contractors. Required for sub-tier claimants to preserve owner-level lien rights.',
      },
      claimOfLien: {
        residential: 90,
        commercial: 120,
        description: 'Claim of Lien must be filed within 90 days of last furnishing (residential, 4 units or fewer) or 120 days (commercial). NMSA § 48-2-8.',
      },
      serveOwner: {
        days: 30,
        description: 'Copy of recorded Claim of Lien must be served on the owner within 30 days of recording. NMSA § 48-2-8.',
      },
      enforce: {
        description: 'Lien enforcement action must be filed within 2 years of filing the Claim of Lien.',
      },
    },
    counties: [
      'Bernalillo', 'Sandoval', 'Santa Fe', 'Doña Ana', 'Valencia',
      'Chavez', 'Lea', 'San Juan', 'McKinley', 'Eddy', 'Otero',
      'Rio Arriba', 'Taos', 'Grant', 'Luna', 'Other New Mexico County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a New Mexico mechanics lien document preparation specialist with deep knowledge of New Mexico's Mechanics Lien Law (NMSA 1978, § 48-2-1 et seq.).

APPLICABLE LAW: New Mexico Mechanics Lien Law, NMSA 1978, § 48-2-1 et seq.
FILING OFFICE: ${data.propertyCounty} County Clerk
LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE TYPE: ${data.projectType === 'residential' ? '90 days from last furnishing (residential, 4 units or fewer)' : '120 days from last furnishing (commercial)'}
SERVICE ON OWNER: Within 30 days of recording
ENFORCEMENT DEADLINE: 2 years from filing

KEY NEW MEXICO REQUIREMENTS:
- Document is called "Claim of Lien" — must be NOTARIZED
- Filed with the County Clerk in the county where the property is located
- Subcontractors and suppliers must have served a preliminary notice on the owner within 60 days of first furnishing to preserve owner-level lien rights
- Different deadlines for residential (90 days) vs. commercial (120 days)
- After recording, serve copy on owner within 30 days

NOTARIZATION BLOCK FORMAT:
STATE OF NEW MEXICO
COUNTY OF ___________________

Subscribed and sworn to before me this _______ day of _________________, 20____.

___________________________________________
Notary Public, State of New Mexico
My commission expires: ___________________
(Notary Seal)
`,
  },

// ── STANDARD-TIER STATES (accurate, concise) ─────────────────────────────────

  AL: {
    name: 'Alabama',
    statute: "Alabama Mechanics and Materialmen's Lien Statute (Ala. Code § 35-11-210 et seq.)",
    documentName: "Verified Statement of Lien",
    filingOffice: "Probate Court",
    deadlines: {
      noticeOfFurnishing: {
        days: null,
        who: 'material suppliers only',
        description: 'Material suppliers (not laborers or contractors) must give written notice to the property owner within 30 days of first delivery to have lien rights against the owner. Ala. Code § 35-11-218.',
        required: false,
        conditionalNote: 'Only applies to material suppliers, not contractors or subcontractors performing labor.',
      },
      claimOfLien: {
        residential: 120,
        commercial: 180,
        description: 'Subcontractors/suppliers: 4 months. GCs: 6 months. Both run from date of last furnishing. Ala. Code § 35-11-215.',
      },
      serveOwner: { days: null, description: 'No mandatory post-filing service requirement.' },
      enforce: { description: 'Enforcement action must be filed within 6 months of filing the lien. Ala. Code § 35-11-221.' },
    },
    counties: ['Jefferson', 'Mobile', 'Madison', 'Montgomery', 'Shelby', 'Baldwin', 'Tuscaloosa', 'Lee', 'Morgan', 'Calhoun', 'Etowah', 'Houston', 'Other Alabama County'],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are an Alabama mechanics lien document preparation specialist with knowledge of Alabama's Mechanics and Materialmen's Lien Statute (Ala. Code § 35-11-210 et seq.).

APPLICABLE LAW: Ala. Code § 35-11-210 et seq.
FILING OFFICE: ${data.propertyCounty} County Probate Court
LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE: ${data.role === 'General Contractor / Prime' ? '6 months (GC)' : '4 months (sub/supplier)'} from last furnishing
ENFORCEMENT DEADLINE: 6 months from filing

KEY REQUIREMENTS: Verified statement (notarized); filed with Probate Court; material suppliers must give owner notice within 30 days of first delivery; enforce within 6 months.

NOTARIZATION: STATE OF ALABAMA / COUNTY OF ___ / Subscribed and sworn before me this ___ day of ___, 20__. / Notary Public / My commission expires: ___
`,
  },

  AK: {
    name: 'Alaska',
    statute: "Alaska Mechanics Lien Law (AS 34.35.050 et seq.)",
    documentName: "Notice of Right to Lien / Claim of Lien",
    filingOffice: "Recording District (District Recorder)",
    deadlines: {
      noticeOfFurnishing: { days: 10, who: 'subcontractors and suppliers', description: 'Notice of right to lien must be served on owner within 10 days of first furnishing. AS 34.35.062.', required: true, conditionalNote: 'Not required for GCs.' },
      claimOfLien: { residential: 120, commercial: 120, description: '120 days after completion of work. AS 34.35.068.' },
      serveOwner: { days: null, description: 'No separate post-filing service requirement.' },
      enforce: { description: 'Enforcement action must be filed within 6 months of filing. AS 34.35.072.' },
    },
    counties: ['Anchorage', 'Fairbanks', 'Juneau', 'Kenai', 'Kodiak', 'Matanuska-Susitna', 'Sitka', 'Ketchikan', 'Other Alaska Recording District'],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are an Alaska mechanics lien specialist. Law: AS 34.35.050 et seq. Filing office: ${data.propertyCounty} District Recorder. Deadline: 120 days after completion. Enforce: 6 months from filing. Subs: 10-day notice to owner required. Notarize the claim. Include: claimant info, property description, owner name, work description, amount, dates.
NOTARIZATION: STATE OF ALASKA / ___ Judicial District / Subscribed and sworn before me this ___ day of ___, 20__. / Notary Public / Expires: ___
`,
  },

  AR: {
    name: 'Arkansas',
    statute: "Arkansas Mechanics Lien Law (Ark. Code Ann. § 18-44-101 et seq.)",
    documentName: "Lien Account",
    filingOffice: "Circuit Clerk",
    deadlines: {
      noticeOfFurnishing: { days: null, who: 'material suppliers', description: 'Material suppliers must send notice to owner within 75 days of delivery. Ark. Code Ann. § 18-44-115.', required: false, conditionalNote: 'Only for material suppliers.' },
      noticeOfIntent: { days: null, description: 'All claimants must give owner a Notice of Intent to File Lien at least 10 days before filing. Ark. Code Ann. § 18-44-115.', required: true },
      claimOfLien: { residential: 120, commercial: 120, description: '120 days after last furnishing. Ark. Code Ann. § 18-44-117.' },
      serveOwner: { days: null, description: 'The 10-day Notice of Intent handles owner notification.' },
      enforce: { description: 'Enforcement must be filed within 15 months of filing. Ark. Code Ann. § 18-44-119.' },
    },
    counties: ['Pulaski', 'Benton', 'Washington', 'Sebastian', 'Faulkner', 'Saline', 'Garland', 'Craighead', 'Lonoke', 'Pope', 'Other Arkansas County'],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are an Arkansas mechanics lien specialist. Law: Ark. Code Ann. § 18-44-101 et seq. Filing: ${data.propertyCounty} Circuit Clerk. Deadline: 120 days from last furnishing. Enforce: 15 months from filing. Pre-filing: 10-day Notice of Intent required for all claimants. Notarize the lien account.
NOTARIZATION: STATE OF ARKANSAS / COUNTY OF ___ / Subscribed and sworn before me this ___ day of ___, 20__. / Notary Public / Expires: ___
`,
  },

  DE: {
    name: 'Delaware',
    statute: "Delaware Mechanics Lien Law (25 Del. C. § 2701 et seq.)",
    documentName: "Scire Facias Sur Mechanics Lien",
    filingOffice: "Superior Court Prothonotary",
    deadlines: {
      claimOfLien: { residential: 180, commercial: 180, description: '6 months after last furnishing of labor or materials. 25 Del. C. § 2711.' },
      serveOwner: { days: null, description: 'Court process handles service.' },
      enforce: { description: 'Enforcement action must be filed within 1 year of filing. Delaware lien is filed as a court action — the initial filing IS the enforcement action.' },
    },
    counties: ['New Castle', 'Kent', 'Sussex'],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Delaware mechanics lien specialist. Law: 25 Del. C. § 2701 et seq. Filing: ${data.propertyCounty} Superior Court Prothonotary. Delaware mechanics liens are COURT ACTIONS — the filing initiates a court proceeding. Deadline: 6 months from last furnishing. File "Scire Facias Sur Mechanics Lien" petition. No preliminary notice required.
VERIFICATION: Under penalties of perjury, the undersigned states the foregoing is true and correct. / Signature: ___ / Date: ___
`,
  },

  HI: {
    name: 'Hawaii',
    statute: "Hawaii Mechanic's and Materialman's Lien Law (HRS § 507-41 et seq.)",
    documentName: "Mechanic's and Materialman's Lien",
    filingOffice: "Bureau of Conveyances (State) or Land Court",
    deadlines: {
      noticeOfFurnishing: { days: 45, who: 'subcontractors and suppliers', description: 'Notice to owner required within 45 days of first furnishing. HRS § 507-43.', required: true, conditionalNote: 'Not required for GCs.' },
      claimOfLien: { residential: 45, commercial: 45, description: '45 days after completion of improvement — one of the shortest deadlines in the country. HRS § 507-45.' },
      serveOwner: { days: null, description: 'No separate post-filing service requirement.' },
      enforce: { description: 'Foreclosure must be filed within 3 months of filing. HRS § 507-47. Extremely short enforcement window.' },
    },
    counties: ['Honolulu', 'Hawaii (Big Island)', 'Maui', 'Kauai'],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Hawaii mechanics lien specialist. Law: HRS § 507-41 et seq. Filing: Hawaii Bureau of Conveyances (or Land Court for Torrens property). CRITICAL: Hawaii has the shortest filing deadline — only 45 days after completion. Enforcement is only 3 months from filing. Subs must give 45-day notice. Notarize.
NOTARIZATION: STATE OF HAWAII / COUNTY OF ___ / Subscribed and sworn before me this ___ day of ___, 20__. / Notary Public / Expires: ___
`,
  },

  ID: {
    name: 'Idaho',
    statute: "Idaho Mechanic's Lien Law (Idaho Code § 45-501 et seq.)",
    documentName: "Claim of Lien",
    filingOffice: "County Recorder",
    deadlines: {
      claimOfLien: { residential: 90, commercial: 90, description: '90 days after completion of work or last furnishing. Idaho Code § 45-507.' },
      serveOwner: { days: null, description: 'No separate post-filing service requirement.' },
      enforce: { description: 'Enforcement must be filed within 6 months of filing. Idaho Code § 45-510.' },
    },
    counties: ['Ada', 'Canyon', 'Kootenai', 'Bonneville', 'Bannock', 'Twin Falls', 'Nez Perce', 'Cassia', 'Bingham', 'Jefferson', 'Other Idaho County'],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are an Idaho mechanics lien specialist. Law: Idaho Code § 45-501 et seq. Filing: ${data.propertyCounty} County Recorder. Deadline: 90 days after completion or last furnishing. Enforce: 6 months from filing. No preliminary notice required. Notarize.
NOTARIZATION: STATE OF IDAHO / COUNTY OF ___ / Subscribed and sworn before me this ___ day of ___, 20__. / Notary Public / Expires: ___
`,
  },

  IA: {
    name: 'Iowa',
    statute: "Iowa Mechanic's Lien Law (Iowa Code § 572.1 et seq.)",
    documentName: "Mechanic's Lien",
    filingOffice: "County Recorder",
    deadlines: {
      noticeOfFurnishing: { days: 30, who: 'subcontractors and suppliers', description: 'Subcontractors and suppliers must file a Preliminary Notice with the County Recorder within 30 days of first furnishing. Iowa Code § 572.13.', required: true, conditionalNote: 'Not required for GCs in direct contract with owner.' },
      claimOfLien: { residential: 90, commercial: 90, description: '90 days after last furnishing of labor or materials. Iowa Code § 572.8.' },
      serveOwner: { days: null, description: 'No separate post-filing service requirement.' },
      enforce: { description: 'Enforcement must be filed within 2 years of filing. Iowa Code § 572.17.' },
    },
    counties: ['Polk', 'Linn', 'Scott', 'Johnson', 'Black Hawk', 'Story', 'Pottawattamie', 'Woodbury', 'Dubuque', 'Dallas', 'Jasper', 'Warren', 'Other Iowa County'],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are an Iowa mechanics lien specialist. Law: Iowa Code § 572.1 et seq. Filing: ${data.propertyCounty} County Recorder. Deadline: 90 days from last furnishing. Enforce: 2 years from filing. Subs must file Preliminary Notice with County Recorder within 30 days of first furnishing. Notarize.
NOTARIZATION: STATE OF IOWA / COUNTY OF ___ / Subscribed and sworn before me this ___ day of ___, 20__. / Notary Public / Expires: ___
`,
  },

  KS: {
    name: 'Kansas',
    statute: "Kansas Mechanic's Lien Law (K.S.A. 60-1101 et seq.)",
    documentName: "Verified Statement of Lien",
    filingOffice: "District Court Clerk",
    deadlines: {
      claimOfLien: { residential: 90, commercial: 120, description: 'Subcontractors/suppliers: 3 months after last furnishing. GCs: 4 months after last furnishing. K.S.A. 60-1103.' },
      serveOwner: { days: null, description: 'No mandatory post-filing service requirement.' },
      enforce: { description: 'Enforcement must be filed within 1 year of filing. K.S.A. 60-1105.' },
    },
    counties: ['Johnson', 'Sedgwick', 'Wyandotte', 'Douglas', 'Shawnee', 'Riley', 'Butler', 'Reno', 'Leavenworth', 'Harvey', 'Saline', 'Other Kansas County'],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Kansas mechanics lien specialist. Law: K.S.A. 60-1101 et seq. Filing: ${data.propertyCounty} District Court Clerk. Deadline: ${data.role === 'General Contractor / Prime' ? '4 months (GC)' : '3 months (sub/supplier)'} from last furnishing. Enforce: 1 year from filing. No preliminary notice required. Notarize.
NOTARIZATION: STATE OF KANSAS / COUNTY OF ___ / Subscribed and sworn before me this ___ day of ___, 20__. / Notary Public / Expires: ___
`,
  },

  ME: {
    name: 'Maine',
    statute: "Maine Mechanic's Lien Law (14 M.R.S.A. § 3251 et seq.)",
    documentName: "Statement of Lien",
    filingOffice: "Registry of Deeds",
    deadlines: {
      claimOfLien: { residential: 90, commercial: 90, description: 'Subcontractors and suppliers must file a Statement of Lien within 90 days of last furnishing. GCs do not separately file — their lien arises through enforcement action. 14 M.R.S.A. § 3253.' },
      serveOwner: { days: null, description: 'No separate post-filing service requirement.' },
      enforce: { description: 'Enforcement action must be commenced within 120 days of last furnishing for all claimants. 14 M.R.S.A. § 3254. Note: this runs from last furnishing, not from filing.' },
    },
    counties: ['Cumberland', 'York', 'Penobscot', 'Kennebec', 'Androscoggin', 'Knox', 'Hancock', 'Somerset', 'Oxford', 'Washington', 'Other Maine County'],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Maine mechanics lien specialist. Law: 14 M.R.S.A. § 3251 et seq. Filing: ${data.propertyCounty} Registry of Deeds. Deadline: 90 days from last furnishing. Enforce: 120 days from LAST FURNISHING (not from filing). Maine's lien enforcement deadline runs from last furnishing, not filing date — act quickly.
NOTARIZATION: STATE OF MAINE / COUNTY OF ___ / Subscribed and sworn before me this ___ day of ___, 20__. / Notary Public / Expires: ___
`,
  },

  MS: {
    name: 'Mississippi',
    statute: "Mississippi Mechanic's Lien Law (Miss. Code Ann. § 85-7-131 et seq.)",
    documentName: "Materialman's Lien / Mechanic's Lien",
    filingOffice: "Circuit Clerk",
    deadlines: {
      noticeOfFurnishing: { days: null, who: 'material suppliers', description: 'Material suppliers must give owner written notice within a reasonable time to preserve lien rights against owner. Miss. Code Ann. § 85-7-133.', required: false, conditionalNote: 'Only for material suppliers.' },
      claimOfLien: { residential: 90, commercial: 90, description: '90 days after last furnishing of labor or materials. Miss. Code Ann. § 85-7-131.' },
      serveOwner: { days: null, description: 'No separate mandatory post-filing service requirement.' },
      enforce: { description: 'Enforcement must be filed within 1 year of filing. Miss. Code Ann. § 85-7-141.' },
    },
    counties: ['Hinds', 'Harrison', 'DeSoto', 'Rankin', 'Madison', 'Jackson', 'Lee', 'Forrest', 'Lamar', 'Lafayette', 'Other Mississippi County'],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Mississippi mechanics lien specialist. Law: Miss. Code Ann. § 85-7-131 et seq. Filing: ${data.propertyCounty} Circuit Clerk. Deadline: 90 days from last furnishing. Enforce: 1 year from filing. Notarize.
NOTARIZATION: STATE OF MISSISSIPPI / COUNTY OF ___ / Subscribed and sworn before me this ___ day of ___, 20__. / Notary Public / Expires: ___
`,
  },

  MT: {
    name: 'Montana',
    statute: "Montana Construction Lien Law (MCA § 71-3-521 et seq.)",
    documentName: "Construction Lien",
    filingOffice: "County Clerk and Recorder",
    deadlines: {
      noticeOfFurnishing: { days: 20, who: 'subcontractors and suppliers', description: 'Subcontractors and suppliers must serve a preliminary notice on owner within 20 days of first furnishing. MCA § 71-3-531.', required: true, conditionalNote: 'Not required for GCs.' },
      claimOfLien: { residential: 90, commercial: 90, description: '90 days after last furnishing. MCA § 71-3-535.' },
      serveOwner: { days: null, description: 'No separate post-filing service requirement.' },
      enforce: { description: 'Enforcement must be filed within 2 years of filing. MCA § 71-3-553.' },
    },
    counties: ['Yellowstone', 'Cascade', 'Missoula', 'Flathead', 'Gallatin', 'Silverbow', 'Ravalli', 'Lewis and Clark', 'Hill', 'Other Montana County'],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Montana construction lien specialist. Law: MCA § 71-3-521 et seq. Filing: ${data.propertyCounty} County Clerk and Recorder. Deadline: 90 days from last furnishing. Enforce: 2 years from filing. Subs: 20-day preliminary notice required. Notarize.
NOTARIZATION: STATE OF MONTANA / COUNTY OF ___ / Subscribed and sworn before me this ___ day of ___, 20__. / Notary Public / Expires: ___
`,
  },

  ND: {
    name: 'North Dakota',
    statute: "North Dakota Mechanic's Lien Law (N.D.C.C. § 35-27-01 et seq.)",
    documentName: "Mechanic's Lien",
    filingOffice: "County Recorder",
    deadlines: {
      noticeOfIntent: { days: null, description: 'Notice of intent to lien is required before filing for all claimants. N.D.C.C. § 35-27-07.', required: true },
      claimOfLien: { residential: 90, commercial: 90, description: '90 days after completion of improvement. N.D.C.C. § 35-27-05.' },
      serveOwner: { days: null, description: 'No separate post-filing service requirement.' },
      enforce: { description: 'Enforcement must be filed within 3 years of filing. N.D.C.C. § 35-27-25.' },
    },
    counties: ['Cass', 'Burleigh', 'Grand Forks', 'Ward', 'Morton', 'Williams', 'Stark', 'Stutsman', 'McLean', 'Ramsey', 'Other North Dakota County'],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a North Dakota mechanics lien specialist. Law: N.D.C.C. § 35-27-01 et seq. Filing: ${data.propertyCounty} County Recorder. Deadline: 90 days after completion. Notice of intent required before filing. Enforce: 3 years from filing. Notarize.
NOTARIZATION: STATE OF NORTH DAKOTA / COUNTY OF ___ / Subscribed and sworn before me this ___ day of ___, 20__. / Notary Public / Expires: ___
`,
  },

  NE: {
    name: 'Nebraska',
    statute: "Nebraska Mechanics Lien Law (Neb. Rev. Stat. § 52-101 et seq.)",
    documentName: "Mechanic's Lien",
    filingOffice: "Register of Deeds",
    deadlines: {
      claimOfLien: { residential: 120, commercial: 120, description: '120 days after last furnishing of labor or materials. Neb. Rev. Stat. § 52-105.' },
      serveOwner: { days: null, description: 'No separate post-filing service requirement.' },
      enforce: { description: 'Enforcement must be filed within 2 years of filing. Neb. Rev. Stat. § 52-110.' },
    },
    counties: ['Douglas', 'Sarpy', 'Lancaster', 'Hall', 'Buffalo', 'Dodge', 'Platte', 'Madison', 'Lincoln', 'Scotts Bluff', 'Other Nebraska County'],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Nebraska mechanics lien specialist. Law: Neb. Rev. Stat. § 52-101 et seq. Filing: ${data.propertyCounty} Register of Deeds. Deadline: 120 days from last furnishing. Enforce: 2 years from filing. No preliminary notice required. Notarize.
NOTARIZATION: STATE OF NEBRASKA / COUNTY OF ___ / Subscribed and sworn before me this ___ day of ___, 20__. / Notary Public / Expires: ___
`,
  },

  NH: {
    name: 'New Hampshire',
    statute: "New Hampshire Mechanic's Lien Law (RSA 447:1 et seq.)",
    documentName: "Petition to Enforce Mechanic's Lien",
    filingOffice: "Superior Court",
    deadlines: {
      noticeOfFurnishing: { days: null, who: 'subcontractors and suppliers', description: 'NH lien arises automatically — no recording required. Sub-tier claimants must send written notice to owner before the lien is extinguished. RSA 447:9.', required: false },
      claimOfLien: { residential: 120, commercial: 120, description: 'NH has no separate lien recording step. The lien arises automatically. The claimant must file a petition in Superior Court to enforce within 120 days of last furnishing. RSA 447:12.' },
      serveOwner: { days: null, description: 'Court process handles service.' },
      enforce: { description: 'Petition to enforce must be filed in Superior Court within 120 days of last furnishing. The filing of the petition IS the enforcement action.' },
    },
    counties: ['Hillsborough', 'Rockingham', 'Merrimack', 'Strafford', 'Belknap', 'Cheshire', 'Carroll', 'Grafton', 'Sullivan', 'Coos'],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a New Hampshire mechanics lien specialist. Law: RSA 447:1 et seq. IMPORTANT: New Hampshire mechanics liens arise AUTOMATICALLY — there is no lien recording step. Instead, the claimant files a Petition to Enforce in Superior Court within 120 days of last furnishing. The filing of the petition IS the enforcement action. Court: ${data.propertyCounty} County Superior Court. Generate a formal demand letter and a plain-language guide to filing the court petition.
`,
  },

  RI: {
    name: 'Rhode Island',
    statute: "Rhode Island Mechanic's Lien Law (R.I. Gen. Laws § 34-28-1 et seq.)",
    documentName: "Notice of Intention to Do Work",
    filingOffice: "Superior Court",
    deadlines: {
      noticeOfFurnishing: { days: null, who: 'all claimants', description: 'Before performing work, claimant must file a Notice of Intention to Do Work with the Superior Court. Without this, no lien rights arise. R.I. Gen. Laws § 34-28-4.', required: true },
      claimOfLien: { residential: 200, commercial: 200, description: '200 days after last furnishing. R.I. Gen. Laws § 34-28-10.' },
      serveOwner: { days: null, description: 'Court process handles service.' },
      enforce: { description: 'Enforcement must be filed within 3 years of filing. R.I. Gen. Laws § 34-28-17.' },
    },
    counties: ['Providence', 'Kent', 'Newport', 'Washington', 'Bristol'],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Rhode Island mechanics lien specialist. Law: R.I. Gen. Laws § 34-28-1 et seq. IMPORTANT: Rhode Island requires filing a Notice of Intention to Do Work with the Superior Court BEFORE work begins — this is a prerequisite to any lien rights. Filing after work starts does not preserve lien rights. Lien deadline: 200 days from last furnishing. Enforcement: 3 years from filing. Generate a demand letter and process guide.
`,
  },

  SD: {
    name: 'South Dakota',
    statute: "South Dakota Mechanic's Lien Law (SDCL § 44-9-1 et seq.)",
    documentName: "Mechanic's Lien",
    filingOffice: "Circuit Court Clerk",
    deadlines: {
      claimOfLien: { residential: 120, commercial: 120, description: '120 days after last furnishing of labor or materials. SDCL § 44-9-13.' },
      serveOwner: { days: null, description: 'No separate post-filing service requirement.' },
      enforce: { description: 'Enforcement must be filed within 6 years of filing. SDCL § 44-9-33.' },
    },
    counties: ['Minnehaha', 'Pennington', 'Lincoln', 'Brown', 'Codington', 'Brookings', 'Meade', 'Lawrence', 'Hughes', 'Beadle', 'Other South Dakota County'],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a South Dakota mechanics lien specialist. Law: SDCL § 44-9-1 et seq. Filing: ${data.propertyCounty} Circuit Court Clerk. Deadline: 120 days from last furnishing. Enforce: 6 years from filing (long window). No preliminary notice required. Notarize.
NOTARIZATION: STATE OF SOUTH DAKOTA / COUNTY OF ___ / Subscribed and sworn before me this ___ day of ___, 20__. / Notary Public / Expires: ___
`,
  },

  VT: {
    name: 'Vermont',
    statute: "Vermont Mechanic's Lien Law (9 V.S.A. § 1921 et seq.)",
    documentName: "Notice of Lien",
    filingOffice: "Town Clerk",
    deadlines: {
      claimOfLien: { residential: 180, commercial: 180, description: '180 days after last furnishing of labor or materials. 9 V.S.A. § 1924.' },
      serveOwner: { days: null, description: 'No separate post-filing service requirement.' },
      enforce: { description: 'Enforcement must be filed within 2 years of filing. 9 V.S.A. § 1926.' },
    },
    counties: ['Chittenden', 'Washington', 'Windsor', 'Rutland', 'Addison', 'Franklin', 'Orange', 'Orleans', 'Caledonia', 'Windham', 'Other Vermont Town'],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Vermont mechanics lien specialist. Law: 9 V.S.A. § 1921 et seq. Filing: Vermont uses Town Clerks — file with the Town Clerk of the town where the property is located (not a county recorder). Deadline: 180 days from last furnishing. Enforce: 2 years from filing. No preliminary notice required. Notarize.
NOTARIZATION: STATE OF VERMONT / Subscribed and sworn before me this ___ day of ___, 20__. / Notary Public / Expires: ___
`,
  },

  WV: {
    name: 'West Virginia',
    statute: "West Virginia Mechanic's Lien Law (W. Va. Code § 38-2-1 et seq.)",
    documentName: "Mechanic's Lien",
    filingOffice: "County Clerk",
    deadlines: {
      claimOfLien: { residential: 100, commercial: 100, description: '100 days after last furnishing of labor or materials. W. Va. Code § 38-2-7.' },
      serveOwner: { days: null, description: 'No separate post-filing service requirement.' },
      enforce: { description: 'Enforcement must be filed within 1 year of filing. W. Va. Code § 38-2-20.' },
    },
    counties: ['Kanawha', 'Cabell', 'Berkeley', 'Wood', 'Monongalia', 'Raleigh', 'Marion', 'Harrison', 'Putnam', 'Jefferson', 'Other West Virginia County'],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a West Virginia mechanics lien specialist. Law: W. Va. Code § 38-2-1 et seq. Filing: ${data.propertyCounty} County Clerk. Deadline: 100 days from last furnishing. Enforce: 1 year from filing. No preliminary notice required. Notarize.
NOTARIZATION: STATE OF WEST VIRGINIA / COUNTY OF ___ / Subscribed and sworn before me this ___ day of ___, 20__. / Notary Public / Expires: ___
`,
  },

  WY: {
    name: 'Wyoming',
    statute: "Wyoming Mechanic's Lien Law (Wyo. Stat. § 29-2-101 et seq.)",
    documentName: "Mechanic's Lien",
    filingOffice: "County Clerk",
    deadlines: {
      claimOfLien: { residential: 150, commercial: 150, description: '150 days after last furnishing of labor or materials. Wyo. Stat. § 29-2-103.' },
      serveOwner: { days: null, description: 'No separate post-filing service requirement.' },
      enforce: { description: 'Enforcement must be filed within 180 days (6 months) of filing. Wyo. Stat. § 29-2-105.' },
    },
    counties: ['Laramie', 'Natrona', 'Campbell', 'Sweetwater', 'Albany', 'Fremont', 'Teton', 'Sheridan', 'Uinta', 'Goshen', 'Other Wyoming County'],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Wyoming mechanics lien specialist. Law: Wyo. Stat. § 29-2-101 et seq. Filing: ${data.propertyCounty} County Clerk. Deadline: 150 days from last furnishing. Enforce: 180 days from filing. No preliminary notice required. Notarize.
NOTARIZATION: STATE OF WYOMING / COUNTY OF ___ / Subscribed and sworn before me this ___ day of ___, 20__. / Notary Public / Expires: ___
`,
  },

// ── END EXPANSION ─────────────────────────────────────────────────────────────
