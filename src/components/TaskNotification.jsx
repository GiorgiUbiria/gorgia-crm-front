import React, { useEffect } from "react"
import echo from "../plugins/echo"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const TaskNotification = () => {
  useEffect(() => {
    console.log("Setting up WebSocket listener for IT tasks")

    const channel = echo.channel("it-tasks")

    channel.subscribed(() => {
      console.log("Successfully subscribed to it-tasks channel")
    })

    channel.error(error => {
      console.debug("IT tasks channel subscription error - skipping", error)
    })

    channel.listen(".it.task.added", data => {
      const priorityColors = {
        High: "🔴",
        Medium: "🟡",
        Low: "🟢",
      }

      toast(
        <div>
          <h4 className="font-bold">დაემატა ახალი IT თასქი</h4>
          <p>{data.task.task_title}</p>
          <p className="text-sm">მოითხოვა: {data.user.name}</p>
          <p>
            {priorityColors[data.task.priority]} {data.task.priority} პრიორიტეტი
          </p>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        }
      )
    })

    return () => {
      console.debug("Cleaning up WebSocket connection")
      channel.stopListening(".it.task.added")
      echo.leaveChannel("it-tasks")
    }
  }, [])

  return null
}

export default TaskNotification
