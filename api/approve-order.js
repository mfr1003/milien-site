import { Resend } from 'resend';
import { get, del } from '@vercel/blob';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { sessionId } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID required' });
  }

  try {
    const blobUrl = `${process.env.VERCEL_BLOB_BASE_URL}/orders/${sessionId}.json`;
    const response = await fetch(blobUrl);

    if (!response.ok) {
      return res.status(404).json({ error: 'Order not found or already approved' });
    }

    const orderData = await response.json();
    const { htmlDocuments, metadata } = orderData;

    await resend.emails.send({
      from: 'MiLien <hello@lodgemilien.com>',
      to: metadata.claimantEmail,
      subject: `Your MiLien documents are ready — ${metadata.propertyAddress}`,
      html: htmlDocuments,
    });

    await fetch(blobUrl, { method: 'DELETE' }).catch(() => {});

    res.status(200).json({ success: true, emailSentTo: metadata.claimantEmail });
  } catch (err) {
    console.error('Approve error:', err);
    res.status(500).json({ error: 'Approval failed: ' + err.message });
  }
}
