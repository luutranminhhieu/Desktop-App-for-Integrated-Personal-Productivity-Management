import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpSecure = process.env.SMTP_SECURE === 'true';
const smtpFrom = process.env.SMTP_FROM || smtpUser || 'no-reply@example.com';

if (!smtpHost || !smtpUser || !smtpPass) {
  console.warn('SMTP config missing. Set SMTP_HOST, SMTP_USER, SMTP_PASS to enable email sending.');
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined
});

export async function sendResetPasswordEmail(to: string, resetLink: string): Promise<void> {
  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error('SMTP is not configured.');
  }

  await transporter.sendMail({
    from: smtpFrom,
    to,
    subject: 'Reset your password',
    text: `Click the link to reset your password: ${resetLink}`,
    html: `
      <p>Copy and paste this link to reset your password:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
    `
  });
}
