import React, { useEffect, useMemo, useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardBody,
  Container,
  Form,
  Input,
  Label,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Spinner,
  Alert,
} from "reactstrap"
import { useFormik } from "formik"
import { vacationSchema } from "./validationSchema"
import Breadcrumbs from "components/Common/Breadcrumb"
import { createVacation } from "../../../../services/vacation"
import { getPublicDepartments as getDepartments } from "../../../../services/admin/department"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import useFetchUser from "hooks/useFetchUser"
import useUserRoles from "hooks/useUserRoles"
import classnames from "classnames"

const InputWithError = React.memo(function InputWithError({
  formik,
  name,
  label,
  type = "text",
  children,
  disabled,
  ...props
}) {
  return (
    <div className="mb-3">
      <Label for={name}>{label}</Label>
      <Input
        type={type}
        id={name}
        name={name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[name]}
        invalid={formik.touched[name] && Boolean(formik.errors[name])}
        disabled={disabled}
        {...props}
      >
        {children}
      </Input>
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-danger mt-1">{formik.errors[name]}</div>
      )}
    </div>
  )
})

const RestDaysCheckbox = React.memo(function RestDaysCheckbox({
  holidays,
  formik,
  handleCheckboxChange,
}) {
  return (
    <div className="mb-3">
      <Label>დასვენების დღეები</Label>
      <div className="d-flex flex-wrap">
        {holidays.map(holiday => (
          <div className="form-check form-check-inline" key={holiday.value}>
            <Input
              type="checkbox"
              id={holiday.value}
              name={holiday.value}
              checked={formik.values[holiday.value] === "yes"}
              onChange={handleCheckboxChange(holiday.value)}
              className="form-check-input"
            />
            <Label className="form-check-label" for={holiday.value}>
              {holiday.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
})

const VacationPage = () => {
  const navigate = useNavigate()
  const { user, loading: userLoading } = useFetchUser()
  const roles = useUserRoles()
  const isAdmin = useMemo(() => roles.includes("admin"), [roles])

  const [departments, setDepartments] = useState([])
  const [departmentsLoading, setDepartmentsLoading] = useState(false)
  const [departmentsError, setDepartmentsError] = useState(null)
  const [activeTab, setActiveTab] = useState("1")

  const holidays = useMemo(
    () => [
      { name: "ორშაბათი", value: "is_monday" },
      { name: "სამშაბათი", value: "is_tuesday" },
      { name: "ოთხშაბათი", value: "is_wednesday" },
      { name: "ხუთშაბათი", value: "is_thursday" },
      { name: "პარასკევი", value: "is_friday" },
      { name: "შაბათი", value: "is_saturday" },
      { name: "კვირა", value: "is_sunday" },
    ],
    []
  )

  useEffect(() => {
    const fetchDepartments = async () => {
      setDepartmentsLoading(true)
      try {
        const response = await getDepartments()
        if (response.status === 200) {
          setDepartments(response.data.departments)
        } else {
          setDepartmentsError("Failed to fetch departments.")
        }
      } catch (error) {
        console.error("Error fetching departments:", error)
        setDepartmentsError("An error occurred while fetching departments.")
      } finally {
        setDepartmentsLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  const initialValues = useMemo(
    () => ({
      vacation_type: "",
      employee_name: user ? `${user.name} ${user.sur_name}` : "",
      department: user?.department?.name || "",
      position: user?.position || "",
      substitute_name: "",
      substitute_department: "",
      substitute_position: "",
      start_date: "",
      end_date: "",
      is_monday: null,
      is_tuesday: null,
      is_wednesday: null,
      is_thursday: null,
      is_friday: null,
      is_saturday: null,
      is_sunday: null,
      duration_days: 0,
    }),
    [user]
  )

  const calculateDuration = useCallback((startDate, endDate, restDays) => {
    if (!startDate || !endDate) return 0

    const start = new Date(startDate)
    const end = new Date(endDate)
    let totalDays = 0

    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)

    const dayMap = {
      0: "sunday",
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    }

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const currentDay = dayMap[d.getDay()]
      if (restDays[`is_${currentDay}`] !== "yes") {
        totalDays++
      }
    }

    return Math.max(1, totalDays)
  }, [])

  const formik = useFormik({
    initialValues,
    validationSchema: vacationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const submitData = {
          vacation_type: values.vacation_type,
          employee_name: values.employee_name,
          department: values.department,
          position: values.position,
          substitute_name: values.substitute_name,
          substitute_department: values.substitute_department,
          substitute_position: values.substitute_position,
          start_date: values.start_date
            ? new Date(values.start_date).toISOString().split("T")[0]
            : "",
          end_date: values.end_date
            ? new Date(values.end_date).toISOString().split("T")[0]
            : "",
          is_monday: values.is_monday,
          is_tuesday: values.is_tuesday,
          is_wednesday: values.is_wednesday,
          is_thursday: values.is_thursday,
          is_friday: values.is_friday,
          is_saturday: values.is_saturday,
          is_sunday: values.is_sunday,
          duration_days: values.duration_days,
        }

        console.log("Submitting data:", submitData)

        const res = await createVacation(submitData)
        if (res.status === 200) {
          toast.success("Request submitted successfully!", {
            position: "top-right",
            autoClose: 3000,
          })

          resetForm()
          navigate("/applications/vacation/my-requests")
        }
      } catch (err) {
        console.error("Submission error:", err)
        const errorMessage =
          err?.response?.data?.message ||
          err?.response?.data?.data?.message ||
          "An error occurred. Please try again later."

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        })
      } finally {
        setSubmitting(false)
      }
    },
  })

  useEffect(() => {
    if (user && !userLoading) {
      formik.setValues({
        ...initialValues,
        employee_name: `${user.name} ${user.sur_name}`,
        department: user.department?.name || "",
        position: user.position || "",
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userLoading])

  useEffect(() => {
    const newDuration = calculateDuration(
      formik.values.start_date,
      formik.values.end_date,
      formik.values
    )
    if (newDuration !== formik.values.duration_days) {
      formik.setFieldValue("duration_days", newDuration)
    }
  }, [
    formik.values.start_date,
    formik.values.end_date,
    formik.values,
    calculateDuration,
    formik,
  ])

  const toggleTab = useCallback(
    tab => {
      if (formik.isSubmitting) return
      if (tab !== activeTab) {
        setActiveTab(tab)
        formik.resetForm({
          values: {
            vacation_type: "",
            employee_name: isAdmin
              ? ""
              : user
              ? `${user.name} ${user.sur_name}`
              : "",
            department: isAdmin ? "" : user?.department?.name || "",
            position: isAdmin ? "" : user?.position || "",
            substitute_name: "",
            substitute_department: "",
            substitute_position: "",
            start_date: "",
            end_date: "",
            is_monday: null,
            is_tuesday: null,
            is_wednesday: null,
            is_thursday: null,
            is_friday: null,
            is_saturday: null,
            is_sunday: null,
            duration_days: 0,
          },
        })
      }
    },
    [activeTab, formik, isAdmin, user]
  )

  const handleCheckboxChange = useCallback(
    fieldName => e => {
      formik.setFieldValue(fieldName, e.target.checked ? "yes" : null)
    },
    [formik]
  )

  if (userLoading || departmentsLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
      </div>
    )
  }

  if (departmentsError) {
    return (
      <div className="text-center mt-5">
        <Alert color="danger">{departmentsError}</Alert>
      </div>
    )
  }

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="განცხადებები"
            breadcrumbItem="შვებულების გაგზავნა"
          />
          <div className="row">
            <div className="col-12">
              <Card>
                <CardBody>
                  {isAdmin && (
                    <Nav tabs className="mb-3">
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === "1" })}
                          onClick={() => toggleTab("1")}
                          style={{ cursor: "pointer" }}
                        >
                          ჩემი შვებულება
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === "2" })}
                          onClick={() => toggleTab("2")}
                          style={{ cursor: "pointer" }}
                        >
                          თანამშრომლის შვებულება
                        </NavLink>
                      </NavItem>
                    </Nav>
                  )}

                  {!isAdmin && activeTab !== "1" && setActiveTab("1")}

                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <Form onSubmit={formik.handleSubmit}>
                        <div className="row">
                          <div className="col-md-6">
                            <InputWithError
                              formik={formik}
                              name="employee_name"
                              label="სახელი და გვარი"
                              disabled
                            />
                          </div>
                          <div className="col-md-6">
                            <InputWithError
                              formik={formik}
                              name="department"
                              label="დეპარტამენტი"
                              type="text"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <InputWithError
                              formik={formik}
                              name="position"
                              label="პოზიცია"
                              disabled
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <InputWithError
                              formik={formik}
                              name="substitute_name"
                              label="შემცვლელის სახელი"
                            />
                          </div>
                          <div className="col-md-6">
                            <InputWithError
                              formik={formik}
                              name="substitute_department"
                              label="შემცვლელის დეპარტამენტი"
                              type="select"
                            >
                              <option value="">აირჩიეთ დეპარტამენტი</option>
                              {departments.map(dept => (
                                <option key={dept.id} value={dept.name}>
                                  {dept.name}
                                </option>
                              ))}
                            </InputWithError>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <InputWithError
                              formik={formik}
                              name="substitute_position"
                              label="შემცვლელის პოზიცია"
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <InputWithError
                              formik={formik}
                              name="vacation_type"
                              label="შვებულების ტიპი"
                              type="select"
                            >
                              <option value="">აირჩიეთ ტიპი</option>
                              <option value="paid_leave">ანაზღაურებადი</option>
                              <option value="unpaid_leave">
                                ანაზღაურების გარეშე
                              </option>
                              <option value="maternity_leave">
                                უხელფასო შვებულება ორსულობის, მშობიარობისა და
                                ბავშვის მოვლის გამო
                              </option>
                              <option value="administrative_leave">
                                ადმინისტრაციული
                              </option>
                            </InputWithError>
                          </div>
                          <div className="col-md-6">
                            <InputWithError
                              formik={formik}
                              name="start_date"
                              label="დაწყების თარიღი"
                              type="date"
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <InputWithError
                              formik={formik}
                              name="end_date"
                              label="დასრულების თარიღი"
                              type="date"
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-12">
                            <RestDaysCheckbox
                              holidays={holidays}
                              formik={formik}
                              handleCheckboxChange={handleCheckboxChange}
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-12">
                            <div className="mb-3">
                              <Label>ხანგრძლივობა დღეებში</Label>
                              <Input
                                type="text"
                                value={formik.values.duration_days}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>

                        <div className="d-flex justify-content-end">
                          <Button
                            type="submit"
                            color="primary"
                            disabled={!formik.isValid || formik.isSubmitting}
                          >
                            {formik.isSubmitting ? "იგზავნება..." : "გაგზავნა"}
                          </Button>
                        </div>
                      </Form>
                    </TabPane>

                    {isAdmin && (
                      <TabPane tabId="2">
                        <Form onSubmit={formik.handleSubmit}>
                          <div className="row">
                            <div className="col-md-6">
                              <InputWithError
                                formik={formik}
                                name="employee_name"
                                label="თანამშრომლის სახელი და გვარი"
                                disabled={false}
                              />
                            </div>
                            <div className="col-md-6">
                              <InputWithError
                                formik={formik}
                                name="department"
                                label="თანამშრომლის დეპარტამენტი"
                                type="select"
                                disabled={false}
                              >
                                <option value="">აირჩიეთ დეპარტამენტი</option>
                                {departments.map(dept => (
                                  <option key={dept.id} value={dept.name}>
                                    {dept.name}
                                  </option>
                                ))}
                              </InputWithError>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <InputWithError
                                formik={formik}
                                name="position"
                                label="თანამშრომლის პოზიცია"
                                disabled={false}
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <InputWithError
                                formik={formik}
                                name="substitute_name"
                                label="შემცვლელის სახელი"
                              />
                            </div>
                            <div className="col-md-6">
                              <InputWithError
                                formik={formik}
                                name="substitute_department"
                                label="შემცვლელის დეპარტამენტი"
                                type="select"
                              >
                                <option value="">აირჩიეთ დეპარტამენტი</option>
                                {departments.map(dept => (
                                  <option key={dept.id} value={dept.name}>
                                    {dept.name}
                                  </option>
                                ))}
                              </InputWithError>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <InputWithError
                                formik={formik}
                                name="substitute_position"
                                label="შემცვლელის პოზიცია"
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <InputWithError
                                formik={formik}
                                name="vacation_type"
                                label="შვებულების ტიპი"
                                type="select"
                              >
                                <option value="">აირჩიეთ ტიპი</option>
                                <option value="paid_leave">
                                  ანაზღაურებადი
                                </option>
                                <option value="unpaid_leave">
                                  ანაზღაურების გარეშე
                                </option>
                                <option value="maternity_leave">
                                  უხელფასო შვებულება ორსულობის, მშობიარობისა და
                                  ბავშვის მოვლის გამო
                                </option>
                                <option value="administrative_leave">
                                  ადმინისტრაციული
                                </option>
                              </InputWithError>
                            </div>
                            <div className="col-md-6">
                              <InputWithError
                                formik={formik}
                                name="start_date"
                                label="დაწყების თარიღი"
                                type="date"
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <InputWithError
                                formik={formik}
                                name="end_date"
                                label="დასრულების თარიღი"
                                type="date"
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-12">
                              <RestDaysCheckbox
                                holidays={holidays}
                                formik={formik}
                                handleCheckboxChange={handleCheckboxChange}
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-12">
                              <div className="mb-3">
                                <Label>ხანგრძლივობა დღეებში</Label>
                                <Input
                                  type="text"
                                  value={formik.values.duration_days}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>

                          <div className="d-flex justify-content-end">
                            <Button
                              type="submit"
                              color="primary"
                              disabled={!formik.isValid || formik.isSubmitting}
                            >
                              {formik.isSubmitting
                                ? "იგზავნება..."
                                : "გაგზავნა"}
                            </Button>
                          </div>
                        </Form>
                      </TabPane>
                    )}
                  </TabContent>
                </CardBody>
              </Card>
            </div>
          </div>
        </Container>
      </div>
      <ToastContainer />
    </>
  )
}

export default VacationPage
