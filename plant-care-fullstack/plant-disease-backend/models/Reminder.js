// models/Reminder.js
import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  plantName: { type: String, required: true },
  action: { type: String, enum: ["water", "treatment"], required: true },
  scheduleDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Reminder = mongoose.models.Reminder || mongoose.model("Reminder", ReminderSchema);
export default Reminder;
