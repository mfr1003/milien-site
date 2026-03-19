import { put } from '@vercel/blob';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const filename = req.query.filename;
  if (!filename) {
    return res.status(400).json({ error: 'Filename is required' });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  const contentType = req.headers['content-type'];

  if (!allowedTypes.includes(contentType)) {
    return res.status(400).json({ error: 'Only JPG, PNG, WEBP, and PDF files are accepted' });
  }

  try {
    const blob = await put(`proof/${Date.now()}-${filename}`, req, {
      access: 'public',
      contentType,
    });

    res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
}
