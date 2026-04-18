// utils/sendEmail.js
import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS) {
  console.warn("⚠️ EMAIL_USER or EMAIL_PASS missing from .env — email reminders will not send.");
}

// Single reusable transporter — avoids opening a new TCP connection per email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  const msg = {
    from: `"VrikZo 🌿" <${EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(msg);
  return info;
};

