import React, { useState } from "react"
import { Link } from "react-router-dom"
import classNames from "classnames"
import useNotifications from "../../hooks/useNotifications"
import { formatDistanceToNow, isValid, parseISO } from "date-fns"

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications()

  const toggle = () => setIsOpen(!isOpen)

  const handleMarkAsRead = (e, notification) => {
    e.preventDefault()
    e.stopPropagation()
    if (!notification.read_at) {
      markAsRead(notification.id)
    }
  }

  const handleMarkAllAsRead = e => {
    e.preventDefault()
    markAllAsRead()
  }

  const handleDelete = (e, notificationId) => {
    e.preventDefault()
    e.stopPropagation()
    deleteNotification(notificationId)
  }

  const formatTimeAgo = dateString => {
    try {
      if (!dateString) return ""
      const date = parseISO(dateString)
      if (!isValid(date)) return ""
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      console.error("Error formatting date:", error)
      return ""
    }
  }

  const renderNotification = notification => {
    if (!notification?.data) return null
    const { data } = notification
    const timeAgo = formatTimeAgo(notification.created_at)

    return (
      <div
        key={notification.id}
        className="border-b border-gray-200 dark:!border-gray-700 p-2"
      >
        <div className="flex items-start">
          <div className="flex-grow">
            <Link
              to={data.action_url || "#"}
              className={classNames(
                "text-gray-900 dark:!text-gray-100 no-underline hover:text-gray-700 dark:!hover:text-gray-300",
                { "font-semibold": !notification.read_at }
              )}
            >
              <h6 className="text-sm mb-1">{data.message}</h6>
              {timeAgo && (
                <p className="text-xs text-gray-500 dark:!text-gray-400 mb-1">
                  {timeAgo}
                </p>
              )}
            </Link>
          </div>
          <div className="flex gap-2 items-center ml-2">
            {!notification.read_at && (
              <button
                className="text-blue-600 dark:!text-blue-400 hover:text-blue-700 dark:!hover:text-blue-300 p-0"
                onClick={e => handleMarkAsRead(e, notification)}
                title="Mark as read"
              >
                <i className="bx bx-show text-xl"></i>
              </button>
            )}
            <button
              className="text-red-600 dark:!text-red-400 hover:text-red-700 dark:!hover:text-red-300 p-0"
              onClick={e => handleDelete(e, notification.id)}
              title="Delete notification"
            >
              <i className="bx bx-x text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={toggle}
        className="relative p-2 text-gray-600 dark:!text-gray-300 hover:text-gray-700 dark:!hover:text-gray-100"
      >
        <i className="bx bx-bell text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg">
          <div className="rounded-md ring-1 ring-black ring-opacity-5 bg-white dark:!bg-gray-800">
            <div className="border-b border-gray-200 dark:!border-gray-700 p-3">
              <div className="flex items-center justify-between">
                <h6 className="text-sm text-gray-900 dark:!text-gray-100 m-0">
                  შეტყობინებები{" "}
                  {unreadCount > 0 && (
                    <span className="ml-1 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                      {unreadCount} ახალი
                    </span>
                  )}
                </h6>
                {unreadCount > 0 && (
                  <button
                    className="text-sm text-blue-600 dark:!text-blue-400 hover:text-blue-700 dark:!hover:text-blue-300"
                    onClick={handleMarkAllAsRead}
                  >
                    ყველას წაკითხულად მონიშვნა
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-[350px] overflow-auto">
              {notifications.length === 0 ? (
                <div className="p-3 text-center">
                  <p className="text-gray-500 dark:!text-gray-400 m-0">
                    შეტყობინებები არ არის
                  </p>
                </div>
              ) : (
                notifications.map(renderNotification)
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
