// This file contains the chat API functions
// In a real implementation, these would interact with a backend service

import type { Message } from "@/lib/types";

// ✅ Google API Key (Replace with environment variable in production)
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

// Simulated delay for API calls
const simulateApiDelay = (min = 1000, max = 3000) =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min));

// ✅ Personalized welcome chat history
export async function getChatHistory(userId: string): Promise<Message[]> {
  await simulateApiDelay(500, 1000);

  return [
    {
      id: "1",
      content: "Hello! I'm SerenMind, your AI wellness companion.  How are you feeling today?",
      sender: "ai",
      timestamp: new Date(Date.now() - 60000),
    },
  ];
}

// Save and return user message
export async function sendMessage(userId: string, content: string): Promise<Message> {
  const userMessage: Message = {
    id: Date.now().toString(),
    content,
    sender: "user",
    timestamp: new Date(),
  };
  return userMessage;
}

// ✅ Fetch AI Response using Google Gemini Pro
async function fetchGoogleAiResponse(userMessage: string): Promise<string> {
  if (!GOOGLE_API_KEY) {
    console.error("Google API key is missing");
    throw new Error("Google API key is missing. Please check your environment variables.");
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`;

  const requestBody = {
    contents: [{
      parts: [{
        text: `You are Serenmind, a mental health AI companion. Your responses should be:
1. Empathetic and supportive
2. Natural and conversational
3. Focused on emotional well-being
4. Brief and to the point
5. Free of medical advice or diagnoses

User message: ${userMessage}

Respond as a caring friend who listens and supports.`
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 400,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };

  try {
    console.log("Sending request to Google AI API:", {
      url: apiUrl,
      body: JSON.stringify(requestBody, null, 2)
    });

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    console.log("Raw API response:", responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { rawResponse: responseText };
      }

      console.error("Google AI API Error:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        error: errorData
      });
      
      if (response.status === 400) {
        throw new Error(`Invalid request to Google AI API: ${errorData.error?.message || 'Unknown error'}`);
      } else if (response.status === 401) {
        throw new Error("Unauthorized. Please check your Google API key.");
      } else if (response.status === 403) {
        throw new Error("Access denied. Please check your Google API key permissions.");
      } else {
        throw new Error(`API request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
      }
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse API response:", responseText);
      throw new Error("Invalid response from Google AI API");
    }
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("Unexpected API response format:", data);
      throw new Error("Unexpected response format from Google AI API");
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch AI response");
  }
}

// Get AI response
export async function getAiResponse(userId: string, userMessage: string): Promise<Message> {
  try {
    // Simulate API delay
    await simulateApiDelay();

    // Get AI response
    const aiResponse = await fetchGoogleAiResponse(userMessage);

    // Create and return AI message
    const aiMessage: Message = {
      id: Date.now().toString(),
      content: aiResponse,
      sender: "ai",
      timestamp: new Date(),
    };

    return aiMessage;
  } catch (error) {
    console.error("Error getting AI response:", error);
    
    // Return a fallback message if the API fails
    return {
      id: Date.now().toString(),
      content: "I'm having trouble connecting right now. Could you try again in a moment?",
      sender: "ai",
      timestamp: new Date(),
    };
  }
}
