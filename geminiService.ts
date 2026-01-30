
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeDocument = async (base64File: string, mimeType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64File.split(',')[1] || base64File,
              mimeType: mimeType
            }
          },
          {
            text: "You are an expert records manager for a government building office. Perform high-accuracy OCR on this document and extract the following: 1. Owner Name 2. Permit Number (if any) 3. Document Date 4. Document Type (e.g., Application, Structural Plan, Electrical Plan) 5. A brief summary of the document content. Return the results clearly formatted."
          }
        ]
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini OCR Error:", error);
    return "Error performing OCR. Please manualy verify the document.";
  }
};
