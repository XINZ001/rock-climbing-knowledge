const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");

async function main() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
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
}
main();
