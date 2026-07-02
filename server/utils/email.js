const nodemailer = require("nodemailer");
const logger = require("./logger");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

exports.sendOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your NanoTools verification code",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="font-size:22px;font-weight:600;margin-bottom:8px">Verify your email</h2>
          <p style="color:#666;margin-bottom:24px">Enter this code to complete signup:</p>
          <div style="background:#f5f5f5;border-radius:10px;padding:20px;text-align:center;font-size:36px;font-weight:700;letter-spacing:8px;color:#7F77DD">${otp}</div>
          <p style="color:#999;font-size:13px;margin-top:16px">Expires in 10 minutes. If you didn't request this, ignore this email.</p>
        </div>
      `,
    });
  } catch (err) {
    logger.error("Email send error:", err.message);
  }
};

exports.sendWelcome = async (email, name) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Welcome to NanoTools AI",
    html: `<div style="font-family:sans-serif;padding:32px"><h2>Welcome, ${name}!</h2><p>Your account is ready. Start with 200+ free tools at <a href="${process.env.CLIENT_URL}">nanotools.ai</a></p></div>`,
  });
};

exports.sendPasswordReset = async (email, resetUrl) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset your NanoTools password",
    html: `<div style="font-family:sans-serif;padding:32px"><h2>Reset your password</h2><p>Click below within 1 hour:</p><a href="${resetUrl}" style="background:#7F77DD;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px">Reset password</a></div>`,
  });
};
