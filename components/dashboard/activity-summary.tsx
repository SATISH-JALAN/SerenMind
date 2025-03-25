"use client"

import { motion } from "framer-motion"

export function ActivitySummary() {
  const activities = [
    { name: "Therapy Chats", count: 12, unit: "sessions" },
    { name: "Breathing Exercises", count: 18, unit: "sessions" },
    { name: "Guided Meditations", count: 8, unit: "sessions" },
    { name: "Mood Check-ins", count: 24, unit: "times" },
  ]

  const totalTime = "5h 45m"

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.name}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex justify-between items-center"
        >
          <span>{activity.name}</span>
          <span className="font-medium">
            {activity.count} {activity.unit}
          </span>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="pt-4 border-t border-[#6A9FB5]/10"
      >
        <div className="flex justify-between items-center">
          <span className="font-medium">Total Time</span>
          <span className="font-medium text-[#6A9FB5]">{totalTime}</span>
        </div>
      </motion.div>
    </div>
  )
}

