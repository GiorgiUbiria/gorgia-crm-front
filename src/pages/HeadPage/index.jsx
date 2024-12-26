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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="p-4 sm:p-6">
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

          <TabContent activeTab={activeTab} className="p-3">
            <TabPane tabId="1">
              <div className="mb-3">
                <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                  <DropdownToggle caret>
                    {agreementType === "standard" && "ნასყიდობის ხელშეკრულება"}
                    {agreementType === "marketing" &&
                      "მარკეტინგული მომსახურების ხელშეკრულება"}
                    {agreementType === "service" && "მომსახურების ხელშეკრულება"}
                    {agreementType === "local" &&
                      "ადგილობრივი შესყიდვის ხელშეკრულება"}
                    {agreementType === "delivery" && "მიღება-ჩაბარების აქტი"}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => setAgreementType("standard")}>
                      ნასყიდობის ხელშეკრულება
                    </DropdownItem>
                    <DropdownItem onClick={() => setAgreementType("marketing")}>
                      მარკეტინგული მომსახურების ხელშეკრულება
                    </DropdownItem>
                    <DropdownItem onClick={() => setAgreementType("service")}>
                      მომსახურების ხელშეკრულება
                    </DropdownItem>
                    <DropdownItem onClick={() => setAgreementType("local")}>
                      ადგილობრივი შესყიდვის ხელშეკრულება
                    </DropdownItem>
                    <DropdownItem onClick={() => setAgreementType("delivery")}>
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
        <DialogTitle id="modal-title">
          {chosenApproval?.model_type.includes("Business") && "მივლინების"}{" "}
          {chosenApproval?.model_type.includes("Vocation") && "შვებულების"}{" "}
          {chosenApproval?.model_type.includes("Purchase") && "შიდა შესყიდვის"}{" "}
          მოთხოვნა
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="modal-description">
            <form className="w-96" onSubmit={vacationSubmit}>
              {/* Form Fields Based on chosenApproval Data */}
            </form>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default HeadPage
