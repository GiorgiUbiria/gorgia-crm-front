import { create } from "zustand"
import echo from "../../plugins/echo"
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../services/notification"

const useNotificationStore = create((set, get) => ({
  notifications: [],
  isLoading: false,
  error: null,

  initialize: async () => {
    set({ isLoading: true })
    try {
      const response = await getNotifications()
      const notifications = Array.isArray(response.data) ? response.data : []
      set({ notifications, isLoading: false })
    } catch (error) {
      console.error("Error initializing notifications:", error)
      set({ notifications: [], error: error.message, isLoading: false })
    }
  },

  addNotification: notification => {
    if (!notification) {
      console.error("Invalid notification:", notification)
      return
    }

    set(state => {
      const exists = state.notifications.some(n => n.id === notification.id)
      if (exists) return state

      const newNotification = {
        id: notification.id,
        type: notification.type,
        read_at: null,
        created_at: notification.data?.created_at || new Date().toISOString(),
        data: {
          message: notification.message || notification.data?.message,
          action_url: notification.data?.action_url || "#",
          ...notification.data,
        },
      }

      return {
        notifications: [newNotification, ...state.notifications],
      }
    })
  },

  markAsRead: async notificationId => {
    try {
      await markNotificationAsRead(notificationId)
      set(state => ({
        notifications: state.notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, read_at: new Date().toISOString() }
            : notification
        ),
      }))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  },

  markAllAsRead: async () => {
    try {
      await markAllNotificationsAsRead()
      set(state => ({
        notifications: state.notifications.map(notification => ({
          ...notification,
          read_at: notification.read_at || new Date().toISOString(),
        })),
      }))
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  },

  deleteNotification: async notificationId => {
    try {
      await deleteNotification(notificationId)
      set(state => ({
        notifications: state.notifications.filter(n => n.id !== notificationId),
      }))
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  },

  getUnreadCount: () => {
    const { notifications } = get()
    return Array.isArray(notifications)
      ? notifications.filter(n => !n.read_at).length
      : 0
  },

  setupEchoListeners: userId => {
    if (!userId) return

    echo.private(`App.Models.User.${userId}`).notification(notification => {
      console.log("Received new notification:", notification)
      get().addNotification(notification)
    })
  },

  cleanup: () => {
    if (echo) {
      const { notifications } = get()
      if (notifications?.length > 0) {
        const userId = notifications[0]?.data?.user_id
        if (userId) {
          echo.leave(`App.Models.User.${userId}`)
        }
      }
    }
  },
}))

export default useNotificationStore
