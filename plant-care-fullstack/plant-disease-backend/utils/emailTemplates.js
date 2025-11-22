// utils/emailTemplates.js
import { genAI } from "../config/gemini.js"; 
import escapeHtml from "escape-html";

/**
 * generateReminderEmail(plantName, action, remedyText) -> returns HTML string
 * Includes remedies from chatbot response.
 */
export async function generateReminderEmail(plantName, action, remedyText = "") {
  // Try generating with Gemini if available
  if (genAI) {
    try {
      const prompt = `
You are a friendly plant-care assistant. Generate a clean, concise HTML-formatted reminder email.

Plant: "${plantName}"
Action: "${action === "water" ? "Watering" : "Treatment"}"

Write:
- Warm greeting
- Why the action matters
- 2 short actionable steps
- A section titled "AI Suggested Remedies"
- Insert the following remedies *exactly as provided*, no rephrasing:

REMEDY TEXT BELOW:
${remedyText || "No remedies provided."}

Return ONLY clean HTML (no backticks).
`;

      const model =
        genAI.getGenerativeModel?.({ model: "gemini-2.5-flash" }) || genAI;

      const resp =
        (await model.generateContent?.(prompt).catch(() => null)) ||
        (await model.generate?.(prompt).catch(() => null));

      const text =
        resp?.response?.text?.() ||
        resp?.output?.[0]?.content ||
        "";

      if (text && text.trim()) return text.trim();
    } catch (err) {
      console.warn("⚠ Gemini email generation failed:", err.message);
    }
  }

  // --- FALLBACK STATIC HTML (if Gemini unavailable) ---
  const safePlant = escapeHtml(plantName);
  const safeRemedies = escapeHtml(remedyText || "");
  const verb = action === "water" ? "Water" : "Apply treatment to";

  return `
  <div style="font-family:system-ui, sans-serif; color:#0f172a;">
    <h2 style="color:#059669;">🌱 Reminder — ${safePlant}</h2>

    <p>Hello! This is a gentle reminder to <strong>${verb.toLowerCase()}</strong> your plant <strong>${safePlant}</strong>.</p>

    <p><strong>Why:</strong> Consistent care helps keep the plant healthy and stress-free.</p>

    <ol>
      <li>${
        action === "water"
          ? "Give 200–400 ml of water depending on pot size."
          : "Apply the recommended plant treatment as instructed."
      }</li>
      <li>Monitor changes over the next 24–48 hours.</li>
    </ol>

    <p style="color:#6b7280; margin-top:20px;">— VrikZo Plant Care</p>
  </div>
  `;
}
