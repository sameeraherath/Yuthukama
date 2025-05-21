import config from "../config/config.js";
import {
  SYSTEM_PROMPT,
  GENERATION_CONFIG,
  SAFETY_SETTINGS,
} from "../constants/prompts.js";

// Log the API key status (without exposing the actual key)
console.log(
  "Gemini API Key Status:",
  config.geminiApiKey ? "Present" : "Missing"
);

export const getAIMessage = async (req, res) => {
  try {
    console.log("Request received:", req.body);
    const { message } = req.body;

    if (!message) {
      console.log("No message provided in request");
      return res.status(400).json({ message: "Message is required" });
    }

    if (!config.geminiApiKey) {
      console.error("Gemini API key is missing in config");
      return res.status(500).json({
        message: "AI service configuration error",
        error: "API key not configured",
      });
    }

    try {
      console.log("Sending request to Gemini API...");
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${config.geminiApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${SYSTEM_PROMPT}\n\nUser: ${message}\n\nAssistant:`,
                  },
                ],
              },
            ],
            generationConfig: GENERATION_CONFIG,
            safetySettings: SAFETY_SETTINGS,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API Error:", errorData);
        throw new Error(
          errorData.error?.message || "Failed to get response from Gemini API"
        );
      }

      const data = await response.json();
      console.log("Response received from Gemini API");

      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid response format from Gemini API");
      }

      const text = data.candidates[0].content.parts[0].text;
      console.log("Text extracted successfully");

      return res.json({ response: text });
    } catch (geminiError) {
      console.error("Gemini API Error Details:", {
        name: geminiError.name,
        message: geminiError.message,
        stack: geminiError.stack,
      });
      return res.status(500).json({
        message: "Error communicating with AI service",
        error: geminiError.message,
      });
    }
  } catch (error) {
    console.error("AI Chat Controller Error Details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      message: "Error processing AI message",
      error: error.message,
    });
  }
};
