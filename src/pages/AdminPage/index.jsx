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
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { getDepartments, getUsers } from "../../services/admin/department"
import UsersTab from "./UsersTab"
import DepartmentsTab from "./DepartmentsTab"

const AdminPage = () => {
  document.title = "ადმინისტრირება | Gorgia LLC"

  const [activeTab, setActiveTab] = useState("1")
  const [departments, setDepartments] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchDepartments()
    fetchUsers()
  }, [])

  const fetchDepartments = async () => {
    try {
      const res = await getDepartments()
      console.log("departments", res.data.departments)
      setDepartments(res.data.departments)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await getUsers()
      console.log("users", res.data.users)
      setUsers(res.data.users)
    } catch (err) {
      console.error(err)
    }
  }

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const handleUserDeleted = async () => {
    await fetchUsers()
  }

  const handleDepartmentDeleted = async () => {
    await fetchDepartments()
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="ადმინისტრირება" breadcrumbItem="მართვის პანელი" />
        <Row>
          <Col lg="12">
            <Card className="shadow-sm">
              <CardBody className="px-2 px-sm-3">
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
                    <UsersTab users={users} onUserDeleted={handleUserDeleted} />
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AdminPage
