import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap"
import SimpleBar from "simplebar-react"
import { withTranslation } from "react-i18next"

const NotificationDropdown = props => {
  const [menu, setMenu] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

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
            className={`bx bx-bell ${
              notifications.length > 0 ? "bx-tada" : ""
            }`}
          />
          <span
            className={`badge rounded-pill ${
              notifications.length > 0 ? "bg-danger" : "bg-secondary"
            }`}
          >
            {notifications.length}
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
            {loading ? (
              <div className="text-center p-3">დამუშავება...</div>
            ) : notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <Link
                  to=""
                  className="text-reset notification-item"
                  key={index}
                >
                  <div className="d-flex">
                    <div className="avatar-xs me-3">
                      <span className="avatar-title bg-primary rounded-circle font-size-16">
                        <i className="bx bx-comment" />
                      </span>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mt-0 mb-1">
                        {props.t("New reply on your comment")}
                      </h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-1">{notification.message}</p>
                        <p className="mb-0">
                          <i className="mdi mdi-clock-outline" />{" "}
                          {props.t("Just now")}{" "}
                        </p>
                      </div>
                    </div>
                  </div>
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
  t: PropTypes.any,
}

export default withTranslation()(NotificationDropdown)
