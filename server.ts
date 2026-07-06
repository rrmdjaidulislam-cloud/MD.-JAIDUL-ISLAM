import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper for safe system prompt
const TUTOR_SYSTEM_INSTRUCTION = `You are Tutor Jahid, an expert, encouraging, and friendly math tutor from Edustika.
You teach students math in a clear, step-by-step, premium educational style.
You speak in a warm, friendly mix of Bengali and English (Bengali-English bilingual) since your target students are from Bangladesh.
Always break down complex equations with simple logic, explain concepts intuitively, and congratulate students on their efforts.
When explaining equations, structure your answers clearly using Markdown.
If the student asks something unrelated to education, gently bring them back to mathematics.`;

// API Endpoints
// 1. Solve math equations or explain concepts
app.post("/api/gemini/solve", async (req, res) => {
  const { prompt, topic } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Topic: ${topic || "General Mathematics"}\n\nQuestion: ${prompt}`,
      config: {
        systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Solve Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate math explanation" });
  }
});

// 2. Generate customized math quizzes with multiple choice options
app.post("/api/gemini/quiz", async (req, res) => {
  const { topic, difficulty } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate 3 multiple choice quiz questions in Bengali & English about ${topic || "Algebra"} with difficulty ${difficulty || "Medium"}. For each question, provide 4 options, the index of the correct answer (0-3), and a clear step-by-step tutor explanation in Bengali.`,
      config: {
        systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quizzes: {
              type: Type.ARRAY,
              description: "List of multiple choice quiz questions",
              items: {
                type: Type.OBJECT,
                properties: {
                  question: {
                    type: Type.STRING,
                    description: "The math question text, in a friendly blend of Bengali and English"
                  },
                  options: {
                    type: Type.ARRAY,
                    description: "Array of exactly 4 options",
                    items: { type: Type.STRING }
                  },
                  correctAnswer: {
                    type: Type.INTEGER,
                    description: "Index of the correct answer in the options array (0 to 3)"
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "Friendly step-by-step solution breakdown in Bengali"
                  }
                },
                required: ["question", "options", "correctAnswer", "explanation"]
              }
            }
          },
          required: ["quizzes"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Gemini Quiz Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate quiz" });
  }
});

// Vite Middleware Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
