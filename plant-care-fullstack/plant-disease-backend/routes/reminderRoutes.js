// routes/reminderRoutes.js
import express from "express";
import { createReminder } from "../controllers/reminderController.js";

const router = express.Router();

// POST /api/reminders/create
router.post("/create", createReminder);

export default router;
