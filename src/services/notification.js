import defaultInstance from "../plugins/axios"

export const getNotifications = async () => {
  try {
    const response = await defaultInstance.get("/api/notifications")
    return response.data
  } catch (error) {
    console.error("Error fetching notifications:", error)
    throw error
  }
}

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await defaultInstance.post(`/api/notifications/${notificationId}/read`)
    return response.data
  } catch (error) {
    console.error("Error marking notification as read:", error)
    if (error.response?.status === 403) {
      throw new Error("You don't have permission to mark this notification as read")
    }
    throw error
  }
}

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await defaultInstance.post("/api/notifications/read-all")
    return response.data
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    throw error
  }
}

export const deleteNotification = async (notificationId) => {
  try {
    const response = await defaultInstance.delete(`/api/notifications/${notificationId}`)
    return response.data
  } catch (error) {
    console.error("Error deleting notification:", error)
    if (error.response?.status === 403) {
      throw new Error("You don't have permission to delete this notification")
    }
    throw error
  }
}
