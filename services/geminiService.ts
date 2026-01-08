
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

const ai = new GoogleGenAI({ apiKey: /*process.env.API_KEY*/ AIzaSyAWJKZO_XwEAsBP-gRsf8ldaE5SQap0w-s });

export class GeminiService {
  async sendMessage(prompt: string, history: { role: 'user' | 'model', text: string }[] = [], customInstruction?: string) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: customInstruction || SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
      return response.text || "I'm sorry, I couldn't process that request.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "I'm having trouble connecting right now.";
    }
  }

  async analyzeImage(prompt: string, base64Data: string, mimeType: string) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: mimeType } },
            { text: prompt }
          ]
        },
        config: {
          systemInstruction: "You are a clinical report analyst. Explain reports simply and highlight abnormalities clearly. Always include a disclaimer that you are an AI, not a doctor.",
          temperature: 0.3,
        }
      });
      return response.text || "Analysis failed.";
    } catch (error) {
      console.error("Vision API Error:", error);
      return "Error processing image.";
    }
  }
}

export const geminiService = new GeminiService();
