import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";
import { withTranslation } from "react-i18next";
import { getNotifications } from "services/notification";

const NotificationDropdown = (props) => {
  const [menu, setMenu] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = 1; 

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getNotifications();
        setComments(response.data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle real-time notifications
  useEffect(() => {
    if (window.Echo) {
      const channel = window.Echo.channel(`user.${userId}`);
      channel.listen('ReplyMade', (event) => {
        setComments((prevComments) => [
          ...prevComments,
          event.dailyComment
        ]);
      });

      return () => {
        window.Echo.leave(`user.${userId}`);
      };
    }
  }, [userId]);

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
          <i className="bx bx-bell bx-tada" />
          <span className="badge bg-danger rounded-pill">{comments.length}</span>
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0"> {props.t("Notifications")} </h6>
              </Col>
              <div className="col-auto">
                <a href="#" className="small"> View All </a>
              </div>
            </Row>
          </div>

          <SimpleBar style={{ height: "230px" }}>
            {loading ? (
              <div className="text-center p-3">Loading notifications...</div>
            ) : comments.length > 0 ? (
              comments.map((comment, index) => (
                <Link to="" className="text-reset notification-item" key={index}>
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
                        <p className="mb-1">
                          {comment.message}
                        </p>
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

          <div className="p-2 border-top d-grid">
            <Link className="btn btn-sm btn-link font-size-14 text-center" to="#">
              <i className="mdi mdi-arrow-right-circle me-1"></i> <span key="t-view-more">{props.t("View More..")}</span>
            </Link>
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

NotificationDropdown.propTypes = {
  t: PropTypes.any
};

export default withTranslation()(NotificationDropdown);
