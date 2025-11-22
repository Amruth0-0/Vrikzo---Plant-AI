import dotenv from "dotenv";
import fetch from "node-fetch";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

/* -------------------------------------------------------------------------- */
/*                        ENVIRONMENT VALIDATION                              */
/* -------------------------------------------------------------------------- */

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is required");
}

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Missing GEMINI_API_KEY in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

async function getWeather(city = "bangalore") {
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    console.error("❌ WEATHER_API_KEY missing from environment");
    return null;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.cod !== 200) {
      console.error(
        //`🌩️ Weather API error: ${data.message || response.statusText}`
      );
      return null;
    }

    return {
      temp: data.main?.temp ?? "N/A",
      humidity: data.main?.humidity ?? "N/A",
      condition: data.weather?.[0]?.description ?? "N/A",
      city: data.name ?? city,
    };
  } catch (err) {
    console.error("🌩️ Weather fetch error:", err.message);
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*                              MAIN CHAT ROUTE                                */
/* -------------------------------------------------------------------------- */

export const chatWithGemini = async (req, res) => {
  try {
    const { message, history, location, diagnosis } = req.body;

    console.log("📩 Received user message:", message);

    if (!message && !diagnosis) {
      return res.status(400).json({ error: "Message is required." });
    }

    /* -----------------------------------------------
     * Combine Conversation History
     * ----------------------------------------------- */
    const chatContext = (history || [])
      .map((m) => `${m.role === "user" ? "User" : "AI"}: ${m.text}`)
      .join("\n");

    /* -----------------------------------------------
     * Weather Context
     * ----------------------------------------------- */
    const weather = await getWeather(location || "Bangalore");

    const weatherInfo = weather
      ? `Current weather in ${weather.city}: ${weather.temp}°C, ${weather.condition}, humidity ${weather.humidity}%.`
      : "Weather data unavailable.";

    /* -----------------------------------------------
     * DIAGNOSIS CONTEXT (If image detected disease)
     * ----------------------------------------------- */
    let diagnosisContext = "";

    if (diagnosis) {
      diagnosisContext = `
Detected Crop: ${diagnosis.crop}
Detected Disease: ${diagnosis.disease}
Confidence: ${(diagnosis.confidence * 100).toFixed(2)}%
Image URL: ${diagnosis.imageUrl}

Use this diagnosis + weather to generate advice.
`;
    }

    /* ---------------------------------------------------------------------- */
    /*                                PROMPT                                   */
    /* ---------------------------------------------------------------------- */

    const prompt = `
You are **VrikZo Intelligence 🌿**, a kind plant care assistant.
Keep responses short, friendly, and human (under 50 words).

Give as per Weather info: ${weatherInfo}
${diagnosisContext}

Respond ONLY in JSON format like:
{
  "observation": "",
  "remedy": "",
  "careTip": "",
}

Chat History:
${chatContext}

User: ${message || "[No user text — image diagnosis only]"}
AI:
`;

    console.log("🪴 Calling Gemini…");

    /* ---------------------------------------------------------------------- */
    /*                       CALL GEMINI WITH RETRY                            */
    /* ---------------------------------------------------------------------- */

    let result;

    try {
      result = await model.generateContent(prompt);
    } catch (err) {
      if (err.message.includes("503")) {
        console.warn("⚠️ Gemini overloaded — retrying in 2 seconds...");
        await new Promise((r) => setTimeout(r, 2000));
        result = await model.generateContent(prompt);
      } else {
        throw err;
      }
    }

    const aiText = result.response?.text()?.trim() || "";

    /* -----------------------------------------------
     * SAFE JSON Parse
     * ----------------------------------------------- */
    let reply;

    try {
      const cleanText = aiText.replace(/```json\n?|\n?```/g, "").trim();
      reply = JSON.parse(cleanText);
    } catch {
      reply = {
        observation: "Sorry, I couldn't process that.",
        remedy: "",
        careTip: "",
        followUp: "Would you like more help or advice?",
      };
    }

    return res.json({
      reply,
      weather,
      diagnosis,
    });

    /* ---------------------------------------------------------------------- */
    /*                                 ERROR                                   */
    /* ---------------------------------------------------------------------- */

  } catch (err) {
    console.error("💥 Chatbot error:", err.stack || err.message);

    return res.json({
      reply: {
        observation: "Sorry 🌱, I couldn't reach VrikZo Intelligence.",
        remedy: "",
        careTip: "",
        followUp: "Would you like more help or advice?",
      },
    });
  }
};
