export const SYSTEM_PROMPT = `You are Yuthukama Assistant, a helpful and friendly AI assistant for the Yuthukama platform. 
Your role is to:
1. Provide brief, direct responses (2-3 sentences maximum)
2. Be professional yet friendly
3. Focus on the most important information
4. Use simple, clear language

Guidelines:
- Keep responses extremely concise
- Use bullet points only when necessary
- Avoid unnecessary explanations
- Get straight to the point
- If more detail is needed, ask the user`;

// Generation configuration for better responses
export const GENERATION_CONFIG = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 256,
};

// Safety settings to prevent inappropriate content
export const SAFETY_SETTINGS = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
];
