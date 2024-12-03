import React, { useEffect, useState, useMemo } from "react"
import {
  createHrDocument,
  getHrDocuments,
} from "services/hrDocument"
import { updateUser } from "services/user"
import { useSelector } from "react-redux"
import * as Yup from "yup"
import moment from "moment"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import useFetchUsers from "hooks/useFetchUsers"
import useIsAdmin from "hooks/useIsAdmin"
import {
  Row,
  Col,
  ModalFooter,
  Container,
} from "reactstrap"
import { Formik, Form } from "formik"
import classnames from "classnames"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"
import { Button } from "reactstrap"
import AuthDocument from "./AuthDocument"
import OthersDocument from "./OthersDocument"

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

const STATUS_MAPPING = {
  in_progress: "in_progress",
  approved: "approved",
  rejected: "rejected",
}

const getInitialValues = (activeTab, currentUser, selectedUser) => {
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

const forUserValidationSchema = activeTab => {
  if (activeTab === "2") {
    return validationSchema.shape({
      selectedUser: Yup.string().required("მომხმარებლის არჩევა აუცილებელია"),
    })
  }
  return validationSchema
}

const HrPage = () => {
  document.title = "HR დოკუმენტები | Gorgia LLC"

  const [hrDocuments, setHrDocuments] = useState([])
  const [modal, setModal] = useState(false)
  const [expandedRows, setExpandedRows] = useState([])
  const [activeTab, setActiveTab] = useState("1")

  const reduxUser = useSelector(state => state.user.user)
  const [currentUser, setCurrentUser] = useState(reduxUser)

  const { users, loading: usersLoading, error: usersError } = useFetchUsers()
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  console.log(selectedUserId)

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

  const transformedHrDocuments = hrDocuments.map(document => ({
    id: document.id,
    status: STATUS_MAPPING[document.status] || document.status,
    created_at: document.created_at,
    user: {
      name: document.user.name,
      id: document.user.id_number,
      position: document.user.position,
    },
    name: document.name,
    salary: document.salary,
    purpose: document.purpose,
    comment: document.comment,
  }))

  const filterOptions = [
    {
      field: "status",
      label: "სტატუსი",
      valueLabels: {
        approved: "დამტკიცებული",
        rejected: "უარყოფილი",
        in_progress: "განხილვაში",
      },
    },
  ]

  const columns = useMemo(() => {
    return [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "სახელი",
        accessor: "user.name",
        disableSortBy: true,
      },
      {
        Header: "პირადი ნომერი",
        accessor: "user.id",
        disableSortBy: true,
      },
      {
        Header: "პოზიცია",
        accessor: "user.position",
        disableSortBy: true,
      },
      {
        Header: "დოკუმენტის ტიპი",
        accessor: "name",
        disableSortBy: true,
      },
      {
        Header: "ხელფასი",
        accessor: "salary",
      },
      {
        Header: "მიზანი",
        accessor: "purpose",
        disableSortBy: true,
      },
      {
        Header: "დამატების თარიღი",
        accessor: "created_at",
        Cell: ({ value }) => (
          <div>
            <i className="bx bx-calendar me-2"></i>
            {new Date(value).toLocaleDateString()}
          </div>
        ),
      },
      {
        Header: "სტატუსი",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              display: "inline-flex",
              alignItems: "center",
              fontSize: "0.875rem",
              fontWeight: 500,
              backgroundColor:
                value === "in_progress"
                  ? "#fff3e0"
                  : value === "rejected"
                  ? "#ffebee"
                  : value === "approved"
                  ? "#e8f5e9"
                  : "#f5f5f5",
              color:
                value === "in_progress"
                  ? "#e65100"
                  : value === "rejected"
                  ? "#c62828"
                  : value === "approved"
                  ? "#2e7d32"
                  : "#757575",
            }}
          >
            <i className={`bx ${statusMap[value].icon} me-2`}></i>
            {statusMap[value].label}
          </span>
        ),
      },
    ]
  }, [])

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
      if (tab === "1") {
        setSelectedUserId("")
        setSelectedUser(null)
      }
    }
  }

  const handleSelectedUser = (id) =>{
    setSelectedUser(id)
  }

  return (
    <React.Fragment>
              

      <div className="page-content mb-4">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs
                title="HR დოკუმენტები"
                breadcrumbItem="დოკუმენტები"
              />
            </Col>
          </Row>
          <ToastContainer />

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
                    ჩემთვის
                  </NavLink>
                </NavItem>
                {isAdmin && (
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => {
                      toggleTab("2")
                    }}
                  >
                    სხვისთვის
                  </NavLink>
                </NavItem>
                )}
              </Nav>

              <TabContent activeTab={activeTab} className="p-3 text-muted">
                <TabPane tabId="1">
                  

                <Formik
                  enableReinitialize
                  initialValues={getInitialValues(activeTab, currentUser, selectedUser)}
                  validationSchema={forUserValidationSchema(activeTab)}
                  onSubmit={handleDocumentSubmit}
                >
                  {({
                    values,
                    setValues,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                  }) => (
                    <Form onSubmit={handleSubmit}>
                      <AuthDocument activeTab={activeTab}  DOCUMENT_TYPES={DOCUMENT_TYPES} isPaidDocument={isPaidDocument} values={values} currentUser={currentUser} />
                      
                      <ModalFooter>
                        <Button color="primary" type="submit" disabled={isSubmitting}>
                          შენახვა
                        </Button>
                        {/* <Button color="secondary" onClick={() => setModal(!modal)}>
                          დახურვა
                        </Button> */}
                      </ModalFooter>
                    </Form>
                  )}
                </Formik>


                </TabPane>
                {isAdmin && (
                <TabPane tabId="2">
                <Formik
                  enableReinitialize
                  initialValues={getInitialValues(activeTab, currentUser, selectedUser)}
                  validationSchema={forUserValidationSchema(activeTab)}
                  onSubmit={handleDocumentSubmit}
                >
                  {({
                    values,
                    setValues,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                  }) => (
                    <Form onSubmit={handleSubmit}>
                      <OthersDocument activeTab={activeTab} users={users} selectedUserId={selectedUserId}  setSelectedUserId={setSelectedUserId} />
                      <ModalFooter>
                        <Button color="primary" type="submit" disabled={isSubmitting}>
                          შენახვა
                        </Button>
                        {/* <Button color="secondary" onClick={() => setModal(!modal)}>
                          დახურვა
                        </Button> */}
                      </ModalFooter>
                    </Form>
                  )}
                </Formik>
                </TabPane>
                )}
              </TabContent>
              
            </div>
          </div>
        </Container>


        </div>
      </div>

    </React.Fragment>
  )
}

export default HrPage
