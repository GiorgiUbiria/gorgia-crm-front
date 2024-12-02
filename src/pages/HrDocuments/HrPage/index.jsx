
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import useIsAdmin from "hooks/useIsAdmin"
import {
  Row,
  Col,
} from "reactstrap"

import React, { useState } from "react"
import {
  Breadcrumbs,
} from "@mui/material"
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Container,
} from "reactstrap"
import classnames from "classnames"
import AuthDocument from "./AuthDocument"
import OthersDocument from "./OthersDocument"




const HrPage = () => {
  document.title = "HR დოკუმენტები | Gorgia LLC"

  const [activeTab, setActiveTab] = useState("1")
  const isAdmin = useIsAdmin()

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  return (
    <React.Fragment>
      <div className="page-content mb-4">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs
                title="HR დოკუმენტები"
                breadcrumbItem="დოკუმენტები"
              />
            </Col>
          </Row>
          <ToastContainer />

        <Container fluid>
          <div className="vacation-dashboard-container">
            <div className="container-fluid">
              <Nav tabs className="nav-tabs-custom nav-justified w-100">
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => {
                      toggleTab("1")
                    }}
                  >
                    ჩემთვის
                  </NavLink>
                </NavItem>
                {isAdmin && <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => {
                      toggleTab("2")
                    }}
                  >
                    სხვისთვის
                  </NavLink>
                </NavItem>}
              </Nav>

              <TabContent activeTab={activeTab} className="p-3 text-muted">
                <TabPane tabId="1">
                  <AuthDocument />
                </TabPane>
                {isAdmin && (
                <TabPane tabId="2">
                  <OthersDocument />
                </TabPane>
                )}
              </TabContent>
              
            </div>
          </div>
        </Container>
        </div>
      </div>
    </React.Fragment>
  )
}

export default HrPage
