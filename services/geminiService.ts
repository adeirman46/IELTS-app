
import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiWritingSample } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this context, we assume the key is present.
  console.warn("API_KEY environment variable not set. Gemini API will not function.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateSampleAnswer = async (prompt: string, question: string): Promise<string> => {
    if (!API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return "This is a sample answer. If I were asked about my hometown, I would mention that it's a bustling city with a rich history. The most interesting part is definitely the old town square, which has beautiful architecture and lively cafes.";
    }

    try {
        const fullPrompt = `You are an IELTS speaking coach. Provide a concise, natural-sounding sample answer for the following IELTS Speaking Part 1 question.
        
        **Topic:**
        ${prompt}

        **Question:**
        ${question}
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                thinkingConfig: { thinkingBudget: 0 },
                maxOutputTokens: 150
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating sample answer:", error);
        return "Sorry, I couldn't generate a sample answer at the moment.";
    }
};