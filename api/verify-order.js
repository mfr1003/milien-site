import Anthropic from '@anthropic-ai/sdk';
import { list } from '@vercel/blob';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── BS&A County UID Map ───────────────────────────────────────────────────────
// County-level BS&A portal UIDs for direct deep-linking (Option C).
// Unlisted counties fall back to Google search.
const BSA_COUNTY_UIDS = {
  'Alcona': '6',
  'Alger': '7',
  'Allegan': '380',
  'Alpena': '10',
  'Antrim': '11',
  'Arenac': '12',
  'Baraga': '13',
  'Barry': '14',
  'Bay': '15',
  'Benzie': '16',
  'Berrien': '17',
  'Branch': '18',
  'Calhoun': '19',
  'Cass': '20',
  'Charlevoix': '21',
  'Cheboygan': '22',
  'Chippewa': '1961',
  'Clare': '24',
  'Clinton': '25',
  'Crawford': '26',
  'Delta': '27',
  'Dickinson': '28',
  'Eaton': '29',
  'Emmet': '30',
  'Genesee': '31',
  'Gladwin': '32',
  'Gogebic': '33',
  'Grand Traverse': '34',
  'Gratiot': '35',
  'Hillsdale': '36',
  'Houghton': '37',
  'Huron': '38',
  'Ingham': '383',
  'Ionia': '40',
  'Iosco': '41',
  'Iron': '42',
  'Isabella': '43',
  'Jackson': '44',
  'Kalamazoo': '45',
  'Kalkaska': '46',
  'Kent': '47',
  'Keweenaw': '48',
  'Lake': '49',
  'Lapeer': '50',
  'Leelanau': '51',
  'Lenawee': '52',
  'Livingston': '53',
  'Luce': '54',
  'Mackinac': '55',
  'Macomb': '113',
  'Manistee': '57',
  'Marquette': '58',
  'Mason': '59',
  'Mecosta': '60',
  'Menominee': '61',
  'Midland': '62',
  'Missaukee': '63',
  'Monroe': '64',
  'Montcalm': '65',
  'Montmorency': '66',
  'Muskegon': '67',
  'Newaygo': '68',
  'Oakland': '69',
  'Oceana': '70',
  'Ogemaw': '71',
  'Ontonagon': '72',
  'Osceola': '73',
  'Oscoda': '74',
  'Otsego': '75',
  'Ottawa': '76',
  'Presque Isle': '77',
  'Roscommon': '78',
  'Saginaw': '79',
  'Sanilac': '80',
  'Schoolcraft': '81',
  'Shiawassee': '82',
  'St. Clair': '83',
  'St. Joseph': '84',
  'Tuscola': '85',
  'Van Buren': '86',
  'Washtenaw': '87',
  'Wayne': null, // Wayne uses waynecountylandrecords.com
  'Wexford': '89',
};

function getBsaLink(county, address, city) {
  const cleanCounty = county.replace(' County', '').trim();

  // Wayne County has its own portal
  if (cleanCounty === 'Wayne') {
    const query = encodeURIComponent(`${address} ${city}`);
    return {
      label: 'Wayne County Land Records',
      url: `https://waynecountylandrecords.com/recorder/web/`,
      note: 'Search by address at Wayne County Land Records',
    };
  }

  const uid = BSA_COUNTY_UIDS[cleanCounty];
  if (uid) {
    return {
      label: `${cleanCounty} County — BS&A Online`,
      url: `https://bsaonline.com/?uid=${uid}`,
      note: `Search by address at this county\'s BS&A portal`,
    };
  }

  // Fallback: Google search
  const query = encodeURIComponent(`${address} ${city} ${cleanCounty} County Michigan property owner site:bsaonline.com OR site:michigan.gov`);
  return {
    label: 'Search Public Records',
    url: `https://www.google.com/search?q=${query}`,
    note: 'Google search for public property records',
  };
}

// ── NHTSA VIN Decode ──────────────────────────────────────────────────────────
async function decodeVin(vin) {
  const res = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin.trim()}?format=json`,
    { signal: AbortSignal.timeout(8000) }
  );
  if (!res.ok) throw new Error(`NHTSA API error: ${res.status}`);
  const data = await res.json();
  const vars = data.Results || [];

  const get = (name) => {
    const v = vars.find(x => x.Variable === name);
    return v && v.Value && v.Value !== 'Not Applicable' ? v.Value : null;
  };

  return {
    year: get('Model Year'),
    make: get('Make'),
    model: get('Model'),
    trim: get('Trim'),
    bodyType: get('Body Class'),
    vehicleType: get('Vehicle Type'),
    errorCode: get('Error Code'),
    errorText: get('Error Text'),
  };
}

// ── Claude Web Search for Property Owner ──────────────────────────────────────
async function lookupPropertyOwner(address, city, county) {
  const prompt = `Find the current property owner name and legal description for this Michigan property:
Address: ${address}
City: ${city}
County: ${county} County, Michigan

Search BS&A Online, county assessor records, or any public Michigan property database.
Return ONLY a valid JSON object with these exact keys:
{
  "ownerName": "string or null",
  "legalDescription": "string or null",
  "parcelId": "string or null",
  "source": "string describing where you found the information"
}
If you cannot find the information, return null values with a source explaining why.`;

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 800,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages: [{ role: 'user', content: prompt }],
  });

  // Extract text from response (may be after tool use blocks)
  const textBlocks = message.content.filter(b => b.type === 'text');
  if (!textBlocks.length) return null;

  const raw = textBlocks[textBlocks.length - 1].text;

  // Parse JSON from response
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return { ownerName: null, legalDescription: null, parcelId: null, source: raw.substring(0, 200) };

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    return { ownerName: null, legalDescription: null, parcelId: null, source: 'Parse error — ' + raw.substring(0, 150) };
  }
}

// ── Main Handler ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

  try {
    // Fetch order from blob
    const { blobs } = await list({ prefix: `orders/${sessionId}` });
    if (!blobs || blobs.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const blobRes = await fetch(blobs[0].url);
    const order = await blobRes.json();
    const m = order.metadata || {};

    const isAuto = m.workType === 'automotive';

    if (isAuto) {
      // ── Automotive: VIN decode ──
      const vin = m.vin;
      if (!vin) return res.status(400).json({ error: 'No VIN on order' });

      const decoded = await decodeVin(vin);

      // Check if VIN result matches customer-submitted vehicle description
      const submittedDesc = (m.vehicleDescription || '').toLowerCase();
      const yearMatch = decoded.year && submittedDesc.includes(decoded.year);
      const makeMatch = decoded.make && submittedDesc.toLowerCase().includes(decoded.make.toLowerCase());
      const modelMatch = decoded.model && submittedDesc.toLowerCase().includes(decoded.model.toLowerCase());
      const confidence = [yearMatch, makeMatch, modelMatch].filter(Boolean).length;

      return res.status(200).json({
        type: 'automotive',
        vin,
        decoded,
        submittedDescription: m.vehicleDescription,
        confidence, // 0-3: how many of year/make/model match submitted description
        mdosLink: {
          label: 'MDOS Title Search (Manual)',
          url: 'https://sos.state.mi.us/1607_28753_7,4670_28796.00.html',
          note: 'MDOS title/lienholder lookup requires dealer or government account',
        },
      });
    } else {
      // ── Construction: property owner lookup ──
      const address = m.propertyAddress;
      const city = m.propertyCity;
      const county = m.propertyCounty;

      if (!address || !county) {
        return res.status(400).json({ error: 'Missing address or county on order' });
      }

      const [propertyData, bsaLink] = await Promise.all([
        lookupPropertyOwner(address, city, county),
        Promise.resolve(getBsaLink(county, address, city)),
      ]);

      return res.status(200).json({
        type: 'construction',
        address,
        city,
        county,
        propertyData,
        bsaLink,
        googleLink: {
          label: 'Google Property Search',
          url: `https://www.google.com/search?q=${encodeURIComponent(`"${address}" "${county} County" Michigan property owner records`)}`,
        },
      });
    }
  } catch (err) {
    console.error('Verify error:', err);
    return res.status(500).json({ error: err.message });
  }
}
