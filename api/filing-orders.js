import { list, put } from '@vercel/blob';

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    // List all filing coordination orders from completed/ blob
    try {
      const { blobs } = await list({ prefix: 'completed/' });
      const orders = [];

      await Promise.all(blobs.map(async (blob) => {
        try {
          const res2 = await fetch(blob.url);
          const order = await res2.json();
          if (order.metadata?.filingCoordination === 'true') {
            orders.push(order);
          }
        } catch {}
      }));

      // Sort by completedAt descending
      orders.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

      return res.status(200).json({ orders });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    // Update filing status for an order
    const { sessionId, filingStatus, trackingNumber, notes } = req.body;
    if (!sessionId || !filingStatus) {
      return res.status(400).json({ error: 'sessionId and filingStatus required' });
    }

    try {
      const { blobs } = await list({ prefix: `completed/${sessionId}` });
      if (!blobs || blobs.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const orderRes = await fetch(blobs[0].url);
      const orderData = await orderRes.json();

      const updated = {
        ...orderData,
        filingStatus,
        filingUpdatedAt: new Date().toISOString(),
        ...(trackingNumber && { trackingNumber }),
        ...(notes && { filingNotes: notes }),
      };

      await put(
        `completed/${sessionId}.json`,
        JSON.stringify(updated),
        { access: 'public', contentType: 'application/json' }
      );

      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
