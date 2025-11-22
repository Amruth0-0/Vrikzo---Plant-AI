// models/EmailUser.js
import mongoose from "mongoose";

const EmailUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const EmailUser = mongoose.models.EmailUser || mongoose.model("EmailUser", EmailUserSchema);
export default EmailUser;
