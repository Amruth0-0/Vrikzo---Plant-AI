import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import detectRoutes from "./routes/detectRoutes.js";
import chatbotRoutes from "./routes/chatbot.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import userEmailRoute from "./routes/userEmailRoute.js";
import  reminderRoutes  from "./routes/reminderRoutes.js";
import { startReminderScheduler } from "./scheduler/reminderScheduler.js";
import "./scheduler/reminderScheduler.js"; 


// 🌿 Load environment variables
dotenv.config();
console.log("✅ Loaded GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Found" : "❌ Missing");
console.log("✅ Loaded WEATHER_API_KEY:", process.env.WEATHER_API_KEY ? "Found" : "❌ Missing");

// 🌿 Initialize App
const app = express();

// ✅ Middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

// ✅ Connect to MongoDB
connectDB();
startReminderScheduler();


// ✅ Correct Gemini initialization
const genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
export { genAI }; // Allow reuse by controllers (e.g., chatbotController)

// ✅ API Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/detect", detectRoutes);
app.use("/api", chatbotRoutes);
app.use("/api/users", userEmailRoute);
app.use("/api/reminders", reminderRoutes);

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("🌿 VrikZo Backend is Running Successfully!");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🌿 Server running on http://localhost:${PORT}`)
);
