// api/abandoned-cart.js
// Vercel Cron Job — runs every 4 hours
// Finds intake blobs with no matching completed order, sends one follow-up email

import { list, get, put } from '@vercel/blob';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const MIN_AGE_MS = 2 * 60 * 60 * 1000;  // 2 hours — give them time to complete
const FALLBACK_MAX_AGE_MS = 45 * 24 * 60 * 60 * 1000; // 45-day fallback if no deadline calculable

const STATE_NAMES = {
  MI: 'Michigan', OH: 'Ohio', IN: 'Indiana', FL: 'Florida',
  TX: 'Texas', NC: 'North Carolina', IL: 'Illinois', GA: 'Georgia',
};

const DEADLINE_WARNINGS = {
  MI: { construction: 90,  automotive: 105 },
  OH: { construction: 75,  automotive: 30  },
  IN: { construction: 90,  automotive: 90  },
  FL: { construction: 90,  automotive: 7   },
  TX: { construction: 120, automotive: 30  },
  NC: { construction: 120, automotive: 30  },
  IL: { construction: 120, automotive: 30  },
  GA: { construction: 90,  automotive: 30  },
};

function getDaysRemaining(dateLast, stateCode, workType) {
  if (!dateLast || !stateCode) return null;
  const track = workType === 'automotive' ? 'automotive' : 'construction';
  const deadlineDays = DEADLINE_WARNINGS[stateCode]?.[track];
  if (!deadlineDays) return null;
  const lastDate = new Date(dateLast);
  const deadlineDate = new Date(lastDate.getTime() + deadlineDays * 24 * 60 * 60 * 1000);
  const daysLeft = Math.ceil((deadlineDate - Date.now()) / (24 * 60 * 60 * 1000));
  return daysLeft;
}

function buildEmailHtml(intake, daysLeft) {
  const stateLabel = STATE_NAMES[intake.stateCode] || intake.stateCode || '';
  const track = intake.workType === 'automotive' ? 'Automotive' : 'Construction';
  const amount = intake.amountOwed ? '$' + parseInt(intake.amountOwed).toLocaleString() : 'your unpaid balance';

  const deadlineBlock = daysLeft !== null
    ? daysLeft > 0
      ? `<p style="background:#fff3cd;border:1px solid #f0ad4e;border-radius:6px;padding:12px 16px;color:#856404;font-size:14px;margin:20px 0;">
          <strong>⏰ Deadline reminder:</strong> You have approximately <strong>${daysLeft} days</strong> remaining to file your lien on this job. Lien rights are lost permanently once the deadline passes.
        </p>`
      : `<p style="background:#f8d7da;border:1px solid #f5c6cb;border-radius:6px;padding:12px 16px;color:#721c24;font-size:14px;margin:20px 0;">
          <strong>⚠ Your filing deadline may have passed.</strong> Contact us at <a href="mailto:support@lodgemilien.com">support@lodgemilien.com</a> — there may still be options available to you.
        </p>`
    : '';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:580px;width:100%;">

        <!-- Header -->
        <tr><td style="background:#0a193c;padding:24px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color:#f5b400;font-size:20px;font-weight:700;letter-spacing:1px;">MiLien</td>
              <td align="right" style="color:rgba(255,255,255,0.5);font-size:12px;">LodgeMiLien LLC</td>
            </tr>
          </table>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px;">
          <h2 style="color:#0a193c;margin:0 0 16px;font-size:20px;">You didn't finish your lien order.</h2>
          <p style="color:#444;font-size:15px;line-height:1.6;margin:0 0 16px;">
            You started a lien document order for a <strong>${stateLabel} ${track}</strong> job — ${amount} unpaid — but didn't complete the payment.
          </p>
          <p style="color:#444;font-size:15px;line-height:1.6;margin:0 0 16px;">
            Your information is saved. Picking up where you left off takes less than a minute.
          </p>

          ${deadlineBlock}

          <!-- CTA -->
          <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
            <tr><td style="background:#f5b400;border-radius:6px;">
              <a href="https://lodgemilien.com" style="display:inline-block;padding:14px 28px;color:#0a193c;font-weight:700;font-size:15px;text-decoration:none;">
                Complete My Order →
              </a>
            </td></tr>
          </table>

          <p style="color:#666;font-size:13px;line-height:1.6;margin:0 0 8px;">
            Starting at $97 · Documents delivered within 24 hours · No attorney required
          </p>
          <p style="color:#666;font-size:13px;line-height:1.6;margin:0;">
            Questions? Reply to this email or contact us at
            <a href="mailto:support@lodgemilien.com" style="color:#0a193c;">support@lodgemilien.com</a>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f8f8f8;padding:16px 32px;border-top:1px solid #eee;">
          <p style="color:#999;font-size:11px;margin:0;line-height:1.5;">
            LodgeMiLien LLC · Troy, Michigan · Property lien document preparation service, not a law firm.<br>
            You received this because you started a lien order at lodgemilien.com.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export default async function handler(req, res) {
  // Verify this is a legitimate cron request from Vercel
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const now = Date.now();
  let sent = 0;
  let skipped = 0;
  let errors = 0;

  try {
    // Load all intake blobs
    const { blobs: intakeBlobs } = await list({ prefix: 'intakes/' });

    // Load all completed order keys for fast lookup
    const { blobs: completedBlobs } = await list({ prefix: 'completed/' });
    const completedSessions = new Set(
      completedBlobs.map(b => b.pathname.replace('completed/', '').replace('.json', ''))
    );

    // Load already-emailed keys
    const { blobs: followupBlobs } = await list({ prefix: 'followup-sent/' });
    const alreadyEmailed = new Set(
      followupBlobs.map(b => b.pathname.replace('followup-sent/', '').replace('.json', ''))
    );

    for (const blob of intakeBlobs) {
      try {
        const blobAge = now - new Date(blob.uploadedAt).getTime();

        // Skip if too fresh
        if (blobAge < MIN_AGE_MS) { skipped++; continue; }

        // Extract session key from blob path: intakes/{key}.json
        const sessionKey = blob.pathname.replace('intakes/', '').replace('.json', '');

        // Skip if they completed the order
        if (completedSessions.has(sessionKey)) { skipped++; continue; }

        // Skip if we already sent a follow-up
        if (alreadyEmailed.has(sessionKey)) { skipped++; continue; }

        // Fetch intake data
        const response = await fetch(blob.url);
        if (!response.ok) { errors++; continue; }
        const intake = await response.json();

        if (!intake.claimantEmail) { skipped++; continue; }

        // Skip if the lien deadline has already passed — nothing to sell them
        const daysLeft = getDaysRemaining(intake.dateLast, intake.stateCode, intake.workType);
        if (daysLeft !== null && daysLeft <= 0) { skipped++; continue; }

        // If we can't calculate a deadline, use the fallback max age
        if (daysLeft === null && blobAge > FALLBACK_MAX_AGE_MS) { skipped++; continue; }

        // Send the follow-up email
        const stateLabel = STATE_NAMES[intake.stateCode] || intake.stateCode || 'your state';
        const track = intake.workType === 'automotive' ? 'Automotive' : 'Construction';

        await resend.emails.send({
          from: 'LodgeMiLien <docs@lodgemilien.com>',
          to: intake.claimantEmail,
          subject: `You didn't finish your ${stateLabel} lien order`,
          html: buildEmailHtml(intake, daysLeft),
        });

        // Mark as emailed so we don't send again
        await put(
          `followup-sent/${sessionKey}.json`,
          JSON.stringify({ sentAt: new Date().toISOString(), email: intake.claimantEmail }),
          { access: 'public' }
        );

        sent++;
      } catch (err) {
        console.error('Error processing blob:', blob.pathname, err.message);
        errors++;
      }
    }

    console.log(`Abandoned cart cron: sent=${sent} skipped=${skipped} errors=${errors}`);
    return res.status(200).json({ sent, skipped, errors });

  } catch (err) {
    console.error('Abandoned cart cron failed:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
