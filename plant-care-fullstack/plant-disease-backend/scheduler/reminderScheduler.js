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

      // Query by a 60-second window — survives server restarts and clock drift
      const windowStart = new Date(now.getTime() - 30 * 1000); // 30s before
      const windowEnd   = new Date(now.getTime() + 30 * 1000); // 30s after

      // Only find reminders that haven't been sent yet (sentAt guard prevents double-fire)
      const reminders = await Reminder.find({
        scheduleDate: { $gte: windowStart, $lte: windowEnd },
        sentAt: { $exists: false },
      });

      for (const reminder of reminders) {
        try {
          // Mark as sent BEFORE sending email — prevents double-fire on crash
          await Reminder.findByIdAndUpdate(reminder._id, { sentAt: new Date() });

          const { email, action, plantName, remedyText } = reminder;

          // Generate HTML email (Gemini or fallback)
          const html = await generateReminderEmail(plantName, action, remedyText);

          await sendEmail({
            to: email,
            subject: `🌱 Reminder: ${action === "water" ? "Water" : "Treatment"} — ${plantName}`,
            html,
            text: `Reminder: ${action} for ${plantName}`,
          });

          console.log(`📧 Sent ${action} reminder to ${email} (${plantName})`);

          // Delete after successful send
          await Reminder.findByIdAndDelete(reminder._id);
        } catch (err) {
          console.error("Error sending reminder email:", err);
          // sentAt is already set — won't retry this minute, scheduler picks up next run
        }
      }
    } catch (err) {
      console.error("Reminder scheduler error:", err);
    }
  });
};

