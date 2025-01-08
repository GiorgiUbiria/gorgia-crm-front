import React, { useState } from "react"
import {
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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"
import classnames from "classnames"
import HrPageApprove from "pages/HrDocuments/HrPageApprove"
import VacationPageApprove from "pages/Applications/Vacation/VacationPageApprove/VacationPageApprove"
import PurchasePageApprove from "pages/Applications/InternalProcurement/PurchasePageApprove/PurchasePageApprove"
import TripPageApprove from "pages/Applications/BusinessTrip/TripPageApprove/TripPageApprove"
import StandardAgreementApprove from "pages/Agreements/Standard/StandardAgreementApprove"
import MarketingAgreementApprove from "pages/Agreements/Marketing/MarketingAgreementApprove"
import ServiceAgreementApprove from "pages/Agreements/Service/ServiceAgreementApprove"
import LocalAgreementApprove from "pages/Agreements/Local/LocalAgreementApprove"
import DeliveryAgreementApprove from "pages/Agreements/Delivery/DeliveryAgreementApprove"

const HeadPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [chosenApproval] = useState(null)
  const [activeTab, setActiveTab] = useState("1")
  const [agreementType, setAgreementType] = useState("standard")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState)
  const closeModal = () => setModalIsOpen(false)
  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  const vacationSubmit = async e => {
    e.preventDefault()

    try {
      await approveVacation(chosenApproval.id, {
        status: e.target.status.value,
      })

      window.location.reload()
    } catch (err) {
      console.error(err)
    }
  }

  const renderAgreementApprove = () => {
    switch (agreementType) {
      case "standard":
        return <StandardAgreementApprove />
      case "marketing":
        return <MarketingAgreementApprove />
      case "service":
        return <ServiceAgreementApprove />
      case "local":
        return <LocalAgreementApprove />
      case "delivery":
        return <DeliveryAgreementApprove />
      default:
        return <StandardAgreementApprove />
    }
  }

  return (
    <>
      <div className="max-w-9xl mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-6">
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
              {renderAgreementApprove()}
            </TabPane>
            <TabPane tabId="2">
              <TripPageApprove />
            </TabPane>
            <TabPane tabId="3">
              <PurchasePageApprove />
            </TabPane>
            <TabPane tabId="4">
              <VacationPageApprove />
            </TabPane>
            <TabPane tabId="5">
              <HrPageApprove />
            </TabPane>
          </TabContent>
        </div>
      </div>

      {/* Modal */}
      <Dialog
        open={modalIsOpen}
        onClose={closeModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className="fixed z-50"
      >
        <DialogTitle id="modal-title" className="text-base sm:text-lg">
          {chosenApproval?.model_type.includes("Business") && "მივლინების"}{" "}
          {chosenApproval?.model_type.includes("Vocation") && "შვებულების"}{" "}
          {chosenApproval?.model_type.includes("Purchase") && "შიდა შესყიდვის"}{" "}
          მოთხოვნა
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="modal-description">
            <form
              className="w-full max-w-sm sm:max-w-md md:max-w-lg"
              onSubmit={vacationSubmit}
            >
              {/* Form Fields Based on chosenApproval Data */}
            </form>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default HeadPage
