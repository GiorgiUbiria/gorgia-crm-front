import React, { useEffect, useState, useMemo } from "react"
import {
  createHrDocument,
  getCurrentUserHrDocuments,
  getHrDocuments,
} from "services/hrDocument"
import {
  updateUserIdNumberById,
  updateUserIdNumber,
  fetchUser,
} from "services/user"
import { useSelector } from "react-redux"
import * as Yup from "yup"
import moment from "moment"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import useFetchUsers from "hooks/useFetchUsers"
import useIsAdmin from "hooks/useIsAdmin"
import MuiTable from "components/Mui/MuiTable"
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormFeedback,
  Label,
} from "reactstrap"
import { Formik, Form, Field, ErrorMessage } from "formik"
import classnames from "classnames"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"
import { Button } from "reactstrap"
import { usePermissions } from "hooks/usePermissions"
import { useNavigate } from "react-router-dom"

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

const getInitialValues = (activeTab, currentUser, selectedUser) => {
  if (activeTab === "1") {
    return {
      documentType: "",
      id_number: currentUser?.id_number || "",
      position: currentUser?.position || "",
      working_start_date: currentUser?.working_start_date || "",
      purpose: "",
    }
  } else if (activeTab === "2") {
    return {
      selectedUser: selectedUser?.id || "",
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
  first_name: Yup.string().required("სახელი აუცილებელია"),
  last_name: Yup.string().required("გვარი აუცილებელია"),
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
      selectedUser: Yup.string().required("მომხმარებლის არჩევა აუცილებელია"),
    })
  }
  return validationSchema
}

const HrPage = () => {
  const navigate = useNavigate()
  const reduxUser = useSelector(state => state.user.user)
  const [currentUser, setCurrentUser] = useState(reduxUser)
  const { users, loading: usersLoading } = useFetchUsers()
  const [selectedUserId, setSelectedUserId] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [position, setPosition] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [goal, setGoal] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [activeTab, setActiveTab] = useState("1")
  const { hasPermission, isAdmin } = usePermissions()

  const isHrMember = currentUser?.department_id === 8
  const isHrDepartmentHead =
    isHrMember && currentUser?.role === "department_head"

  const canAccessOtherTab = isAdmin || isHrMember || isHrDepartmentHead

  useEffect(() => {
    setCurrentUser(reduxUser)
  }, [reduxUser])

  useEffect(() => {
    if (activeTab === "2" && selectedUserId) {
      const user = users.find(u => u.id === parseInt(selectedUserId))
      setSelectedUser(user || null)
    } else {
      setSelectedUser(null)
    }
  }, [activeTab, selectedUserId, users])

  const handleDocumentSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log('here')

    try {
      // const contextUser = activeTab === "1" ? currentUser : selectedUser

      // if (!contextUser) {
      //   toast.error("მომხმარებლის მონაცემები არ მოიძებნა")
      //   return
      // }

      // const data = {
      //   first_name: firstName,
      //   last_name: lastName,
      //   position,
      //   id_number: idNumber,
      //   purpose: goal,
      // }
      // await updateUserIdNumberById(data, currentUser.id)

      // if (
      //   (activeTab === "2" || isAdmin) &&
      //   (values.id_number !== currentUser.id_number ||
      //     values.position !== currentUser.position)
      // ) {
      //   const updateData = {
      //     id_number: values.id_number,
      //     position: values.position,
      //     first_name: firstName,
      //     last_name: lastName,
      //   }

      //   if (activeTab === "2") {
      //     await updateUserIdNumberById(updateData, currentUser.id)
      //   } else {
      //     await updateUserIdNumber(updateData)
      //   }
      // }
      const documentData = {
        name: values.documentType,
        user_id: currentUser.id,
        first_name: firstName,
        last_name: lastName,
        position,
        id_number: idNumber,
        purpose: goal,

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

  

  const renderUserInfo = (user, isEditable = false) => (
    <div className="row g-3 mb-4">
      <div className="col-md-6">
        <Label className="form-label">პირადი ნომერი</Label>
        {isEditable ? (
          <Field type="text" name="id_number" className="form-control" />
        ) : (
          <p className="form-control-plaintext border rounded p-2">
            {user?.id_number}
          </p>
        )}
        <ErrorMessage
          name="id_number"
          component="div"
          className="text-danger mt-1"
        />
      </div>
      <div className="col-md-6">
        <Label className="form-label">პოზიცია</Label>
        {isEditable ? (
          <Field type="text" name="position" className="form-control" />
        ) : (
          <p className="form-control-plaintext border rounded p-2">
            {user?.position}
          </p>
        )}
        <ErrorMessage
          name="position"
          component="div"
          className="text-danger mt-1"
        />
      </div>
    </div>
  )

  const isDocumentTypeDisabled = type => {
    if (isEmploymentDocument(type)) {
      const hasRequiredExperience = hasWorkedSixMonths(
        currentUser?.working_start_date
      )
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
                        currentUser,
                        selectedUser
                      )}
                      validationSchema={forUserValidationSchema(activeTab)}
                      onSubmit={handleDocumentSubmit}
                    >
                      {({ values, isSubmitting }) => (
                        <Form>
                          <TabContent activeTab={activeTab}>
                            <TabPane tabId="1">
                              {/* Document Type Selection */}
                              <div className="mb-4">
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
                                        disabled={isDocumentTypeDisabled(type)}
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

                              {/* User Info */}
                              {renderUserInfo(currentUser, isAdmin)}

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
                            </TabPane>

                            {canAccessOtherTab && (
                              <TabPane tabId="2">
                                {/* User Selection */}

                                {/* <div className="mb-4">
                                  <Label className="form-label">
                                    მომხმარებელი
                                  </Label>
                                  <Field
                                    type="text"
                                    name="selectedUser"
                                    className="form-control"
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    onChange={e => {
                                      setSelectedUserId(e.target.value)
                                      const formik = e.target.form?.formik
                                      if (formik) {
                                        formik.setFieldValue(
                                          "selectedUser",
                                          e.target.value
                                        )
                                      }
                                    }}
                                    value={selectedUserId}
                                  >
                                    <option value="">
                                      აირჩიეთ მომხმარებელი
                                    </option>
                                    {users.map(user => (
                                      <option key={user.id} value={user.id}>
                                        {user.name} (ID: {user.id_number})
                                      </option>
                                    ))}
                                  </Field>
                                  <ErrorMessage
                                    name="selectedUser"
                                    component="div"
                                    className="text-danger mt-1"
                                  />
                                </div> */}



                                <div className="row g-3 mb-4">
                                      <div className="col-md-6">
                                        <Label className="form-label">სახელი</Label>
                                        
                                          <Field type="text" name="first_name" className="form-control" value={firstName} onChange={e => setFirstName(e.target.value)} />
                                        
                                        <ErrorMessage
                                          name="first_name"
                                          component="div"
                                          className="text-danger mt-1"
                                        />
                                      </div>
                                      <div className="col-md-6">
                                        <Label className="form-label">გვარი</Label>
                                        
                                          <Field type="text" name="last_name" className="form-control" value={lastName} onChange={e => setLastName(e.target.value)} />
                                        
                                        <ErrorMessage
                                          name="last_name"
                                          component="div"
                                          className="text-danger mt-1"
                                        />
                                      </div>
                                    </div>

                                {/* Document Type and User Info */}
                                
                                  <>
                                    {/* Document Type Selection */}
                                    <div className="mb-4">
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
                                            <option key={key} value={type}>
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
                                    </div>

                                    {/* Selected User Info (editable) */}
                                    {/* {renderUserInfo(selectedUser, true)} */}

                                    <div className="row g-3 mb-4">
                                      <div className="col-md-6">
                                        <Label className="form-label">პირადი ნომერი</Label>
                                        
                                          <Field type="text" name="id_number" className="form-control" value={idNumber} onChange={e => setIdNumber(e.target.value)} />
                                        
                                        <ErrorMessage
                                          name="id_number"
                                          component="div"
                                          className="text-danger mt-1"
                                        />
                                      </div>
                                      <div className="col-md-6">
                                        <Label className="form-label">პოზიცია</Label>
                                          <Field type="text" name="position" className="form-control" value={position} onChange={e => setPosition(e.target.value)} />
                                        
                                        <ErrorMessage
                                          name="position"
                                          component="div"
                                          className="text-danger mt-1"
                                        />
                                      </div>
                                    </div>



                                    {/* Purpose field for paid documents */}
                                    {isPaidDocument(values.documentType) && (
                                      <div className="mb-4">
                                        <Label className="form-label">
                                          მიზანი
                                        </Label>
                                        <Field
                                          type="text"
                                          name="purpose"
                                          className="form-control"
                                          value={goal}
                                          onChange={e => setGoal(e.target.value)}
                                        />
                                        <ErrorMessage
                                          name="purpose"
                                          component="div"
                                          className="text-danger mt-1"
                                        />
                                      </div>
                                    )}
                                  </>
                                
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
