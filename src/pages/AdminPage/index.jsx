import React, { useEffect, useState } from "react"
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Button,
  Input,
  Table,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Badge,
} from "reactstrap"
import { FaTrash, FaPlus, FaSearch, FaFileDownload } from "react-icons/fa"
import classnames from "classnames"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import {
  assignHead,
  createDepartment,
  deleteDepartment,
  getDepartments,
  getUsers,
  deleteUser,
  updateUserById,
} from "../../services/admin/department"
import DepartmentForm from "components/DepartmentForm"
import UserForm from "components/UserForm"
import * as XLSX from "xlsx"
import useIsAdmin from "hooks/useIsAdmin"
import UsersTab from "./UsersTab"
import DepartmentsTab from "./DepartmentsTab"

const AdminPage = () => {
  const { t } = useTranslation()
  const isAdmin = useIsAdmin()
  const [activeTab, setActiveTab] = useState("1")
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [chosenDepartment, setChosenDepartment] = useState(null)
  const [chosenUser, setChosenUser] = useState(null)
  const [departments, setDepartments] = useState([])
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState("")

  useEffect(() => {
    document.title = "ადმინისტრირება | Gorgia LLC"
    fetchDepartments()
    fetchUsers()
  }, [])

  const fetchDepartments = async () => {
    try {
      const res = await getDepartments()
      setDepartments(res.data.departments)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await getUsers()
      setUsers(res.data.users)
    } catch (err) {
      console.error(err)
    }
  }

  const openDepartmentModal = (department = null) => {
    setChosenDepartment(department)
    setIsEditMode(!!department)
    setIsDepartmentModalOpen(true)
  }

  const openUserModal = (user = null) => {
    setChosenUser(user)
    setIsEditMode(!!user)
    setIsUserModalOpen(true)
  }

  const handleAddDepartment = async data => {
    try {
      await createDepartment(data)
      toast.success(t("Department added successfully"))
      fetchDepartments()
      setIsDepartmentModalOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddUser = async data => {
    try {
      await updateUserById(chosenUser.id, data)
      toast.success(t("User updated successfully"))
      fetchUsers()
      setIsUserModalOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAssignHead = async data => {
    try {
      await assignHead(data)
      toast.success(t("Department head assigned successfully"))
      fetchDepartments()
      setIsDepartmentModalOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteDepartment = async (id, name) => {
    if (window.confirm(`${t("Are you sure you want to delete")} ${name}?`)) {
      try {
        await deleteDepartment(id)
        toast.success(t("Department deleted successfully"))
        fetchDepartments()
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleDeleteUser = async user => {
    if (
      window.confirm(
        `${t("Are you sure you want to delete user")} ${user.name}?`
      )
    ) {
      try {
        await deleteUser(user.id)
        toast.success(t("User deleted successfully"))
        fetchUsers()
      } catch (error) {
        console.error(error)
      }
    }
  }

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const filteredDepartments = departments.filter(
    dep =>
      dep.name.toLowerCase().includes(departmentSearchTerm.toLowerCase()) ||
      (dep.head?.name || "")
        .toLowerCase()
        .includes(departmentSearchTerm.toLowerCase())
  )

  const filteredUsers = users.filter(
    user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const searchInputStyle = {
    paddingRight: "2.5rem",
    borderRadius: "4px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
  }

  const searchIconStyle = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#64748b",
  }

  const exportUsersToExcel = () => {
    const data = [
      ["გვარი", "სახელი", "ელ-ფოსტა", "დეპარტამენტი", "როლი"],
      ...filteredUsers.map(user => [
        user.sur_name,
        user.name,
        user.email,
        user.department?.name || "არ არის მითითებული",
        user.role,
      ]),
    ]

    const ws = XLSX.utils.aoa_to_sheet(data)

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Users")

    XLSX.writeFile(wb, "მომხმარებლები.xlsx")
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="ადმინისტრირება" breadcrumbItem="მართვის პანელი" />
        <Row>
          <Col lg="12">
            <Card className="shadow-sm">
              <CardBody>
                <Nav tabs className="nav-tabs-custom nav-justified">
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "1" })}
                      onClick={() => toggle("1")}
                    >
                      <span className="d-none d-sm-block">დეპარტამენტები</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "2" })}
                      onClick={() => toggle("2")}
                    >
                      <span className="d-none d-sm-block">მომხმარებლები</span>
                    </NavLink>
                  </NavItem>
                </Nav>

                <TabContent activeTab={activeTab} className="p-3">
                  <TabPane tabId="1">
                    <DepartmentsTab
                      departmentSearchTerm={departmentSearchTerm}
                      setDepartmentSearchTerm={setDepartmentSearchTerm}
                      openDepartmentModal={openDepartmentModal}
                      filteredDepartments={filteredDepartments}
                      handleDeleteDepartment={handleDeleteDepartment}
                      searchInputStyle={searchInputStyle}
                      searchIconStyle={searchIconStyle}
                    />
                  </TabPane>

                  <TabPane tabId="2">
                    <UsersTab
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      openUserModal={openUserModal}
                      filteredUsers={filteredUsers}
                      handleDeleteUser={handleDeleteUser}
                      exportUsersToExcel={exportUsersToExcel}
                      isAdmin={isAdmin}
                      searchInputStyle={searchInputStyle}
                      searchIconStyle={searchIconStyle}
                    />
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>

            <DepartmentForm
              isOpen={isDepartmentModalOpen}
              toggle={() => setIsDepartmentModalOpen(!isDepartmentModalOpen)}
              onSubmit={handleAddDepartment}
              onAssignHead={handleAssignHead}
              department={chosenDepartment}
              isEditMode={isEditMode}
              users={users}
            />

            <UserForm
              isOpen={isUserModalOpen}
              toggle={() => setIsUserModalOpen(!isUserModalOpen)}
              onSubmit={handleAddUser}
              user={chosenUser}
              isEditMode={isEditMode}
              departments={departments}
            />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AdminPage