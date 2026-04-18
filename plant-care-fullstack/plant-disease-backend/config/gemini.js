import { GoogleGenerativeAI } from "@google/generative-ai";

// Single shared Gemini client — import this instead of creating new instances in controllers
export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Pre-built model instance ready for use in any controller
export const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
