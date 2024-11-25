import React, { useEffect, useState, useMemo } from "react"
import {
  Table,
  Button,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormFeedback,
  Label,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import {
  createHrDocument,
  getCurrentUserHrDocuments,
  getHrDocuments,
} from "services/hrDocument"
import { updateUser } from "services/user"
import { useSelector } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useTable, useSortBy } from "react-table"
import moment from "moment"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import useFetchUsers from "hooks/useFetchUsers"
import "./HrPage.scss"
import useIsAdmin from "hooks/useIsAdmin"

const DOCUMENT_TYPES = {
  PAID_EMPLOYMENT: "შრომითი ხელფასიანი",
  UNPAID_EMPLOYMENT: "შრომითი უხელფასო",
  PAID_PROBATION: "გამოსაცდელი ვადით ხელფასიანი",
  UNPAID_PROBATION: "გამოსაცდელი ვადით უხელფასო",
}

const isPaidDocument = type => {
  return (
    type === DOCUMENT_TYPES.PAID_EMPLOYMENT ||
    type === DOCUMENT_TYPES.PAID_PROBATION
  )
}

const isEmploymentDocument = type => {
  return (
    type === DOCUMENT_TYPES.PAID_EMPLOYMENT ||
    type === DOCUMENT_TYPES.UNPAID_EMPLOYMENT
  )
}

const hasWorkedSixMonths = startDate => {
  if (!startDate) return false
  const sixMonthsAgo = moment().subtract(6, "months")
  return moment(startDate).isBefore(sixMonthsAgo)
}

const statusMap = {
  in_progress: {
    label: "განხილვაში",
    icon: "bx-time",
    color: "#FFA500",
  },
  approved: {
    label: "დამტკიცებული",
    icon: "bx-check-circle",
    color: "#28a745",
  },
  rejected: {
    label: "უარყოფილი",
    icon: "bx-x-circle",
    color: "#dc3545",
  },
}

const HrPage = () => {
  document.title = "ვიზირება | Gorgia LLC"

  const [hrDocuments, setHrDocuments] = useState([])
  const [modal, setModal] = useState(false)
  const [expandedRows, setExpandedRows] = useState([])
  const [activeTab, setActiveTab] = useState("1")

  const reduxUser = useSelector(state => state.user.user)
  const [currentUser, setCurrentUser] = useState(reduxUser)

  const { users, loading: usersLoading, error: usersError } = useFetchUsers()
  const [selectedUserId, setSelectedUserId] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortDirection, setSortDirection] = useState("desc")

  const isAdmin = useIsAdmin()

  useEffect(() => {
    setCurrentUser(reduxUser)
  }, [reduxUser])

  const fetchHrDocuments = async () => {
    try {
      if (isAdmin) {
        const response = await getHrDocuments()
        setHrDocuments(response.data)
      } else {
        const response = await getCurrentUserHrDocuments()
        setHrDocuments(response.data)
      }
    } catch (err) {
      console.error("Error fetching HR documents:", err)
    }
  }

  useEffect(() => {
    fetchHrDocuments()
  }, [])

  useEffect(() => {
    if (activeTab === "2" && selectedUserId) {
      const user = users.find(u => u.id === selectedUserId)
      setSelectedUser(user)
    } else {
      setSelectedUser(null)
    }
  }, [activeTab, selectedUserId, users])

  const handleCreateDocument = () => {
    setModal(true)
    setActiveTab("1")
    setSelectedUserId("")
    setSelectedUser(null)
  }

  const handleDocumentSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const contextUser = activeTab === "1" ? currentUser : selectedUser

      if (!contextUser) {
        toast.error("Selected user data is not available.")
        return
      }

      const missingFields = validateRequiredFields(values, contextUser)

      if (missingFields.length > 0) {
        const shouldUpdate = window.confirm(
          `შემდეგი ველები არ არის შევსებული: ${missingFields.join(", ")}. \n` +
            "გსურთ მათი განახლება?"
        )

        if (shouldUpdate) {
          const userData = {}

          missingFields.forEach(field => {
            userData[field] = values[field]
          })

          await updateUser(contextUser.id, userData)

          if (activeTab === "1") {
            setCurrentUser(prev => ({
              ...prev,
              ...userData,
            }))
          } else {
            setSelectedUser(prev => ({
              ...prev,
              ...userData,
            }))
          }

          toast.success("მომხმარებლის ინფორმაცია განახლდა")
        } else {
          return
        }
      }

      if (
        !validateWorkDuration(
          values.documentType,
          contextUser?.working_start_date
        )
      ) {
        return
      }

      const documentData = {
        name: values.documentType,
        user_id: contextUser.id,
        ...(isPaidDocument(values.documentType) && { purpose: values.purpose }),
      }

      await createHrDocument(documentData)
      handleSuccess()
      resetForm()
    } catch (err) {
      handleError(err)
    } finally {
      setSubmitting(false)
    }
  }

  const validateRequiredFields = (values, userContext) => {
    const missingFields = []
    if (isPaidDocument(values.documentType)) {
      if (!userContext?.id_number && !values.id_number)
        missingFields.push("id_number")
      if (!userContext?.position && !values.position)
        missingFields.push("position")
      if (!userContext?.working_start_date && !values.working_start_date)
        missingFields.push("working_start_date")
    }
    return missingFields
  }

  const validateWorkDuration = (documentType, startDate) => {
    const hasWorked6MonthsFlag = hasWorkedSixMonths(startDate)

    if (isEmploymentDocument(documentType) && !hasWorked6MonthsFlag) {
      toast.error(
        "შრომითი ცნობის მოთხოვნა შესაძლებელია მხოლოდ 6 თვეზე მეტი სტაჟის მქონე თანამშრომლებისთვის"
      )
      return false
    }

    if (!isEmploymentDocument(documentType) && hasWorked6MonthsFlag) {
      toast.error(
        "გამოსაცდელი ვადის ცნობის მოთხოვნა შესაძლებელია მხოლოდ 6 თვეზე ნაკლები სტაჟის მქონე თანამშრომლებისთვის"
      )
      return false
    }

    return true
  }

  const handleSuccess = () => {
    setModal(false)
    fetchHrDocuments()
    toast.success("დოკუმენტი წარმატებით შეიქმნა")
  }

  const handleError = err => {
    console.error("Error creating HR document:", err)
    toast.error("დოკუმენტის შექმნა ვერ მოხერხდა")
  }

  const getRowClass = status => {
    switch (status) {
      case "rejected":
        return "table-danger"
      case "approved":
        return "table-success"
      case "in_progress":
        return "table-warning"
      default:
        return ""
    }
  }

  const handleRowClick = index => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter(id => id !== index))
    } else {
      setExpandedRows([...expandedRows, index])
    }
  }

  const validationSchema = Yup.object().shape({
    documentType: Yup.string().required("დოკუმენტის ტიპი აუცილებელია"),
    id_number: Yup.string().when("documentType", {
      is: isPaidDocument,
      then: () => Yup.string().required("პირადი ნომერი აუცილებელია"),
    }),
    position: Yup.string().when("documentType", {
      is: isPaidDocument,
      then: () => Yup.string().required("პოზიცია აუცილებელია"),
    }),
    working_start_date: Yup.date().when("documentType", {
      is: isPaidDocument,
      then: () => Yup.date().required("სამსახურის დაწყების თარიღი აუცილებელია"),
    }),
    purpose: Yup.string().when("documentType", {
      is: isPaidDocument,
      then: () => Yup.string().required("მიზანი აუცილებელია"),
    }),
  })

  const forUserValidationSchema =
    activeTab === "2"
      ? validationSchema.shape({
          selectedUser: Yup.string().required(
            "მომხმარებლის არჩევა აუცილებელია"
          ),
        })
      : validationSchema

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "თარიღი",
        accessor: "created_at",
        Cell: ({ value }) => moment(value).format("YYYY-MM-DD"),
        sortType: (a, b) => {
          const dateA = moment(a.original.created_at).valueOf()
          const dateB = moment(b.original.created_at).valueOf()
          return dateA - dateB
        },
      },
      {
        Header: "მოთხოვნილი ცნობის ფორმა",
        accessor: "name",
      },
      {
        Header: "სტატუსი",
        accessor: "status",
        Cell: ({ value }) =>
          value === "rejected"
            ? "უარყოფილია"
            : value === "approved"
            ? "დადასტურებულია"
            : "მოლოდინში",
      },
    ],
    []
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: hrDocuments,
        initialState: {
          sortBy: [
            {
              id: "created_at",
              desc: true,
            },
          ],
        },
      },
      useSortBy
    )

  const toggleTab = tab => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const getInitialValues = () => {
    if (activeTab === "1") {
      return {
        documentType: "",
        id_number: currentUser?.id_number || "",
        position: currentUser?.position || "",
        working_start_date: currentUser?.working_start_date || "",
        purpose: "",
      }
    } else if (activeTab === "2" && selectedUser) {
      return {
        selectedUser: selectedUser.id,
        documentType: "",
        id_number: selectedUser?.id_number || "",
        position: selectedUser?.position || "",
        working_start_date: selectedUser?.working_start_date || "",
        purpose: "",
      }
    } else {
      return {
        documentType: "",
        id_number: "",
        position: "",
        working_start_date: "",
        purpose: "",
      }
    }
  }

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }

  const handleItemsPerPageChange = value => {
    setItemsPerPage(value)
    setCurrentPage(1)
  }

  const sortDocuments = docs => {
    return [...docs].sort((a, b) => {
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB
    })
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const sortedDocuments = sortDocuments(hrDocuments)
  const currentDocuments = sortedDocuments.slice(
    indexOfFirstItem,
    indexOfLastItem
  )

  console.log(currentDocuments)

  return (
    <React.Fragment>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="HR" breadcrumbItem="მოთხოვნილი ცნობები" />

          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">მოთხოვნილი ცნობები</CardTitle>
                  {currentUser && (
                    <div className="mb-4">
                      <strong>მომხმარებელი:</strong>{" "}
                      {currentUser.name || "უცნობი"} (ID:{" "}
                      {currentUser.id_number || "უცნობი"}, პოზიცია:{" "}
                      {currentUser.position || "უცნობი"})
                    </div>
                  )}
                  <CardSubtitle className="card-title-desc d-flex justify-content-between align-items-center">
                    <div>
                      ქვევით ნაჩვენებია უკვე დადასტურებული ან უარყოფილი
                      მოთხოვნილი ცნობები
                    </div>
                    <div>
                      <Button
                        type="button"
                        color="primary"
                        onClick={handleCreateDocument}
                      >
                        ცნობის მოთხოვნა
                      </Button>
                    </div>
                  </CardSubtitle>

                  <div className="hr-table-modern">
                    <div className="table-controls mb-3">
                      <div className="d-flex align-items-center">
                        <span className="me-2">თითო გვერდზე:</span>
                        <Input
                          type="select"
                          className="form-select w-auto"
                          value={itemsPerPage}
                          onChange={e =>
                            handleItemsPerPageChange(Number(e.target.value))
                          }
                        >
                          {[5, 10, 15, 20].map(value => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </Input>
                      </div>
                    </div>

                    <Table className="table-modern">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>მომთხოვნი პირი</th>
                          <th>მოთხოვნილი ფორმის სტილი</th>
                          <th
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              setSortDirection(prev =>
                                prev === "desc" ? "asc" : "desc"
                              )
                            }
                          >
                            თარიღი{" "}
                            <i
                              className={`bx bx-sort-${
                                sortDirection === "desc" ? "down" : "up"
                              }`}
                            ></i>
                          </th>
                          <th>სტატუსი</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentDocuments.map((document, index) => (
                          <React.Fragment key={`doc-${document.id}`}>
                            <tr
                              key={`row-${document.id}`}
                              onClick={() => handleRowClick(index)}
                              className={`status-${document.status}`}
                            >
                              <td>
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar-wrapper">
                                    <span className="avatar-initial">
                                      {document.name?.charAt(0) || "?"}
                                    </span>
                                  </div>
                                  <span className="user-name">
                                    {document.name}
                                  </span>
                                </div>
                              </td>
                              <td>{document.name}</td>
                              <td>
                                <div className="date-wrapper">
                                  <i className="bx bx-calendar me-2"></i>
                                  {new Date(
                                    document.created_at
                                  ).toLocaleDateString()}
                                </div>
                              </td>
                              <td>
                                <span
                                  className={`status-badge status-${document.status}`}
                                >
                                  <i
                                    className={`bx ${
                                      statusMap[document.status].icon
                                    } me-2`}
                                  ></i>
                                  {statusMap[document.status].label}
                                </span>
                              </td>
                            </tr>
                            {expandedRows.includes(index) && (
                              <tr key={`expanded-${document.id}`}>
                                <td colSpan="5">
                                  <div className="expanded-content">
                                    <Row>
                                      <Col md={6}>
                                        <div className="info-section">
                                          <h6 className="info-title">
                                            <i className="bx bx-user"></i>
                                            თანამშრომლის ინფორმაცია
                                          </h6>
                                          <ul className="info-list">
                                            <li>
                                              <span className="label">
                                                პოზიცია:
                                              </span>
                                              <span className="value">
                                                {document.user.position}
                                              </span>
                                            </li>
                                            <li>
                                              <span className="label">
                                                პირადი ნომერი:
                                              </span>
                                              <span className="value">
                                                {document.user.id}
                                              </span>
                                            </li>
                                          </ul>
                                        </div>
                                      </Col>
                                      <Col md={6}>
                                        <div className="info-section">
                                          <h6 className="info-title">
                                            <i className="bx bx-file"></i>
                                            დოკუმენტის დეტალები
                                          </h6>
                                          <ul className="info-list">
                                            <li>
                                              <span className="label">
                                                კომენტარი:
                                              </span>
                                              <span className="value">
                                                {document.comment ||
                                                  "არ არის მითითებული"}
                                              </span>
                                            </li>
                                          </ul>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </Table>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="pagination-info">
                        ნაჩვენებია {indexOfFirstItem + 1}-
                        {Math.min(indexOfLastItem, sortedDocuments.length)} /{" "}
                        {sortedDocuments.length}
                      </div>
                      <div className="pagination-controls">
                        <Button
                          color="light"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="me-2"
                        >
                          <i className="bx bx-chevron-left"></i>
                        </Button>
                        {Array.from({
                          length: Math.ceil(
                            sortedDocuments.length / itemsPerPage
                          ),
                        }).map((_, index) => (
                          <Button
                            key={index + 1}
                            color={
                              currentPage === index + 1 ? "primary" : "light"
                            }
                            onClick={() => handlePageChange(index + 1)}
                            className="me-2"
                          >
                            {index + 1}
                          </Button>
                        ))}
                        <Button
                          color="light"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={
                            currentPage ===
                            Math.ceil(sortedDocuments.length / itemsPerPage)
                          }
                        >
                          <i className="bx bx-chevron-right"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      <Modal isOpen={modal} toggle={() => setModal(!modal)} size="lg">
        <ModalHeader toggle={() => setModal(!modal)}>
          ცნობის მოთხოვნა
        </ModalHeader>
        <Formik
          enableReinitialize
          initialValues={getInitialValues()}
          validationSchema={forUserValidationSchema}
          onSubmit={handleDocumentSubmit}
        >
          {({
            values,
            setValues,
            handleChange,
            handleSubmit,
            isSubmitting,
            resetForm,
          }) => {
            // Effect to update form fields when selectedUser changes
            useEffect(() => {
              if (activeTab === "2" && selectedUser) {
                setValues({
                  selectedUser: selectedUser.id,
                  documentType: values.documentType || "",
                  id_number: selectedUser.id_number || "",
                  position: selectedUser.position || "",
                  working_start_date: selectedUser.working_start_date || "",
                  purpose: values.purpose || "",
                })
              }
            }, [
              activeTab,
              selectedUser,
              setValues,
              values.documentType,
              values.purpose,
            ])

            return (
              <Form onSubmit={handleSubmit}>
                <ModalBody>
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "1" })}
                        onClick={() => toggleTab("1")}
                        style={{ cursor: "pointer" }}
                      >
                        ჩემთვის
                      </NavLink>
                    </NavItem>
                    {isAdmin && (
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === "2" })}
                          onClick={() => toggleTab("2")}
                          style={{ cursor: "pointer" }}
                        >
                          სხვისთვის
                        </NavLink>
                      </NavItem>
                    )}
                  </Nav>
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <div className="mt-3">
                        <div className="mb-3">
                          <Label>დოკუმენტის ტიპი</Label>
                          <Field
                            as="select"
                            name="documentType"
                            className="form-control"
                          >
                            <option value="">აირჩიეთ დოკუმენტის ტიპი</option>
                            {Object.values(DOCUMENT_TYPES).map(type => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="documentType"
                            component={FormFeedback}
                          />
                        </div>

                        <div className="mb-3">
                          <Label>პირადი ნომერი</Label>
                          <Field
                            type="text"
                            name="id_number"
                            className="form-control"
                            placeholder="შეიყვანეთ პირადი ნომერი"
                            disabled={currentUser?.id_number ? true : false}
                            onChange={handleChange}
                          />
                          <ErrorMessage
                            name="id_number"
                            component={FormFeedback}
                          />
                        </div>

                        <div className="mb-3">
                          <Label>პოზიცია</Label>
                          <Field
                            type="text"
                            name="position"
                            className="form-control"
                            placeholder="შეიყვანეთ პოზიცია"
                            disabled={currentUser?.position ? true : false}
                            onChange={handleChange}
                          />
                          <ErrorMessage
                            name="position"
                            component={FormFeedback}
                          />
                        </div>

                        <div className="mb-3">
                          <Label>სამსახურის დაწყების თარიღი</Label>
                          <Field
                            type="date"
                            name="working_start_date"
                            className="form-control"
                            disabled={
                              currentUser?.working_start_date ? true : false
                            }
                            onChange={handleChange}
                          />
                          <ErrorMessage
                            name="working_start_date"
                            component={FormFeedback}
                          />
                        </div>

                        {isPaidDocument(values.documentType) && (
                          <div className="mb-3">
                            <Label>მიზანი</Label>
                            <Field
                              type="text"
                              name="purpose"
                              className="form-control"
                              placeholder="შეიყვანეთ მიზანი"
                              onChange={handleChange}
                            />
                            <ErrorMessage
                              name="purpose"
                              component={FormFeedback}
                            />
                          </div>
                        )}
                      </div>
                    </TabPane>
                    {isAdmin && (
                      <TabPane tabId="2">
                        <div className="mt-3">
                          <div className="mb-3">
                            <Label>მომხმარებელი</Label>
                            {usersLoading ? (
                              <Input type="select" name="selectedUser" disabled>
                                <option>მიმდინარეობს ჩამოტვირთვა...</option>
                              </Input>
                            ) : usersError ? (
                              <div className="text-danger">
                                მომხმარებლების ჩატვირთვა ვერ მოხერხდა
                              </div>
                            ) : (
                              <Input
                                type="select"
                                name="selectedUser"
                                value={selectedUserId}
                                onChange={e =>
                                  setSelectedUserId(e.target.value)
                                }
                              >
                                <option value="">აირჩიეთ მომხმარებელი</option>
                                {users.map(user => (
                                  <option key={user.id} value={user.id}>
                                    {user.name} (ID: {user.id_number})
                                  </option>
                                ))}
                              </Input>
                            )}
                            <ErrorMessage
                              name="selectedUser"
                              component={FormFeedback}
                            />
                          </div>

                          {selectedUser && (
                            <>
                              <div className="mb-3">
                                <Label>დოკუმენტის ტიპი</Label>
                                <Field
                                  as="select"
                                  name="documentType"
                                  className="form-control"
                                >
                                  <option value="">
                                    აირჩიეთ დოკუმენტის ტიპი
                                  </option>
                                  {Object.values(DOCUMENT_TYPES).map(type => (
                                    <option key={type} value={type}>
                                      {type}
                                    </option>
                                  ))}
                                </Field>
                                <ErrorMessage
                                  name="documentType"
                                  component={FormFeedback}
                                />
                              </div>

                              <div className="mb-3">
                                <Label>პირადი ნომერი</Label>
                                <Field
                                  type="text"
                                  name="id_number"
                                  className="form-control"
                                  placeholder="შეიყვანეთ პირადი ნომერი"
                                  disabled={
                                    selectedUser?.id_number ? true : false
                                  }
                                  onChange={handleChange}
                                />
                                <ErrorMessage
                                  name="id_number"
                                  component={FormFeedback}
                                />
                              </div>

                              <div className="mb-3">
                                <Label>პოზიცია</Label>
                                <Field
                                  type="text"
                                  name="position"
                                  className="form-control"
                                  placeholder="შეიყვანეთ პოზიცი��"
                                  disabled={
                                    selectedUser?.position ? true : false
                                  }
                                  onChange={handleChange}
                                />
                                <ErrorMessage
                                  name="position"
                                  component={FormFeedback}
                                />
                              </div>

                              <div className="mb-3">
                                <Label>სამსახურის დაწყების თარიღი</Label>
                                <Field
                                  type="date"
                                  name="working_start_date"
                                  className="form-control"
                                  disabled={
                                    selectedUser?.working_start_date
                                      ? true
                                      : false
                                  }
                                  onChange={handleChange}
                                />
                                <ErrorMessage
                                  name="working_start_date"
                                  component={FormFeedback}
                                />
                              </div>

                              {isPaidDocument(values.documentType) && (
                                <div className="mb-3">
                                  <Label>მიზანი</Label>
                                  <Field
                                    type="text"
                                    name="purpose"
                                    className="form-control"
                                    placeholder="შეიყვანეთ მიზანი"
                                    onChange={handleChange}
                                  />
                                  <ErrorMessage
                                    name="purpose"
                                    component={FormFeedback}
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </TabPane>
                    )}
                  </TabContent>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" type="submit" disabled={isSubmitting}>
                    შენახვა
                  </Button>
                  <Button color="secondary" onClick={() => setModal(!modal)}>
                    დახურვა
                  </Button>
                </ModalFooter>
              </Form>
            )
          }}
        </Formik>
      </Modal>
    </React.Fragment>
  )
}

export default HrPage
