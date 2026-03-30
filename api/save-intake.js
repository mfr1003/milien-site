import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    const timestamp = Date.now();
    const email = (data.claimantEmail || 'unknown').toLowerCase().trim();
    const safeEmail = email.replace(/[^a-z0-9._+-]/g, '_');

    // Key by email so webhook can look up by email after Stripe payment
    const blobKey = `intakes/${safeEmail}/${timestamp}.json`;

    await put(
      blobKey,
      JSON.stringify({ timestamp, ...data }),
      { access: 'public', contentType: 'application/json' }
    );

    res.status(200).json({ saved: true });
  } catch (err) {
    console.error('Save intake error:', err);
    res.status(200).json({ saved: false });
  }
}
