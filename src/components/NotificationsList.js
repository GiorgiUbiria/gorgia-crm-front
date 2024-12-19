import React, { useState } from "react"
import { useNotifications } from "../context/NotificationsContext"

const NotificationsList = () => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications()

  const renderNotificationContent = notification => {
    switch (notification.type) {
      case "it_task":
        return (
          <div className="space-y-1">
            <h4 className="font-medium text-gray-900">New IT Task</h4>
            <p className="text-gray-700">{notification.data.task_title}</p>
            <p className="text-gray-600">
              Priority: {notification.data.priority}
            </p>
            <p className="text-gray-600">
              Created by: {notification.data.created_by.name}
            </p>
          </div>
        )
      case "department_user":
        return (
          <div className="space-y-1">
            <h4 className="font-medium text-gray-900">New Team Member</h4>
            <p className="text-gray-700">
              {notification.data.user.name} {notification.data.user.sur_name}
            </p>
            <p className="text-gray-600">
              Position: {notification.data.user.position}
            </p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="relative inline-block">
      <div className="cursor-pointer p-2" onClick={() => setIsOpen(!isOpen)}>
        <div className="relative text-2xl text-gray-600">
          <i className="fas fa-bell"></i>
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs min-w-[1.125rem] text-center">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute right-0 top-full w-90 bg-white rounded-lg shadow-lg z-50 mt-2">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <button
                className="text-blue-500 flex items-center gap-1 hover:text-blue-600"
                onClick={markAllAsRead}
              >
                <i className="fas fa-check-double"></i>
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 flex gap-3 ${
                    !notification.read ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="text-xl text-gray-600 pt-1">
                    {notification.type === "it_task" ? (
                      <i className="fas fa-tasks"></i>
                    ) : (
                      <i className="fas fa-user"></i>
                    )}
                  </div>
                  <div className="flex-1">
                    {renderNotificationContent(notification)}
                    <div className="mt-2 flex justify-between items-center">
                      <small className="text-gray-500">
                        {new Date(notification.created_at).toLocaleString()}
                      </small>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <button
                            className="p-1.5 text-blue-500 hover:bg-gray-100 rounded"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                        )}
                        <button
                          className="p-1.5 text-red-500 hover:bg-gray-100 rounded"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationsList
