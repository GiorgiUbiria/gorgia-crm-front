import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col, Tooltip } from "reactstrap"
import SimpleBar from "simplebar-react"
import { withTranslation } from "react-i18next"
import echo from "../../../plugins/echo"
import { useSelector } from "react-redux"
import defaultInstance from "plugins/axios"

const NotificationDropdown = props => {
  const [menu, setMenu] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [tooltipOpen, setTooltipOpen] = useState({})
  const user = useSelector(state => state.user.user)

  useEffect(() => {
    if (!user || !user.id) return;

    const channel = echo.private(`notifications.${user.id}`)

    channel.listen('.notification.created', data => {
      setNotifications(prev => {
        const prevNotifications = Array.isArray(prev) ? prev : [];
        return [data.notification, ...prevNotifications];
      });
      setUnreadCount(data.unread_count || 0);
    })

    channel.listen('.notification.deleted', data => {
      setNotifications(prev => {
        const prevNotifications = Array.isArray(prev) ? prev : [];
        return prevNotifications.filter(n => n.id !== data.notification.id);
      });
      setUnreadCount(data.unread_count || 0);
    })

    channel.listen('.notification.read', data => {
      setNotifications(prev => {
        const prevNotifications = Array.isArray(prev) ? prev : [];
        return prevNotifications.map(n =>
          n.id === data.notification.id ? { ...n, read: true } : n
        );
      });
      setUnreadCount(data.unread_count || 0);
    })

    const fetchNotifications = async () => {
      try {
        const response = await defaultInstance.get('/api/notifications')
        const fetchedNotifications = Array.isArray(response.data.notifications.data)
          ? response.data.notifications.data
          : [];
        console.log("Fetched Notifications:", fetchedNotifications);
        setNotifications(fetchedNotifications);
        setUnreadCount(response.data.unread_count || 0);
      } catch (error) {
        console.error("Error fetching notifications:", error)
        setNotifications([]);
        setUnreadCount(0);
      }
    }

    fetchNotifications()

    return () => {
      channel.stopListening('.notification.created')
      channel.stopListening('.notification.deleted')
      channel.stopListening('.notification.read')
      channel.unsubscribe()
    }
  }, [user])

  const toggleTooltip = (id) => {
    setTooltipOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon position-relative"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          <i
            className={`bx bx-bell ${unreadCount > 0 ? "bx-tada" : ""
              }`}
          />
          <span
            className={`badge rounded-pill ${unreadCount > 0 ? "bg-danger" : "bg-secondary"
              }`}
          >
            {unreadCount}
          </span>
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0"> {props.t("შეტყობინებები")} </h6>
              </Col>
            </Row>
          </div>

          <SimpleBar style={{ height: "230px" }}>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Link
                  to=""
                  className="text-reset notification-item"
                  key={notification.id}
                  id={`notification-${notification.id}`}
                >
                  <div className="d-flex">
                    <div className="avatar-xs me-3">
                      <span className="avatar-title bg-primary rounded-circle font-size-16">
                        <i className="bx bx-comment" />
                      </span>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mt-0 mb-1">
                        {notification.data.task_title} - {notification.data.status}
                      </h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-1">
                          Priority: {notification.data.priority}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Tooltip
                    placement="right"
                    isOpen={tooltipOpen[notification.id] || false}
                    target={`notification-${notification.id}`}
                    toggle={() => toggleTooltip(notification.id)}
                  >
                    <div>
                      <strong>Task ID:</strong> {notification.data.task_id}
                    </div>
                    <div>
                      <strong>Created By:</strong>{" "}
                      {notification.data.created_by.name}
                    </div>
                    <div>
                      <strong>Priority:</strong> {notification.data.priority}
                    </div>
                    <div>
                      <strong>Status:</strong> {notification.data.status}
                    </div>
                    <div>
                      <strong>Created At:</strong>{" "}
                      {new Date(notification.created_at).toLocaleString()}
                    </div>
                  </Tooltip>
                </Link>
              ))
            ) : (
              <div className="text-center p-3">No notifications</div>
            )}
          </SimpleBar>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

NotificationDropdown.propTypes = {
  t: PropTypes.func.isRequired,
}

export default withTranslation()(NotificationDropdown)
