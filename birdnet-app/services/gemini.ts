
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getBirdFacts = async (birdName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide 3 interesting facts about the bird "${birdName}" in Chinese. Keep them concise and engaging for nature enthusiasts.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Error fetching bird facts:", error);
    return ["这种鸟以其独特的鸣叫声而闻名。", "它们通常栖息在森林边缘和公园中。", "是生态系统中非常重要的昆虫捕食者。"];
  }
};
