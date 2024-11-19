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
import { commentsData } from "common/data"

const Comments = () => {
  return (
    <React.Fragment>
      <Col xl={4} lg={6}>
        <Card>
          <CardBody>
            <div className="d-flex flex-wrap">
              <div className="me-2">
                <h5 className="card-title mb-3">Comments</h5>
              </div>
              <UncontrolledDropdown className="ms-auto">
                <DropdownToggle
                  tag="a"
                  className="text-muted font-size-16"
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
            <SimpleBar style={{ maxHeight: "310px" }}>
              <ul className="list-group list-group-flush">
                {(commentsData || [])?.map((comment, index) => (
                  <li className="list-group-item py-3" key={index}>
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar-xs">
                          <div className="avatar-title rounded-circle bg-light text-primary">
                            <i className="bx bxs-user"></i>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="font-size-14 mb-1">
                          {comment.name}{" "}
                          <small className="text-muted float-end">{comment.time}</small>
                        </h5>
                        <p className="text-muted">{comment.content}  </p>
                        {comment.replies && (
                          <React.Fragment>
                            <div>
                              <Link to="#" className="text-success"><i className="mdi mdi-reply"></i> Reply</Link>
                            </div>
                            <div className="d-flex pt-3">
                              <div className="flex-shrink-0 me-3">
                                <div className="avatar-xs">
                                  <div className="avatar-title rounded-circle bg-light text-primary">
                                    <i className="bx bxs-user"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                {(comment.replies || [])?.map((reply, replyIndex) => (
                                  <div key={replyIndex}>
                                    <h5 className="font-size-14 mb-1">
                                      {reply.name}{" "}
                                      <small className="text-muted float-end">{reply.time} </small>
                                    </h5>
                                    <p className="text-muted">{reply.content} </p>
                                  </div>
                                ))}
                                <div>
                                  <Link to="#" className="text-success"><i className="mdi mdi-reply"></i> Reply</Link>
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        )}
                        {
                          !comment.replies &&
                          <div>
                            <Link to="#!" className="text-success">
                              <i className="mdi mdi-reply me-1"></i> Reply
                            </Link>
                          </div>
                        }
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </SimpleBar>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  )
}

export default Comments
