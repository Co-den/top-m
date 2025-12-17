// utils/germinipage.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export async function getPlanSuggestion(
  planName: string
): Promise<string> {
  if (!planName || typeof planName !== "string") {
    return "Plan name is required";
  }

  if (!API_KEY || !genAI) {
    return "AI service not configured";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      `Provide a brief description for: ${planName}`
    );

    if (!result || !result.response) {
      throw new Error("No response");
    }

    const text = result.response.text();
    return text.trim() || "No description available";
  } catch (error) {
    console.error("Gemini error:", error);
    return "Could not fetch suggestion";
  }
}
