import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function generateEmbedding(text: string) {
  const model = genAI.getGenerativeModel({ model: "embedding-001" });

  // Correct request format
  const result = await model.embedContent({
    content: {
      role: "user", // Required role field
      parts: [{ text }],
    },
  });

  return result.embedding.values; // Returns the vector embedding
}

export default generateEmbedding;