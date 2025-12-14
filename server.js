
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import 'dotenv/config';
import { db } from "./db.js"; 


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));


if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing! Set it in your .env file.");
  process.exit(1);
} else {
  console.log("✅ Gemini API key loaded successfully");
}

async function generateStory(prompt) {
  const fullPrompt = `Write a concise 100-word surreal story about: ${prompt}`;

  try {
    const url = "https://text.pollinations.ai/" + encodeURIComponent(fullPrompt);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const story = (await res.text()).trim();

    console.log("AI Response:", story);

    if (!story) throw new Error("API returned empty text");

    return story;
  } catch (err) {
    console.error("GenerateStory Error:", err);
    throw err;
  }
}


app.post("/api/story", async (req, res) => {
  try {
    const { prompt, maxWords } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt required" });

    const fullPrompt = `Write a surreal story in approximately ${maxWords} words about: ${prompt}`;
    const url = "https://text.pollinations.ai/" + encodeURIComponent(fullPrompt);

    const apiRes = await fetch(url);
    if (!apiRes.ok) throw new Error(`API error: ${apiRes.status}`);

    const story = (await apiRes.text()).trim();

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
    const [rows] = await db.query(
      "SELECT * FROM stories ORDER BY created_at DESC LIMIT 10"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stories" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 DreamWeaver running on http://localhost:${PORT}`));
