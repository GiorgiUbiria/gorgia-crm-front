import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Breadcrumbs,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
  Container,
} from "reactstrap"
import classnames from "classnames"
import HrPageApprove from "pages/HrPageApprove"
import VacationPageApprove from "pages/VacationPageApprove/VacationPageApprove"
import PurchasePageApprove from "pages/PurchasePageApprove/PurchasePageApprove"
import TripPageApprove from "pages/TripPageApprove/TripPageApprove"
import LawyerPageApprove from "pages/LawyerPageApprove"

const ArchivePage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("1") // State for Tabs

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Admin" breadcrumbItem="Archive" />
        <Container fluid>
          <div className="vacation-dashboard-container">
            <div className="container-fluid">
              {/* Full Width Tabs */}
              <Nav tabs className="nav-tabs-custom nav-justified w-100">
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => {
                      toggleTab("1")
                    }}
                  >
                    ხელშეკრულებები
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => {
                      toggleTab("2")
                    }}
                  >
                    მივლინება
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: activeTab === "3" })}
                    onClick={() => {
                      toggleTab("3")
                    }}
                  >
                    შესყიდვები
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: activeTab === "4" })}
                    onClick={() => {
                      toggleTab("4")
                    }}
                  >
                    შვებულება
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: activeTab === "5" })}
                    onClick={() => {
                      toggleTab("5")
                    }}
                  >
                    დოკუმენტები
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeTab} className="p-3 text-muted">
                <TabPane tabId="1">
                  <LawyerPageApprove filterStatus={["approved", "rejected"]} />
                </TabPane>
                <TabPane tabId="2">
                  <TripPageApprove filterStatus={["approved", "rejected"]} />
                </TabPane>
                <TabPane tabId="3">
                  <PurchasePageApprove
                    filterStatus={["approved", "rejected"]}
                  />
                </TabPane>
                <TabPane tabId="4">
                  <VacationPageApprove
                    filterStatus={["approved", "rejected"]}
                  />
                </TabPane>
                <TabPane tabId="5">
                  <HrPageApprove filterStatus={["approved", "rejected"]} />
                </TabPane>
              </TabContent>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default ArchivePage
