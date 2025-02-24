import React, { useState } from "react"
import { createHrDocument } from "services/hrDocument"
import * as Yup from "yup"
import useAuth from "hooks/useAuth"
import { Row, Col, Label } from "reactstrap"
import { Formik, Form, Field, ErrorMessage } from "formik"
import classnames from "classnames"
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"
import { Button } from "reactstrap"
import { useNavigate } from "react-router-dom"
import DatePicker from "components/DatePicker"
import { subMonths, isBefore } from "date-fns"
import { toast } from "store/zustand/toastStore"

const DOCUMENT_TYPES = {
  PAID_EMPLOYMENT: "ხელფასიანი ცნობა",
  UNPAID_EMPLOYMENT: "უხელფასო ცნობა",
  PAID_PROBATION: "გამოსაცდელი ვადით ხელფასიანი",
  UNPAID_PROBATION: "გამოსაცდელი ვადით უხელფასო",
}

const REGIONS = [
  "თბილისი",
  "ბათუმი",
  "ქუთაისი",
  "ზუგდიდი",
  "თელავი",
  "მარნეული",
  "რუსთავი",
  "გორი",
  "საჩხერე",
]

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
  const sixMonthsAgo = subMonths(new Date(), 6)
  return isBefore(new Date(startDate), sixMonthsAgo)
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
      region: "",
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
      region: "",
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
      region: "",
    }
  }
}

const validationSchema = Yup.object().shape({
  documentType: Yup.string().required("დოკუმენტის ტიპი აუცილებელია"),
  id_number: Yup.string().required("პირადი ნომერი აუცილებელია"),
  position: Yup.string().required("პოზიცია აუცილებელია"),
  region: Yup.string().required("რეგიონი აუცილებელია"),
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
  const { user, isAdmin, isHrMember, isSecurityManager, isAssistant } =
    useAuth()
  const [activeTab, setActiveTab] = useState("1")
  const isHrDepartmentHead =
    isHrMember && user?.roles?.some(role => role.slug === "department_head")
  const [startedDate, setStartedDate] = useState({
    started_date: "",
  })

  const canAccessOtherTab =
    isAdmin() ||
    isHrMember() ||
    isHrDepartmentHead ||
    isSecurityManager ||
    isAssistant()

  const handleDocumentSubmit = async (values, { setSubmitting }) => {
    try {
      const documentData = {
        name: values.documentType,
        user_id: user.id,
        first_name: values.first_name,
        last_name: values.last_name,
        is_other_user: activeTab === "2" ? 1 : 0,
        position: activeTab === "2" ? values.position : null,
        id_number: activeTab === "2" ? values.id_number : null,
        template_num:
          Object.values(DOCUMENT_TYPES).findIndex(
            d => d === values.documentType
          ) + 1,
        started_date: activeTab == "2" ? startedDate?.started_date : "",
        region: values.region,
        ...(isPaidDocument(values.documentType) && { purpose: values.purpose }),
      }

      if (!documentData.region) {
        toast.error("გთხოვთ აირჩიოთ რეგიონი", "შეცდომა", {
          duration: 2000,
          size: "small",
        })
        return
      }

      await createHrDocument(documentData)
      toast.success("დოკუმენტი წარმატებით შეიქმნა", "წარმატება", {
        duration: 2000,
        size: "small",
      })

      if (canAccessOtherTab && activeTab === "2") {
        navigate("/hr/documents/approve")
      } else {
        navigate("/hr/documents/my-requests")
      }
    } catch (err) {
      console.error("Error creating HR document:", err)
      toast.error("დოკუმენტის შექმნა ვერ მოხერხდა", "შეცდომა", {
        duration: 2000,
        size: "small",
      })
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
          {name === "id_number"
            ? user?.id_number
            : user?.position || user?.department?.name}
        </p>
      )}
      <ErrorMessage name={name} component="div" className="text-danger mt-1" />
    </div>
  )

  const renderUserForm = (values, tab) => (
    <>
      {tab === 2 && (
        <div className="row g-3 mb-4">
          {renderUserInfo(values, "სახელი", "first_name", true)}
          {renderUserInfo(values, "გვარი", "last_name", true)}
        </div>
      )}
      <div className="row g-3 mb-4">
        {tab == 2 && (
          <div className="col-md-6">
            <div className="flex flex-row">
              <Label className="form-label">დაწყების თარიღი</Label>
              <DatePicker
                startDate={startedDate}
                handleStartedDate={setStartedDate}
              />
            </div>
            <ErrorMessage
              name="started_date"
              component="div"
              className="text-danger mt-1"
            />
          </div>
        )}

        <div className={`${tab === 2 && "col-md-6"}`}>
          <Label className="form-label">დოკუმენტის ტიპი</Label>
          <Field as="select" name="documentType" className="form-select">
            <option value="">აირჩიეთ დოკუმენტის ტიპი</option>
            {Object.entries(DOCUMENT_TYPES).map(([key, type]) => (
              <option
                key={key}
                value={type}
                disabled={isDocumentTypeDisabled(
                  type,
                  tab == 1
                    ? user?.working_start_date
                    : startedDate?.started_date
                )}
              >
                {type}
              </option>
            ))}
          </Field>
          <ErrorMessage
            name="documentType"
            component="div"
            className="text-danger mt-1"
          />
          {getDocumentTypeHelpText(values.documentType) && (
            <div className="text-warning mt-1">
              <i className="bx bx-info-circle me-1"></i>
              {getDocumentTypeHelpText(values.documentType)}
            </div>
          )}
        </div>
      </div>
      <div>
        <Label className="form-label">რეგიონი</Label>
        <Field as="select" name="region" className="form-select">
          <option value="">აირჩიეთ რეგიონი</option>
          {Object.entries(REGIONS).map(([key, type]) => (
            <option key={key} value={type}>
              {type}
            </option>
          ))}
        </Field>
        <ErrorMessage
          name="region"
          component="div"
          className="text-danger mt-1"
        />
      </div>

      <div className="row g-3 mb-4 mt-2">
        {renderUserInfo(user, "პირადი ნომერი", "id_number", isAdmin)}
        {renderUserInfo(user, "პოზიცია", "position", isAdmin)}
      </div>

      {isPaidDocument(values.documentType) && (
        <div className="mb-4">
          <Label className="form-label">მიზანი</Label>
          <Field type="text" name="purpose" className="form-control" />
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
    <>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Row>
          <Col xl={8} className="mx-auto">
            <div>
              <div>
                <Nav tabs className="nav-tabs-custom">
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "1" })}
                      onClick={() => setActiveTab("1")}
                    >
                      ჩემთვის
                    </NavLink>
                  </NavItem>
                  {canAccessOtherTab && (
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
                    initialValues={getInitialValues(activeTab, user)}
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
      </div>
    </>
  )
}

export default HrPage
