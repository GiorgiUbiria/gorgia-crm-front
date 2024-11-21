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
  Badge,
} from "reactstrap";
import { FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/Common/Breadcrumb";
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

const AdminPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("1");
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [chosenDepartment, setChosenDepartment] = useState(null);
  const [chosenUser, setChosenUser] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState("");

  useEffect(() => {
    document.title = "ადმინისტრირება | Gorgia LLC";
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

  const filteredDepartments = departments.filter(dep =>
    dep.name.toLowerCase().includes(departmentSearchTerm.toLowerCase()) ||
    (dep.head?.name || "").toLowerCase().includes(departmentSearchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const searchInputStyle = {
    paddingRight: '2.5rem',
    borderRadius: '4px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  };

  const searchIconStyle = {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b',
  };

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
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="search-box" style={{ minWidth: '300px' }}>
                        <div className="position-relative">
                          <Input
                            type="text"
                            value={departmentSearchTerm}
                            onChange={(e) => setDepartmentSearchTerm(e.target.value)}
                            placeholder="მოძებნეთ დეპარტამენტი..."
                            style={searchInputStyle}
                          />
                          <FaSearch style={searchIconStyle} />
                        </div>
                      </div>
                      <Button
                        color="primary"
                        onClick={() => openDepartmentModal(null)}
                        className="d-flex align-items-center"
                      >
                        <FaPlus className="me-1" /> დეპარტამენტის დამატება
                      </Button>
                    </div>

                    <div className="table-responsive">
                      <Table className="table-centered table-hover mb-0" bordered>
                        <thead style={{ backgroundColor: '#f1f5f9' }}>
                          <tr>
                            <th className="text-center" style={{ width: '5%' }}>#</th>
                            <th style={{ width: '35%' }}>დეპარტამენტი</th>
                            <th style={{ width: '40%' }}>ხელმძღვანელი</th>
                            <th className="text-center" style={{ width: '20%' }}>მოქმედება</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDepartments.map((dep, index) => (
                            <tr key={dep.id}>
                              <td className="text-center">{index + 1}</td>
                              <td>{dep.name}</td>
                              <td>
                                {dep.head ? (
                                  <div className="d-flex align-items-center">
                                    <div className="avatar-xs me-2">
                                      <span className="avatar-title rounded-circle bg-primary text-white">
                                        {dep.head.name.charAt(0)}
                                      </span>
                                    </div>
                                    {dep.head.name}
                                  </div>
                                ) : (
                                  <Badge color="warning" pill>
                                    არ არის მითითებული
                                  </Badge>
                                )}
                              </td>
                              <td className="text-center">
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => openDepartmentModal(dep)}
                                >
                                  რედაქტირება
                                </Button>
                                <Button
                                  color="danger"
                                  size="sm"
                                  onClick={() => handleDeleteDepartment(dep.id, dep.name)}
                                >
                                  <FaTrash />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </TabPane>

                  <TabPane tabId="2">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="search-box" style={{ minWidth: '300px' }}>
                        <div className="position-relative">
                          <Input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="მოძებნეთ მომხმარებელი..."
                            style={searchInputStyle}
                          />
                          <FaSearch style={searchIconStyle} />
                        </div>
                      </div>
                      <Button
                        color="primary"
                        onClick={() => openUserModal(null)}
                        className="d-flex align-items-center"
                      >
                        <FaPlus className="me-1" /> მომხმარებლის დამატება
                      </Button>
                    </div>

                    <div className="table-responsive">
                      <Table className="table-centered table-hover mb-0" bordered>
                        <thead style={{ backgroundColor: '#f1f5f9' }}>
                          <tr>
                            <th className="text-center" style={{ width: '5%' }}>#</th>
                            <th style={{ width: '25%' }}>სახელი</th>
                            <th style={{ width: '25%' }}>ელ-ფოსტა</th>
                            <th style={{ width: '20%' }}>დეპარტამენტი</th>
                            <th style={{ width: '10%' }}>როლი</th>
                            <th className="text-center" style={{ width: '15%' }}>მოქმედება</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user, index) => (
                            <tr key={user.id}>
                              <td className="text-center">{index + 1}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar-xs me-2">
                                    <span className="avatar-title rounded-circle bg-primary text-white">
                                      {user.name?.charAt(0)}
                                    </span>
                                  </div>
                                  {user.name}
                                </div>
                              </td>
                              <td>{user.email}</td>
                              <td>
                                {user.department?.name || (
                                  <Badge color="warning" pill>
                                    არ არის მითითებული
                                  </Badge>
                                )}
                              </td>
                              <td>
                                <Badge color="info" pill>
                                  {user.role}
                                </Badge>
                              </td>
                              <td className="text-center">
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => openUserModal(user)}
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
                    </div>
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
  );
};

export default AdminPage;
