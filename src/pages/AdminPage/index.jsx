import React, { useEffect, useState } from "react";
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
} from "reactstrap";
import { FaTrash, FaPlus } from "react-icons/fa";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  assignHead,
  createDepartment,
  deleteDepartment,
  getDepartments,
  getUsers,
  deleteUser,
  updateUserById,
} from "../../services/admin/department";
import DepartmentForm from "components/DepartmentForm";
import UserForm from "components/UserForm"; 
import { updateUser } from "services/user";

const AdminPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("1"); 
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [chosenDepartment, setChosenDepartment] = useState(null);
  const [chosenUser, setChosenUser] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDepartments();
    fetchUsers();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data.departments);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  const openDepartmentModal = (department = null) => {
    setChosenDepartment(department);
    setIsEditMode(!!department);
    setIsDepartmentModalOpen(true);
  };

  const openUserModal = (user = null) => {
    setChosenUser(user);
    setIsEditMode(!!user);
    setIsUserModalOpen(true);
  };

  const handleAddDepartment = async (data) => {
    try {
      await createDepartment(data);
      toast.success(t("Department added successfully"));
      fetchDepartments();
      setIsDepartmentModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddUser = async (data) => {
    try {
      await updateUserById(chosenUser.id, data);  
      toast.success(t("User updated successfully"));
      fetchUsers();
      setIsUserModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAssignHead = async (data) => {
    try {
      await assignHead(data);
      toast.success(t("Department head assigned successfully"));
      fetchDepartments();
      setIsDepartmentModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteDepartment = async (id, name) => {
    if (window.confirm(`${t("Are you sure you want to delete")} ${name}?`)) {
      try {
        await deleteDepartment(id);
        toast.success(t("Department deleted successfully"));
        fetchDepartments();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`${t("Are you sure you want to delete user")} ${user.name}?`)) {
      try {
        await deleteUser(user.id);
        toast.success(t("User deleted successfully"));
        fetchUsers();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col lg="12">
            {/* Tab Navigation */}
            <Nav tabs className="mb-3">
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "1" })}
                  onClick={() => toggle("1")}
                >
                  {t("დეპარტამენტები")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "2" })}
                  onClick={() => toggle("2")}
                >
                  {t("მომხმარებლები")}
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1" >
              <div className="d-flex justify-content-end mb-3">
              <Button
                  color="primary"
                  onClick={() => openDepartmentModal(null)} 
                  style={{
                    display:"flex",
                    alignItems:"center",
                    gap:"5px",
                    justifyContent:"end"
                  }}
                >
                  <FaPlus /> {t("დეპარტამენტის დამატება")}
                </Button>
              </div>
                <Card>
                  <CardBody>
                    <Table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>{t("სახელი")}</th>
                          <th>{t("დეპარტამენტის ჰედი")}</th>
                          <th>{t("მოქმედება")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {departments.map((dep, index) => (
                          <tr key={dep.id}>
                            <td>{index + 1}</td>
                            <td>{dep.name}</td>
                            <td>{dep.head ? dep.head.name : "N/A"}</td>
                            <td>
                              <Button
                                color="primary"
                                size="sm"
                                className="me-2"
                                onClick={() => openDepartmentModal(dep)} // Open modal for editing department
                              >
                               რედაქტირება
                              </Button>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() =>
                                  handleDeleteDepartment(dep.id, dep.name)
                                }
                              >
                                <FaTrash />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </TabPane>

              {/* Users Tab */}
              <TabPane tabId="2">
                <Input
                  type="text"
                  placeholder={t("Search by name or email")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-3"
                />
                <Card>
                  <CardBody>
                    <Table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>{t("User Name")}</th>
                          <th>{t("Email")}</th>
                          <th>{t("Department")}</th>
                          <th>{t("Action")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users
                          .filter((user) =>
                            (user?.name || "")
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            (user?.email || "")
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          )
                          .map((user, index) => (
                            <tr key={user.id}>
                              <td>{index + 1}</td>
                              <td>{user?.name}</td>
                              <td>{user?.email}</td>
                              <td>{user?.department ? user.department.name : "N/A"}</td>
                              <td>
                                <Button
                                  color="primary"
                                  className="me-2" 
                                  size="sm"
                                  onClick={() => openUserModal(user)} // Open user modal for editing
                                >
                                  რედაქტირება
                                </Button>
                                <Button
                                  color="danger"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user)}
                                >
                                  <FaTrash />
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </TabPane>
            </TabContent>

            {/* Department Form Modal */}
            <DepartmentForm
              isOpen={isDepartmentModalOpen}
              toggle={() => setIsDepartmentModalOpen(!isDepartmentModalOpen)}
              isEditMode={isEditMode}
              department={chosenDepartment}
              onSave={handleAddDepartment}
              onAssignHead={handleAssignHead}
            />

            {/* User Form Modal */}
            <UserForm
              isOpen={isUserModalOpen}
              toggle={() => setIsUserModalOpen(!isUserModalOpen)}
              isEditMode={isEditMode}
              user={chosenUser}
              onSave={handleAddUser}
              departments={departments}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminPage;
