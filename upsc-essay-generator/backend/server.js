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

app.post("/generate-essay", async (req, res) => {
  try {
    const { topic } = req.body;

    const requestBody = {
      contents: [
        {
          parts: [{ text: `Write a UPSC-level essay on the topic: ${topic}` }],
        },
      ],
    };

    const response = await axios.post(GEMINI_API_URL, requestBody, {
      headers: { "Content-Type": "application/json" },
    });

    const essay =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";
    res.json({ essay });
  } catch (error) {
    console.error(
      "Error generating essay:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to generate essay" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
