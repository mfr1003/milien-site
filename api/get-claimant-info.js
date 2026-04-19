// api/get-claimant-info.js
// Returns saved claimant info for a returning customer by email.
// Looks through completed blob orders, finds most recent match, returns business fields only.

import { list, getDownloadUrl } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.query;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const CRON_SECRET = process.env.CRON_SECRET;

  try {
    // Search completed orders first, then intakes
    const completedBlobs = await list({ prefix: 'completed/' });
    const intakeBlobs = await list({ prefix: 'intakes/' });

    const allBlobs = [
      ...completedBlobs.blobs,
      ...intakeBlobs.blobs,
    ].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    const emailLower = email.toLowerCase().trim();

    for (const blob of allBlobs) {
      try {
        const fetchRes = await fetch(blob.downloadUrl || blob.url);
        if (!fetchRes.ok) continue;
        const data = await fetchRes.json();

        // Match on claimant email (construction) or shop email (automotive)
        const blobEmail = (data.claimantEmail || data.shopEmail || '').toLowerCase().trim();
        if (blobEmail !== emailLower) continue;

        // Found a match — return business fields only, no sensitive order data
        return res.status(200).json({
          claimantName: data.claimantName || data.shopName || '',
          claimantStreet: data.claimantStreet || extractStreet(data.claimantAddress) || '',
          claimantCity: data.claimantCity || extractCity(data.claimantAddress) || '',
          claimantState: data.claimantState || extractState(data.claimantAddress) || '',
          claimantZip: data.claimantZip || extractZip(data.claimantAddress) || '',
          claimantPhone: data.claimantPhone || data.shopPhone || '',
          claimantEmail: blobEmail,
          websiteUrl: data.websiteUrl || data.shopWebsite || '',
        });
      } catch (e) {
        continue;
      }
    }

    // No match found
    return res.status(404).json({ error: 'No orders found for that email' });

  } catch (err) {
    console.error('get-claimant-info error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}

// Helpers for when address was stored as a joined string e.g. "456 Main St, Troy, MI, 48084"
function extractStreet(addr) {
  if (!addr) return '';
  return addr.split(',')[0]?.trim() || '';
}
function extractCity(addr) {
  if (!addr) return '';
  return addr.split(',')[1]?.trim() || '';
}
function extractState(addr) {
  if (!addr) return '';
  return addr.split(',')[2]?.trim().toUpperCase() || '';
}
function extractZip(addr) {
  if (!addr) return '';
  return addr.split(',')[3]?.trim() || '';
}
