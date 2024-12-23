import React, { useEffect, useState } from "react"
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap"
import classnames from "classnames"
import { useSelector } from "react-redux"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import {
  getDepartments,
  getUsers,
  getDepartmentMembers,
} from "../../services/admin/department"
import UsersTab from "./UsersTab"
import DepartmentsTab from "./DepartmentsTab"
import { usePermissions } from "hooks/usePermissions"

const AdminPage = () => {
  document.title = "ადმინისტრირება | Gorgia LLC"

  const [activeTab, setActiveTab] = useState("1")
  const [departments, setDepartments] = useState([])
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const currentUser = useSelector(state => state.user.user)

  const { isAdmin, isDepartmentHead, userDepartmentId, isHrMember } =
    usePermissions()

  useEffect(() => {
    const initializeData = async () => {
      if (!currentUser) {
        setIsLoading(true)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        if (isHrMember) {
          const response = await getUsers()
          console.log(response)
          if (response.data?.users) {
            setUsers(response.data.users)
          } else if (response.data?.message) {
            setError(response.data.message)
          }
        } else if (isDepartmentHead && currentUser.department_id) {
          const response = await getDepartmentMembers(currentUser.department_id)
          if (response.data?.members) {
            setUsers(response.data.members)
          } else if (response.data?.message) {
            setError(response.data.message)
          }
        } else if (isAdmin) {
          const [deptResponse, usersResponse] = await Promise.all([
            getDepartments(),
            getUsers(),
          ])
          setDepartments(deptResponse.data.departments)
          setUsers(usersResponse.data.users)
        } else if (currentUser.roles) {
          setError("Unauthorized access. Required role not found.")
        }
      } catch (err) {
        console.error("Error fetching data:", err.response || err)
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.exception ||
          err.message ||
          "Error fetching data"
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [currentUser, isDepartmentHead, isAdmin])

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const handleUserDeleted = async () => {
    if (isDepartmentHead && userDepartmentId) {
      try {
        const response = await getDepartmentMembers(userDepartmentId)
        if (response.data?.members) {
          setUsers(response.data.members)
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error refreshing members list")
      }
    } else if (isAdmin) {
      try {
        const response = await getUsers()
        setUsers(response.data.users)
      } catch (err) {
        setError(err.response?.data?.message || "Error refreshing users list")
      }
    }
  }

  const handleDepartmentDeleted = async () => {
    if (isAdmin) {
      try {
        const response = await getDepartments()
        setDepartments(response.data.departments)
      } catch (err) {
        setError(
          err.response?.data?.message || "Error refreshing departments list"
        )
      }
    }
  }

  if (isLoading && !currentUser) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center">Loading user data...</div>
        </Container>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center">Loading content...</div>
        </Container>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="alert alert-danger" role="alert">
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {typeof error === "string"
                ? error
                : JSON.stringify(error, null, 2)}
            </pre>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="ადმინისტრირება" breadcrumbItem="მართვის პანელი" />
        <Row>
          <Col lg="12">
            <Card className="shadow-sm">
              <CardBody className="px-2 px-sm-3">
                {isDepartmentHead && users.length > 0 ? (
                  <UsersTab
                    users={users}
                    onUserDeleted={handleUserDeleted}
                    isDepartmentHead={true}
                    currentUserDepartmentId={userDepartmentId}
                  />
                ) : isAdmin ? (
                  <>
                    <Nav tabs className="nav-tabs-custom nav-justified">
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === "1" })}
                          onClick={() => toggle("1")}
                        >
                          <span>დეპარტამენტები</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === "2" })}
                          onClick={() => toggle("2")}
                        >
                          <span>მომხმარებლები</span>
                        </NavLink>
                      </NavItem>
                    </Nav>

                    <TabContent activeTab={activeTab} className="p-3">
                      <TabPane tabId="1">
                        <DepartmentsTab
                          departments={departments}
                          onDepartmentDeleted={handleDepartmentDeleted}
                          users={users}
                        />
                      </TabPane>

                      <TabPane tabId="2">
                        <UsersTab
                          users={users}
                          onUserDeleted={handleUserDeleted}
                          currentUserDepartmentId={userDepartmentId}
                          isDepartmentHead={isDepartmentHead}
                        />
                      </TabPane>
                    </TabContent>
                  </>
                ) : isHrMember ? (
                  <UsersTab
                    users={users}
                    onUserDeleted={handleUserDeleted}
                    isDepartmentHead={true}
                    currentUserDepartmentId={userDepartmentId}
                  />
                ) : (
                  <div className="alert alert-warning">
                    Unauthorized access. Please contact administrator.
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AdminPage
