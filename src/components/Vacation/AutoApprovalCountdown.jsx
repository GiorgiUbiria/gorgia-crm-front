import React, { useState, useEffect } from "react"
import { Tooltip } from "@mui/material"

const AutoApprovalCountdown = ({ createdAt }) => {
  const [timeLeft, setTimeLeft] = useState("")
  const [isWarning, setIsWarning] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const created = new Date(createdAt)
      const deadline = new Date(created.getTime() + 24 * 60 * 60 * 1000) // 24 hours
      const now = new Date()
      const difference = deadline - now

      if (difference <= 0) {
        setTimeLeft("ავტომატურად დამტკიცდება")
        return
      }

      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

      setIsWarning(hours < 2) // Warning when less than 2 hours left
      setTimeLeft(`${hours}სთ ${minutes}წთ`)
    }

    const timer = setInterval(calculateTimeLeft, 60000) // Update every minute
    calculateTimeLeft() // Initial calculation

    return () => clearInterval(timer)
  }, [createdAt])

  return (
    <Tooltip title="ავტომატური დამტკიცების დრომდე დარჩენილია" arrow>
      <span
        className={`badge ${
          isWarning ? "bg-warning" : "bg-info"
        } font-size-12`}
      >
        {timeLeft}
      </span>
    </Tooltip>
  )
}

export default AutoApprovalCountdown 