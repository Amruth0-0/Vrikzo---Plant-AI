import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "amulyah66@gmail.com",
    pass: process.env.EMAIL_PASS || "vrikzo123",
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("📧 Email transporter ready.");
  }
});

export default transporter;
