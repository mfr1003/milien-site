import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { blobs } = await list({ prefix: 'rejected/' });
    const orders = [];

    await Promise.all(blobs.map(async (blob) => {
      try {
        const r = await fetch(blob.url);
        const order = await r.json();
        orders.push(order);
      } catch {}
    }));

    orders.sort((a, b) => new Date(b.rejectedAt) - new Date(a.rejectedAt));

    return res.status(200).json({ orders });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
