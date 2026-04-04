import { list, del, put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { sessionId, reason } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID required' });
  }

  try {
    // Find the pending order blob
    const { blobs } = await list({ prefix: `orders/${sessionId}` });
    if (!blobs || blobs.length === 0) {
      return res.status(404).json({ error: 'Order not found or already processed' });
    }

    const blobUrl = blobs[0].url;
    const response = await fetch(blobUrl);
    if (!response.ok) {
      return res.status(404).json({ error: 'Order blob not readable' });
    }

    const orderData = await response.json();

    // Archive to rejected/ with reason and timestamp
    await put(
      `rejected/${sessionId}.json`,
      JSON.stringify({
        ...orderData,
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason || 'No reason provided',
      }),
      { access: 'public', contentType: 'application/json' }
    );

    // Remove from pending queue
    await del(blobs[0].url);

    res.status(200).json({ success: true, sessionId });
  } catch (err) {
    console.error('Reject error:', err);
    res.status(500).json({ error: 'Rejection failed: ' + err.message });
  }
}
