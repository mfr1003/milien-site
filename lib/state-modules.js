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

  TX: {
    name: 'Texas',
    statute: "Texas Mechanics' Lien Law (Texas Property Code Chapter 53)",
    documentName: "Mechanic's Lien Affidavit",
    filingOffice: 'County Clerk',
    deadlines: {
      noticeOfFurnishing: {
        days_commercial: 75,
        days_residential: 45,
        who: 'subcontractors and suppliers (not original contractors)',
        description: 'Subcontractors and suppliers must send a Notice of Unpaid Balance to both the property owner AND the original contractor. Commercial: by the 15th day of the 3rd month after each month work was performed and unpaid. Residential: by the 15th day of the 2nd month after each month work was performed and unpaid.',
        required: true,
        conditionalNote: 'Not required for original contractors in direct contract with the property owner. Must be sent for each month that work was performed and remains unpaid.',
      },
      claimOfLien: {
        residential: 90,
        commercial: 120,
        description: 'Lien Affidavit must be filed with the County Clerk by the 15th day of the 3rd month (residential) or 4th month (commercial) after the month in which claimant last provided labor or materials.',
      },
      serveOwner: {
        days: 5,
        description: 'A copy of the filed Lien Affidavit must be sent to the property owner AND the original contractor within 5 days of filing.',
      },
      enforce: {
        description: 'Lawsuit to enforce lien must be filed within 1 year of the last date the claimant could have filed the lien affidavit. May be extended up to 2 years by written agreement with property owner recorded in county records.',
      },
    },
    counties: [
      'Harris', 'Dallas', 'Tarrant', 'Bexar', 'Travis', 'Collin', 'Denton',
      'El Paso', 'Fort Bend', 'Montgomery', 'Williamson', 'Hidalgo', 'Nueces',
      'Jefferson', 'Lubbock', 'Galveston', 'Bell', 'Webb', 'McLennan', 'Smith',
      'Other Texas County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Texas mechanics lien document preparation specialist with deep knowledge of Texas Property Code Chapter 53, including the 2022 amendments under House Bill 2237 (effective January 1, 2022) and the 2025 amendments under Senate Bill 929.

APPLICABLE LAW: Texas Property Code Chapter 53 (as amended HB 2237 eff. 1/1/2022; SB 929 eff. 5/21/2025)
FILING OFFICE: ${data.propertyCounty} County Clerk
LIEN AFFIDAVIT DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE TYPE: ${data.projectType === 'residential' ? '15th day of 3rd month after month of last furnishing (residential)' : '15th day of 4th month after month of last furnishing (commercial)'}
STATUTE OF LIMITATIONS: 1 year from last date claimant could have filed lien

KEY TEXAS REQUIREMENTS:
- Document is called "Mechanic's Lien Affidavit" — must be NOTARIZED
- Filed with the County Clerk in the county where the property is located
- Must include LEGAL DESCRIPTION of property — street address alone is NOT sufficient
- Original contractors (direct contract with owner): No pre-lien notice required
- Subcontractors/suppliers: Must send Notice of Unpaid Balance to BOTH owner AND original contractor before filing lien (commercial: 15th day of 3rd month after each unpaid work month; residential: 15th day of 2nd month)
- After filing, must serve copy on owner AND original contractor within 5 days
- If deadline falls on Saturday, Sunday, or legal holiday: extends to next business day (SB 929)
- Acceptable delivery: certified mail, registered mail, or traceable private delivery (FedEx/UPS) with proof of receipt
- HOMESTEAD WARNING: To lien a homestead, the contract must be WRITTEN, signed by BOTH spouses before work starts, and recorded with the county clerk before work begins. Oral contracts cannot support a homestead lien. If this appears to be the owner's primary residence, flag this prominently in the filing instructions.
- Texas Fraudulent Lien Act: Filing an invalid lien can result in statutory damages of $10,000 or actual damages (whichever is greater) plus attorney's fees

NOTARIZATION BLOCK FORMAT:
STATE OF TEXAS
COUNTY OF ___________________

BEFORE ME, the undersigned notary public, on this day personally appeared the above-named affiant, known to me to be a credible person, who being by me duly sworn, upon oath, deposes and says that the facts set forth in the foregoing Affidavit are within affiant's personal knowledge and are true and correct.

SUBSCRIBED AND SWORN TO before me this _______ day of _________________, 20____.

___________________________________________
Notary Public in and for the State of Texas
My Commission Expires: ___________________
(Notary Seal)
`,
  },

  NC: {
    name: 'North Carolina',
    statute: 'North Carolina Lien Law (Chapter 44A, NC General Statutes)',
    documentName: 'Notice of Claim of Lien on Real Property',
    filingOffice: 'Clerk of Superior Court',
    deadlines: {
      noticeToLienAgent: {
        description: 'If the owner has designated a Lien Agent (required on projects over $30K with a building permit), subcontractors and suppliers must send a Notice to Lien Agent before or as soon as possible after first furnishing. File electronically via the NC Lien Agent System (www.nclienagentonline.com). This notice preserves lien rights — missing it can extinguish sub/supplier rights entirely on lien-agent-designated projects.',
        required: true,
        conditionalNote: 'Only applies when owner has designated a Lien Agent. Check GSCCCA or the NC Lien Agent System before starting work.',
      },
      claimOfLien: {
        residential: 120,
        commercial: 120,
        description: '120 calendar days (not four months) after the last furnishing of labor or materials at the site by the person claiming the lien. § 44A-12.',
      },
      serveOwner: {
        days: 2,
        description: 'No later than 2 business days after filing, send a copy of the Claim of Lien to the property owner by registered or certified mail or statutory overnight delivery.',
      },
      enforce: {
        description: 'Action to enforce must be commenced within 180 calendar days (not six months) after the last furnishing of labor or materials. § 44A-13.',
      },
    },
    counties: [
      'Mecklenburg', 'Wake', 'Guilford', 'Forsyth', 'Durham', 'Cumberland',
      'Union', 'Buncombe', 'Cabarrus', 'Gaston', 'Onslow', 'Johnston',
      'New Hanover', 'Catawba', 'Alamance', 'Rowan', 'Davidson', 'Pitt',
      'Randolph', 'Harnett', 'Other North Carolina County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a North Carolina mechanics lien document preparation specialist with deep knowledge of Chapter 44A of the North Carolina General Statutes.

APPLICABLE LAW: Chapter 44A, NC General Statutes (§§ 44A-7 through 44A-24)
FILING OFFICE: ${data.propertyCounty} County Clerk of Superior Court
CLAIM OF LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE NOTE: 120 CALENDAR DAYS from last furnishing — not "four months." Count calendar days precisely.
ENFORCE DEADLINE: 180 calendar days from last furnishing (separate from filing deadline)

KEY NORTH CAROLINA REQUIREMENTS:
- Document is called "Notice of Claim of Lien on Real Property" — must be NOTARIZED
- Filed with the Clerk of Superior Court (NOT Register of Deeds) in the county where property is located
- Within 2 business days of filing, send copy to property owner by registered/certified mail or statutory overnight delivery (§ 44A-12)
- LIEN AGENT SYSTEM: On projects over $30,000 with building permits, owner must designate a lien agent. If a lien agent was designated, subcontractors and suppliers must send Notice to Lien Agent via the NC Lien Agent System (nclienagentonline.com) to preserve lien rights. Failure to send notice to lien agent extinguishes sub/supplier lien rights. Flag this if the claimant is a subcontractor or supplier.
- No legal description required — property must be described with sufficient detail to be identified (address is generally sufficient)
- Two types of liens available: (1) Claim of Lien on Real Property (attaches to the property itself), and (2) Notice of Claim of Lien upon Funds (attaches to funds owed to the GC). Subcontractors should consider both.
- GC (direct contract with owner): Can file lien directly, no lien agent notice required
- Subcontractors/suppliers: Must serve Notice to Lien Agent if one was designated

NOTARIZATION BLOCK FORMAT:
STATE OF NORTH CAROLINA
COUNTY OF ___________________

Before me, the undersigned notary public, personally appeared the above-named claimant who, being duly sworn, states that the foregoing is true and correct to the best of their knowledge and belief.

Subscribed and sworn to before me this _______ day of _________________, 20____.

_______________________________________
Notary Public
My commission expires: ___________________
(Notary Seal)
`,
  },

  IL: {
    name: 'Illinois',
    statute: 'Illinois Mechanics Lien Act (770 ILCS 60/)',
    documentName: "Mechanic's Lien Claim",
    filingOffice: 'County Recorder',
    deadlines: {
      residentialNotice: {
        days: 60,
        description: 'Subcontractors and suppliers on owner-occupied single-family residential projects must serve written notice on the OWNER within 60 days of FIRST furnishing labor or materials. § 21. Contains specific statutory warning language. Service by certified mail, registered mail, or nationally recognized delivery service with tracking (FedEx/UPS) as of HB 4660 eff. 1/1/2025.',
        required: true,
        conditionalNote: 'Only required for subcontractors and suppliers (not GCs) on owner-occupied single-family residential projects.',
      },
      section24Notice: {
        days: 90,
        description: 'ALL subcontractors and suppliers must serve owner (and lender of record) with Section 24 notice within 90 days of LAST day of work or material delivery. This is required regardless of project type. Without this notice, sub has no lien against the property owner.',
        required: true,
        conditionalNote: 'Not required for general contractors in direct contract with owner.',
      },
      claimOfLien: {
        residential: 120,
        commercial: 120,
        description: 'All claimants must record their lien claim with the County Recorder within 4 months of the last date of work. § 7. This is required to maintain priority against third parties (mortgages, purchasers).',
      },
      enforce: {
        description: 'Foreclosure lawsuit must be filed within 2 years of last date of furnishing labor or materials. If owner serves a Section 34 demand, claimant has only 30 days to file suit or lose lien. All necessary parties (including mortgage lenders) must be joined within 30 days of filing.',
      },
    },
    counties: [
      'Cook', 'DuPage', 'Lake', 'Will', 'Kane', 'McHenry', 'Winnebago',
      'St. Clair', 'Madison', 'Champaign', 'Sangamon', 'Peoria', 'McLean',
      'Rock Island', 'Tazewell', 'Macon', 'Kankakee', 'Kendall', 'DeKalb', 'LaSalle',
      'Other Illinois County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are an Illinois mechanics lien document preparation specialist with deep knowledge of the Illinois Mechanics Lien Act (770 ILCS 60/), including 2025 amendments under Public Act 103-0827 (HB 4660, effective January 1, 2025).

APPLICABLE LAW: Illinois Mechanics Lien Act, 770 ILCS 60/ (as amended HB 4660 eff. 1/1/2025)
FILING OFFICE: ${data.propertyCounty} County Recorder
LIEN RECORDING DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
DEADLINE: 4 months from last date of work — must be RECORDED with County Recorder, not merely filed

KEY ILLINOIS REQUIREMENTS:
- Document is called "Mechanic's Lien Claim" — must be signed and NOTARIZED
- Recorded with the County Recorder in the county where the property is located (§ 7)
- Must serve copy on property owner after recording
- GCs (direct contract with owner): No pre-lien notice required; must record lien within 4 months of last work
- Subcontractors/suppliers on OWNER-OCCUPIED SINGLE-FAMILY RESIDENTIAL only: Must serve written Section 21 notice on OWNER within 60 days of FIRST furnishing, with specific statutory warning language in 10-point bold type
- ALL subcontractors/suppliers (all project types): Must serve Section 24 notice on OWNER AND LENDER OF RECORD within 90 days of LAST day of work/delivery — required to enforce lien against owner
- Without Section 24 notice, sub's lien is only valid against funds shown on GC's sworn statement
- Acceptable service methods (HB 4660, eff. 1/1/2025): certified mail with return receipt requested, or nationally recognized delivery service with tracking capability (FedEx, UPS)
- Lien priority relates BACK to date of original contract — can prime mortgages recorded after contract date
- Sworn statements from GC (§ 5): GC must provide sworn statement of all subs upon owner's request; important for sub to request this
- Foreclosure suit must be filed within 2 years of last date of work; if owner serves § 34 demand, only 30 days to sue
- All necessary parties including mortgage lenders must be joined in foreclosure suit within 30 days of filing

RESIDENTIAL 60-DAY NOTICE STATUTORY LANGUAGE (include verbatim if residential project):
"NOTICE TO OWNER: The subcontractor providing this notice has performed work for or delivered material to your home improvement contractor. These services or materials are being used in the improvements to your residence and entitle the subcontractor to file a lien against your residence if the labor, services, material, fixtures, apparatus or machinery, forms or form work are not paid for by your home improvement contractor. A lien waiver will be provided to your contractor when the subcontractor is paid, and you are urged to request this waiver from your contractor when paying for your home improvements."

NOTARIZATION BLOCK FORMAT:
STATE OF ILLINOIS
COUNTY OF ___________________

The undersigned, being duly sworn on oath, deposes and states that the foregoing is true and correct to the best of affiant's knowledge and belief.

_______________________________________
Signature of Claimant

Subscribed and sworn to before me this _______ day of _________________, 20____.

_______________________________________
Notary Public, State of Illinois
My commission expires: ___________________
(Official Notary Seal)
`,
  },

  GA: {
    name: 'Georgia',
    statute: "Georgia Mechanics and Materialmen's Lien Law (O.C.G.A. § 44-14-360 et seq.)",
    documentName: "Claim of Lien",
    filingOffice: 'Clerk of Superior Court',
    deadlines: {
      noticeToContractor: {
        days: 30,
        description: 'If the GC has filed a Notice of Commencement (NOC) with the Clerk of Superior Court, subcontractors and suppliers must serve a Notice to Contractor within 30 days of first furnishing labor or materials OR within 30 days of the NOC filing date, whichever is later. Check the GSCCCA system (www.gsccca.org) to confirm whether a NOC was filed.',
        required: true,
        conditionalNote: 'Only required if GC filed a Notice of Commencement. Always check GSCCCA before starting work.',
      },
      claimOfLien: {
        residential: 90,
        commercial: 90,
        description: '90 days after the last day labor or materials were furnished (not invoice date, not contract date). § 44-14-361.1.',
      },
      serveOwner: {
        days: 2,
        description: 'Within 2 business days after filing, send a copy of the Claim of Lien to the property owner by registered or certified mail or statutory overnight delivery (§ 44-14-361.1).',
      },
      enforce: {
        description: 'Foreclosure lawsuit must be filed within 365 days of the lien filing date. Within 30 days of filing suit, must also file a Notice of Commencement of Lien Action with the Clerk of Superior Court. Lien expires and is VOID 395 days from filing if no notice of lien action is filed.',
      },
    },
    counties: [
      'Fulton', 'Gwinnett', 'Cobb', 'DeKalb', 'Cherokee', 'Forsyth', 'Hall',
      'Clayton', 'Henry', 'Columbia', 'Richmond', 'Chatham', 'Muscogee', 'Clarke',
      'Bibb', 'Houston', 'Carroll', 'Paulding', 'Coweta', 'Bartow',
      'Other Georgia County'
    ],
    documentPrompt: (data, today, lienDeadlineStr, daysRemaining) => `
You are a Georgia mechanics lien document preparation specialist with deep knowledge of Georgia's Mechanics and Materialmen's Lien Law (O.C.G.A. § 44-14-360 et seq.).

APPLICABLE LAW: O.C.G.A. § 44-14-360 et seq.
FILING OFFICE: ${data.propertyCounty} County Clerk of Superior Court
CLAIM OF LIEN DEADLINE: ${lienDeadlineStr} (${daysRemaining} days remaining)
ENFORCE DEADLINE: 365 days from lien filing date (lawsuit must be filed; not 365 days from last work)
LIEN EXPIRATION: Lien becomes void 395 days from filing if no Notice of Commencement of Lien Action is filed

KEY GEORGIA REQUIREMENTS:
- Document is called "Claim of Lien" — must be NOTARIZED (sworn under oath)
- Filed with the Clerk of Superior Court in the county where the property is located
- Most counties: electronic filing via GSCCCA eFiling system (www.gsccca.org) — this is the default method
- Within 2 business days of filing, send copy to property owner by registered/certified mail or statutory overnight delivery (§ 44-14-361.1(a)(2))
- NOTICE OF COMMENCEMENT SYSTEM: If the GC filed a Notice of Commencement, subcontractors must serve a Notice to Contractor within 30 days of first furnishing OR within 30 days of the NOC filing, whichever is later. Always check GSCCCA to confirm.
- No legal description required — property must be described with enough detail to be identified (address sufficient)
- MANDATORY 12-POINT BOLD WARNING — must appear verbatim on the document: "This claim of lien expires and is void 395 days from the date of filing the claim of lien if no notice of commencement of lien action is filed in that time period"
- Must also include owner's right-to-contest language
- Lien enforcement: must file lawsuit within 365 days of lien filing date, AND file Notice of Commencement of Lien Action with Clerk of Superior Court within 30 days of filing suit
- Amount of lien may be reduced by amendment — amended lien relates back to original filing date
- Georgia broadly covers contractors, subcontractors, materialmen, architects, engineers, surveyors, and foresters

MANDATORY DOCUMENT WARNING (12-POINT BOLD — include verbatim):
THIS CLAIM OF LIEN EXPIRES AND IS VOID 395 DAYS FROM THE DATE OF FILING THE CLAIM OF LIEN IF NO NOTICE OF COMMENCEMENT OF LIEN ACTION IS FILED IN THAT TIME PERIOD.

OWNER RIGHT-TO-CONTEST NOTICE (include on document):
The owner of the above-described real property, or the owner's agent or attorney, may contest this claim of lien by filing a written notice of contest with the clerk of the superior court of the county in which the lien is filed, pursuant to O.C.G.A. § 44-14-368.

NOTARIZATION BLOCK FORMAT:
STATE OF GEORGIA
COUNTY OF ___________________

Before me, the undersigned notary public, personally appeared the above-named claimant who, being duly sworn, states that the foregoing is true and correct to the best of their knowledge and belief.

Subscribed and sworn to before me this _______ day of _________________, 20____.

_______________________________________
Notary Public, State of Georgia
My commission expires: ___________________
(Notary Seal)
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
  if (stateCode === 'TX') {
    if (role === 'General Contractor / Prime') return null;
    return projectType === 'residential' ? 45 : 75;
  }
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
The following three placeholders MUST appear in the document exactly as written below, including the square brackets. Do not paraphrase, remove, or modify the brackets. Copy them verbatim:
- [TO BE CONFIRMED — verify owner name from ${propertyCounty} County property records before filing]
- [LEGAL DESCRIPTION — obtain from deed or ${propertyCounty} County ${module.filingOffice} records before filing]
- [TAX PARCEL ID — obtain from ${propertyCounty} County records before filing]
For ALL other content use plain text or blank underlines (___________). Do not add any other bracketed items.

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

  TX: {
    name: 'Texas',
    statute: "Texas Property Code § 70.001 (Worker's Lien) and § 70.006 (Sale of Motor Vehicle)",
    filingAgency: 'County Tax Assessor-Collector',
    deadlines: {
      filingDeadline: 30,
      description: "Written notice must be sent to owner and all lienholders of record by certified mail within 30 days of when charges accrue. Non-franchised dealers must file a copy of the notice with the county tax assessor-collector's office with a $25 fee within the same 30-day period.",
      inspectionDeadline: 3,
      inspectionDescription: 'Upon request, shop must allow owner or lienholder to inspect the vehicle within 3 business days of the request.',
      taxAssessorResponse: 15,
      taxAssessorDescription: 'County tax assessor-collector must forward a copy of the notice to the vehicle owner and lienholders within 15 business days of receipt.',
    },
  },

  NC: {
    name: 'North Carolina',
    statute: 'North Carolina Possessory Lien Law (N.C.G.S. § 44A-2 et seq.)',
    filingAgency: 'Clerk of Superior Court / NC DMV',
    deadlines: {
      filingDeadline: 10,
      description: 'After charges accrue and remain unpaid, lienor must apply to Clerk of Superior Court for sale order. Clerk issues order no less than 14 days from application. Notice of sale mailed to all parties.',
    },
  },

  IL: {
    name: 'Illinois',
    statute: 'Illinois Garage Keepers Lien (770 ILCS 95/)',
    filingAgency: 'Illinois Secretary of State / Circuit Court',
    deadlines: {
      filingDeadline: 30,
      description: 'After 30 days of non-payment, may proceed with lien enforcement through abandoned vehicle process or court proceeding.',
    },
  },

  GA: {
    name: 'Georgia',
    statute: "Georgia Abandoned Motor Vehicle Law (O.C.G.A. § 40-11-1 et seq.)",
    filingAgency: 'Georgia Department of Revenue (DOR) / Tag Office',
    deadlines: {
      filingDeadline: 30,
      noticeDeadline: 3,
      noticeDescription: 'Notice to owner must be sent within 3 business days of vehicle coming into possession.',
      description: 'After 30 days of non-payment, may proceed with abandoned motor vehicle process through the Georgia DOR.',
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
- Violating this section is a Class A infraction under Indiana law`,

    TX: `- Lien attaches to the VEHICLE under Texas Property Code § 70.001 (Worker's Lien) — applies to repair shops that perform labor on vehicles
- Shop must retain possession of the vehicle to maintain the lien (possessory lien)
- A signed work order authorizing the repairs is required — oral authorizations are risky
- NOTICE REQUIREMENT: Within 30 days of when charges accrue, shop must send written notice by certified mail, return receipt requested, to: (1) the registered owner, and (2) every lienholder of record on the certificate of title
- Notice must include: amount of charges, request for payment, physical address where repairs were made, legal name of lien holder, TIN or EIN of lien holder, and a signed copy of the work order
- NON-FRANCHISED DEALER FILING: A repair shop that is not a franchised motor vehicle dealer must also file a copy of the notice with the county tax assessor-collector's office in the county where repairs were made, with a $25 administrative fee, within the same 30-day period
- County tax assessor-collector must forward the notice to owner and lienholders within 15 business days of receipt
- Upon request, shop must allow owner or lienholder to inspect the vehicle within 3 business days
- Vehicle sale must be at public auction — shop may bid on vehicle itself
- After sale: apply proceeds to lien; deposit any surplus with the county clerk for the owner/lienholders
- Title transfer after sale: the buyer must apply for a new certificate of title through the county tax assessor-collector using the sale documentation`,

    NC: `- Lien attaches to the VEHICLE (possessory lien) under N.C.G.S. § 44A-2 — shop must retain possession
- Applies to any person who repairs, services, tows, or stores motor vehicles in the ordinary course of business
- After charges are unpaid, lienor must apply to the Clerk of Superior Court for an order authorizing sale
- Clerk issues sale order not less than 14 days from application date
- Notice of the application and sale order must be mailed to all parties (owner, lienholders)
- Sale proceeds: first to lien charges and sale costs; surplus to owner
- For title transfer: work through NC DMV using the court sale order documentation`,

    IL: `- Illinois Garage Keepers Lien under 770 ILCS 95/ — possessory lien, must retain vehicle
- After charges accrue and remain unpaid, repair shop may enforce lien
- Process may involve court proceeding or Illinois Secretary of State abandoned vehicle process
- After 30 days: may proceed with enforcement; consult Illinois attorney for current abandoned vehicle procedures
- Proceeds applied to charges; surplus to owner`,

    GA: `- Georgia Abandoned Motor Vehicle Law (O.C.G.A. § 40-11-1 et seq.)
- Must send notice to owner within 3 business days of vehicle coming into possession
- After 30 days of non-payment, vehicle may be treated as abandoned
- Process involves Georgia Department of Revenue and local tag office
- Application filed with DOR; DOR notifies owner and lienholders
- If unclaimed after notice period, vehicle may be sold; proceeds to charges then owner`
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
Purchaser uses this to apply for a new certificate of title from the Indiana BMV.`,

    TX: `═══════════════════════════════════════
DOCUMENT 2: TEXAS § 70.006 NOTICE GUIDE
Texas Worker's Lien — Notice of Lien and Charges
Texas Property Code § 70.001 / § 70.006
═══════════════════════════════════════

This document must be sent by certified mail, return receipt requested, within 30 days of when charges accrued. If you are not a franchised motor vehicle dealer, a copy must also be filed with the county tax assessor-collector's office ($25 fee) within the same 30-day window.

NOTICE OF LIEN — REQUIRED CONTENTS:
Repair Facility: ${claimantName}
Physical Address of Repair Shop: ${claimantAddress}
Phone: ${claimantPhone}
Taxpayer/Employer ID Number: _____________ (YOUR TIN or EIN — required by statute)
Vehicle: ${vehicleDescription}
VIN: ${vin}
Registered Owner: ${ownerName}
Owner Address: ${ownerAddress}
Date repairs authorized: ${dateLast}
Work performed: ${workDescription}
Total charges: $${parseInt(amountOwed).toLocaleString()}

SEND CERTIFIED MAIL TO:
1. Registered owner at last known address
2. Each lienholder of record on the certificate of title (search title records first)

ATTACH TO NOTICE: A signed copy of the work order authorizing the repairs. This is a statutory requirement — do not omit it.

COUNTY TAX ASSESSOR-COLLECTOR FILING (required if not a franchised dealer):
File a copy of this notice with the ${claimantAddress.split(',').slice(-2).join(',').trim() || 'your county'} County Tax Assessor-Collector's office within 30 days of when charges accrued.
Filing fee: $25 (paid to the county tax assessor-collector)
The county must forward the notice to the owner and lienholders within 15 business days.

VEHICLE INSPECTION RIGHT:
If the owner or any lienholder requests to inspect the vehicle, you must allow inspection within 3 business days of the request. The inspection must be completed before any public sale.

SALE PROCESS:
After proper notice, if the vehicle remains unclaimed, you may sell it at public auction. You may bid on the vehicle yourself. After the sale, apply proceeds to your lien first, then deposit any surplus with the county clerk for the owner or lienholders. The buyer must apply for a new certificate of title through the county tax assessor-collector.`,

    NC: `═══════════════════════════════════════
DOCUMENT 2: NC POSSESSORY LIEN GUIDE
North Carolina Vehicle Repair Lien — N.C.G.S. § 44A-2
═══════════════════════════════════════

OVERVIEW:
North Carolina grants possessory liens to repair shops under N.C.G.S. § 44A-2. You must retain possession of the vehicle. To enforce after non-payment, you must apply to the Clerk of Superior Court for a sale order.

SHOP INFORMATION:
${claimantName}
${claimantAddress}
${claimantPhone}

VEHICLE INFORMATION:
${vehicleDescription}
VIN: ${vin}

REGISTERED OWNER: ${ownerName}
OWNER ADDRESS: ${ownerAddress}

CHARGES OWED: $${parseInt(amountOwed).toLocaleString()}
WORK PERFORMED: ${workDescription}
DATE OF LAST WORK: ${dateLast}

ENFORCEMENT PROCESS:
1. Send demand letter to owner by certified mail, return receipt requested
2. If unpaid after reasonable time (10+ days), apply to Clerk of Superior Court in the county where the vehicle is located for a sale order
3. The Clerk issues a sale order at least 14 days from your application date
4. Mail notice of the application and order to the owner and all lienholders of record
5. Conduct the authorized sale per court order
6. Apply proceeds: first to your charges and sale costs; surplus to owner`,

    IL: `═══════════════════════════════════════
DOCUMENT 2: ILLINOIS GARAGE KEEPER LIEN GUIDE
Illinois Vehicle Repair Lien — 770 ILCS 95/
═══════════════════════════════════════

OVERVIEW:
Illinois grants garage keepers a possessory lien under 770 ILCS 95/. After 30 days of non-payment, you may proceed with enforcement through the Illinois Secretary of State's abandoned vehicle process or a court proceeding.

SHOP INFORMATION:
${claimantName}
${claimantAddress}
${claimantPhone}

VEHICLE: ${vehicleDescription}
VIN: ${vin}
REGISTERED OWNER: ${ownerName}
OWNER ADDRESS: ${ownerAddress}
CHARGES OWED: $${parseInt(amountOwed).toLocaleString()}
WORK: ${workDescription}

ENFORCEMENT STEPS:
1. Send demand letter by certified mail to owner and all title lienholders
2. After 30 days of non-payment, contact the Illinois Secretary of State for current abandoned vehicle procedures
3. File required notices with SOS; SOS notifies owner and lienholders
4. If unclaimed after notice period, proceed with sale per SOS authorization
5. Apply proceeds: first to charges; surplus to owner`,

    GA: `═══════════════════════════════════════
DOCUMENT 2: GEORGIA ABANDONED VEHICLE GUIDE
Georgia Vehicle Repair Lien — O.C.G.A. § 40-11-1 et seq.
═══════════════════════════════════════

OVERVIEW:
Georgia's Abandoned Motor Vehicle Law (O.C.G.A. § 40-11-1 et seq.) governs unpaid vehicle repair situations. Notice must be sent within 3 business days of the vehicle coming into your possession.

SHOP INFORMATION:
${claimantName}
${claimantAddress}
${claimantPhone}

VEHICLE: ${vehicleDescription}
VIN: ${vin}
REGISTERED OWNER: ${ownerName}
OWNER ADDRESS: ${ownerAddress}
CHARGES OWED: $${parseInt(amountOwed).toLocaleString()}
WORK: ${workDescription}

ENFORCEMENT STEPS:
1. Within 3 business days of receiving the vehicle: send written notice to the registered owner by certified mail, return receipt requested
2. Send demand letter (Document 1) simultaneously
3. After 30 days of non-payment: file application with your county tag office / Georgia Department of Revenue declaring vehicle abandoned
4. DOR notifies owner and lienholders of record; they have opportunity to redeem
5. If unclaimed after notice period: DOR authorizes sale; apply proceeds to charges then surrender surplus to DOR for owner`
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

IMPORTANT: Violating I.C. § 9-22-6-2 procedures is a Class A infraction. Follow each step precisely. If you have released the vehicle and the owner still owes you, a different lien process applies (I.C. § 32-33-10). Consult an Indiana attorney in that situation.`,

    TX: `═══════════════════════════════════════
DOCUMENT 3: FILING INSTRUCTIONS FOR ${claimantName.toUpperCase()}
Texas Worker's Lien — Step by Step
Texas Property Code § 70.001 / § 70.006
═══════════════════════════════════════

STEP 1 — SEND THE DEMAND LETTER TODAY
Send via certified mail, return receipt requested, to ${ownerName} at ${ownerAddress}. Keep all documentation. This is your first and most important step — most disputes resolve here without going further.

STEP 2 — WAIT 10 DAYS FOR PAYMENT
If paid, release the vehicle. If not paid, proceed immediately to Step 3. You are on a strict 30-day statutory clock from the date charges accrued. Do not wait.

STEP 3 — CONDUCT A TITLE SEARCH (BEFORE SENDING FORMAL NOTICE)
Before sending the formal § 70.006 notice, search Texas DMV records to identify all registered owners and lienholders on the certificate of title. Contact your county Tax Assessor-Collector or use the Texas DMV online title check system. You must notify every lienholder of record — failure to notify a known lienholder can affect your lien's validity.

STEP 4 — SEND CERTIFIED NOTICE TO OWNER AND ALL LIENHOLDERS (within 30 days of charges accruing)
Using Document 2 as your guide, send written notice by certified mail, return receipt requested, to: (1) the registered owner, and (2) every lienholder of record on the certificate of title. The notice must include the required statutory language, a signed copy of the work order, your TIN/EIN, the repair address, and the amount claimed.

STEP 5 — FILE WITH COUNTY TAX ASSESSOR-COLLECTOR (within 30 days, same window as Step 4)
If you are NOT a franchised motor vehicle dealer, file a copy of the notice with the county tax assessor-collector's office in the county where the repairs were made. Filing fee: $25. The county will then forward a copy to the owner and lienholders within 15 business days. This step is required by statute and failure to file can make your lien subordinate to any recorded lienholder.

STEP 6 — ALLOW INSPECTION IF REQUESTED
If the owner or any lienholder requests to inspect the vehicle, you must make it available within 3 business days. Document all inspection requests and outcomes in writing.

STEP 7 — CONDUCT PUBLIC AUCTION (if vehicle remains unredeemed)
If the vehicle remains unclaimed after proper notice, schedule and conduct a public auction. You may bid on the vehicle yourself. Announce the sale publicly and document the proceedings completely.

STEP 8 — APPLY PROCEEDS AND HANDLE TITLE
Apply auction proceeds to your lien first. Deposit any surplus with the county clerk for the owner or lienholders. The buyer must apply for a new certificate of title through the county tax assessor-collector using the sale documentation you provide.

IMPORTANT: Retain possession of the vehicle at all times. If you release the vehicle before full payment, your possessory lien is extinguished. Texas courts strictly enforce the 30-day notice window — late filings can result in your lien being subordinate to title lienholders. If in doubt, consult a Texas attorney before proceeding with a sale.`,

    NC: `═══════════════════════════════════════
DOCUMENT 3: FILING INSTRUCTIONS FOR ${claimantName.toUpperCase()}
North Carolina Vehicle Repair Lien — Step by Step
N.C.G.S. § 44A-2
═══════════════════════════════════════

STEP 1 — SEND THE DEMAND LETTER TODAY
Send via certified mail, return receipt requested, to ${ownerName} at ${ownerAddress}. Keep all documentation. Most disputes resolve here.

STEP 2 — RETAIN POSSESSION OF THE VEHICLE
North Carolina's lien is possessory. If you release the vehicle without full payment, your lien is extinguished.

STEP 3 — WAIT 10 DAYS FOR PAYMENT
If paid, release the vehicle. If not, proceed to enforcement.

STEP 4 — APPLY TO CLERK OF SUPERIOR COURT
File an application for a sale order with the Clerk of Superior Court in the county where the vehicle is located. The application should state the facts of the unpaid debt, the lien amount, and request authorization for sale.

STEP 5 — RECEIVE SALE ORDER (at least 14 days from application)
The Clerk issues the sale order not less than 14 days from your application. Immediately mail copies of the application and order to the owner and all title lienholders.

STEP 6 — CONDUCT AUTHORIZED SALE
Conduct the sale per the court order. Document the sale completely.

STEP 7 — APPLY PROCEEDS
Apply proceeds to your lien first, then to sale costs. Deliver any surplus to the owner. Work with NC DMV for title transfer using your court sale documentation.`,

    IL: `═══════════════════════════════════════
DOCUMENT 3: FILING INSTRUCTIONS FOR ${claimantName.toUpperCase()}
Illinois Garage Keeper Lien — Step by Step
770 ILCS 95/
═══════════════════════════════════════

STEP 1 — SEND THE DEMAND LETTER TODAY
Send via certified mail, return receipt requested, to ${ownerName} at ${ownerAddress}. Keep all records.

STEP 2 — RETAIN POSSESSION
Your lien is possessory under Illinois law. Release of the vehicle extinguishes your lien.

STEP 3 — WAIT 30 DAYS
If unpaid after 30 days, proceed to enforcement.

STEP 4 — CONTACT ILLINOIS SECRETARY OF STATE
Contact the Illinois Secretary of State's office for current abandoned vehicle procedures and required forms. Requirements may have been updated — always verify current procedures directly with SOS before filing.

STEP 5 — FILE REQUIRED NOTICES
File the appropriate forms with SOS and serve notice on the owner and all title lienholders. SOS will coordinate notification.

STEP 6 — WAIT FOR REDEMPTION PERIOD TO EXPIRE
Owner and lienholders have an opportunity to redeem. If unclaimed, proceed with sale per SOS authorization.

STEP 7 — APPLY PROCEEDS
Apply sale proceeds to your charges; surrender surplus to SOS for owner.

IMPORTANT: Illinois garage keeper lien procedures can be complex. If you have any uncertainty, consult an Illinois attorney before releasing or selling the vehicle.`,

    GA: `═══════════════════════════════════════
DOCUMENT 3: FILING INSTRUCTIONS FOR ${claimantName.toUpperCase()}
Georgia Abandoned Motor Vehicle Lien — Step by Step
O.C.G.A. § 40-11-1 et seq.
═══════════════════════════════════════

STEP 1 — SEND THE DEMAND LETTER TODAY
Send via certified mail, return receipt requested, to ${ownerName} at ${ownerAddress}. Keep all documentation.

STEP 2 — SEND 3-BUSINESS-DAY NOTICE (if not already sent)
Within 3 business days of the vehicle coming into your possession, you must have sent written notice to the registered owner by certified mail. If this was not done, do it immediately — this is a statutory requirement.

STEP 3 — WAIT FOR PAYMENT (30 days)
If paid, release the vehicle. If unpaid after 30 days from the date the vehicle came into your possession, it may be treated as abandoned.

STEP 4 — SEARCH TITLE RECORDS
Before filing with the DOR, search Georgia title records to identify all owners and lienholders. Contact your county tag office or use the Georgia DOR online title lookup system.

STEP 5 — FILE WITH COUNTY TAG OFFICE / GEORGIA DOR
File an abandoned motor vehicle report with your county tag office or the Georgia Department of Revenue. Pay required fees. Provide documentation of the notice you sent in Step 2.

STEP 6 — DOR NOTIFIES PARTIES
The DOR notifies the registered owner and all title lienholders. They have a redemption period to claim the vehicle and pay your charges.

STEP 7 — SALE AND PROCEEDS
If unclaimed after the redemption period, the DOR authorizes disposition. Apply proceeds to your charges; surrender surplus to the DOR for the owner. Work with the county tag office for title transfer.

IMPORTANT: Georgia's abandoned motor vehicle procedures are administered locally through county tag offices and the DOR. Requirements can vary slightly by county. Contact your county tag office for current forms before filing.`
  };

  const requirements = stateRequirements[stateCode] || stateRequirements.MI;
  const doc2 = doc2Content[stateCode] || doc2Content.MI;
  const doc3 = doc3Content[stateCode] || doc3Content.MI;

  const licenseField = stateCode === 'MI'
    ? `MVSR License number: ${licenseNumber || 'TO BE CONFIRMED BEFORE FILING'}`
    : `Facility license/registration: ${licenseNumber || 'N/A'}`;

  const deadlineBlock = stateCode === 'MI'
    ? `BDVR-35 FILING DEADLINE: ${filingDeadlineStr} (${daysRemaining} days remaining)
TOTAL PROCESS LIMIT: 225 days from lien attachment date`
    : stateCode === 'TX'
      ? `NOTICE + COUNTY FILING DEADLINE: ${filingDeadlineStr} (${daysRemaining} days remaining — 30 days from date charges accrued)
CRITICAL: Must send certified notice to owner/lienholders AND file with county tax assessor-collector within 30 days`
      : '';

  const prompt = `You are a ${module.name} vehicle mechanic's lien document preparation specialist with deep knowledge of ${module.statute}.

APPLICABLE LAW: ${module.statute}
FILING AGENCY: ${module.filingAgency}
${deadlineBlock}

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
