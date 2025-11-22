import express from "express";
import { chatWithGemini } from "../controllers/chatbotController.js";

const router = express.Router();
router.post("/chat", chatWithGemini);

export default router;
