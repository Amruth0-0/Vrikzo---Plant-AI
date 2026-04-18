import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import connectDB from "./config/db.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import detectRoutes from "./routes/detectRoutes.js";
import chatbotRoutes from "./routes/chatbot.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import userEmailRoute from "./routes/userEmailRoute.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import { startReminderScheduler } from "./scheduler/reminderScheduler.js";

// 🌿 Load environment variables
dotenv.config();
console.log("✅ Loaded GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Found" : "❌ Missing");
console.log("✅ Loaded OPENWEATHER_API_KEY:", process.env.OPENWEATHER_API_KEY ? "Found" : "❌ Missing");

// 🌿 Initialize App
const app = express();

// ✅ Middlewares
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

// ✅ Rate Limiters
// — AI detection is expensive; cap at 10 requests per 15 minutes per IP
const detectLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many detection requests. Please try again in 15 minutes." },
});

// — Chatbot: 30 messages per 15 minutes per IP
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many chat requests. Please slow down." },
});

// — General API: 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

// ✅ Connect to MongoDB
connectDB();
startReminderScheduler();

// ✅ Correct Gemini initialization
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export { genAI }; // Allow reuse by controllers (e.g., chatbotController)

// ✅ API Routes (rate-limited)
app.use("/api/upload", generalLimiter, uploadRoutes);
app.use("/api/detect", detectLimiter, detectRoutes);
app.use("/api", chatLimiter, chatbotRoutes);
app.use("/api/users", generalLimiter, userEmailRoute);
app.use("/api/reminders", generalLimiter, reminderRoutes);
app.use("/api/weather", generalLimiter, weatherRoutes);

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("🌿 VrikZo Backend is Running Successfully!");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🌿 Server running on http://localhost:${PORT}`)
);

