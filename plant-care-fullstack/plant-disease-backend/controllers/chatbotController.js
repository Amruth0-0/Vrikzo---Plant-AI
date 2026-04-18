import { geminiModel } from "../config/gemini.js";

/* -------------------------------------------------------------------------- */
/*                             WEATHER HELPER                                  */
/* -------------------------------------------------------------------------- */

async function getWeather(location = "Bangalore") {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    console.error("❌ OPENWEATHER_API_KEY missing from environment");
    return null;
  }

  try {
    // Support both "City" names and "lat,lon" coordinate strings
    const isCoords = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(location.trim());
    const query = isCoords
      ? `lat=${location.split(",")[0]}&lon=${location.split(",")[1]}`
      : `q=${encodeURIComponent(location.trim())}`;

    const url = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.cod !== 200) {
      console.error(`🌩️ Weather API error: ${data.message || response.statusText}`);
      return null;
    }

    return {
      temp: data.main?.temp ?? "N/A",
      humidity: data.main?.humidity ?? "N/A",
      condition: data.weather?.[0]?.description ?? "N/A",
      city: data.name ?? location,
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
      result = await geminiModel.generateContent(prompt);
    } catch (err) {
      if (err.message.includes("503")) {
        console.warn("⚠️ Gemini overloaded — retrying in 2 seconds...");
        await new Promise((r) => setTimeout(r, 2000));
        result = await geminiModel.generateContent(prompt);
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

    // M-6 fix: always return HTTP 500 on server-side errors, not 200
    return res.status(500).json({
      reply: {
        observation: "Sorry 🌱, I couldn't reach VrikZo Intelligence.",
        remedy: "",
        careTip: "",
        followUp: "Would you like more help or advice?",
      },
    });
  }
};

