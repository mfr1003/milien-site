import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { sessionId, prefix } = req.query;
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID required' });
  }

  const folder = prefix === 'completed' ? 'completed' : 'orders';

  try {
    const { blobs } = await list({ prefix: `${folder}/${sessionId}` });
    if (!blobs || blobs.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const response = await fetch(blobs[0].url);
    if (!response.ok) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderData = await response.json();
    res.status(200).json(orderData);
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ error: 'Failed to fetch order: ' + err.message });
  }
}
