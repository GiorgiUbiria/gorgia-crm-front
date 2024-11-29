import React, { useState } from "react"
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
  Container,
} from "reactstrap"
import classnames from "classnames"

import LawyerPageArchive from "pages/LawyerPageArchive/LawyerPageArchive"
import HrPage from "pages/HrDocuments/HrPage/index"
import UserProcurement from "pages/UserProcurements"
import UserVocation from "pages/UserVocations"
import UserTrip from "pages/Applications/BusinessTrip/UserTrips"


const ArchivePage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [chosenArchiveItem, setChosenArchiveItem] = useState(null)
  const [activeTab, setActiveTab] = useState("1")

  const openModal = data => {
    setModalIsOpen(true)
    setChosenArchiveItem(data)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Admin" breadcrumbItem="Archives" />
        <Container fluid>
          <div className="archive-dashboard-container">
            <div className="container-fluid">
              <Nav tabs className="nav-tabs-custom nav-justified w-100">
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => toggleTab("1")}
                  >
                    ხელშეკრულებები
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => toggleTab("2")}
                  >
                    მივლინებები
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: activeTab === "3" })}
                    onClick={() => toggleTab("3")}
                  >
                    შიდა შესყიდვები
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: activeTab === "4" })}
                    onClick={() => toggleTab("4")}
                  >
                    შვებულებები
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: activeTab === "5" })}
                    onClick={() => toggleTab("5")}
                  >
                    HR დოკუმენტები
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeTab} className="p-3 text-muted">
                <TabPane tabId="1">
                  <LawyerPageArchive />
                </TabPane>
                <TabPane tabId="2">
                  <UserTrip />
                </TabPane>
                <TabPane tabId="3">
                  <UserProcurement />
                </TabPane>
                <TabPane tabId="4">
                  <UserVocation />
                </TabPane>
                <TabPane tabId="5">
                  <HrPage />
                </TabPane>
              </TabContent>

              <Dialog
                open={modalIsOpen}
                onClose={closeModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
              >
                <DialogTitle id="modal-title">
                  {chosenArchiveItem?.type} - არქივი
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="modal-description">
                    {/* Archive item details will be displayed here */}
                  </DialogContentText>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default ArchivePage 