// controllers/reminderController.js
import { body, validationResult } from "express-validator";
import Reminder from "../models/Reminder.js";
import EmailUser from "../models/EmailUser.js";

/* ---------------------------------------------------------------------- */
/*  Validation rules — import and spread into your route definition        */
/* ---------------------------------------------------------------------- */
export const reminderValidationRules = [
  body("email")
    .isEmail().withMessage("A valid email address is required.")
    .normalizeEmail(),

  body("plantName")
    .trim()
    .notEmpty().withMessage("plantName is required.")
    .isLength({ max: 100 }).withMessage("plantName must be 100 characters or fewer.")
    .escape(),

  body("action")
    .trim()
    .isIn(["water", "treatment"]).withMessage("action must be 'water' or 'treatment'."),

  body("scheduleDate")
    .notEmpty().withMessage("scheduleDate is required.")
    .isISO8601().withMessage("scheduleDate must be a valid ISO 8601 date."),

  body("remedyText")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("remedyText must be 500 characters or fewer."),
];

/* ---------------------------------------------------------------------- */
/*  Controller                                                              */
/* ---------------------------------------------------------------------- */
export const createReminder = async (req, res) => {
  // Return all validation errors at once
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, plantName, action, scheduleDate, remedyText } = req.body;

    // Save user email if not already recorded
    let user = await EmailUser.findOne({ email });
    if (!user) {
      user = new EmailUser({ email });
      await user.save();
    }

    const parsed = new Date(scheduleDate);

    const reminder = new Reminder({
      email,
      plantName,
      action,
      scheduleDate: parsed,
      remedyText: remedyText || "",
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

