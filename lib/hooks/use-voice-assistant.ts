"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"

interface UseVoiceAssistantProps {
  enabled: boolean
  pitch?: number
  rate?: number
  volume?: number
}

export function useVoiceAssistant({
  enabled = false,
  pitch = 1.1, // Slightly higher pitch for female voice
  rate = 0.9, // Slightly slower for soothing effect
  volume = 1.0,
}: UseVoiceAssistantProps) {
  const [isAvailable, setIsAvailable] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const { toast } = useToast()

  // Get available voices
  const loadVoices = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return

    const availableVoices = window.speechSynthesis.getVoices()
    if (availableVoices.length === 0) return

    setVoices(availableVoices)

    // Try to find a female voice
    const femaleVoice = availableVoices.find(
      (voice) =>
        (voice.name.toLowerCase().includes("female") ||
          voice.name.includes("Samantha") ||
          voice.name.includes("Victoria") ||
          voice.name.includes("Ava") ||
          voice.name.includes("Moira") ||
          voice.name.includes("Karen")) &&
        voice.lang.startsWith("en"),
    )

    if (femaleVoice) {
      setSelectedVoice(femaleVoice)
    } else {
      // Fallback to any English voice
      const englishVoice = availableVoices.find((voice) => voice.lang.startsWith("en"))
      setSelectedVoice(englishVoice || availableVoices[0])
    }
  }, [])

  // Check if speech synthesis is available
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsAvailable(true)

      // Load voices
      loadVoices()

      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
    } else if (typeof window !== "undefined") {
      toast({
        title: "Voice Assistant Unavailable",
        description: "Your browser doesn't support speech synthesis.",
        variant: "destructive",
      })
    }
  }, [loadVoices, toast])

  // Cancel any ongoing speech when component unmounts
  useEffect(() => {
    return () => {
      if (isAvailable && typeof window !== "undefined") {
        window.speechSynthesis.cancel()
      }
    }
  }, [isAvailable])

  // Speak text function
  const speak = useCallback(
    (text: string) => {
      if (!isAvailable || !enabled || typeof window === "undefined") return

      try {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)

        // Set voice properties
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }

        utterance.pitch = pitch
        utterance.rate = rate
        utterance.volume = volume

        // Add event listeners
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event)
          setIsSpeaking(false)
        }

        // Speak the text
        window.speechSynthesis.speak(utterance)
      } catch (error) {
        console.error("Error in speech synthesis:", error)
        setIsSpeaking(false)
      }
    },
    [isAvailable, enabled, selectedVoice, pitch, rate, volume],
  )

  // Stop speaking
  const stop = useCallback(() => {
    if (!isAvailable || typeof window === "undefined") return
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [isAvailable])

  return {
    isAvailable,
    isSpeaking,
    speak,
    stop,
    voices,
    selectedVoice,
    setSelectedVoice,
  }
}

