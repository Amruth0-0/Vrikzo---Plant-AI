import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});

import fs from "fs";

async function testGemini() {
    try {
        const result = await model.generateContent("Hello!");
        console.log("Success:", result.response.text());
    } catch (err) {
        fs.writeFileSync("error_log.json", JSON.stringify({ message: err.message, stack: err.stack }, null, 2));
        console.error("Saved error to error_log.json");
    }
}

testGemini();
