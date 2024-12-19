// src/context/NotificationsContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react"
import defaultInstance from "plugins/axios"
import echo from "../plugins/echo"

const NotificationsContext = createContext()

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)

  const fetchNotifications = useCallback(async () => {
    try {
      console.log("Fetching notifications...")
      const response = await defaultInstance.get("/api/notifications")
      console.log("Fetched notifications:", response.data)
      setNotifications(response.data.notifications.data)
      setUnreadCount(response.data.unread_count)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }, [])

  const markAsRead = async notificationId => {
    try {
      console.log("Marking notification as read:", notificationId)
      const response = await defaultInstance.post(
        `/api/notifications/${notificationId}/read`
      )
      console.log("Mark as read response:", response.data)

      setNotifications(prev => {
        const updated = prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true, read_at: new Date() }
            : notification
        )
        console.log("Updated notifications after mark as read:", updated)
        return updated
      })

      setUnreadCount(response.data.unread_count)
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      console.log("Marking all notifications as read")
      const response = await defaultInstance.post("/api/notifications/read-all")
      console.log("Mark all as read response:", response.data)

      setNotifications(prev => {
        const updated = prev.map(notification => ({
          ...notification,
          read: true,
          read_at: new Date(),
        }))
        console.log("Updated notifications after mark all as read:", updated)
        return updated
      })

      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const deleteNotification = async notificationId => {
    try {
      console.log("Deleting notification:", notificationId)
      const response = await defaultInstance.delete(
        `/api/notifications/${notificationId}`
      )
      console.log("Delete notification response:", response.data)

      setNotifications(prev => {
        const updated = prev.filter(
          notification => notification.id !== notificationId
        )
        console.log("Updated notifications after delete:", updated)
        return updated
      })

      setUnreadCount(response.data.unread_count)
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const setupNotificationListeners = useCallback(userId => {
    console.log("Setting up notification listeners for user:", userId)

    const channel = echo.private(`notifications.${userId}`)
    console.log("Subscribed to channel:", `notifications.${userId}`)

    // Connection status handlers
    echo.connector.pusher.connection.bind("connected", () => {
      console.log("WebSocket connected")
      setIsConnected(true)
    })

    echo.connector.pusher.connection.bind("disconnected", () => {
      console.log("WebSocket disconnected")
      setIsConnected(false)
    })

    echo.connector.pusher.connection.bind("error", error => {
      console.error("WebSocket error:", error)
      setIsConnected(false)
    })

    // Notification event handlers
    channel.listen(".notification.created", data => {
      console.log("New notification event received:", data)
      setNotifications(prev => {
        // Check if notification already exists
        const exists = prev.some(n => n.id === data.notification.id)
        if (exists) {
          console.log("Notification already exists, skipping update")
          return prev
        }
        const updated = [data.notification, ...prev]
        console.log("Updated notifications after new notification:", updated)
        return updated
      })
      setUnreadCount(prev => {
        const newCount = prev + 1
        console.log("Updated unread count:", newCount)
        return newCount
      })
    })

    channel.listen(".notification.read", data => {
      console.log("Notification read event received:", data)
      setNotifications(prev => {
        const updated = prev.map(notification =>
          notification.id === data.notification.id
            ? {
                ...notification,
                read: true,
                read_at: data.notification.read_at,
              }
            : notification
        )
        console.log("Updated notifications after read event:", updated)
        return updated
      })
      setUnreadCount(data.unread_count)
    })

    channel.listen(".notification.deleted", data => {
      console.log("Notification deleted event received:", data)
      setNotifications(prev => {
        const updated = prev.filter(
          notification => notification.id !== data.notification.id
        )
        console.log("Updated notifications after delete event:", updated)
        return updated
      })
      setUnreadCount(data.unread_count)
    })

    return () => {
      console.log("Cleaning up notification listeners")
      channel.stopListening(".notification.created")
      channel.stopListening(".notification.read")
      channel.stopListening(".notification.deleted")
      echo.leave(`notifications.${userId}`)
    }
  }, [])

  useEffect(() => {
    console.log("NotificationsProvider mounted")
    fetchNotifications()

    const token = sessionStorage.getItem("token")
    if (!token) {
      console.warn("No token found for notifications")
      return
    }

    try {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(c => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join("")
      )
      const { sub: userId } = JSON.parse(jsonPayload)

      if (!userId) {
        console.warn("No user ID found in token")
        return
      }

      console.log("Setting up notifications for user:", userId)
      const cleanup = setupNotificationListeners(userId)

      return () => {
        console.log("NotificationsProvider unmounting")
        cleanup()
      }
    } catch (error) {
      console.error("Error setting up notifications:", error)
    }
  }, [fetchNotifications, setupNotificationListeners])

  const contextValue = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications: fetchNotifications,
    isConnected,
  }

  console.log("NotificationsContext current state:", {
    notificationsCount: notifications.length,
    unreadCount,
    isConnected,
  })

  return (
    <NotificationsContext.Provider value={contextValue}>
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationsContext)
