import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const sendAIMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message)
      return res.status(400).json({ message: "Message is required" });
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(message);
    const response = await result.response;
    const aiResponse = response.text();
    res.json({ response: aiResponse });
  } catch (error) {
    console.error("AI Chat error:", error);
    res.status(500).json({ message: "Failed to process AI message" });
  }
};
