import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI();
const prompt = fs.readFileSync("prompt.txt", "utf8");
try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    });
    console.log(response.text);
} catch(e) {
    console.log("Error:", e);
}
