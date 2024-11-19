import { filemanagerData, filesData } from "common/data"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  Card,
  CardBody,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledAlert,
  UncontrolledDropdown,
} from "reactstrap"

const FileRightBar = () => {
  const [isOpen, setIsOpen] = useState(true)

  const toggle = () => setIsOpen(!isOpen)
  return (
    <React.Fragment>

      <Card className="filemanager-sidebar me-md-2">
        <CardBody>
          <div className="d-flex flex-column h-100">
            <div className="mb-4">
              <div className="mb-3">
                <UncontrolledDropdown>
                  <DropdownToggle className="btn btn-light w-100" type="button">
                    <i className="mdi mdi-plus me-1"></i> Create New
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem href="#"><i className="bx bx-folder me-1"></i> Folder</DropdownItem>
                    <DropdownItem href="#"><i className="bx bx-file me-1"></i> File</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
              <ul className="list-unstyled categories-list">
                <li>
                  <div className="custom-accordion">
                    <Link
                      className="text-body fw-medium py-1 d-flex align-items-center"
                      onClick={toggle}
                      to="#"
                    >
                      <i className="mdi mdi-folder font-size-16 text-warning me-2"></i>{" "}
                      Files{" "}

                      <i
                        className={
                          isOpen
                            ? "mdi mdi-chevron-up accor-down-icon ms-auto"
                            : "mdi mdi-chevron-down accor-down-icon ms-auto"
                        }
                      />
                    </Link>
                    <Collapse isOpen={isOpen}>
                      <div className="card border-0 shadow-none ps-2 mb-0">
                        <ul className="list-unstyled mb-0">
                          {
                            (filesData || [])?.map((item, index) => (
                              <li key={index}>
                                <Link to="#" className="d-flex align-items-center">
                                  <span className="me-auto">{item.text}</span>
                                  {item.icon && <i className="mdi mdi-pin ms-auto"></i>}
                                </Link>
                              </li>
                            ))
                          }
                        </ul>
                      </div>
                    </Collapse>
                  </div>
                </li>
                {
                  (filemanagerData || [])?.map((item, index) => (
                    <li key={index}>
                      <Link to="#" className="text-body d-flex align-items-center">
                        <i className={item.icon}></i> <span className="me-auto">{item.text}</span>
                        {item.badge && <span className="badge bg-success rounded-pill ms-2">01</span>}
                        {item.icons && <i className="mdi mdi-circle-medium text-danger ms-2"></i>}
                      </Link>
                    </li>
                  ))
                }
              </ul>
            </div>

            <div className="mt-auto">
              <UncontrolledAlert color="success" className="alert-dismissible fade show px-3 mb-0">
                <div className="mb-3">
                  <i className="bx bxs-folder-open h1 text-success"></i>
                </div>

                <div>
                  <h5 className="text-success">Upgrade Features</h5>
                  <p>Cum sociis natoque penatibus et</p>
                  <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none text-success"
                    >
                      Upgrade <i className="mdi mdi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </UncontrolledAlert>
            </div>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}

export default FileRightBar
