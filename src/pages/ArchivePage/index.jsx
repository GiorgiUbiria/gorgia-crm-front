import React, { useState } from "react"
import { Breadcrumbs } from "@mui/material"
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Container,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"
import classnames from "classnames"

import TripPageArchive from "pages/Applications/BusinessTrip/TripPageArchive"
import VacationPageArchive from "pages/Applications/Vacation/VacationPageArchive"
import ProcurementPageArchive from "pages/Applications/InternalProcurement/ProcurementPageArchive"
import HrPageArchive from "pages/HrDocuments/HrPageArchive"
import StandardAgreementArchive from "pages/Agreements/Standard/StandardAgreementArchive"
import MarketingAgreementArchive from "pages/Agreements/Marketing/MarketingAgreementArchive"
import ServiceAgreementArchive from "pages/Agreements/Service/ServiceAgreementArchive"
import LocalAgreementArchive from "pages/Agreements/Local/LocalAgreementArchive"
import DeliveryAgreementArchive from "pages/Agreements/Delivery/DeliveryAgreementArchive"

const ArchivePage = () => {
  const [activeTab, setActiveTab] = useState("1")
  const [agreementType, setAgreementType] = useState("standard")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState)

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  const renderAgreementArchive = () => {
    switch (agreementType) {
      case "standard":
        return <StandardAgreementArchive />
      case "marketing":
        return <MarketingAgreementArchive />
      case "service":
        return <ServiceAgreementArchive />
      case "local":
        return <LocalAgreementArchive />
      case "delivery":
        return <DeliveryAgreementArchive />
      default:
        return <StandardAgreementArchive />
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
                  <div className="mb-3">
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                      <DropdownToggle caret>
                        {agreementType === "standard" &&
                          "ნასყიდობის ხელშეკრულება"}
                        {agreementType === "marketing" &&
                          "მარკეტინგული მომსახურების ხელშეკრულება"}
                        {agreementType === "service" &&
                          "მომსახურების ხელშეკრულება"}
                        {agreementType === "local" &&
                          "ადგილობრივი შესყიდვის ხელშეკრულება"}
                        {agreementType === "delivery" &&
                          "მიღება-ჩაბარების აქტი"}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          onClick={() => setAgreementType("standard")}
                        >
                          ნასყიდობის ხელშეკრულება
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => setAgreementType("marketing")}
                        >
                          მარკეტინგული მომსახურების ხელშეკრულება
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => setAgreementType("service")}
                        >
                          მომსახურების ხელშეკრულება
                        </DropdownItem>
                        <DropdownItem onClick={() => setAgreementType("local")}>
                          ადგილობრივი შესყიდვის ხელშეკრულება
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => setAgreementType("delivery")}
                        >
                          მიღება-ჩაბარების აქტი
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  {renderAgreementArchive()}
                </TabPane>
                <TabPane tabId="2">
                  <TripPageArchive />
                </TabPane>
                <TabPane tabId="3">
                  <ProcurementPageArchive />
                </TabPane>
                <TabPane tabId="4">
                  <VacationPageArchive />
                </TabPane>
                <TabPane tabId="5">
                  <HrPageArchive />
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
