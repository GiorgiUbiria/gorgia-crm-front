import React, { useEffect, useState } from "react"
import {
  createHrDocument,
} from "services/hrDocument"
import { useSelector } from "react-redux"
import * as Yup from "yup"
import moment from "moment"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import useFetchUsers from "hooks/useFetchUsers"
import { usePermissions } from "hooks/usePermissions"
import {
  Row,
  Col,
  Label,
} from "reactstrap"
import { Formik, Form, Field, ErrorMessage } from "formik"
import classnames from "classnames"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"
import { Button } from "reactstrap"
import { useNavigate } from "react-router-dom"
import DatePicker from "components/DatePicker"


const DOCUMENT_TYPES = {
  PAID_EMPLOYMENT: "ხელფასიანი ცნობა",
  UNPAID_EMPLOYMENT: "უხელფასო ცნობა",
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

const getInitialValues = (activeTab, currentUser) => {
  if (activeTab === "1") {
    return {
      documentType: "",
      id_number: currentUser?.id_number || "",
      position: currentUser?.department?.name || "",
      working_start_date: currentUser?.working_start_date || "",
      purpose: "",
      template_num: "",
      started_date: "",
    }
  } else if (activeTab === "2") {
    return {
      first_name: "",
      last_name: "",
      documentType: "",
      id_number: "",
      position: "",
      working_start_date: "",
      purpose: "",
      template_num: "",
      started_date: "",
    }
  } else {
    return {
      documentType: "",
      id_number: "",
      position: "",
      working_start_date: "",
      purpose: "",
      template_num: "",
      started_date: "",
    }
  }
}

const validationSchema = Yup.object().shape({
  documentType: Yup.string().required("დოკუმენტის ტიპი აუცილებელია"),
  id_number: Yup.string().required("პირადი ნომერი აუცილებელია"),
  position: Yup.string().required("პოზიცია აუცილებელია"),
  purpose: Yup.string().when("documentType", {
    is: type =>
      type === DOCUMENT_TYPES.PAID_EMPLOYMENT ||
      type === DOCUMENT_TYPES.PAID_PROBATION,
    then: () => Yup.string().required("მიზანი აუცილებელია"),
  }),
})

const forUserValidationSchema = activeTab => {
  if (activeTab === "2") {
    return validationSchema.shape({
      first_name: Yup.string().required("მომხმარებლის სახელი აუცილებელია"),
      last_name: Yup.string().required("მომხმარებლის გვარი აუცილებელია"),
    })
  }
  return validationSchema
}

const HrPage = () => {
  const navigate = useNavigate()
  const reduxUser = useSelector(state => state.user.user)
  const [currentUser, setCurrentUser] = useState(reduxUser)
  const { users } = useFetchUsers()
  const [selectedUser, setSelectedUser] = useState(null)
  const [activeTab, setActiveTab] = useState("1")
  const { isAdmin } = usePermissions()
  const [startedDate, setStartedDate] = useState({
    started_date: ''
  })

  console.log(startedDate)

  const isHrMember = currentUser?.department_id === 8
  const isHrDepartmentHead =
    isHrMember && currentUser?.role === "department_head"

  const canAccessOtherTab = isAdmin || isHrMember || isHrDepartmentHead

  useEffect(() => {
    setCurrentUser(reduxUser)
  }, [reduxUser])

  useEffect(() => {
    if (activeTab === "2" && selectedUser) {
      const user = users.find(u => u.id === parseInt(selectedUser))
      setSelectedUser(user || null)
    } else {
      setSelectedUser(null)
    }
  }, [activeTab, selectedUser, users])

  const handleDocumentSubmit = async (values, { setSubmitting }) => {
    try {
      const contextUser = currentUser

      const documentData = {
        name: values.documentType,
        user_id: contextUser.id,
        first_name: values.first_name,
        last_name: values.last_name,
        is_other_user: activeTab === "2" ? 1 : 0,
        position: activeTab === "2" ? values.position : null,
        id_number: activeTab === "2" ? values.id_number : null,
        template_num: Object.values(DOCUMENT_TYPES).findIndex(d => d === values.documentType) + 1,
        started_date: activeTab == "2" ? startedDate?.started_date : "",
        ...(isPaidDocument(values.documentType) && { purpose: values.purpose }),
      }

      await createHrDocument(documentData)
      toast.success("დოკუმენტი წარმატებით შეიქმნა")

      if (canAccessOtherTab && activeTab === "2") {
        navigate("/hr/documents/approve")
      } else {
        navigate("/hr/documents/my-requests")
      }
    } catch (err) {
      console.error("Error creating HR document:", err)
      toast.error("დოკუმენტის შექმნა ვერ მოხერხდა")
    } finally {
      setSubmitting(false)
    }
  }

  const renderUserInfo = (user, labelText, name, isEditable = false) => (
      <div className="col-md-6">
        <Label className="form-label">{labelText}</Label>
        {isEditable ? (
          <Field type="text" name={name} className="form-control" />
        ) : (
          <p className="form-control-plaintext border rounded p-2">
            {user?.department?.name}
          </p>
        )}
        <ErrorMessage
          name={name}
          component="div"
          className="text-danger mt-1"
        />
      </div>
  )

  const renderUserForm = (values, tab) => (
      <>
      {tab === 2 && (
        <div className="row g-3 mb-4">
          {renderUserInfo(selectedUser, 'სახელი', 'first_name', true)}
          {renderUserInfo(selectedUser, 'გვარი', 'last_name', true)}
        </div>
      )}
      <div className="row g-3 mb-4">
      {tab == 2 && (
      <div className="col-md-6">
        <div className="flex flex-row">

        <Label className="form-label">დაწყების თარიღი</Label>
          {/* date! */}
          <DatePicker startDate={startedDate} handleStartedDate={setStartedDate} />

        </div>
        <ErrorMessage
          name="started_date"
          component="div"
          className="text-danger mt-1"
        />
      </div>
      )}

<div className={`${tab === 2 && 'col-md-6'}`}>
        <Label className="form-label">
          დოკუმენტის ტიპი
        </Label>
        <Field
          as="select"
          name="documentType"
          className="form-select"
        >
          <option value="">
            აირჩიეთ დოკუმენტის ტიპი
          </option>
          {Object.entries(DOCUMENT_TYPES).map(
            ([key, type]) => (
              <option
                key={key}
                value={type}
                disabled={isDocumentTypeDisabled(type, tab == 1 ? currentUser?.working_start_date : startedDate?.started_date)}
              >
                {type}
              </option>
            )
          )}
        </Field>
        <ErrorMessage
          name="documentType"
          component="div"
          className="text-danger mt-1"
        />
        {getDocumentTypeHelpText(
          values.documentType
        ) && (
          <div className="text-warning mt-1">
            <i className="bx bx-info-circle me-1"></i>
            {getDocumentTypeHelpText(
              values.documentType
            )}
          </div>
        )}
      </div>
      </div>


      {/* User Info */}
      <div className="row g-3 mb-4">
        {renderUserInfo(currentUser,'პირადი ნომერი', 'id_number', isAdmin)}
        {renderUserInfo(currentUser, 'პოზიცია', 'position', isAdmin)}
      </div>

      {/* Purpose field for paid documents */}
      {isPaidDocument(values.documentType) && (
        <div className="mb-4">
          <Label className="form-label">მიზანი</Label>
          <Field
            type="text"
            name="purpose"
            className="form-control"
          />
          <ErrorMessage
            name="purpose"
            component="div"
            className="text-danger mt-1"
          />
        </div>
      )}
      </>
  )

  const isDocumentTypeDisabled = (type, started) => {
    if (isEmploymentDocument(type)) {
      const hasRequiredExperience = hasWorkedSixMonths(started)
      return !hasRequiredExperience
    }
    return false
  }

  const getDocumentTypeHelpText = type => {
    if (isEmploymentDocument(type) && isDocumentTypeDisabled(type)) {
      return "ამ ტიპის დოკუმენტის მოთხოვნა შესაძლებელია მხოლოდ 6 თვიანი სამუშაო სტაჟის შემდეგ"
    }
    return null
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row className="mb-4">
            <Col xl={12}>
              <Breadcrumbs
                title="HR დოკუმენტები"
                breadcrumbItem="ცნობის მოთხოვნა"
              />
            </Col>
          </Row>

          <Row>
            <Col xl={8} className="mx-auto">
              <div className="card">
                <div className="card-body">
                  <Nav tabs className="nav-tabs-custom">
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "1" })}
                        onClick={() => setActiveTab("1")}
                      >
                        ჩემთვის
                      </NavLink>
                    </NavItem>
                    {canAccessOtherTab && (isAdmin || isHrMember) && (
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === "2" })}
                          onClick={() => setActiveTab("2")}
                        >
                          სხვისთვის
                        </NavLink>
                      </NavItem>
                    )}
                  </Nav>

                  <div className="mt-4">
                    <Formik
                      enableReinitialize
                      initialValues={getInitialValues(
                        activeTab,
                        currentUser
                      )}
                      validationSchema={forUserValidationSchema(activeTab)}
                      onSubmit={handleDocumentSubmit}
                    >
                      {({ values, isSubmitting }) => (
                        <Form>
                          <TabContent activeTab={activeTab}>
                            <TabPane tabId="1">
                              {renderUserForm(values, 1)}
                            </TabPane>

                            {canAccessOtherTab && (
                              <TabPane tabId="2">
                                {renderUserForm(values, 2)}
                              </TabPane>
                            )}
                          </TabContent>

                          <div className="mt-4">
                            <Button
                              color="primary"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "გთხოვთ დაელოდოთ..." : "შენახვა"}
                            </Button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <ToastContainer />
        </div>
      </div>
    </React.Fragment>
  )
}

export default HrPage