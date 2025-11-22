// controllers/reminderController.js
import Reminder from "../models/Reminder.js";
import EmailUser from "../models/EmailUser.js";

export const createReminder = async (req, res) => {
  try {
    const { email, plantName, action, scheduleDate, remedyText } = req.body;

    if (!email || !plantName || !action || !scheduleDate) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Save user email if not present
    let user = await EmailUser.findOne({ email });
    if (!user) {
      user = new EmailUser({ email });
      await user.save();
    }

    const parsed = new Date(scheduleDate);
    if (isNaN(parsed.getTime())) {
      return res.status(400).json({ message: "Invalid scheduleDate" });
    }

    const reminder = new Reminder({
      email,
      plantName,
      action,
      scheduleDate: parsed,
      remedyText
    });

    await reminder.save();

    return res.json({
      success: true,
      message: "Reminder scheduled successfully!",
      reminder,
    });
  } catch (error) {
    console.error("Reminder creation error:", error);
    res.status(500).json({ message: "Server error." });
  }
};
