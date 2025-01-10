import React, { useEffect, useMemo, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Spinner,
  Alert,
} from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import classnames from "classnames"
import MyVacationForm from "./MyVacationForm"
import EmployeeVacationForm from "./EmployeeVacationForm"
import { getPublicDepartments as getDepartments } from "../../../../services/admin/department"
import { getVacationBalance } from "../../../../services/admin/vacation"
import useFetchUser from "../../../../hooks/useFetchUser"
import { usePermissions } from "../../../../hooks/usePermissions"

const VacationPage = () => {
  const navigate = useNavigate()
  const { user, loading: userLoading } = useFetchUser()
  const { isAdmin, isDepartmentHead, isHrMember } = usePermissions()

  const [departments, setDepartments] = useState([])
  const [departmentsLoading, setDepartmentsLoading] = useState(false)
  const [departmentsError, setDepartmentsError] = useState(null)
  const [activeTab, setActiveTab] = useState("1")
  const [vacationBalance, setVacationBalance] = useState(null)
  const [balanceLoading, setBalanceLoading] = useState(false)

  // Fetch vacation balance
  useEffect(() => {
    const fetchVacationBalance = async () => {
      setBalanceLoading(true)
      try {
        const response = await getVacationBalance()
        setVacationBalance(response.data)
      } catch (error) {
        console.error("Error fetching vacation balance:", error)
        toast.error("შვებულების ბალანსის მიღება ვერ მოხერხდა")
      } finally {
        setBalanceLoading(false)
      }
    }

    fetchVacationBalance()
  }, [])

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      setDepartmentsLoading(true)
      try {
        const response = await getDepartments()
        if (response?.data?.data) {
          setDepartments(response.data.data)
        } else {
          setDepartmentsError("Failed to fetch departments.")
        }
      } catch (error) {
        console.error("Error fetching departments:", error)
        setDepartmentsError("An error occurred while fetching departments.")
      } finally {
        setDepartmentsLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  const canManageOthers = useMemo(() => {
    return isAdmin || isDepartmentHead || isHrMember
  }, [isAdmin, isDepartmentHead, isHrMember])

  const toggleTab = useCallback(
    tab => {
      if (tab !== activeTab) {
        setActiveTab(tab)
      }
    },
    [activeTab]
  )

  if (userLoading || departmentsLoading || balanceLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
      </div>
    )
  }

  if (departmentsError) {
    return (
      <div className="text-center mt-5">
        <Alert color="danger">{departmentsError}</Alert>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="p-4 sm:p-6">
          {/* Tab Navigation */}
          {canManageOthers && (
            <Nav tabs className="mb-3">
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "1" })}
                  onClick={() => toggleTab("1")}
                  style={{ cursor: "pointer" }}
                >
                  ჩემი შვებულება
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "2" })}
                  onClick={() => toggleTab("2")}
                  style={{ cursor: "pointer" }}
                >
                  თანამშრომლის შვებულება
                </NavLink>
              </NavItem>
            </Nav>
          )}

          {/* Redirect to "My Vacation" if user cannot manage others and is on wrong tab */}
          {!canManageOthers && activeTab !== "1" && toggleTab("1")}

          {/* Tab Content */}
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Card>
                <CardBody>
                  <MyVacationForm
                    user={user}
                    vacationBalance={vacationBalance}
                    setVacationBalance={setVacationBalance}
                  />
                </CardBody>
              </Card>
            </TabPane>

            {canManageOthers && (
              <TabPane tabId="2">
                <Card>
                  <CardBody>
                    <EmployeeVacationForm
                      departments={departments}
                      navigate={navigate}
                    />
                  </CardBody>
                </Card>
              </TabPane>
            )}
          </TabContent>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </>
  )
}

export default VacationPage
