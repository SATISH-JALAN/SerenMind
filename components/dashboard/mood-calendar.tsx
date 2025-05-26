"use client"
import { motion } from "framer-motion"
import type { MoodEntry } from "@/lib/types"
import { getMoodColor } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MoodCalendarProps {
  moodHistory: MoodEntry[]
}

export function MoodCalendar({ moodHistory }: MoodCalendarProps) {
  // Create a map of dates to moods for quick lookup
  const moodMap = new Map<string, MoodEntry>()
  moodHistory.forEach((entry) => {
    const dateKey = entry.date.toISOString().split("T")[0]
    moodMap.set(dateKey, entry)
  })

  // Generate calendar days for the current month
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Get the first day of the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const startingDayOfWeek = firstDayOfMonth.getDay() // 0 = Sunday, 1 = Monday, etc.

  // Get the number of days in the month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Create an array of days to display
  const days = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={i} className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="aspect-square" />
          }

          const date = new Date(currentYear, currentMonth, day)
          const dateKey = date.toISOString().split("T")[0]
          const entry = moodMap.get(dateKey)
          const isToday = day === today.getDate()

          return (
            <Tooltip key={`day-${day}`}>
              <TooltipTrigger asChild>
                <motion.div
                  className={`aspect-square rounded-full flex items-center justify-center text-xs cursor-pointer ${isToday ? "ring-2 ring-[#6A9FB5]" : ""}`}
                  style={{
                    backgroundColor: entry ? getMoodColor(entry.mood) : "transparent",
                    opacity: entry ? 1 : 0.3,
                  }}
                  whileHover={{ scale: 1.1 }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: entry ? 1 : 0.3 }}
                  transition={{ duration: 0.2, delay: i * 0.01 }}
                >
                  {day}
                </motion.div>
              </TooltipTrigger>
              {entry && (
                <TooltipContent>
                  <div className="text-center">
                    <p className="font-medium">{entry.mood}</p>
                    <p className="text-xs">{date.toLocaleDateString()}</p>
                    {entry.notes && <p className="text-xs italic mt-1">"{entry.notes}"</p>}
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}

