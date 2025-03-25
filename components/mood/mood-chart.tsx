"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { MoodEntry } from "@/lib/types"
import { getDayName, formatDate, getHeightForMood, getMoodColor } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MoodChartProps {
  moodHistory: MoodEntry[]
  timeframe: "week" | "month" | "year"
}

export function MoodChart({ moodHistory, timeframe }: MoodChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Sort entries by date (newest to oldest)
  const sortedEntries = [...moodHistory].sort((a, b) => b.date.getTime() - a.date.getTime())

  // Limit entries based on timeframe
  const displayEntries = sortedEntries.slice(0, timeframe === "week" ? 7 : timeframe === "month" ? 30 : 365)

  // For year view, we need to aggregate by month
  const aggregatedEntries = timeframe === "year" ? aggregateByMonth(sortedEntries) : displayEntries

  return (
    <div className="h-64 w-full bg-[#FAFAFA] dark:bg-gray-900 rounded-lg p-6 mb-6">
      <TooltipProvider>
        <div className="h-full w-full flex items-end justify-between">
          {aggregatedEntries.map((entry, index) => (
            <div key={index} className="flex flex-col items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className={`w-12 rounded-t-lg transition-all duration-500 cursor-pointer`}
                    style={{
                      height: `${getHeightForMood(entry.mood)}%`,
                      backgroundColor: getMoodColor(entry.mood),
                    }}
                    whileHover={{ scale: 1.05 }}
                    onHoverStart={() => setHoveredIndex(index)}
                    onHoverEnd={() => setHoveredIndex(null)}
                    initial={{ height: 0 }}
                    animate={{ height: `${getHeightForMood(entry.mood)}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <p className="font-medium">{entry.mood}</p>
                    <p className="text-xs">{formatDate(entry.date)}</p>
                    {entry.notes && <p className="text-xs italic mt-1">"{entry.notes}"</p>}
                  </div>
                </TooltipContent>
              </Tooltip>
              <div className="flex flex-col items-center mt-2">
                <span className="text-xs">
                  {timeframe === "year"
                    ? entry.date.toLocaleDateString("en-US", { month: "short" })
                    : getDayName(entry.date)}
                </span>
                {timeframe !== "year" && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(entry.date)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </TooltipProvider>

      <div className="flex justify-between items-center flex-wrap gap-2 mt-6">
        {["Happy", "Calm", "Neutral", "Anxious", "Sad"].map((mood) => (
          <div key={mood} className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getMoodColor(mood) }}></span>
            <span className="text-xs">{mood}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper function to aggregate mood entries by month for year view
function aggregateByMonth(entries: MoodEntry[]): MoodEntry[] {
  const monthlyEntries: Record<string, MoodEntry[]> = {}

  // Group entries by month
  entries.forEach((entry) => {
    const monthKey = entry.date.toISOString().substring(0, 7) // YYYY-MM format
    if (!monthlyEntries[monthKey]) {
      monthlyEntries[monthKey] = []
    }
    monthlyEntries[monthKey].push(entry)
  })

  // Calculate most common mood for each month
  return Object.entries(monthlyEntries)
    .map(([monthKey, monthEntries]) => {
      // Count occurrences of each mood
      const moodCounts: Record<string, number> = {}
      monthEntries.forEach((entry) => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1
      })

      // Find most common mood
      let mostCommonMood = monthEntries[0].mood
      let highestCount = 0

      Object.entries(moodCounts).forEach(([mood, count]) => {
        if (count > highestCount) {
          mostCommonMood = mood as any
          highestCount = count
        }
      })

      // Return representative entry for the month
      return {
        id: monthKey,
        date: new Date(monthKey + "-01"), // First day of the month
        mood: mostCommonMood as any,
        notes: `Based on ${monthEntries.length} entries`,
      }
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 12) // Last 12 months
}

