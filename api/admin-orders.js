import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const sessions = await stripe.checkout.sessions.list({
      limit: 50,
      expand: ['data.payment_intent'],
    });

    const orders = sessions.data
      .filter(s => s.payment_status === 'paid')
      .map(s => ({
        id: s.id,
        created: new Date(s.created * 1000).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        }),
        customer: s.metadata?.claimantName || 'Unknown',
        email: s.metadata?.claimantEmail || s.customer_email,
        phone: s.metadata?.claimantPhone || '',
        property: `${s.metadata?.propertyAddress || ''}, ${s.metadata?.propertyCity || ''}`,
        county: s.metadata?.propertyCounty || '',
        amount: s.metadata?.amountOwed || '',
        package: s.metadata?.packageType || '',
        rush: s.metadata?.rushRequired === 'true',
        total: (s.amount_total / 100).toFixed(2),
        dateLast: s.metadata?.dateLast || '',
      }));

    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}
