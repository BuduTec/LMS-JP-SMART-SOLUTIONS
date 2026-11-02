import { SITE_CONFIG } from '@/lib/constants';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'academy@jpsmartsolutions.com';
  const fromName = process.env.RESEND_FROM_NAME || 'JP Smart Solutions Academy';

  if (!apiKey) {
    console.warn(`[EMAIL LOG] RESEND_API_KEY not configured. Email to: ${to}, subject: "${subject}"`);
    return { success: true, simulated: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Failed to send email via Resend:', data);
      return { success: false, error: data };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Email sending exception:', err);
    return { success: false, error: err.message };
  }
}

// Brand styled email wrapper
function getEmailTemplate(contentHtml: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #F3F7FC; margin: 0; padding: 24px; color: #071525; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #E1EBF5; overflow: hidden; }
          .header { background: linear-gradient(135deg, #071525 0%, #0b2d55 55%, #0B63CE 100%); padding: 32px 24px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; }
          .header p { color: #14B8D4; margin: 4px 0 0 0; font-size: 12px; font-weight: 700; text-transform: uppercase; }
          .body { padding: 32px 28px; line-height: 1.6; font-size: 14px; }
          .footer { background: #071525; padding: 24px; text-align: center; font-size: 11px; color: #8898AA; }
          .footer a { color: #14B8D4; text-decoration: none; }
          .btn { display: inline-block; background-color: #0B63CE; color: #ffffff; padding: 12px 28px; border-radius: 999px; text-decoration: none; font-weight: bold; font-size: 13px; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>JP SMART SOLUTIONS</h1>
            <p>Engineering Academy</p>
          </div>
          <div class="body">
            ${contentHtml}
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} JP SMART SOLUTIONS LTD. Port Harcourt, Rivers State, Nigeria.<br>
            Phone: ${SITE_CONFIG.contact.phone} | <a href="${SITE_CONFIG.url}">Visit Academy</a>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendWelcomeEmail(to: string, name: string) {
  const content = `
    <h2>Welcome to JP Smart Solutions Academy, ${name}!</h2>
    <p>Thank you for creating your account. You now have access to Nigeria's specialized technical training portal for ETAP software, power system analysis, and solar PV engineering.</p>
    <p>Get started by browsing our available curricula or exploring lesson previews:</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${SITE_CONFIG.url}/courses" class="btn">Explore Course Catalogue</a>
    </div>
  `;
  return await sendEmail({
    to,
    subject: 'Welcome to JP Smart Solutions Academy',
    html: getEmailTemplate(content),
  });
}

export async function sendEnrolmentEmail(to: string, name: string, courseName: string) {
  const content = `
    <h2>Enrolment Confirmed!</h2>
    <p>Dear ${name},</p>
    <p>Your enrolment in <strong>${courseName}</strong> has been successfully processed.</p>
    <p>You can now stream high-definition lesson masterclasses, download calculation files, and test your engineering skills.</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${SITE_CONFIG.url}/student/dashboard" class="btn">Go to Student Portal</a>
    </div>
  `;
  return await sendEmail({
    to,
    subject: `Enrolment Confirmed: ${courseName}`,
    html: getEmailTemplate(content),
  });
}

export async function sendPaymentConfirmation(
  to: string,
  name: string,
  courseName: string,
  amount: number,
  reference: string
) {
  const content = `
    <h2>Payment Receipt</h2>
    <p>Dear ${name},</p>
    <p>We have successfully verified your payment of <strong>NGN ${amount.toLocaleString()}</strong> for <strong>${courseName}</strong>.</p>
    <p><strong>Transaction Reference:</strong> <code>${reference}</code></p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${SITE_CONFIG.url}/student/dashboard" class="btn">Access Your Course</a>
    </div>
  `;
  return await sendEmail({
    to,
    subject: `Payment Receipt: ${courseName} (Ref: ${reference})`,
    html: getEmailTemplate(content),
  });
}

export async function sendAssessmentResult(
  to: string,
  name: string,
  courseName: string,
  score: number,
  passed: boolean
) {
  const statusText = passed ? 'Passed' : 'Needs Review';
  const content = `
    <h2>Assessment Result: ${statusText}</h2>
    <p>Dear ${name},</p>
    <p>Your assessment submission for <strong>${courseName}</strong> has been graded.</p>
    <p><strong>Your Final Score:</strong> ${score}%</p>
    <p>${passed ? 'Congratulations on mastering this module!' : 'You may review course lessons and retake the assessment.'}</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${SITE_CONFIG.url}/student/assessments" class="btn">View Assessment Breakdown</a>
    </div>
  `;
  return await sendEmail({
    to,
    subject: `Assessment Result: ${courseName} - ${score}%`,
    html: getEmailTemplate(content),
  });
}
