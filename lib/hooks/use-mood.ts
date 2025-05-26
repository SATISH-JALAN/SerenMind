"use client"

import { useState, useEffect } from "react"
import type { MoodEntry, MoodInsight } from "@/lib/types"
import { useAuth } from "@/lib/context/auth-context"
import {
  getMoodHistory,
  saveMoodEntry as apiSaveMoodEntry,
  getMoodInsights,
  getMoodRecommendations,
} from "@/lib/api/mood"

export function useMood() {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [insights, setInsights] = useState<MoodInsight[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("week")
  const { user } = useAuth()

  useEffect(() => {
    // Load mood history when user or timeframe changes
    const loadMoodData = async () => {
      if (user) {
        setIsLoading(true)
        try {
          const history = await getMoodHistory(user.id, timeframe)
          setMoodHistory(history)

          const moodInsights = await getMoodInsights(user.id)
          setInsights(moodInsights)

          const moodRecommendations = await getMoodRecommendations(user.id)
          setRecommendations(moodRecommendations)
        } catch (error) {
          console.error("Error loading mood data:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadMoodData()
  }, [user, timeframe])

  const saveMoodEntry = async (mood: string, notes?: string) => {
    try {
      setIsLoading(true)

      if (!user) {
        throw new Error("User must be logged in to save mood entries")
      }

      const newEntry = await apiSaveMoodEntry(user.id, mood, notes)

      // Update local state
      setMoodHistory((prev) => [newEntry, ...prev])

      // Get updated recommendations based on new mood
      const updatedRecommendations = await getMoodRecommendations(user.id, mood)
      setRecommendations(updatedRecommendations)

      return newEntry
    } catch (error) {
      console.error("Error saving mood entry:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    moodHistory,
    insights,
    recommendations,
    isLoading,
    timeframe,
    setTimeframe,
    saveMoodEntry,
  }
}

