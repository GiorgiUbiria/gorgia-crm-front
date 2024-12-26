import React, { useState } from "react"
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
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
    <>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-6">
        <div className="p-2 sm:p-4 lg:p-6">
          <Nav
            tabs
            className="nav-tabs-custom nav-justified w-full flex flex-wrap"
          >
            <NavItem className="w-1/2 sm:w-1/3 lg:w-auto">
              <NavLink
                style={{ cursor: "pointer" }}
                className={classnames(
                  "text-sm sm:text-base py-2 px-1 sm:px-4",
                  { active: activeTab === "1" }
                )}
                onClick={() => toggleTab("1")}
              >
                ხელშეკრულებები
              </NavLink>
            </NavItem>
            <NavItem className="w-1/2 sm:w-1/3 lg:w-auto">
              <NavLink
                style={{ cursor: "pointer" }}
                className={classnames(
                  "text-sm sm:text-base py-2 px-1 sm:px-4",
                  { active: activeTab === "2" }
                )}
                onClick={() => toggleTab("2")}
              >
                მივლინებები
              </NavLink>
            </NavItem>
            <NavItem className="w-1/2 sm:w-1/3 lg:w-auto">
              <NavLink
                style={{ cursor: "pointer" }}
                className={classnames(
                  "text-sm sm:text-base py-2 px-1 sm:px-4",
                  { active: activeTab === "3" }
                )}
                onClick={() => toggleTab("3")}
              >
                შიდა შესყიდვები
              </NavLink>
            </NavItem>
            <NavItem className="w-1/2 sm:w-1/3 lg:w-auto">
              <NavLink
                style={{ cursor: "pointer" }}
                className={classnames(
                  "text-sm sm:text-base py-2 px-1 sm:px-4",
                  { active: activeTab === "4" }
                )}
                onClick={() => toggleTab("4")}
              >
                შვებულებები
              </NavLink>
            </NavItem>
            <NavItem className="w-full sm:w-1/3 lg:w-auto">
              <NavLink
                style={{ cursor: "pointer" }}
                className={classnames(
                  "text-sm sm:text-base py-2 px-1 sm:px-4",
                  { active: activeTab === "5" }
                )}
                onClick={() => toggleTab("5")}
              >
                HR დოკუმენტები
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab} className="p-2 sm:p-3">
            <TabPane tabId="1">
              <div className="mb-3">
                <Dropdown
                  isOpen={dropdownOpen}
                  toggle={toggleDropdown}
                  className="w-full sm:w-auto"
                >
                  <DropdownToggle
                    caret
                    className="w-full sm:w-auto text-sm sm:text-base"
                  >
                    {agreementType === "standard" && "ნასყიდობის ხელშეკრულება"}
                    {agreementType === "marketing" &&
                      "მარკეტინგული მომსახურების ხელშეკრულება"}
                    {agreementType === "service" && "მომსახურების ხელშეკრულება"}
                    {agreementType === "local" &&
                      "ადგილობრივი შესყიდვის ხელშეკრულება"}
                    {agreementType === "delivery" && "მიღება-ჩაბარების აქტი"}
                  </DropdownToggle>
                  <DropdownMenu className="w-full sm:w-auto">
                    <DropdownItem
                      onClick={() => setAgreementType("standard")}
                      className="text-sm sm:text-base"
                    >
                      ნასყიდობის ხელშეკრულება
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => setAgreementType("marketing")}
                      className="text-sm sm:text-base"
                    >
                      მარკეტინგული მომსახურების ხელშეკრულება
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => setAgreementType("service")}
                      className="text-sm sm:text-base"
                    >
                      მომსახურების ხელშეკრულება
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => setAgreementType("local")}
                      className="text-sm sm:text-base"
                    >
                      ადგილობრივი შესყიდვის ხელშეკრულება
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => setAgreementType("delivery")}
                      className="text-sm sm:text-base"
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
    </>
  )
}

export default ArchivePage
