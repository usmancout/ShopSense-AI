import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, origin } = req.body || {};
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const encodedEmail = Buffer.from(encodeURIComponent(normalizedEmail)).toString('base64');
  const resetToken = `local-reset-${encodedEmail}-${Date.now()}`;
  const baseOrigin = origin || req.headers.origin || 'https://shop-sense-ai-mu.vercel.app';
  const resetLink = `${baseOrigin}/reset-password/${resetToken}`;

  const senderEmail = process.env.EMAIL_USER || 'fashiali412@gmail.com';
  const defaultPass = Buffer.from('ampyZmNqeGZ2ZGhxcXRtZw==', 'base64').toString('utf8');
  const senderPass = (process.env.EMAIL_PASS || defaultPass).replace(/\s+/g, '');

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: senderPass,
      },
    });

    await transporter.sendMail({
      from: `"ShopSense AI" <${senderEmail}>`,
      to: normalizedEmail,
      subject: 'ShopSense AI — Password Reset Link',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
          <h2 style="color: #0f172a; margin-top: 0;">Reset Your ShopSense AI Password</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            We received a request to reset the password for <strong>${normalizedEmail}</strong>. Click the button below to choose a new password (expires in 15 minutes):
          </p>
          <p style="margin: 24px 0;">
            <a href="${resetLink}" style="background-color: #059669; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p style="color: #64748b; font-size: 12px;">
            Or copy and paste this link into your browser:<br/>
            <a href="${resetLink}" style="color: #059669;">${resetLink}</a>
          </p>
        </div>
      `,
    });

    return res.status(200).json({
      message: 'Password reset link sent to your email',
      resetLink,
      resetToken,
      sentViaSmtp: true,
    });
  } catch (error) {
    console.error('Vercel forgot-password email error:', error);
    return res.status(500).json({
      message: 'Failed to send reset email',
      resetLink,
      resetToken,
      sentViaSmtp: false,
    });
  }
}
