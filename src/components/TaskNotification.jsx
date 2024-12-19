import React, { useEffect, useState } from "react"
import echo from "../plugins/echo"

const TaskNotification = () => {
  const [notifications, setNotifications] = useState([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    console.log("Setting up WebSocket listener for IT tasks")

    // Listen for connection success
    echo.connector.pusher.connection.bind("connected", () => {
      console.log("Successfully connected to Reverb")
      setConnected(true)
    })

    // Listen for connection errors
    echo.connector.pusher.connection.bind("error", error => {
      console.error("Failed to connect to Reverb:", error)
      setConnected(false)
    })

    // Subscribe to the channel
    const channel = echo.channel("it-tasks")

    // Debug channel subscription
    channel.subscribed(() => {
      console.log("Successfully subscribed to it-tasks channel")
    })

    channel.error(error => {
      console.error("Channel subscription error:", error)
    })

    // Listen for events
    channel.listen(".it.task.added", data => {
      console.log("New task notification received:", data)

      const notification = {
        id: Date.now(),
        title: data.task.task_title,
        priority: data.task.priority,
        user: data.user.name,
        timestamp: new Date(data.task.created_at).toLocaleString(),
      }

      setNotifications(prev => [notification, ...prev])

      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id))
      }, 5000)
    })

    return () => {
      console.log("Cleaning up WebSocket connection")
      channel.unsubscribe()
      echo.disconnect()
    }
  }, [])

  // Add a connection status indicator (optional)
  return (
    <>
      {!connected && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-100 text-yellow-800 p-2 text-center">
          Connecting to notification service...
        </div>
      )}
      <div className="fixed top-4 right-4 z-50">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className="bg-white shadow-lg rounded-lg p-4 mb-4 max-w-sm animate-slide-in"
          >
            <h4 className="font-bold text-lg">New IT Task</h4>
            <p className="text-gray-600">{notification.title}</p>
            <p className="text-sm text-gray-500">
              Created by: {notification.user}
            </p>
            <span
              className={`inline-block px-2 py-1 rounded text-sm ${
                notification.priority === "High"
                  ? "bg-red-100 text-red-800"
                  : notification.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {notification.priority}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

export default TaskNotification
