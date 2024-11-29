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
  Container,
} from "reactstrap"
import classnames from "classnames"
import {
  approveVacation,
  getApprovalVacations,
} from "../../services/admin/vacation"
import HrPageApprove from "pages/HrDocuments/HrPageApprove"
import VacationPageApprove from "pages/Applications/Vacation/VacationPageApprove/VacationPageApprove"
import PurchasePageApprove from "pages/Applications/InternalProcurement/PurchasePageApprove/PurchasePageApprove"
import TripPageApprove from "pages/Applications/BusinessTrip/TripPageApprove/TripPageApprove"
import LawyerPageApprove from "pages/LawyerPageApprove"

const HeadPage = () => {
  const navigate = useNavigate()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [approvalList, setApprovalList] = useState([])
  const [chosenApproval, setChosenApproval] = useState(null)
  const [activeTab, setActiveTab] = useState("1") // State for Tabs

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const res = await getApprovalVacations({ type: "vocation", page: 1 })

        setApprovalList(res.data.approvalSteps)
      } catch (err) {
        console.error(err)
      }
    }

    fetchApprovals()
  }, [])

  const openModal = data => {
    setModalIsOpen(true)
    setChosenApproval(data)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  const vacationSubmit = async e => {
    e.preventDefault()

    try {
      const res = await approveVacation(chosenApproval.id, {
        status: e.target.status.value,
      })

      window.location.reload()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Admin" breadcrumbItem="Daily Report" />
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
                    მივლინებები
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
                    შიდა შესყიდვები
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
                    შვებულებები
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
                    HR დოკუმენტები
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeTab} className="p-3 text-muted">
                <TabPane tabId="1">
                  <LawyerPageApprove />
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
              <Dialog
                open={modalIsOpen}
                onClose={closeModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
              >
                <>
                  <DialogTitle id="modal-title">
                    {chosenApproval?.model_type.includes("Business") &&
                      "მივლინების"}{" "}
                    {chosenApproval?.model_type.includes("Vocation") &&
                      "შვებულების"}{" "}
                    {chosenApproval?.model_type.includes("Purchase") &&
                      "შიდა შესყიდვის"}{" "}
                    მოთხოვნა
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="modal-description">
                      <form className="w-96" onSubmit={vacationSubmit}>
                        {/* Form Fields Based on chosenApproval Data */}
                      </form>
                    </DialogContentText>
                  </DialogContent>
                </>
              </Dialog>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default HeadPage
