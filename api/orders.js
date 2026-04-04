import { list } from '@vercel/blob';

// Handles both pending and completed order lists
// GET /api/orders?type=pending   — orders awaiting review
// GET /api/orders?type=completed — approved and sent orders

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const type = req.query.type;

  if (type === 'pending') {
    try {
      const { blobs } = await list({ prefix: 'orders/' });
      const orders = [];

      await Promise.all(blobs.map(async (blob) => {
        try {
          const r = await fetch(blob.url);
          const order = await r.json();
          orders.push({
            sessionId: blob.pathname.replace('orders/', '').replace('.json', ''),
            paidAt: order.paidAt,
            metadata: order.metadata || {},
          });
        } catch {}
      }));

      orders.sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));
      return res.status(200).json({ orders });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (type === 'completed') {
    try {
      const { blobs } = await list({ prefix: 'completed/' });
      const orders = [];

      await Promise.all(blobs.map(async (blob) => {
        try {
          const r = await fetch(blob.url);
          const order = await r.json();
          orders.push({
            sessionId: blob.pathname.replace('completed/', '').replace('.json', ''),
            paidAt: order.paidAt,
            completedAt: order.completedAt,
            emailSentTo: order.emailSentTo,
            metadata: order.metadata || {},
          });
        } catch {}
      }));

      orders.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
      return res.status(200).json({ orders });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(400).json({ error: 'type parameter required: pending or completed' });
}
