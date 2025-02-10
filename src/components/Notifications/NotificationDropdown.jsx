import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import classNames from "classnames"
import useNotifications from "../../hooks/useNotifications"
import { formatDistanceToNow, isValid, parseISO } from "date-fns"
import notificationSound from "../../assets/sounds/notification.mp3"

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications()
  const [previousCount, setPreviousCount] = useState(unreadCount)
  const [hasInteracted, setHasInteracted] = useState(false)
  const notificationAudio = React.useMemo(() => new Audio(notificationSound), [])

  const toggle = () => {
    setIsOpen(!isOpen)
    setHasInteracted(true)
  }

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
      let distance = formatDistanceToNow(date, { addSuffix: true })
      distance = distance
        .replace("about", "დაახლოებით")
        .replace("less than a minute", "1 წუთზე ნაკლები")
        .replace("minute", "წუთი")
        .replace(/minutes/, "წუთი")
        .replace("hour", "საათი")
        .replace(/hours/, "საათი")
        .replace("day", "დღე")
        .replace(/days/, "დღე")
        .replace("month", "თვე")
        .replace(/months/, "თვე")
        .replace("year", "წელი")
        .replace(/years/, "წელი")
        .replace("ago", "წინ")
        .replace("in", "შემდეგ")

      distance = distance
        .replace(/წუთიs/, "წუთის")
        .replace(/საათიs/, "საათის")
        .replace(/დღიs/, "დღის")
        .replace(/თვიs/, "თვის")
        .replace(/წლიs/, "წლის")
      return distance
    } catch (error) {
      console.error("შეცდომა თარიღის ფორმატირებისას:", error)
      return ""
    }
  }

  useEffect(() => {
    if (unreadCount > previousCount && hasInteracted) {
      notificationAudio.play().catch(error => {
        if (error.name !== "NotAllowedError") {
          console.error("Audio playback failed:", error)
        }
      })
    }
    setPreviousCount(unreadCount)
  }, [unreadCount, previousCount, hasInteracted, notificationAudio])

  const renderNotification = notification => {
    if (!notification?.data) return null
    const { data } = notification
    const timeAgo = formatTimeAgo(notification.created_at)

    return (
      <div
        key={notification.id}
        className="border-b border-gray-100 dark:!border-gray-700/50 px-4 py-3 hover:bg-gray-50/80 dark:!hover:bg-gray-700/30 transition-all duration-200"
      >
        <div className="flex items-start gap-4">
          <div
            className={classNames(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
              notification.read_at
                ? "text-gray-400 dark:!text-gray-500"
                : "text-blue-600/80 dark:!text-blue-300/80 bg-blue-50 dark:!bg-blue-900/20"
            )}
          >
            <i
              className={classNames(
                "bx text-xl transition-all duration-200",
                notification.read_at ? "bx-envelope-open" : "bx-envelope"
              )}
            ></i>
          </div>
          <div className="flex-grow min-w-0">
            <Link
              to={data.action_url || "#"}
              className={classNames(
                "block text-gray-900 dark:!text-gray-100 no-underline group",
                { "font-medium": !notification.read_at }
              )}
            >
              <h6 className="text-sm mb-1 leading-snug group-hover:text-blue-600 dark:!group-hover:!text-blue-400 transition-colors duration-200">
                {data.message}
              </h6>
              {timeAgo && (
                <p className="text-xs text-gray-400 dark:!text-gray-500 mb-0">
                  {timeAgo}
                </p>
              )}
            </Link>
          </div>
          <div className="flex gap-1.5 items-center ml-2">
            {!notification.read_at && (
              <button
                className="text-blue-500 dark:!text-blue-400 hover:text-blue-600 dark:!hover:text-blue-300 p-1.5 rounded-full hover:bg-blue-50 dark:!hover:bg-blue-900/30 transition-all duration-200"
                onClick={e => handleMarkAsRead(e, notification)}
                title="Mark as read"
              >
                <i className="bx bx-check text-xl"></i>
              </button>
            )}
            <button
              className="text-gray-400 dark:!text-gray-500 hover:text-red-500 dark:!hover:text-red-400 p-1.5 rounded-full hover:bg-red-50 dark:!hover:bg-red-900/30 transition-all duration-200"
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
        className="relative p-1.5 sm:p-2 text-gray-600 dark:!text-gray-300 hover:text-gray-700 dark:!hover:text-gray-100 transition-colors duration-200"
      >
        <i className="bx bx-bell text-lg sm:text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-blue-100 dark:!bg-blue-900/30 text-[10px] sm:text-xs text-blue-600 dark:!text-blue-300 font-medium ring-1 ring-blue-200 dark:!ring-blue-700/50">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-50 md:hidden"
            onClick={toggle}
          ></div>
          <div
            className={`
            fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 md:hidden
            ${isOpen ? "translate-y-0" : "translate-y-full"}
          `}
          >
            <div className="bg-white dark:!bg-gray-800/95 backdrop-blur-sm rounded-t-xl shadow-lg max-h-[80vh] overflow-hidden">
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-12 h-1 rounded-full bg-gray-300 dark:!bg-gray-600"></div>
              </div>

              <div className="border-b border-gray-100 dark:!border-gray-700/50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h6 className="text-sm font-medium text-gray-900 dark:!text-gray-100 m-0">
                    შეტყობინებები{" "}
                    {unreadCount > 0 && (
                      <span className="ml-2 rounded-full bg-blue-100 dark:!bg-blue-900/30 px-2 py-0.5 text-xs text-blue-600 dark:!text-blue-300 font-medium ring-1 ring-blue-200 dark:!ring-blue-700/50">
                        {unreadCount} ახალი
                      </span>
                    )}
                  </h6>
                  {unreadCount > 0 && (
                    <button
                      className="text-sm text-blue-500 dark:!text-blue-400 hover:text-blue-600 dark:!hover:text-blue-300 transition-colors duration-200"
                      onClick={handleMarkAllAsRead}
                    >
                      ყველას წაკითხულად მონიშვნა
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-[calc(80vh-4rem)] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-200 dark:!scrollbar-thumb-gray-700">
                {notifications.length === 0 ? (
                  <div className="py-12 text-center">
                    <i className="bx bx-envelope-open text-4xl text-gray-300 dark:!text-gray-600 mb-3"></i>
                    <p className="text-gray-400 dark:!text-gray-500 m-0 text-sm">
                      შეტყობინებები არ არის
                    </p>
                  </div>
                ) : (
                  notifications.map(renderNotification)
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:block absolute right-0 mt-2 w-[420px] rounded-lg shadow-lg transform opacity-100 scale-100 transition-all duration-200">
            <div className="rounded-lg ring-1 ring-black/5 bg-white dark:!bg-gray-800/95 backdrop-blur-sm">
              <div className="border-b border-gray-100 dark:!border-gray-700/50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h6 className="text-sm font-medium text-gray-900 dark:!text-gray-100 m-0">
                    შეტყობინებები{" "}
                    {unreadCount > 0 && (
                      <span className="ml-2 rounded-full bg-blue-100 dark:!bg-blue-900/30 px-2 py-0.5 text-xs text-blue-600 dark:!text-blue-300 font-medium ring-1 ring-blue-200 dark:!ring-blue-700/50">
                        {unreadCount} ახალი
                      </span>
                    )}
                  </h6>
                  {unreadCount > 0 && (
                    <button
                      className="text-sm text-blue-500 dark:!text-blue-400 hover:text-blue-600 dark:!hover:text-blue-300 transition-colors duration-200"
                      onClick={handleMarkAllAsRead}
                    >
                      ყველას წაკითხულად მონიშვნა
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-[420px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-200 dark:!scrollbar-thumb-gray-700">
                {notifications.length === 0 ? (
                  <div className="py-12 text-center">
                    <i className="bx bx-envelope-open text-4xl text-gray-300 dark:!text-gray-600 mb-3"></i>
                    <p className="text-gray-400 dark:!text-gray-500 m-0 text-sm">
                      შეტყობინებები არ არის
                    </p>
                  </div>
                ) : (
                  notifications.map(renderNotification)
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default NotificationDropdown
