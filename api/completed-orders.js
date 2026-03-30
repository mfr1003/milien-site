import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { blobs } = await list({ prefix: 'completed/' });

    const orders = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const response = await fetch(blob.url);
          const data = await response.json();
          return {
            sessionId: data.sessionId,
            blobUrl: blob.url,
            paidAt: data.paidAt || blob.uploadedAt,
            completedAt: data.completedAt,
            emailSentTo: data.emailSentTo,
            metadata: data.metadata,
          };
        } catch {
          return null;
        }
      })
    );

    res.status(200).json({
      orders: orders.filter(Boolean).sort((a, b) =>
        new Date(b.completedAt) - new Date(a.completedAt)
      )
    });
  } catch (err) {
    console.error('Completed orders error:', err);
    res.status(500).json({ error: 'Failed to fetch completed orders' });
  }
}
