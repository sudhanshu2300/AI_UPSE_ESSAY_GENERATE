import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const BASE_PROMPT = `
Research the best expert opinions, UPSC toppers’ recommended books, and official UPSC sources on the topic '<TOPIC>'.
Analyze insights from trusted sources like NCERT, The Hindu, Yojana, PIB, and books by renowned authors like Ramesh Singh and M. Laxmikanth.
Then, write a UPSC-level essay in a formal, analytical tone with a balanced perspective. Ensure the essay includes:

1. A strong introduction explaining <TOPIC>.
2. Arguments with real-world examples.
3. Challenges & Ethical Concerns.
4. Counterarguments & Future Prospects.
5. A conclusion summarizing key insights and the way forward.

Ensure logical flow, coherence, and adherence to UPSC standards.
`;

// 🚀 Step 1: Generate the refined prompt
app.post("/generate-prompt", async (req, res) => {
  try {
    const { topic, points } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const customPrompt = `${BASE_PROMPT.replace(/<TOPIC>/g, topic)}
    
    The user has requested to focus on these key points: ${
      points || "None specified."
    }`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: `Refine this essay prompt: ${customPrompt}` }],
        },
      ],
    };

    const response = await axios.post(GEMINI_API_URL, requestBody, {
      headers: { "Content-Type": "application/json" },
    });

    let refinedPrompt =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Failed to generate refined prompt.";

    // ✅ Fix: Replace `\n\n` with `<br/><br/>` and `\n` with `<br/>`
    refinedPrompt = refinedPrompt
      .replace(/\n\n/g, "<br/><br/>")
      .replace(/\n/g, "<br/>");

    res.json({ refinedPrompt });
  } catch (error) {
    console.error(
      "Error generating prompt:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to generate refined prompt" });
  }
});

// 🚀 Step 2: Generate Essay using the refined prompt
app.post("/generate-essay", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    const response = await axios.post(GEMINI_API_URL, requestBody, {
      headers: { "Content-Type": "application/json" },
    });

    let essay =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI. Please try again.";

    // ✅ Fix: Replace `\n\n` (Paragraphs) with `<br/><br/>` for proper rendering
    // ✅ Replace single `\n` (line breaks) with `<br/>`
    essay = essay.replace(/\n\n/g, "<br/><br/>").replace(/\n/g, "<br/>");

    res.json({ essay });
  } catch (error) {
    console.error(
      "Error generating essay:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to generate essay" });
  }
});

const PORT = process.env.PORT || 2302;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
