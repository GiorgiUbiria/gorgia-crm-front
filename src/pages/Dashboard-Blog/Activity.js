import { activityData } from "common/data"
import React from "react"
import { Link } from "react-router-dom"

import {
  Card,
  CardBody,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap"

//SimpleBar
import SimpleBar from "simplebar-react"

const Activity = () => {
  return (
    <React.Fragment>
      <Col xl={4}>
        <Card>
          <CardBody>
            <div className="d-flex align-items-start">
              <div className="me-2">
                <h5 className="card-title mb-4">Activity</h5>
              </div>
              <UncontrolledDropdown className="ms-auto">
                <DropdownToggle
                  className="text-muted font-size-16"
                  tag="a"
                  color="white"
                  type="button"
                >
                  <i className="mdi mdi-dots-horizontal"></i>
                </DropdownToggle>
                <DropdownMenu direction="right">
                  <Link className="dropdown-item" to="#">
                    Action
                  </Link>
                  <Link className="dropdown-item" to="#">
                    Another action
                  </Link>
                  <Link className="dropdown-item" to="#">
                    Something else
                  </Link>
                  <div className="dropdown-divider"></div>
                  <Link className="dropdown-item" to="#">
                    Separated link
                  </Link>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
            <SimpleBar className="mt-2" style={{ maxHeight: "280px" }}>
              <ul className="verti-timeline list-unstyled">
                {(activityData || []).map((event, index) => (
                  <li className={`event-list ${event.active ? 'active' : ''}`} key={index}>
                    <div className="event-timeline-dot">
                      <i className={`bx ${event.active ? "bxs" : "bx"}-right-arrow-circle font-size-18 ${event.active && "bx-fade-right"}`}></i>
                    </div>
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <h5 className="font-size-14">{event.date} <i className="bx bx-right-arrow-alt font-size-16 text-primary align-middle ms-2"></i></h5>
                      </div>
                      <div className="flex-grow-1">
                        <div>
                          {event.title} <span className="fw-semibold"> {event.boldText}</span> {event.text} {event.link && <Link to={event.link}>{event.linkText}</Link>}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </SimpleBar>
            <div className="text-center mt-4">
              <Link
                to="#"
                className="btn btn-primary  btn-sm"
              >
                View More <i className="mdi mdi-arrow-right ms-1"></i>
              </Link>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  )
}

export default Activity
