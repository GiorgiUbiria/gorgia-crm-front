import React, { useState } from "react"
import { Col, Card, CardBody, Nav, NavItem, NavLink, Table, Input, Label } from "reactstrap"
import { Link } from "react-router-dom"
import classnames from "classnames"

//Simple bar
import SimpleBar from "simplebar-react"
import { tasksData } from "common/data"

const TotalSellongProduct = props => {
  const [activeTab, setActiveTab] = useState("1")

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }
  return (
    <React.Fragment>
      <Col xl="4">
        <Card>
          <CardBody>
            <h4 className="card-title mb-4">Tasks</h4>

            <Nav pills className="bg-light rounded">
              <NavItem>
                <NavLink
                  className={classnames({
                    active: activeTab === "1",
                  })}
                  onClick={() => {
                    toggleTab("1")
                  }}
                >
                  In Process
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: activeTab === "2",
                  })}
                  onClick={() => {
                    toggleTab("2")
                  }}
                >
                  Upcoming
                </NavLink>
              </NavItem>
            </Nav>

            <div className="mt-4">
              <SimpleBar style={{ maxHeight: "250px" }}>
                <div className="table-responsive">
                  <Table className="table table-nowrap align-middle table-hover mb-0">
                    <tbody>
                      {
                        (tasksData || [])?.map((item, index) => (
                          <tr key={index}>
                            <td style={{ width: "50px" }}>
                              <div className="form-check">
                                <Input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="customCheck1"
                                />
                                <Label
                                  className="form-check-label"
                                  for="customCheck1"
                                />
                              </div>
                            </td>
                            <td>
                              <h5 className="text-truncate font-size-14 mb-1">
                                <Link to="#" className="text-dark">
                                  {item.task}
                                </Link>
                              </h5>
                              <p className="text-muted mb-0">Assigned to {item.assignedTo}</p>
                            </td>
                            <td style={{ width: "90px" }}>
                              <div>
                                <ul className="list-inline mb-0 font-size-16">
                                  <li className="list-inline-item">
                                    <Link to="#" className="text-success p-1">
                                      <i className="bx bxs-edit-alt" />
                                    </Link>
                                  </li>
                                  <li className="list-inline-item">
                                    <Link to="#" className="text-danger p-1">
                                      <i className="bx bxs-trash" />
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </Table>
                </div>
              </SimpleBar>
            </div>
          </CardBody>

          <div className="card-footer bg-transparent border-top">
            <div className="text-center">
              <Link to="#" className="btn btn-primary ">
                {" "}
                Add new Task
              </Link>
            </div>
          </div>
        </Card>
      </Col>
    </React.Fragment>
  )
}

export default TotalSellongProduct
