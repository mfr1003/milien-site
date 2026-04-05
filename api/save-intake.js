import { put } from '@vercel/blob';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function buildConfirmationEmail(data) {
  const isAuto = data.workType === 'automotive';
  const name = data.claimantName || 'Valued Customer';
  const email = data.claimantEmail || data.claimantEmail;

  const matterLine = isAuto
    ? `${data.vehicleDescription || 'Vehicle'} — $${parseInt(data.amountOwed || 0).toLocaleString()}`
    : `${data.propertyAddress || ''}, ${data.propertyCity || ''} — $${parseInt(data.amountOwed || 0).toLocaleString()}`;

  const stateNames = { MI: 'Michigan', OH: 'Ohio', IN: 'Indiana' };
  const stateName = stateNames[data.stateCode] || data.stateCode || 'Michigan';

  const pkgLabel = data.packageType === 'demand'
    ? 'Demand Letter'
    : data.filingCoordination === 'true'
      ? 'Full Package + Filing Coordination'
      : 'Full Lien Package';

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f1ec;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
<div style="max-width:600px;margin:0 auto;background:#fff;">

  <!-- Header -->
  <div style="background:#0d1117;padding:28px 40px;display:flex;align-items:center;justify-content:space-between;">
    <span style="font-family:'Barlow Condensed',Arial,sans-serif;font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.3px;">
      Lodge<span style="color:#f5a623;">Mi</span>Lien
    </span>
    <span style="font-size:12px;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1px;">Document Preparation</span>
  </div>

  <!-- Status bar -->
  <div style="background:#2ea043;padding:16px 40px;">
    <div style="font-size:16px;font-weight:700;color:#fff;margin-bottom:2px;">Order Received</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.7);">We'll have your documents ready within 24 hours</div>
  </div>

  <!-- Body -->
  <div style="padding:36px 40px;">
    <p style="font-size:16px;color:#1a1a1a;margin-bottom:24px;">Hi ${name},</p>
    <p style="font-size:15px;color:#444;line-height:1.6;margin-bottom:24px;">
      Thank you for your order. We've received your request and a member of our team will review and prepare your documents shortly.
    </p>

    <!-- Order summary -->
    <div style="background:#f4f1ec;border-radius:8px;padding:20px 24px;margin-bottom:28px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#888;margin-bottom:14px;">Order Summary</div>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="color:#666;padding:5px 0;width:140px;">Matter</td>
          <td style="color:#1a1a1a;font-weight:600;">${matterLine}</td>
        </tr>
        <tr>
          <td style="color:#666;padding:5px 0;">State</td>
          <td style="color:#1a1a1a;">${stateName}</td>
        </tr>
        <tr>
          <td style="color:#666;padding:5px 0;">Package</td>
          <td style="color:#1a1a1a;">${pkgLabel}</td>
        </tr>
        <tr>
          <td style="color:#666;padding:5px 0;">Delivery to</td>
          <td style="color:#1a1a1a;">${email}</td>
        </tr>
      </table>
    </div>

    <!-- What happens next -->
    <div style="margin-bottom:28px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#888;margin-bottom:14px;">What Happens Next</div>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="vertical-align:top;padding:0 12px 16px 0;width:28px;">
            <div style="width:24px;height:24px;border-radius:50%;background:#2ea043;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;text-align:center;line-height:24px;">✓</div>
          </td>
          <td style="padding-bottom:16px;border-bottom:1px solid #e8e3dc;">
            <div style="font-weight:600;color:#1a1a1a;font-size:14px;margin-bottom:2px;">Order received</div>
            <div style="font-size:13px;color:#666;">Your payment has been processed and your order is in the queue.</div>
          </td>
        </tr>
        <tr>
          <td style="vertical-align:top;padding:16px 12px 16px 0;width:28px;">
            <div style="width:24px;height:24px;border-radius:50%;background:#f5a623;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#0d1117;text-align:center;line-height:24px;">2</div>
          </td>
          <td style="padding:16px 0 16px;border-bottom:1px solid #e8e3dc;">
            <div style="font-weight:600;color:#1a1a1a;font-size:14px;margin-bottom:2px;">Document review &amp; preparation</div>
            <div style="font-size:13px;color:#666;">A human reviewer prepares your lien documents. This typically takes a few hours during business hours.</div>
          </td>
        </tr>
        <tr>
          <td style="vertical-align:top;padding:16px 12px 0 0;width:28px;">
            <div style="width:24px;height:24px;border-radius:50%;background:#e8e3dc;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#888;text-align:center;line-height:24px;">3</div>
          </td>
          <td style="padding-top:16px;">
            <div style="font-weight:600;color:#1a1a1a;font-size:14px;margin-bottom:2px;">Documents delivered</div>
            <div style="font-size:13px;color:#666;">Your completed documents are sent to this email as a PDF — within 24 hours of your order.</div>
          </td>
        </tr>
      </table>
    </div>

    <p style="font-size:14px;color:#666;line-height:1.6;margin-bottom:8px;">
      Questions? Reply to this email or contact us at <a href="mailto:support@lodgemilien.com" style="color:#f5a623;">support@lodgemilien.com</a>.
    </p>
  </div>

  <!-- Footer -->
  <div style="background:#f4f1ec;border-top:1px solid #e8e3dc;padding:20px 40px;text-align:center;">
    <p style="font-size:11px;color:#999;line-height:1.7;margin:0;">
      LodgeMiLien LLC · Troy, Michigan · lodgemilien.com<br>
      This is a document preparation service. LodgeMiLien is not a law firm and this is not legal advice.<br>
      <a href="https://lodgemilien.com/terms" style="color:#999;">Terms of Service</a> &nbsp;·&nbsp; <a href="https://lodgemilien.com/privacy" style="color:#999;">Privacy Policy</a>
    </p>
  </div>

</div>
</body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const data = req.body;
    if (!data) return res.status(400).json({ error: 'No data provided' });

    const sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Save to blob
    await put(
      `orders/${sessionId}.json`,
      JSON.stringify({
        sessionId,
        paidAt: new Date().toISOString(),
        metadata: data,
      }),
      { access: 'public', contentType: 'application/json' }
    );

    // Send confirmation email — fire and don't block response
    const email = data.claimantEmail;
    if (email) {
      resend.emails.send({
        from: 'LodgeMiLien <docs@lodgemilien.com>',
        to: [email],
        subject: `Order Received — LodgeMiLien`,
        html: buildConfirmationEmail(data),
      }).catch(err => console.error('Confirmation email failed:', err.message));
    }

    return res.status(200).json({ success: true, sessionId });
  } catch (err) {
    console.error('Save intake error:', err);
    return res.status(500).json({ error: err.message });
  }
}
