import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap"
import SimpleBar from "simplebar-react"
import { withTranslation } from "react-i18next"
import { useNotifications } from "../../../context/NotificationsContext"

const NotificationDropdown = props => {
  const [menu, setMenu] = useState(false)
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    isConnected,
  } = useNotifications()

  // Debug logging for props updates
  useEffect(() => {
    console.log("NotificationDropdown - notifications updated:", {
      count: notifications.length,
      notifications,
    })
  }, [notifications])

  useEffect(() => {
    console.log("NotificationDropdown - unreadCount updated:", unreadCount)
  }, [unreadCount])

  useEffect(() => {
    console.log("NotificationDropdown - connection status:", isConnected)
  }, [isConnected])

  const handleMarkAsRead = async (notificationId) => {
    console.log("Marking notification as read:", notificationId)
    await markAsRead(notificationId)
  }

  const handleMarkAllAsRead = async () => {
    console.log("Marking all notifications as read")
    await markAllAsRead()
  }

  const handleDelete = async (notificationId) => {
    console.log("Deleting notification:", notificationId)
    await deleteNotification(notificationId)
  }

  const handleRefresh = async () => {
    console.log("Refreshing notifications")
    await refreshNotifications()
  }

  const renderNotificationContent = notification => {
    console.log("Rendering notification:", notification)
    switch (notification.type) {
      case "it_task":
        return (
          <div>
            <h6 className="mt-0 mb-1">{props.t("New IT Task")}</h6>
            <div className="font-size-12 text-muted">
              <p className="mb-1">{notification.data.task_title}</p>
              <p className="mb-0">
                {props.t("Priority")}: {notification.data.priority}
              </p>
              <p className="mb-0">
                {props.t("Created by")}: {notification.data.created_by.name}
              </p>
            </div>
          </div>
        )
      case "department_user":
        return (
          <div>
            <h6 className="mt-0 mb-1">{props.t("New Team Member")}</h6>
            <div className="font-size-12 text-muted">
              <p className="mb-1">
                {notification.data.user.name} {notification.data.user.sur_name}
              </p>
              <p className="mb-0">
                {props.t("Position")}: {notification.data.user.position}
              </p>
            </div>
          </div>
        )
      default:
        console.log("Unknown notification type:", notification.type)
        return null
    }
  }

  const getNotificationIcon = type => {
    switch (type) {
      case "it_task":
        return "bx bx-task"
      case "department_user":
        return "bx bx-user"
      default:
        return "bx bx-bell"
    }
  }

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => {
          console.log("Toggling notification menu:", !menu)
          setMenu(!menu)
        }}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon position-relative"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          <i className={`bx bx-bell ${unreadCount > 0 ? "bx-tada" : ""}`} />
          {unreadCount > 0 && (
            <span className="badge bg-danger rounded-pill position-absolute top-0 end-0">
              {unreadCount}
            </span>
          )}
          {!isConnected && (
            <span
              className="position-absolute bottom-0 end-0"
              style={{ fontSize: "0.5rem" }}
              title={props.t("Reconnecting to notifications...")}
            >
              <i className="bx bx-error-circle text-warning" />
            </span>
          )}
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
          <div className="p-3 border-bottom">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0">{props.t("შეტყობინებები")}</h6>
              </Col>
              <Col className="text-end">
                {!isConnected ? (
                  <button
                    className="btn btn-sm btn-link text-warning p-0"
                    onClick={handleRefresh}
                    title={props.t("Reconnect")}
                  >
                    <i className="bx bx-refresh" />
                  </button>
                ) : (
                  unreadCount > 0 && (
                    <button
                      className="btn btn-sm btn-link text-muted p-0"
                      onClick={handleMarkAllAsRead}
                    >
                      {props.t("Mark all as read")}
                    </button>
                  )
                )}
              </Col>
            </Row>
          </div>

          <SimpleBar style={{ height: "230px" }}>
            {notifications.length === 0 ? (
              <div className="text-center p-3">
                {props.t("No notifications")}
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`dropdown-item notification-item ${
                    !notification.read ? "bg-light" : ""
                  }`}
                >
                  <div className="d-flex align-items-start">
                    <div className="avatar-xs me-3">
                      <span className="avatar-title bg-primary rounded-circle font-size-16">
                        <i className={getNotificationIcon(notification.type)} />
                      </span>
                    </div>
                    <div className="flex-grow-1">
                      {renderNotificationContent(notification)}
                      <div className="font-size-11 text-muted mt-1">
                        <p className="mb-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      {!notification.read && (
                        <button
                          className="btn btn-link p-0 text-primary"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <i className="bx bx-check-circle" />
                        </button>
                      )}
                      <button
                        className="btn btn-link p-0 text-danger"
                        onClick={() => handleDelete(notification.id)}
                      >
                        <i className="bx bx-trash" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </SimpleBar>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

NotificationDropdown.propTypes = {
  t: PropTypes.any,
}

export default withTranslation()(NotificationDropdown)
