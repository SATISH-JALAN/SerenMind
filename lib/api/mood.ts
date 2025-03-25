// This file contains the mood tracking API functions
// In a real implementation, these would interact with a backend service

import type { MoodEntry, MoodInsight } from "@/lib/types"

// Simulated delay for API calls
const simulateApiDelay = () => new Promise((resolve) => setTimeout(resolve, 1000))

// Get mood history
export async function getMoodHistory(
  userId: string,
  timeframe: "week" | "month" | "year" = "week",
): Promise<MoodEntry[]> {
  await simulateApiDelay()

  // In a real implementation, this would fetch mood history from a backend
  // For demo purposes, we'll return mock mood entries

  const now = new Date()
  const moodTypes = ["Happy", "Calm", "Neutral", "Anxious", "Sad"]
  const entries: MoodEntry[] = []

  let daysToGenerate = 7
  if (timeframe === "month") daysToGenerate = 30
  if (timeframe === "year") daysToGenerate = 365

  for (let i = 0; i < daysToGenerate; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    entries.push({
      id: `mood-${i}`,
      date,
      mood: moodTypes[Math.floor(Math.random() * moodTypes.length)] as any,
      notes: i % 3 === 0 ? "Added some notes about my day" : undefined,
    })
  }

  return entries
}

// Save a new mood entry
export async function saveMoodEntry(userId: string, mood: string, notes?: string): Promise<MoodEntry> {
  await simulateApiDelay()

  // In a real implementation, this would save the mood entry to a backend
  // For demo purposes, we'll return a mock entry

  return {
    id: `mood-${Date.now()}`,
    date: new Date(),
    mood: mood as any,
    notes,
  }
}

// Get mood insights
export async function getMoodInsights(userId: string): Promise<MoodInsight[]> {
  await simulateApiDelay()

  // In a real implementation, this would fetch AI-generated insights from a backend
  // For demo purposes, we'll return mock insights

  return [
    {
      id: "insight-1",
      title: "Morning Mood Pattern",
      description:
        "You tend to feel more positive in the mornings. Consider scheduling challenging tasks for these times when your mood is typically better.",
      type: "pattern",
    },
    {
      id: "insight-2",
      title: "Stress Triggers",
      description:
        "Work-related activities often correlate with increased stress levels. Taking short breaks during work might help manage this stress.",
      type: "trigger",
    },
    {
      id: "insight-3",
      title: "Mood Improvement",
      description:
        "Physical activity appears to improve your mood. Even short walks could be beneficial for your mental wellbeing.",
      type: "improvement",
    },
  ]
}

// Get mood recommendations
export async function getMoodRecommendations(userId: string, currentMood?: string): Promise<any[]> {
  await simulateApiDelay()

  // In a real implementation, this would fetch personalized recommendations from a backend
  // For demo purposes, we'll return mock recommendations based on the current mood

  if (currentMood === "Anxious" || currentMood === "Stressed") {
    return [
      {
        id: "rec-1",
        title: "5-Minute Breathing Exercise",
        description: "A quick breathing technique to help reduce anxiety",
        type: "exercise",
        duration: "5 min",
      },
      {
        id: "rec-2",
        title: "Progressive Muscle Relaxation",
        description: "Tense and relax each muscle group to release physical tension",
        type: "exercise",
        duration: "10 min",
      },
    ]
  } else if (currentMood === "Sad") {
    return [
      {
        id: "rec-3",
        title: "Gratitude Journaling",
        description: "Write down three things you're grateful for to shift perspective",
        type: "activity",
        duration: "5 min",
      },
      {
        id: "rec-4",
        title: "Mood-Boosting Playlist",
        description: "Listen to uplifting music that can help improve your mood",
        type: "media",
        duration: "15 min",
      },
    ]
  } else {
    return [
      {
        id: "rec-5",
        title: "Mindfulness Meditation",
        description: "A guided meditation to help maintain emotional balance",
        type: "exercise",
        duration: "10 min",
      },
      {
        id: "rec-6",
        title: "Nature Walk",
        description: "Spending time in nature can help maintain positive mood",
        type: "activity",
        duration: "20 min",
      },
    ]
  }
}

