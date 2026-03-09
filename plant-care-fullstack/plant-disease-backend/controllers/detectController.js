import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import FormData from "form-data";

dotenv.config();

/**
 * 🌿 detectDisease Controller
 * 1️⃣ Sends image to Flask CNN model
 * 2️⃣ Gets detected plant/disease + confidence
 * 3️⃣ Sends to Gemini for natural remedy/care advice
 * 4️⃣ Returns structured, readable JSON
 */
export const detectDisease = async (req, res) => {
  try {
    const { imagePath } = req.body;

    // 🧩 Step 1 — Validate input
    if (!imagePath) {
      return res.status(400).json({
        error: "No image path provided.",
        message: "Please upload or provide an image path.",
      });
    }

    // 🌱 Step 2 — Send image to Flask CNN model
    let detectionResult;
    try {
      // Build absolute path and send as multipart file upload (Flask expects this)
      const absoluteImagePath = path.resolve(imagePath);
      if (!fs.existsSync(absoluteImagePath)) {
        return res.status(400).json({
          error: "Image file not found.",
          message: `Could not locate image at: ${absoluteImagePath}`,
        });
      }

      const form = new FormData();
      form.append("file", fs.createReadStream(absoluteImagePath));

      const flaskResponse = await axios.post("http://localhost:8000/predict", form, {
        headers: form.getHeaders(),
      });

      detectionResult = flaskResponse.data;
    } catch (flaskErr) {
      console.error("🔥 Flask Model Error:", flaskErr.message);
      return res.status(502).json({
        error: "Flask AI model not responding.",
        message: "Ensure your CNN model server is running on port 8000.",
      });
    }

    // 🧩 Extract data safely
    const diseaseName = detectionResult?.diseaseName || detectionResult?.plant || "Unknown";
    const confidence = detectionResult?.confidence || "N/A";

    if (!diseaseName || diseaseName === "Unknown") {
      return res.status(404).json({
        error: "Detection failed.",
        message: "Unable to identify plant or disease. Try another image.",
      });
    }

    // 🌿 Step 3 — Build prompt for Gemini
    const prompt = `
You are VrikZo Intelligence 🌿, an expert plant care AI.
Detected disease: **${diseaseName}** (Confidence: ${confidence}).
${diagnosisContext}

Provide a short, clear, structured response under 60 words:
- 🌿 Observation: one sentence on the issue
- 💊 Remedy: 2–3 actionable treatment steps
- 🌞 Care Tip: how to maintain the plant and prevent recurrence
- ❗ If diseaseName sounds unknown or healthy, say it’s likely healthy.

End naturally with: "Would you like more help or advice?"
`;

    // ⚡ Step 4 — Call Gemini API
    let aiResponseText = "";
    try {
      const geminiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        }
      );

      aiResponseText =
        geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    } catch (geminiErr) {
      console.error("💥 Gemini API Error:", geminiErr.message);
      aiResponseText = "Unable to fetch care advice at the moment. 🌱";
    }

    // 🌸 Step 5 — Construct a unified structured response
    const result = {
      detection: {
        diseaseName,
        confidence,
        status:
          confidence && parseFloat(confidence) >= 85
            ? "✅ Confident"
            : "⚠️ Low Confidence",
      },
      advice: aiResponseText || "No advice available currently.",
      timestamp: new Date().toISOString(),
    };

    return res.json(result);
  } catch (error) {
    console.error("💥 detectDisease() Fatal Error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected issue occurred while processing your request.",
    });
  }
};
