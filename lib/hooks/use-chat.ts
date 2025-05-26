"use client"

import { useState, useEffect } from "react"
import type { Message } from "@/lib/types"
import { useAuth } from "@/lib/context/auth-context"
import { getChatHistory, sendMessage as apiSendMessage, getAiResponse } from "@/lib/api/chat"

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    // Load chat history when user changes
    const loadChatHistory = async () => {
      if (user) {
        try {
          const history = await getChatHistory(user.id)
          setMessages(history)
        } catch (error) {
          console.error("Error loading chat history:", error)
        }
      } else {
        // If no user, set default welcome message
        setMessages([
          {
            id: "welcome",
            content: "Hello! I'm SerenMind, your AI wellness companion. How are you feeling today?",
            sender: "ai",
            timestamp: new Date(),
          },
        ])
      }
    }

    loadChatHistory()
  }, [user])

  const sendMessage = async (content: string) => {
    try {
      // Add user message to state immediately for UI responsiveness
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: "user",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])

      // Send message to API
      if (user) {
        await apiSendMessage(user.id, content)
      }

      // Show typing indicator
      setIsTyping(true)

      // Get AI response
      const aiMessage = await getAiResponse(user?.id || "anonymous", content)

      // Add AI response to state
      setMessages((prev) => [...prev, aiMessage])

      // Hide typing indicator
      setIsTyping(false)

      return aiMessage
    } catch (error) {
      console.error("Error sending message:", error)
      setIsTyping(false)
      throw error
    }
  }

  const clearChat = async () => {
    try {
      if (user) {
        await getChatHistory(user.id) // Replace with appropriate logic if needed
      }

      // Reset to welcome message
      setMessages([
        {
          id: "welcome",
          content: "Hello! I'm SerenMind, your AI wellness companion. How are you feeling today?",
          sender: "ai",
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error("Error clearing chat:", error)
      throw error
    }
  }

  return {
    messages,
    sendMessage,
    isTyping,
    clearChat,
  }
}