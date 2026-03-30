import { Resend } from 'resend';
import { list, del } from '@vercel/blob';

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
    // Find the blob by prefix
    const { blobs } = await list({ prefix: `orders/${sessionId}` });
    if (!blobs || blobs.length === 0) {
      return res.status(404).json({ error: 'Order not found or already approved' });
    }

    const blobUrl = blobs[0].url;
    const response = await fetch(blobUrl);
    if (!response.ok) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderData = await response.json();
    const { htmlDocuments, metadata } = orderData;

    // Build subject line that works for both construction and automotive
    const isAuto = metadata.workType === 'automotive';
    const subjectRef = isAuto
      ? `${metadata.vehicleDescription} — Garage Keeper's Lien`
      : `${metadata.propertyAddress}, ${metadata.propertyCity}`;

    await resend.emails.send({
      from: 'LodgeMiLien <hello@lodgemilien.com>',
      to: metadata.claimantEmail,
      subject: `Your LodgeMiLien documents are ready — ${subjectRef}`,
      html: htmlDocuments,
    });

    // Delete the order blob after sending
    await del(blobs[0].url);

    res.status(200).json({ success: true, emailSentTo: metadata.claimantEmail });
  } catch (err) {
    console.error('Approve error:', err);
    res.status(500).json({ error: 'Approval failed: ' + err.message });
  }
}
