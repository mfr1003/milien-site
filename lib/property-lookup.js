/**
 * LodgeMiLien — Property Owner Lookup Reference System
 *
 * PURPOSE:
 * Provides state-specific guidance for verifying property owner names,
 * legal descriptions, and parcel IDs before filing a mechanics lien.
 * Injected into Document 3 (Filing Instructions) for every order.
 *
 * STRUCTURE PER STATE:
 *   statewide      {boolean}  True if a single portal covers the whole state
 *   primaryUrl     {string}   Best first stop — statewide portal or state directory
 *   system         {string}   Name of the system or office to search
 *   instructions   {string}   Plain-language step-by-step for the customer
 *   legalDescNote  {string}   Where to get the legal description
 *
 * INTEGRATION:
 * Import this object into state-modules.js.
 * In buildDocumentPrompt(), call buildPropertyLookupBlock(stateCode, propertyCounty)
 * and inject the result into the Document 3 prompt.
 */

const PROPERTY_LOOKUP = {

  // ── STATES WITH TRUE STATEWIDE PORTALS ──────────────────────────────────────

  MD: {
    statewide: true,
    primaryUrl: 'https://sdat.dat.maryland.gov/RealProperty/Pages/default.aspx',
    system: 'Maryland SDAT Real Property Search',
    instructions: `Go to https://sdat.dat.maryland.gov/RealProperty/Pages/default.aspx. Select your county from the dropdown. Search by street address. The result will show the current owner of record, the deed reference, and the property description. This covers all 23 Maryland counties and Baltimore City.`,
    legalDescNote: 'The SDAT search result shows the deed book and page. Pull the full legal description from the deed at your county Circuit Court land records office or through Maryland\'s land records portal at mdlandrec.net.',
  },

  GA: {
    statewide: true,
    primaryUrl: 'https://www.gsccca.org/search',
    system: 'Georgia Superior Court Clerks\' Cooperative Authority (GSCCCA)',
    instructions: `Go to https://www.gsccca.org/search and select "Real Estate Index." Search by county and grantor/grantee name or property address. GSCCCA covers all 159 Georgia counties and shows recorded deeds, the current owner of record, and the legal description. For tax ownership (not deed ownership), also check your county Tax Assessor's website.`,
    legalDescNote: 'The deed retrieved through GSCCCA will contain the full legal description. Use this verbatim on your lien.',
  },

  VA: {
    statewide: true,
    primaryUrl: 'https://www.vlr.courts.state.va.us',
    system: 'Virginia Land Records (VLR)',
    instructions: `Go to https://www.vlr.courts.state.va.us. Select your jurisdiction from the list. Search by grantor/grantee name or instrument number. VLR covers most Virginia cities and counties. For property tax ownership, also check your locality's assessor (e.g., Fairfax County: www.fairfaxcounty.gov/assessments; Virginia Beach: assessor.vbgov.com). Independent cities (Alexandria, Chesapeake, Richmond, Norfolk, etc.) have their own assessor portals — search "[City Name] VA real estate assessor."`,
    legalDescNote: 'Pull the full legal description from the recorded deed via VLR. Virginia lien memoranda require the property description — address alone is insufficient.',
  },

  MA: {
    statewide: true,
    primaryUrl: 'https://www.masslandrecords.com',
    system: 'Massachusetts Land Records (MassLandRecords.com)',
    instructions: `Go to https://www.masslandrecords.com. Select your county's Registry of Deeds. Search by grantor/grantee name or property address. This aggregated system covers all Massachusetts county registries of deeds and will show the current recorded owner and the deed instrument. Note: also search your city/town assessor for the tax record owner name — they should match the deed but occasionally differ after a recent transfer.`,
    legalDescNote: 'The deed retrieved through MassLandRecords.com will contain the full legal description needed for the Notice of Contract and Statement of Account.',
  },

  HI: {
    statewide: true,
    primaryUrl: 'https://boc.hawaii.gov',
    system: 'Hawaii Bureau of Conveyances',
    instructions: `Go to https://boc.hawaii.gov and select "Document Search." Search by grantor/grantee name or Tax Map Key (TMK) number. The Bureau of Conveyances is the statewide recording office — it covers all Hawaii islands. To find the TMK (parcel number) for a property, use the Hawaii Real Property Tax portal for your county: Honolulu: qpublic.net/hi/honolulu; Maui: mauipropertytax.com; Hawaii County: hawaiipropertytax.com; Kauai: kauaipropertytax.com.`,
    legalDescNote: 'Retrieve the legal description from the most recently recorded deed. Hawaii lien law requires the Tax Map Key on the lien document.',
  },

  WV: {
    statewide: true,
    primaryUrl: 'https://www.wvproperty.com',
    system: 'West Virginia Property Records (wvproperty.com)',
    instructions: `Go to https://www.wvproperty.com. Select your county. Search by owner name or address. This statewide portal covers all 55 West Virginia counties and shows current tax owner, parcel ID, and assessed value. For deed-of-record ownership, also check your county's Circuit Clerk office — many are available through https://www.courtswv.gov.`,
    legalDescNote: 'For the legal description, contact or visit your county\'s Circuit Clerk (Clerk of Court) office. Some WV counties have online deed indexes at courtswv.gov.',
  },

  // ── NEW YORK: SPLIT SYSTEM ───────────────────────────────────────────────────

  NY: {
    statewide: false,
    primaryUrl: 'https://a836-acris.nyc.gov/CP/',
    system: 'ACRIS (NYC) / County Clerk (upstate)',
    instructions: `FOR NEW YORK CITY PROPERTIES (Manhattan, Brooklyn, Queens, Bronx, Staten Island):
Go to https://a836-acris.nyc.gov/CP/ — the Automated City Register Information System. Search by address or block/lot. ACRIS shows the current deed of record, owner, and the block and lot number required for NYC lien filings.

FOR ALL OTHER NEW YORK COUNTIES (outside the 5 boroughs):
Search your county clerk's online deed index. Most upstate NY counties have online records through their county websites or through eCourts at iapps.courts.state.ny.us/iscroll. Search "[County] County NY deed search" to find your county's specific portal. You can also use the county assessor's website for the tax-record owner name.`,
    legalDescNote: 'In NYC, use the tax block and lot number as the property identifier on the lien. Outside NYC, use the full metes-and-bounds legal description from the recorded deed, or the section/block/lot from the county tax map.',
  },

  // ── STATES WITH STATE DIRECTORY + COUNTY SYSTEM ─────────────────────────────

  MI: {
    statewide: false,
    primaryUrl: 'https://bsaonline.com',
    system: 'BS&A Online (most counties) / County Equalization Office',
    instructions: `Most Michigan counties use BS&A Online. Go to https://bsaonline.com, select "Public Records Search," choose your county, and search by property address. The result shows the current owner of record, parcel ID, and assessed value. If your county is not on BS&A, search "[County] County MI property search" to find the county's assessor or equalization office portal. You can also find county websites through Michigan.gov's county directory.`,
    legalDescNote: 'The legal description is shown in the BS&A parcel record and on the recorded deed at the county Register of Deeds. Always confirm from the deed — BS&A occasionally abbreviates.',
  },

  OH: {
    statewide: false,
    primaryUrl: 'https://auditor.franklincounty.ohio.gov',
    system: 'County Auditor website',
    instructions: `Ohio property records are maintained by County Auditors. Search "[County] County Ohio Auditor property search" to find your county's portal. Examples: Franklin (Columbus): auditor.franklincounty.ohio.gov; Cuyahoga (Cleveland): cuyahogacounty.us/auditor; Hamilton (Cincinnati): hamiltoncountyauditor.org; Summit (Akron): co.summit.oh.us/auditor. Enter the property address to find the current owner of record, parcel number, and property description.`,
    legalDescNote: 'For the full legal description, visit or contact your county Recorder\'s office — most Ohio counties have online deed indexes. The Auditor\'s site shows the parcel, the Recorder\'s site shows the deed.',
  },

  IN: {
    statewide: false,
    primaryUrl: 'https://gateway.ifionline.org',
    system: 'Indiana Gateway / County Assessor',
    instructions: `Indiana property records are maintained by County Assessors. Visit https://gateway.ifionline.org and navigate to "Property Tax" to find county-level assessor data. Alternatively, search "[County] County Indiana Assessor property search." Most Indiana counties also participate in state-level parcel data. Enter the property address to find the current owner, parcel number, and assessed value.`,
    legalDescNote: 'For the full legal description, visit your county Recorder\'s office or their online deed index. Indiana law requires owner name as shown on TAX RECORDS — use the name exactly as it appears in the county assessor\'s records.',
  },

  TX: {
    statewide: false,
    primaryUrl: 'https://comptroller.texas.gov/taxes/property-tax/cadaddresses.php',
    system: 'County Central Appraisal District (CAD)',
    instructions: `Texas property records are held by County Central Appraisal Districts (CADs). Find your county's CAD at https://comptroller.texas.gov/taxes/property-tax/cadaddresses.php. Major examples: Harris (Houston): hcad.org; Dallas: dcad.org; Travis (Austin): tcad.org; Bexar (San Antonio): bcad.org; Tarrant (Fort Worth): tad.org. Search by address to get the current owner of record, legal description, and the CAD account number (property ID).`,
    legalDescNote: 'The CAD record shows the legal description. Texas lien affidavits REQUIRE the full legal description — street address alone is not sufficient. If the CAD description is abbreviated, pull the full description from the County Clerk\'s deed records.',
  },

  FL: {
    statewide: false,
    primaryUrl: 'https://floridarevenue.com/property/Pages/Taxpayers_CountyOfficials.aspx',
    system: 'County Property Appraiser website',
    instructions: `Florida property records are maintained by County Property Appraisers. Find your county's Property Appraiser at https://floridarevenue.com/property/Pages/Taxpayers_CountyOfficials.aspx. Major examples: Miami-Dade: miamidade.gov/pa; Broward: bcpa.net; Palm Beach: pbcgov.com/papa; Orange (Orlando): ocpafl.org; Hillsborough (Tampa): hcpafl.org. Search by address to find the owner of record, parcel ID, and legal description.`,
    legalDescNote: 'Florida lien documents need the property description with sufficient detail to identify the property. Use the full legal description from the Property Appraiser record or the recorded deed at the county Clerk of Court.',
  },

  NC: {
    statewide: false,
    primaryUrl: 'https://www.ncdor.gov/documents/county-assessors-offices',
    system: 'County Tax Assessor / Register of Deeds',
    instructions: `North Carolina property records are maintained by County Tax Assessors and Registers of Deeds. Find county contacts at https://www.ncdor.gov/documents/county-assessors-offices. Most NC counties have GIS/property search portals — search "[County] County NC GIS property search." Major examples: Mecklenburg: polaris3g.mecklenburgcountync.gov; Wake: wake.gov/departments/revenue/real-estate; Guilford: guilfordcountync.gov/tax. Enter the property address for owner, parcel ID, and property details.`,
    legalDescNote: 'For the legal description, pull the recorded deed from the county Register of Deeds. Most NC counties have online deed indexes. Search "[County] County NC Register of Deeds online search."',
  },

  IL: {
    statewide: false,
    primaryUrl: 'https://www.cookcountyassessor.com',
    system: 'County Assessor website (Cook) / Township Assessor (other counties)',
    instructions: `Illinois property records are county-administered. Cook County (Chicago): cookcountyassessor.com — search by address for owner, PIN (parcel ID), and property details. For all other Illinois counties, search "[County] County Illinois Assessor property search." Most counties have GIS portals. DuPage: dupageco.org/assessor; Lake: lakecountyil.gov/assessor; Will: willcountyillinois.com/county-offices/assessor.`,
    legalDescNote: 'For the legal description, visit your county Recorder\'s office or online deed index. Cook County uses the Chicago Title Indexing System — the "legal description" on a Cook County lien typically references the subdivision and lot.',
  },

  PA: {
    statewide: false,
    primaryUrl: 'https://www.phila.gov/services/property-lots-housing/property-records/',
    system: 'County Assessment Office',
    instructions: `Pennsylvania property records are maintained by County Assessment Offices. Search "[County] County Pennsylvania property assessment search." Examples: Philadelphia: phila.gov/services/property-lots-housing/property-records; Allegheny (Pittsburgh): alleghenyassessor.com; Montgomery: montcopa.org/assessor; Bucks: buckscounty.gov/government/rowoffices/assessmentappealstaxclaim; Chester: chescopa.org/assessor. Enter the property address to find the current owner, parcel ID (UPI), and assessed value.`,
    legalDescNote: 'Pennsylvania Mechanics\' Lien Claims require a legal description adequate to identify the property. For full legal description, visit or search your county Recorder of Deeds office. Many PA counties have online deed indexes through their county websites.',
  },

  WA: {
    statewide: false,
    primaryUrl: 'https://dor.wa.gov/taxes-rates/property-tax/county-assessor-and-treasurer-websites',
    system: 'County Assessor / County Auditor',
    instructions: `Washington property records are county-administered. Find your county's Assessor at https://dor.wa.gov/taxes-rates/property-tax/county-assessor-and-treasurer-websites. Major examples: King (Seattle): blue.kingcounty.gov/Assessor; Pierce (Tacoma): piercecountywa.gov/AssessorTreasurer; Snohomish (Everett): snohomishcountywa.gov/assessor; Spokane: spokanecounty.org/assessor; Clark: clark.wa.gov/assessor. Enter the property address to find owner, parcel number, and assessed value. For deed of record (ownership), use the County Auditor's online index.`,
    legalDescNote: 'Washington Claim of Lien requires a description of the property. Use the legal description from the County Auditor\'s recorded deed records, or the full property description shown in the county assessor\'s parcel record.',
  },

  CO: {
    statewide: false,
    primaryUrl: 'https://www.colorado.gov/assessors-offices',
    system: 'County Assessor website',
    instructions: `Colorado property records are held by County Assessors. Find your county's assessor at colorado.gov or search "[County] County Colorado Assessor property search." Examples: Denver: denvergov.org/assessor; El Paso (Colorado Springs): assessor.elpasoco.com; Jefferson (Lakewood): jeffco.us/assessor; Arapahoe (Aurora): arapahoegov.com/assessor; Boulder: bouldercounty.gov/property-and-land/assessor. Enter the property address to find owner, parcel number, and legal description.`,
    legalDescNote: 'Colorado\'s "Statement of Lien" must include a legal description of the property. Use the full description from the County Clerk and Recorder\'s recorded deed records — not just the parcel number.',
  },

  AZ: {
    statewide: false,
    primaryUrl: 'https://mcassessor.maricopa.gov',
    system: 'County Assessor website',
    instructions: `Arizona property records are maintained by County Assessors. Major examples: Maricopa (Phoenix/Scottsdale): mcassessor.maricopa.gov; Pima (Tucson): assessor.pima.gov; Pinal: pinalcountyaz.gov/assessor; Yavapai: assessor.yavapaiaz.gov; Mohave: assessor.mohave.gov. Search by address to find the current owner, Assessor Parcel Number (APN), and property description.`,
    legalDescNote: 'Arizona Claim of Lien requires a description of the property. Use the legal description from the recorded deed at the County Recorder\'s office — many Arizona county recorders have online deed indexes.',
  },

  NJ: {
    statewide: false,
    primaryUrl: 'https://www.njactb.org/taxboard/index.asp',
    system: 'NJ Tax Court Block/Lot Database / County Records',
    instructions: `New Jersey property records are maintained at the county and municipal level. Each municipality has a tax assessor who maintains property ownership records. Search "[Municipality] NJ tax assessor property search" — most NJ municipalities have online property search. You can also search by block and lot number. For county deed records, visit or search the County Clerk's office online deed index — most NJ counties have online access. Example: Bergen County: bergencountyclerk.org; Essex: essexclerk.com; Middlesex: middlesexcountyclerk.org.`,
    legalDescNote: 'New Jersey lien documents must describe the property. The NJ property description typically references the municipality, county, block, lot, and qualifier. Pull from the recorded deed at the County Clerk\'s deed index.',
  },

  MA: {
    statewide: true,
    primaryUrl: 'https://www.masslandrecords.com',
    system: 'Massachusetts Land Records (MassLandRecords.com)',
    instructions: `Go to https://www.masslandrecords.com. Select your county's Registry of Deeds. Search by grantor/grantee name or property address. This covers all Massachusetts county registries. Also check your city or town assessor's database for the current tax-record owner. Search "[City/Town] MA Assessor property search."`,
    legalDescNote: 'Massachusetts requires a Notice of Contract filed at the Registry of Deeds at the start of work. Pull the full legal description from the recorded deed to complete the Notice of Contract and Statement of Account correctly.',
  },

  MD: {
    statewide: true,
    primaryUrl: 'https://sdat.dat.maryland.gov/RealProperty/Pages/default.aspx',
    system: 'Maryland SDAT Real Property Search',
    instructions: `Go to https://sdat.dat.maryland.gov/RealProperty/Pages/default.aspx. Select your county. Search by street address or owner name. SDAT covers all 23 Maryland counties and Baltimore City and shows the current owner of record, deed reference, and property details. This is your primary source.`,
    legalDescNote: 'Use the deed book/page from SDAT to pull the full legal description at your county\'s land records office (Circuit Court land records). Maryland\'s online land records are also available at mdlandrec.net for most counties.',
  },

  TN: {
    statewide: false,
    primaryUrl: 'https://tncomptroller.org/office-of-local-government/property-assessments/county-assessors/',
    system: 'County Assessor of Property',
    instructions: `Tennessee property records are held by County Assessors. Find your county's assessor at https://tncomptroller.org/office-of-local-government/property-assessments/county-assessors/. Major examples: Shelby (Memphis): assessor.shelby.tn.us; Davidson (Nashville): padctn.org; Knox (Knoxville): knoxcounty.org/assessor; Hamilton (Chattanooga): assessoroftaxes.com. Enter the property address to find the owner, parcel ID, and assessed value.`,
    legalDescNote: 'For the legal description, visit or search your county Register of Deeds office online deed index. Search "[County] County Tennessee Register of Deeds online search."',
  },

  SC: {
    statewide: false,
    primaryUrl: 'https://www.sctax.org',
    system: 'County Assessor / Auditor website',
    instructions: `South Carolina property records are held by County Assessors. Find your county's assessor through sctax.org or search "[County] County SC property search." Examples: Greenville: greenvillecounty.org/apps/GIS; Richland (Columbia): rcgov.us/departments/assessor; Charleston: charlestoncounty.org/departments/assessor; Horry (Myrtle Beach): horrycountysc.gov/departments/auditor. Search by address for owner name, parcel number, and property details.`,
    legalDescNote: 'For the legal description, access your county\'s Register of Deeds records. South Carolina lien filings with the Clerk of Court should reference the property description from the recorded deed.',
  },

  MN: {
    statewide: false,
    primaryUrl: 'https://www.revenue.state.mn.us/assessors-offices-and-contact-information',
    system: 'County Assessor website',
    instructions: `Minnesota property records are held by County Assessors. Find your county at https://www.revenue.state.mn.us/assessors-offices-and-contact-information. Examples: Hennepin (Minneapolis): gis.hennepin.us/property; Ramsey (St. Paul): ramsey.limitfocus.com; Dakota: dakotacounty.us/assessor; Anoka: anokacounty.us/assessor; Washington: co.washington.mn.us/assessor. Enter the property address for owner, parcel ID, and assessed value.`,
    legalDescNote: 'For the full legal description, visit or search your county recorder\'s office deed index. Minnesota lien statements require a legal description of the property.',
  },

  WI: {
    statewide: false,
    primaryUrl: 'https://www.sco.wi.gov/Pages/LandInformation/Home.aspx',
    system: 'County Register of Deeds / Municipal Assessor',
    instructions: `Wisconsin property records are maintained by county and municipal assessors. Search "[County] County Wisconsin property search" or "[Municipality] WI assessor property search." The Wisconsin Land Information Portal at sco.wi.gov has links to county GIS systems. Examples: Milwaukee: mclio.com; Dane (Madison): dane.county.com; Waukesha: waukeshacounty.gov/assessor; Brown (Green Bay): co.brown.wi.us/assessor. Enter the address for owner name, parcel ID, and description.`,
    legalDescNote: 'For the full legal description, search your county Register of Deeds. Most Wisconsin counties have online deed indexes. The Wisconsin Claim for Lien should reference the property legal description from the recorded deed.',
  },

  OR: {
    statewide: false,
    primaryUrl: 'https://www.oregon.gov/ODA/programs/Pages/county-assessors.aspx',
    system: 'County Assessor / Tax office',
    instructions: `Oregon property records are held by County Assessors. Find your county at https://www.oregon.gov/ODA/programs/Pages/county-assessors.aspx. Examples: Multnomah (Portland): maps.multco.us/assess; Washington (Beaverton/Hillsboro): assessmenttaxation.co.washington.or.us; Clackamas: clackamas.us/at; Lane (Eugene): lanecounty.org/government/county-departments/assessment-taxation; Jackson (Medford): jacksoncountyor.gov/assessor. Search by address for owner, map/lot (tax lot) number, and assessed value.`,
    legalDescNote: 'Oregon lien laws require the property to be identifiable. Use the tax lot number and the legal description from the county deed records. Many Oregon counties have online deed indexes through the County Clerk or Recorder.',
  },

  NV: {
    statewide: false,
    primaryUrl: 'https://assessor.clarkcountyv.us',
    system: 'County Assessor website',
    instructions: `Nevada property records are held by County Assessors. Examples: Clark (Las Vegas): assessor.clarkcountyv.us; Washoe (Reno): www.washoecounty.gov/assessor; Carson City: carson.org/government/departments-g-z/public-works/assessor; Elko: elkocountynv.net/assessor. Search by address for current owner, Assessor Parcel Number (APN), and property details.`,
    legalDescNote: 'Nevada Notice of Lien requires a description of the property. Pull the full legal description from the County Recorder\'s deed records — most Nevada counties have online deed indexes.',
  },

  CT: {
    statewide: false,
    primaryUrl: 'https://www.ctassessors.com/assessors-directory',
    system: 'Town Tax Assessor website',
    instructions: `Connecticut property records are maintained by Town Assessors (not county). Find your town's assessor at https://www.ctassessors.com/assessors-directory or search "[Town] CT Tax Assessor property search." Examples: Bridgeport: bridgeportct.gov/assessor; Hartford: hartford.gov/assessor; New Haven: newhavenct.gov/assessor; Stamford: stamfordct.gov/assessor. Enter the street address to find the owner, parcel ID, and assessed value.`,
    legalDescNote: 'Connecticut lien documents are filed with the Town Clerk. The legal description (typically volume and page of deed, or map reference) is available from the Town Clerk\'s recorded deed index. Search "[Town] CT Town Clerk land records."',
  },

  UT: {
    statewide: false,
    primaryUrl: 'https://gis.utah.gov/data/cadastre/parcels/',
    system: 'County Assessor / Recorder website',
    instructions: `Utah property records are held by County Assessors and Recorders. Utah has a statewide parcel GIS dataset at gis.utah.gov but for ownership verification use your county's assessor directly. Examples: Salt Lake: slco.org/assessor; Utah (Provo): utahcounty.gov/Dept/Assessor; Davis: daviscountyutah.gov/assessor; Weber (Ogden): webercountyutah.gov/Assessor; Washington (St. George): washco.utah.gov/assessor. Note: Utah requires a Preliminary Notice filed at the State Construction Registry (SCR) — the SCR also has project data at registry.utah.gov.`,
    legalDescNote: 'Utah Notices of Claim require a property description. Pull the legal description from the County Recorder\'s deed records. Most Utah counties have online deed indexes — search "[County] County Utah Recorder deed search."',
  },

  KY: {
    statewide: false,
    primaryUrl: 'https://pva.ky.gov',
    system: 'County PVA (Property Valuation Administrator)',
    instructions: `Kentucky property records are maintained by County Property Valuation Administrators (PVAs). Find your county's PVA at https://pva.ky.gov. Each county has its own online search portal. Examples: Jefferson (Louisville): jeffersonpva.ky.gov; Fayette (Lexington): fayettepva.com; Kenton: kentoncounty.org/pva; Boone: boonepva.com; Warren (Bowling Green): warrenpva.com. Search by address for owner name, parcel number, and assessed value.`,
    legalDescNote: 'For the full legal description, visit your county Clerk\'s deed records. Most Kentucky county clerk offices have online deed indexes. Search "[County] County Kentucky Clerk deed records."',
  },

  LA: {
    statewide: false,
    primaryUrl: 'https://www.latax.state.la.us',
    system: 'Parish Assessor website',
    instructions: `Louisiana property records are held by Parish Assessors (Louisiana uses "parishes" not "counties"). Find your parish assessor through https://www.latax.state.la.us or search "[Parish] Parish Louisiana Assessor property search." Examples: Jefferson Parish: jpso.us/assessor; Orleans (New Orleans): nolaassessor.com; St. Tammany: stpao.org; East Baton Rouge: ebrpa.org; Caddo (Shreveport): caddoassessor.org. Enter the property address for the current owner, parcel ID, and assessment details.`,
    legalDescNote: 'Louisiana uses "Statements of Claim or Privilege" recorded with the Parish Recorder (Clerk of Court). For the legal description, search your parish\'s clerk of court deed index. Many parishes use LouisianaCourtConnect or similar systems.',
  },

  MO: {
    statewide: false,
    primaryUrl: 'https://stlouis-mo.gov/government/departments/assessor',
    system: 'County Assessor / Collector website',
    instructions: `Missouri property records are held by County Assessors. Search "[County] County Missouri Assessor property search." Examples: St. Louis County: stlouisco.com/assessor; Jackson (Kansas City): jacksongov.org/assessor; St. Charles: sccmo.org/assessor; Greene (Springfield): assessor.greenecountymo.gov. Note: St. Louis City is independent of St. Louis County — use stlouis-mo.gov/government/departments/assessor for city properties.`,
    legalDescNote: 'For the legal description, access your county Recorder of Deeds deed index. Most Missouri counties have online deed searches. Search "[County] County Missouri Recorder of Deeds online search."',
  },

  OK: {
    statewide: false,
    primaryUrl: 'https://oklahoma.gov/content/oklahoma/en/counties.html',
    system: 'County Assessor website',
    instructions: `Oklahoma property records are held by County Assessors. Find your county through https://oklahoma.gov/content/oklahoma/en/counties.html. Examples: Oklahoma County (OKC): assessor.oklahomacounty.org; Tulsa: assessor.tulsacounty.org; Cleveland (Norman/Moore): clevelandcountyassessor.com; Canadian (Yukon/Mustang): canadiancountyassessor.com. Search by address for the current owner, parcel number, and legal description.`,
    legalDescNote: 'For the full legal description, check your county Clerk\'s deed records. Oklahoma\'s lien statute requires a general description of property. Pull the deed description from the County Clerk\'s index.',
  },

  NM: {
    statewide: false,
    primaryUrl: 'https://www.tax.newmexico.gov/businesses/property-tax-division/county-assessors-contact-information/',
    system: 'County Assessor website',
    instructions: `New Mexico property records are held by County Assessors. Find your county at https://www.tax.newmexico.gov/businesses/property-tax-division/county-assessors-contact-information/. Examples: Bernalillo (Albuquerque): bernco.gov/assessor; Dona Ana (Las Cruces): donaanacounty.org/assessor; Santa Fe: santafecountynm.gov/assessor; Sandoval: sandovalcounty.org/assessor. Enter the address for owner, parcel number, and property details.`,
    legalDescNote: 'New Mexico Claim of Lien requires a property description. Pull the legal description from the County Clerk\'s recorded deed. Many New Mexico counties have online deed indexes at their county clerk websites.',
  },

  AL: {
    statewide: false,
    primaryUrl: 'https://www.revenue.alabama.gov/division/property-tax/county-tax-offices/',
    system: 'County Revenue Commissioner / Assessor website',
    instructions: `Alabama property records are held by County Revenue Commissioners (also called Assessors). Find your county at https://www.revenue.alabama.gov/division/property-tax/county-tax-offices/. Examples: Jefferson (Birmingham): jccal.org/revenue; Madison (Huntsville): madisoncountyal.gov/tax-assessor; Mobile: mobilecountyal.gov/government/departments/revenue-commissioner; Shelby: shelbyal.com/revenue. Enter the property address to find the current owner, parcel ID, and assessed value.`,
    legalDescNote: 'Alabama property records are maintained at the County Probate Judge\'s office for deed recording. For the legal description, access your county Probate Judge\'s deed index. Search "[County] County Alabama Probate Judge deed records."',
  },

  AK: {
    statewide: false,
    primaryUrl: 'https://dnr.alaska.gov/ssd/recoff/findRecOff.cfm',
    system: 'Recording District Office / Municipal Assessor',
    instructions: `Alaska property records are maintained by Recording Districts (not counties). Find your Recording District at https://dnr.alaska.gov/ssd/recoff/findRecOff.cfm. For Anchorage properties: Municipality of Anchorage Assessor at muni.org/departments/finance/assessor. For Fairbanks: fairbanksnorthstarborough.gov/assessor. For Juneau: juneau.org/finance/assessor. For smaller areas, contact the Recording District directly.`,
    legalDescNote: 'For the legal description, search your Recording District\'s deed index. The Alaska Recording Office has an online system at dnr.alaska.gov for many districts.',
  },

  AR: {
    statewide: false,
    primaryUrl: 'https://www.saline.ar.gov/assessor.html',
    system: 'County Assessor website',
    instructions: `Arkansas property records are held by County Assessors. Search "[County] County Arkansas Assessor property search." Examples: Pulaski (Little Rock): pulaskiassessor.org; Benton (Bentonville/Fayetteville): bentoncountyar.gov/assessor; Washington (Fayetteville): co.washington.ar.us/assessor; Sebastian (Fort Smith): sebastiancountyonline.com/assessor. Enter the property address for owner, parcel number, and assessed value.`,
    legalDescNote: 'For the legal description, access your county Circuit Clerk\'s deed index. Arkansas Lien Accounts must identify the property. Search "[County] County Arkansas Circuit Clerk deed records."',
  },

  DE: {
    statewide: false,
    primaryUrl: 'https://assessment.newcastlede.gov',
    system: 'County Assessment Office',
    instructions: `Delaware has only 3 counties. New Castle (Wilmington/Newark): assessment.newcastlede.gov; Kent (Dover): co.kent.de.us/assessments; Sussex (Rehoboth/Lewes/Georgetown): sussexcountydes.maps.arcgis.com or sussexcountyde.gov/departments/assessments. Enter the property address to find the current owner, parcel ID (Parcel No.), and assessed value.`,
    legalDescNote: 'Delaware lien actions are filed in Superior Court. The legal description from the recorded deed is needed. Access deed records through the Delaware Department of State Recorder of Deeds: delaware.gov/recorder-of-deeds.',
  },

  ID: {
    statewide: false,
    primaryUrl: 'https://tax.idaho.gov/taxes/property-tax/county-assessors/',
    system: 'County Assessor website',
    instructions: `Idaho property records are held by County Assessors. Find your county at https://tax.idaho.gov/taxes/property-tax/county-assessors/. Examples: Ada (Boise): adacounty.id.gov/assessor; Canyon (Nampa/Caldwell): canyonco.org/assessor; Kootenai (Coeur d'Alene): kcgov.us/assessor; Bonneville (Idaho Falls): co.bonneville.id.us/departments/assessor. Enter the address for owner, parcel number, and assessed value.`,
    legalDescNote: 'For the legal description, visit or search your county Recorder\'s deed index. Most Idaho counties have online deed records. Search "[County] County Idaho Recorder deed search."',
  },

  IA: {
    statewide: false,
    primaryUrl: 'https://tax.iowa.gov/property',
    system: 'Iowa Department of Revenue Property Tax / County Assessor',
    instructions: `Iowa property records are held by County Assessors. The Iowa Department of Revenue has a property tax resource at https://tax.iowa.gov/property. Search "[County] County Iowa Assessor property search." Examples: Polk (Des Moines): assessor.polkcountyiowa.gov; Linn (Cedar Rapids): linncountyiowa.gov/assessor; Scott (Davenport): assessor.scottcountyiowa.com; Johnson (Iowa City): johnsoncountyiowa.gov/assessor. Enter address for owner, parcel ID, and assessed value.`,
    legalDescNote: 'For the full legal description, access your county Recorder\'s deed index. Most Iowa counties have online deed records through their county websites or through ILTCO (Iowa Land Transfer and Collection Organization). Search "[County] County Iowa Recorder deed records."',
  },

  KS: {
    statewide: false,
    primaryUrl: 'https://www.ksrevenue.gov/propertyvaluations.html',
    system: 'County Appraiser website',
    instructions: `Kansas property records are held by County Appraisers. Find your county at https://www.ksrevenue.gov/propertyvaluations.html. Examples: Johnson (Overland Park/Olathe): jocogov.org/dept/appraiser; Sedgwick (Wichita): sedgwickcounty.org/appraiser; Wyandotte (Kansas City, KS): wycokck.org/appraiser; Douglas (Lawrence): douglas-county.com/appraiser. Enter address for owner, parcel ID, and assessed value.`,
    legalDescNote: 'For the full legal description, search your county Register of Deeds. Kansas Lien Statements must describe the property. Most Kansas counties have online deed indexes. Search "[County] County Kansas Register of Deeds online."',
  },

  ME: {
    statewide: false,
    primaryUrl: 'https://www.maine.gov/cgi-bin/online/real_estate/index.pl',
    system: 'Maine Registry of Deeds / Municipal Assessor',
    instructions: `Maine property records are maintained by County Registries of Deeds and municipal assessors. The Maine Registry of Deeds online system at https://www.maine.gov/cgi-bin/online/real_estate/index.pl links to county registries. For ownership (tax records), search your municipal assessor — most Maine towns and cities have online assessor databases. Search "[Town/City] Maine Assessor property search." Examples: Portland: portlandmaine.gov/assessor; Bangor: bangormaine.gov/assessor.`,
    legalDescNote: 'For the full legal description, use your county Registry of Deeds. Maine counties: Androscoggin, Aroostook, Cumberland, Franklin, Hancock, Kennebec, Knox, Lincoln, Oxford, Penobscot, Piscataquis, Sagadahoc, Somerset, Waldo, Washington, York. Most have online deed indexes.',
  },

  MS: {
    statewide: false,
    primaryUrl: 'https://www.mstc.state.ms.us/taxareas/property/main.htm',
    system: 'County Tax Assessor/Collector website',
    instructions: `Mississippi property records are held by County Tax Assessors/Collectors. Find your county at https://www.mstc.state.ms.us/taxareas/property/main.htm. Search "[County] County Mississippi Tax Assessor property search." Examples: Hinds (Jackson): co.hinds.ms.us/assessor; Harrison (Biloxi/Gulfport): co.harrison.ms.us/assessor; DeSoto (Southaven): desotoms.com/assessor; Rankin (Brandon): rankincounty.org/assessor. Enter address for owner, parcel ID, and assessed value.`,
    legalDescNote: 'For the legal description, access your county Circuit Clerk\'s deed index. Mississippi mechanics lien documents need adequate property description. Search "[County] County Mississippi Chancery Clerk deed records."',
  },

  MT: {
    statewide: false,
    primaryUrl: 'https://gis.mt.gov/msl/MTPublicLandSurvey',
    system: 'Montana Department of Revenue / County Assessor',
    instructions: `Montana property records are maintained by the Montana Department of Revenue and county assessors. The Montana Cadastral mapping system at https://svc.mt.gov/msl/mtcadastral shows parcel ownership statewide. Go to svc.mt.gov/msl/mtcadastral, search by address, and click on the parcel for owner name, parcel number, and legal description. This is the most useful statewide Montana resource.`,
    legalDescNote: 'The Montana Cadastral system shows the legal description for most parcels. For deed-of-record ownership and the full instrument, visit your county Clerk and Recorder\'s deed index. Search "[County] County Montana Clerk and Recorder deed records."',
  },

  ND: {
    statewide: false,
    primaryUrl: 'https://www.tax.nd.gov/property-tax/county-assessors',
    system: 'County Recorder / Assessor website',
    instructions: `North Dakota property records are held by County Recorders and Assessors. Find your county at https://www.tax.nd.gov/property-tax/county-assessors. Examples: Cass (Fargo): casscountynd.gov/recorder; Burleigh (Bismarck): burleighco.com/recorder; Grand Forks: grandforksgov.com/assessor; Ward (Minot): wardnd.com/departments/assessor. Enter the property address for owner, parcel number, and assessed value.`,
    legalDescNote: 'For the full legal description, search your county Recorder\'s deed index. North Dakota Mechanic\'s Lien documents must describe the property. Search "[County] County North Dakota Recorder deed records."',
  },

  NE: {
    statewide: false,
    primaryUrl: 'https://www.revenue.nebraska.gov/PAD/list_of_assessors.html',
    system: 'County Assessor website',
    instructions: `Nebraska property records are held by County Assessors. Find your county at https://www.revenue.nebraska.gov/PAD/list_of_assessors.html. Examples: Douglas (Omaha): assessor.douglascounty-ne.gov; Sarpy (Papillion/Bellevue): sarpy.com/assessor; Lancaster (Lincoln): lancaster.ne.gov/assessor; Hall (Grand Island): hallcountyne.gov/assessor. Enter the property address for current owner, parcel ID, and assessed value.`,
    legalDescNote: 'For the full legal description, access your county Register of Deeds deed index. Most Nebraska counties have online deed records. Search "[County] County Nebraska Register of Deeds online search."',
  },

  NH: {
    statewide: false,
    primaryUrl: 'https://www.nh.gov/tax/assessors',
    system: 'Town/City Assessor website',
    instructions: `New Hampshire property records are maintained by Town and City Assessors (not counties). Search "[Town/City] NH Assessor property search." Examples: Manchester: manchesternh.gov/assessor; Nashua: nashuanh.gov/assessor; Concord: concordnh.gov/assessor; Derry: derry.nh.gov/assessor. Also note: New Hampshire mechanics liens arise automatically and are enforced through Superior Court — verify property ownership through the town assessor and the county Registry of Deeds.`,
    legalDescNote: 'For deed-of-record ownership and the full legal description, search your county Registry of Deeds. New Hampshire has 10 counties, each with a Registry of Deeds. Search "[County] County New Hampshire Registry of Deeds."',
  },

  RI: {
    statewide: false,
    primaryUrl: 'https://www.rilawyers.org/public-resources/county-registry-of-deeds/',
    system: 'City/Town Tax Assessor / County Superior Court Records',
    instructions: `Rhode Island property records are maintained by City and Town Tax Assessors and County Superior Court recording systems. Search "[City/Town] RI Tax Assessor property search." Note: Rhode Island mechanics liens require a Notice of Intention filed in Superior Court BEFORE work begins. For ownership verification, use your town assessor's online database plus the county Superior Court deed index. Providence: providenceri.gov/assessor; Cranston: cranstonri.com/assessor; Warwick: warwickri.gov/assessor.`,
    legalDescNote: 'Rhode Island has 5 counties — Providence, Kent, Newport, Washington, and Bristol. Each county has Superior Court deed records. Search "[County] County Rhode Island Superior Court land records."',
  },

  SD: {
    statewide: false,
    primaryUrl: 'https://dor.sd.gov/individuals/property-tax/county-directors-of-equalization/',
    system: 'County Director of Equalization (Assessor) website',
    instructions: `South Dakota property records are held by County Directors of Equalization (the assessor function). Find your county at https://dor.sd.gov/individuals/property-tax/county-directors-of-equalization/. Examples: Minnehaha (Sioux Falls): minnehahacounty.org/dept/auditor/doe; Pennington (Rapid City): pennco.org/departments/equalization; Lincoln: lincolncountysd.org/equalization; Brown (Aberdeen): brown.sd.us/equalization. Enter the address for owner, parcel number, and assessed value.`,
    legalDescNote: 'For the full legal description, search your county Register of Deeds deed index. South Dakota Mechanic\'s Lien filings are with the Circuit Court Clerk. Search "[County] County South Dakota Register of Deeds online."',
  },

  VT: {
    statewide: false,
    primaryUrl: 'https://www.vtpic.com',
    system: 'Vermont Property Information Center / Town Clerk',
    instructions: `Vermont property records are maintained by Town Clerks (Vermont uses towns, not counties). The Vermont Property Information Center at https://www.vtpic.com provides statewide property data aggregated from town records — search by address for owner, parcel ID, and grand list value. For deed of record, search your town's online land records or visit the Town Clerk directly. Examples: Burlington: burlingtonvt.gov/assessor; South Burlington: southburlingtonvt.gov/assessor.`,
    legalDescNote: 'Vermont Notice of Lien is filed with the Town Clerk. For the property description (lot number, survey reference), access the Town Clerk\'s recorded deed index. Most Vermont towns have deed records through vtpic.com or their own town websites.',
  },

  WY: {
    statewide: false,
    primaryUrl: 'https://revenue.wyo.gov/property-tax-division/county-assessors',
    system: 'County Assessor website',
    instructions: `Wyoming property records are held by County Assessors. Find your county at https://revenue.wyo.gov/property-tax-division/county-assessors. Examples: Laramie (Cheyenne): laramiecounty.com/assessor; Natrona (Casper): natrona.net/assessor; Campbell (Gillette): campbellcounty.com/assessor; Sweetwater (Rock Springs): sweet.wy.us/assessor; Teton (Jackson Hole): tetoncountywy.gov/assessor. Enter the property address for owner, parcel number, and assessed value.`,
    legalDescNote: 'For the full legal description, search your county Clerk\'s deed index. Wyoming Mechanic\'s Lien must describe the property. Search "[County] County Wyoming Clerk deed records."',
  },

};


/**
 * buildPropertyLookupBlock
 *
 * Returns the formatted property lookup instruction block for injection
 * into Document 3 (Filing Instructions) of any state's generated documents.
 *
 * @param {string} stateCode       - e.g. 'MI', 'CA', 'TX'
 * @param {string} propertyCounty  - e.g. 'Oakland'
 * @returns {string}               - Formatted instruction block for the AI prompt
 */
function buildPropertyLookupBlock(stateCode, propertyCounty) {
  const lookup = PROPERTY_LOOKUP[stateCode];

  if (!lookup) {
    return `PROPERTY OWNER VERIFICATION:
Before filing, verify the current property owner using the ${propertyCounty} County property records system. Search by property address at the county assessor's or recorder's website to confirm the owner name, parcel ID, and legal description. Use the exact owner name as shown in official county records.`;
  }

  return `PROPERTY OWNER VERIFICATION — ${lookup.system.toUpperCase()}:

${lookup.instructions}

LEGAL DESCRIPTION:
${lookup.legalDescNote}

CRITICAL: The property owner name on the lien document must match the owner of record in the official county/state property records exactly. Do not use a name from a business card, contract, or verbal source — verify it from the public records system above before filing.`;
}


export { PROPERTY_LOOKUP, buildPropertyLookupBlock };
