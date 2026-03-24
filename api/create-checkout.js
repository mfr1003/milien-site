const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body;
  const isAuto = body.workType === 'automotive';

  const basePrice = body.packageType === 'demand' ? 9700 : 19700;
  const rushSurcharge = body.rushRequired ? Math.round(basePrice * 0.5) : 0;
  const filingFee = (body.filingCoordination === 'true' && body.packageType !== 'demand') ? 7500 : 0;
  const totalPrice = basePrice + rushSurcharge + filingFee;

  const packageLabel = isAuto
    ? "Michigan Garage Keeper's Lien Package"
    : body.packageType === 'demand'
      ? 'LodgeMiLien Demand Letter'
      : 'LodgeMiLien Full Lien Package';

  const description = isAuto
    ? `Garage Keeper's Lien documents — ${body.vehicleDescription} — VIN: ${body.vin}`
    : `Mechanics lien documents for ${body.propertyAddress}, ${body.propertyCity} — ${body.propertyCounty} County`;

  const customerEmail = body.claimantEmail;

  // Build metadata — Stripe has a 500 char limit per value and 50 key limit
  const metadata = isAuto ? {
    workType: 'automotive',
    stateCode: 'MI',
    vehicleDescription: body.vehicleDescription || '',
    vin: body.vin || '',
    ownerName: body.ownerName || '',
    ownerAddress: body.ownerAddress || '',
    dateLast: body.dateLast || '',
    amountOwed: body.amountOwed || '',
    workDescription: body.workDescription || '',
    claimantName: body.claimantName || '',
    claimantAddress: body.claimantAddress || '',
    claimantPhone: body.claimantPhone || '',
    claimantEmail: body.claimantEmail || '',
    licenseNumber: body.licenseNumber || '',
    packageType: body.packageType || 'full',
    rushRequired: body.rushRequired ? 'true' : 'false',
    proofUrl: body.proofUrl || '',
  } : {
    workType: 'construction',
    stateCode: body.stateCode || 'MI',
    role: body.role || '',
    projectType: body.projectType || 'commercial',
    propertyAddress: body.propertyAddress || '',
    propertyCity: body.propertyCity || '',
    propertyCounty: body.propertyCounty || '',
    ownerName: body.ownerName || '',
    ownerAddress: body.ownerAddress || '',
    dateFirst: body.dateFirst || '',
    dateLast: body.dateLast || '',
    amountOwed: body.amountOwed || '',
    workDescription: body.workDescription || '',
    claimantName: body.claimantName || '',
    claimantAddress: body.claimantAddress || '',
    claimantPhone: body.claimantPhone || '',
    claimantEmail: body.claimantEmail || '',
    packageType: body.packageType || 'full',
    filingCoordination: body.filingCoordination || 'false',
    rushRequired: body.rushRequired ? 'true' : 'false',
    proofUrl: body.proofUrl || '',
  };
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: packageLabel, description },
            unit_amount: totalPrice,
          },
          quantity: 1,
        },
        ...(body.rushRequired ? [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Rush Processing (50% surcharge)',
              description: 'Priority processing within 4 business hours',
            },
            unit_amount: rushSurcharge,
          },
          quantity: 1,
        }] : []),
        ...(filingFee > 0 ? [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Filing Coordination',
              description: 'We coordinate notarization and file with the county Register of Deeds on your behalf',
            },
            unit_amount: filingFee,
          },
          quantity: 1,
        }] : []),
      ],
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}`,
      customer_email: customerEmail,
      metadata,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
