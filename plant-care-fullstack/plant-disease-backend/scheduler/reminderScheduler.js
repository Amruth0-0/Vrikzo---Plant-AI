// scheduler/reminderScheduler.js
import cron from "node-cron";
import Reminder from "../models/Reminder.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateReminderEmail } from "../utils/emailTemplates.js";

export const startReminderScheduler = () => {
console.log("⏰ Reminder scheduler loading...");

// Run every minute
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    // Round to minute precision
    const minuteStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      0,
      0
    );

    // Find reminders that match this exact minute
    const reminders = await Reminder.find({
      scheduleDate: minuteStart,
    });

    for (const reminder of reminders) {
      try {
        const { email, action, plantName, remedyText } = reminder;

        // generate HTML email (Gemini or fallback)
        const html = await generateReminderEmail(plantName, action, remedyText);

        await sendEmail({
          to: email,
          subject: `🌱 Reminder: ${action === "water" ? "Water" : "Treatment"} — ${plantName}`,
          html,
          text: `Reminder: ${action} for ${plantName}`,
        });

        console.log(`📧 Sent ${action} reminder to ${email} (${plantName})`);

        // Remove the reminder after sending so it's one-time (optional)
        await Reminder.findByIdAndDelete(reminder._id);
      } catch (err) {
        console.error("Error sending reminder email:", err);
      }
    }
  } catch (err) {
    console.error("Reminder scheduler error:", err);
  }
});
};
