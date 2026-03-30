import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    const timestamp = new Date().toISOString();
    const id = `intake_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    await put(
      `intakes/${id}.json`,
      JSON.stringify({ id, timestamp, ...data }),
      { access: 'public', contentType: 'application/json' }
    );

    res.status(200).json({ saved: true, id });
  } catch (err) {
    console.error('Save intake error:', err);
    // Return 200 anyway — we don't want this to block payment
    res.status(200).json({ saved: false });
  }
}
