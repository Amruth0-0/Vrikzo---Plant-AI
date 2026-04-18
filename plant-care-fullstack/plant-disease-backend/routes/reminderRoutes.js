// routes/reminderRoutes.js
import express from "express";
import { createReminder, reminderValidationRules } from "../controllers/reminderController.js";

const router = express.Router();

// POST /api/reminders/create
router.post("/create", reminderValidationRules, createReminder);

export default router;
