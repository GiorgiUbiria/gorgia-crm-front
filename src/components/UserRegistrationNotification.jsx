import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import echo from "../plugins/echo"
import { CrmToast, CrmToastProvider } from "./CrmToast"
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notification"

const UserRegistrationNotification = ({
  userId,
  departmentId,
  isHeadOfDepartment,
}) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [toastOpen, setToastOpen] = useState(false)
  const [currentToast, setCurrentToast] = useState(null)

  // Fetch existing notifications on mount
  useEffect(() => {
    if (!userId || !departmentId) return

    const fetchNotifications = async () => {
      try {
        const response = await getNotifications()
        const userRegistrationNotifications = response.notifications.filter(
          notification => notification.type === "user_registration"
        )
        setNotifications(userRegistrationNotifications)
        setUnreadCount(response.unread_count)
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      }
    }

    fetchNotifications()
  }, [userId, departmentId])

  useEffect(() => {
    if (!userId || !departmentId || !isHeadOfDepartment) return

    // Subscribe to department channel for heads
    const departmentChannel = echo.private(`department.${departmentId}`)

    departmentChannel.listen(".user.registered", data => {
      const { user, department, created_at } = data

      const notification = {
        id: Date.now(),
        type: "user_registration",
        user: {
          name: `${user.name} ${user.surname}`,
          email: user.email,
          position: user.position,
          mobile: user.mobile_number,
          idNumber: user.id_number,
        },
        department: department.name,
        created_at,
        read_at: null,
      }

      // Update notifications list
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)

      // Show toast
      setCurrentToast(notification)
      setToastOpen(true)
    })

    // Listen for notification read events
    departmentChannel.listen(".notification.read", data => {
      const { notification } = data
      setNotifications(prev =>
        prev.map(n =>
          n.id === notification.id ? { ...n, read_at: notification.read_at } : n
        )
      )
      setUnreadCount(data.unread_count)
    })

    // Listen for notification deleted events
    departmentChannel.listen(".notification.deleted", data => {
      const { notification } = data
      setNotifications(prev => prev.filter(n => n.id !== notification.id))
      setUnreadCount(data.unread_count)
    })

    return () => {
      departmentChannel.stopListening(".user.registered")
      departmentChannel.stopListening(".notification.read")
      departmentChannel.stopListening(".notification.deleted")
      echo.leave(`department.${departmentId}`)
    }
  }, [departmentId, isHeadOfDepartment, userId])

  const handleMarkAsRead = async notificationId => {
    try {
      const response = await markNotificationAsRead(notificationId)
      setUnreadCount(response.unread_count)
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await markAllNotificationsAsRead()
      setUnreadCount(response.unread_count)
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  if (!userId || !departmentId) {
    return null
  }

  return (
    <>
      <CrmToastProvider>
        {currentToast && (
          <CrmToast
            open={toastOpen}
            onOpenChange={setToastOpen}
            title="New User Registration"
            description={`${currentToast.user.name} has registered in ${currentToast.department}`}
            variant="info"
            duration={5000}
          />
        )}
      </CrmToastProvider>

      {unreadCount > 0 && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
          {unreadCount}
        </div>
      )}

      <div className="fixed top-16 right-4 z-50 w-96 max-h-[calc(100vh-8rem)] overflow-y-auto">
        {notifications.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">User Registrations</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="space-y-4">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    !notification.read_at
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                  onClick={() =>
                    !notification.read_at && handleMarkAsRead(notification.id)
                  }
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{notification.user.name}</h4>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Position: {notification.user.position}</p>
                    <p>Email: {notification.user.email}</p>
                    <p>Department: {notification.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

UserRegistrationNotification.propTypes = {
  userId: PropTypes.number.isRequired,
  departmentId: PropTypes.number.isRequired,
  isHeadOfDepartment: PropTypes.bool.isRequired,
}

export default UserRegistrationNotification
