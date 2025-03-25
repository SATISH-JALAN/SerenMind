// This file contains the chat API functions
// In a real implementation, these would interact with a backend service

import type { Message } from "@/lib/types"

// Simulated delay for API calls
const simulateApiDelay = (min = 1000, max = 3000) =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min))

// Get chat history
export async function getChatHistory(userId: string): Promise<Message[]> {
  await simulateApiDelay(500, 1000)

  // In a real implementation, this would fetch chat history from a backend
  // For demo purposes, we'll return a mock chat history
  return [
    {
      id: "1",
      content: "Hello! I'm SerenMind, your AI wellness companion. How are you feeling today?",
      sender: "ai",
      timestamp: new Date(Date.now() - 60000),
    },
  ]
}

// Send a message to the AI
export async function sendMessage(userId: string, content: string): Promise<Message> {
  // In a real implementation, this would send the message to a backend AI service
  // For demo purposes, we'll create a mock user message
  const userMessage: Message = {
    id: Date.now().toString(),
    content,
    sender: "user",
    timestamp: new Date(),
  }

  return userMessage
}

// Get AI response
export async function getAiResponse(userId: string, userMessage: string): Promise<Message> {
  await simulateApiDelay()

  // In a real implementation, this would get a response from an AI service
  // For demo purposes, we'll create mock AI responses based on keywords

  let response = ""

  if (userMessage.toLowerCase().includes("anxious") || userMessage.toLowerCase().includes("anxiety")) {
    response =
      "I understand that anxiety can be challenging. Would you like to try a quick breathing exercise to help calm your nerves, or would you prefer to talk more about what's causing your anxiety?"
  } else if (userMessage.toLowerCase().includes("sad") || userMessage.toLowerCase().includes("depressed")) {
    response =
      "I'm sorry to hear you're feeling down. Remember that it's okay to feel this way sometimes. Would you like to explore some activities that might help lift your mood, or would you prefer to talk about what's making you feel this way?"
  } else if (userMessage.toLowerCase().includes("happy") || userMessage.toLowerCase().includes("good")) {
    response =
      "I'm glad to hear you're feeling good! What's contributing to your positive mood today? Understanding what makes us feel good can help us cultivate more of those experiences."
  } else if (userMessage.toLowerCase().includes("tired") || userMessage.toLowerCase().includes("exhausted")) {
    response =
      "Feeling tired can affect our mental wellbeing significantly. Have you been getting enough sleep lately? Would you like some tips for improving your sleep quality or managing your energy throughout the day?"
  } else if (userMessage.toLowerCase().includes("stress") || userMessage.toLowerCase().includes("stressed")) {
    response =
      "Stress can be overwhelming. Let's try to identify what's causing your stress and explore some strategies to manage it. Would you like to talk about specific stressors or try a quick relaxation technique?"
  } else {
    const responses = [
      "Thank you for sharing that with me. How long have you been feeling this way?",
      "I appreciate you opening up. Could you tell me more about what might be contributing to these feelings?",
      "I'm here to support you. Would you like to explore some coping strategies or would you prefer to continue discussing what's on your mind?",
      "That's important to acknowledge. How has this been affecting your daily life?",
      "I understand. Sometimes putting feelings into words can be helpful in itself. Is there anything specific you'd like guidance on?",
    ]
    response = responses[Math.floor(Math.random() * responses.length)]
  }

  return {
    id: Date.now().toString(),
    content: response,
    sender: "ai",
    timestamp: new Date(),
  }
}

// Clear chat history
export async function clearChatHistory(userId: string): Promise<void> {
  await simulateApiDelay(300, 800)

  // In a real implementation, this would clear chat history in the backend
  return
}

