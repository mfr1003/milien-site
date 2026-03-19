const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
 
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
 
  const {
    role,
    propertyAddress,
    propertyCity,
    propertyCounty,
    ownerName,
    ownerAddress,
    dateFirst,
    dateLast,
    amountOwed,
    workDescription,
    claimantName,
    claimantAddress,
    claimantPhone,
    claimantEmail,
    packageType,
    rushRequired
  } = req.body;
 
  const basePrice = packageType === 'demand' ? 9700 : 19700;
  const rushSurcharge = rushRequired ? Math.round(basePrice * 0.5) : 0;
  const totalPrice = basePrice + rushSurcharge;
 
  const packageLabel = packageType === 'demand'
    ? 'MiLien Demand Letter'
    : 'MiLien Full Lien Package';
 
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: packageLabel,
              description: `Michigan mechanics lien documents for ${propertyAddress}, ${propertyCity} — ${propertyCounty} County`,
            },
            unit_amount: totalPrice,
          },
          quantity: 1,
        },
        ...(rushRequired ? [{
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
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}`,
      customer_email: claimantEmail,
      metadata: {
        role,
        propertyAddress,
        propertyCity,
        propertyCounty,
        ownerName,
        ownerAddress,
        dateFirst,
        dateLast,
        amountOwed,
        workDescription,
        claimantName,
        claimantAddress,
        claimantPhone,
        claimantEmail,
        packageType,
        rushRequired: rushRequired ? 'true' : 'false',
      },
    });
 
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
 
