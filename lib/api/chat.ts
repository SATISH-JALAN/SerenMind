// This file contains the chat API functions
// In a real implementation, these would interact with a backend service

import type { Message } from "@/lib/types";

// ✅ Google API Key (Replace with environment variable in production)
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

// Simulated delay for API calls
const simulateApiDelay = (min = 1000, max = 3000) =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min));

// Get chat history
export async function getChatHistory(userId: string): Promise<Message[]> {
  await simulateApiDelay(500, 1000);

  return [
    {
      id: "1",
      content: "Hello! I'm SerenMind, your AI wellness companion. How are you feeling today?",
      sender: "ai",
      timestamp: new Date(Date.now() - 60000),
    },
  ];
}

// Send a message to the AI
export async function sendMessage(userId: string, content: string): Promise<Message> {
  const userMessage: Message = {
    id: Date.now().toString(),
    content,
    sender: "user",
    timestamp: new Date(),
  };
  return userMessage;
}

// ✅ Fetch AI Response using Google API
async function fetchGoogleAiResponse(userMessage: string): Promise<string> {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: userMessage }] }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // ✅ Correctly extract AI response
    const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process your request.";

    return aiReply;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Sorry, there was an issue connecting to the AI.";
  }
}

// Get AI response
export async function getAiResponse(userId: string, userMessage: string): Promise<Message> {
  await simulateApiDelay();

  let response = await fetchGoogleAiResponse(userMessage); // 🔹 Calls Google AI instead of mock response

  return {
    id: Date.now().toString(),
    content: response,
    sender: "ai",
    timestamp: new Date(),
  };
}

// Clear chat history
export async function clearChatHistory(userId: string): Promise<void> {
  await simulateApiDelay(300, 800);
}