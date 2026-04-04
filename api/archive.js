import { list, put } from '@vercel/blob';

// Handles both filing queue and rejected orders
// GET  /api/archive?type=filing   — filing coordination orders
// GET  /api/archive?type=rejected — rejected orders
// POST /api/archive               — update filing status (filing queue only)

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const type = req.query.type;

    if (type === 'rejected') {
      try {
        const { blobs } = await list({ prefix: 'rejected/' });
        const orders = [];
        await Promise.all(blobs.map(async (blob) => {
          try {
            const r = await fetch(blob.url);
            orders.push(await r.json());
          } catch {}
        }));
        orders.sort((a, b) => new Date(b.rejectedAt) - new Date(a.rejectedAt));
        return res.status(200).json({ orders });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    if (type === 'filing') {
      try {
        const { blobs } = await list({ prefix: 'completed/' });
        const orders = [];
        await Promise.all(blobs.map(async (blob) => {
          try {
            const r = await fetch(blob.url);
            const order = await r.json();
            if (order.metadata?.filingCoordination === 'true') orders.push(order);
          } catch {}
        }));
        orders.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
        return res.status(200).json({ orders });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    return res.status(400).json({ error: 'type parameter required: filing or rejected' });
  }

  if (req.method === 'POST') {
    // Update filing status
    const { sessionId, filingStatus, trackingNumber, notes } = req.body;
    if (!sessionId || !filingStatus) {
      return res.status(400).json({ error: 'sessionId and filingStatus required' });
    }
    try {
      const { blobs } = await list({ prefix: `completed/${sessionId}` });
      if (!blobs || blobs.length === 0) return res.status(404).json({ error: 'Order not found' });

      const orderRes = await fetch(blobs[0].url);
      const orderData = await orderRes.json();

      await put(
        `completed/${sessionId}.json`,
        JSON.stringify({
          ...orderData,
          filingStatus,
          filingUpdatedAt: new Date().toISOString(),
          ...(trackingNumber && { trackingNumber }),
          ...(notes && { filingNotes: notes }),
        }),
        { access: 'public', contentType: 'application/json' }
      );
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
