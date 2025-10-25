
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "./db.js"; 

//  Use GEMINI_API_KEY from .env
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const db = mysql.createPool(process.env.MYSQL_URL);

// Free tier compatible model
const STORY_MODEL = "gemini-2.0-flash";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Check if API key exists
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing! Set it in your .env file.");
  process.exit(1);
} else {
  console.log("✅ Gemini API key loaded successfully");
}

/**
 * Generate a surreal story using Gemini API
 */
async function generateStory(prompt) {
  const fullPrompt = `Write a concise 100-word surreal story about: ${prompt}`;

  try {
    const model = ai.getGenerativeModel({ model: STORY_MODEL });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 500,
      },
    });

    // Correct: call the function to get string
    const story = result.response.text(); 

    console.log("AI Response:", story);

    if (!story) throw new Error("AI generation failed or returned empty text");
    return story.trim();
  } catch (err) {
    console.error("GenerateStory Error:", err);
    throw err;
  }
}

// -----------------------------
// Express Routes
// -----------------------------

app.post("/api/story", async (req, res) => {
  try {
    const { prompt, maxWords } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt required" });

    const fullPrompt = `Write a surreal story in approximately ${maxWords} words about: ${prompt}`;

    const model = ai.getGenerativeModel({ model: STORY_MODEL });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig: { temperature: 0.9, maxOutputTokens: 1000 }
    });

    const story = result.response.text().trim();

    await db.query(
      "INSERT INTO stories (prompt, story) VALUES (?, ?)",
      [prompt, story]
    );

    res.json({ story });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate story" });
  }
});

app.get("/api/stories", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM stories ORDER BY created_at DESC LIMIT 10");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stories" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 DreamWeaver running on http://localhost:${PORT}`));
