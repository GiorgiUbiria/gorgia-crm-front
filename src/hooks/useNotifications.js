import { useEffect } from "react"
import useAuthStore from "../store/zustand/authStore"
import useNotificationStore from "../store/zustand/notificationStore"

const useNotifications = () => {
  const user = useAuthStore(state => state.user)
  const {
    notifications,
    isLoading,
    error,
    initialize,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
    setupEchoListeners,
    cleanup,
  } = useNotificationStore()

  useEffect(() => {
    if (user?.id) {
      initialize()
      setupEchoListeners(user.id)
    }

    return () => {
      cleanup()
    }
  }, [user?.id, initialize, setupEchoListeners, cleanup])

  return {
    notifications,
    isLoading,
    error,
    unreadCount: getUnreadCount(),
    markAsRead,
    markAllAsRead,
    deleteNotification,
  }
}

export default useNotifications 