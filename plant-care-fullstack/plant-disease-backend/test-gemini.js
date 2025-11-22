import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


async function listAvailableModels() {
  try {
    const models = await genAI.listModels();
    console.log("📋 Available models:");
    models.forEach(m => {
      console.log(`  - ${m.name} (supports: ${m.supportedGenerationMethods})`);
    });
  } catch (err) {
    console.error("❌ Could not list models:", err.message);
  }
}

// Call it on startup
listAvailableModels();
