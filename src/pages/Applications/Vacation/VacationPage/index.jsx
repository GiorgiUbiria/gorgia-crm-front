import React, { useEffect, useMemo, useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardBody,
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
import {
  createVacation,
  getVacationBalance,
} from "../../../../services/admin/vacation"
import { getPublicDepartments as getDepartments } from "../../../../services/admin/department"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import useFetchUser from "hooks/useFetchUser"
import useUserRoles from "hooks/useUserRoles"
import classnames from "classnames"
import VacationBalance from "../../../../components/Vacation/VacationBalance"
import { Tooltip } from "@mui/material"

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
      <Label className="mb-2 text-lg font-semibold">დასვენების დღეები</Label>
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
  const [vacationBalance, setVacationBalance] = useState(null)
  const [balanceLoading, setBalanceLoading] = useState(false)

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
    const fetchVacationBalance = async () => {
      setBalanceLoading(true)
      try {
        const response = await getVacationBalance()
        setVacationBalance(response.data)
      } catch (error) {
        console.error("Error fetching vacation balance:", error)
        toast.error("შვებულების ბალანსის მიღება ვერ მოხერხდა")
      } finally {
        setBalanceLoading(false)
      }
    }

    fetchVacationBalance()
  }, [])

  useEffect(() => {
    const fetchDepartments = async () => {
      setDepartmentsLoading(true)
      try {
        const response = await getDepartments()
        if (response?.data?.data) {
          setDepartments(response.data.data)
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

  const initialValuesMyVacation = useMemo(
    () => ({
      vacation_type: "",
      employee_name: user ? `${user.name} ${user.sur_name}` : "",
      department: user?.department?.name || "",
      position: user?.position || "",
      substitute_name: "",
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
      remaining_days: vacationBalance?.remaining_days,
    }),
    [user, vacationBalance]
  )

  const initialValuesEmployeeVacation = useMemo(
    () => ({
      vacation_type: "",
      employee_name: "",
      department: "",
      position: "",
      substitute_name: "",
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
    []
  )

  const formikMyVacation = useFormik({
    initialValues: initialValuesMyVacation,
    validationSchema: vacationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (
        values.vacation_type === "paid_leave" &&
        values.duration_days > vacationBalance?.remaining_days
      ) {
        toast.error(
          "მოთხოვნილი დღეების რაოდენობა აღემატება დარჩენილ ანაზღაურებად შვებულებას"
        )
        return
      }

      if (
        values.vacation_type === "administrative_leave" &&
        values.duration_days > 7
      ) {
        toast.error("ადმინისტრაციული შვებულება არ შეიძლება აღემატებოდეს 7 დღეს")
        return
      }

      try {
        const submitData = {
          vacation_type: values.vacation_type,
          employee_name: values.employee_name,
          department: values.department,
          position: values.position,
          substitute_name: values.substitute_name,
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

        const response = await createVacation(submitData)

        if (response && (response.status === 200 || response.status === 201)) {
          toast.success("შვებულება წარმატებით გაიგზავნა", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })

          // Refresh vacation balance after successful submission
          const balanceResponse = await getVacationBalance()
          setVacationBalance(balanceResponse.data)

          setTimeout(() => {
            resetForm({
              values: {
                ...initialValuesMyVacation,
                employee_name: `${user.name} ${user.sur_name}`,
                department: user.department?.name || "",
                position: user.position || "",
              },
            })
            navigate("/applications/vacation/my-requests")
          }, 1000)
        } else {
          throw new Error("Unexpected response status")
        }
      } catch (err) {
        console.error("Submission error:", err)
        toast.error(
          err?.response?.data?.message ||
            err?.response?.data?.data?.message ||
            "შეცდომა მოხდა. გთხოვთ სცადეთ მოგვიანებით.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        )
      } finally {
        setSubmitting(false)
      }
    },
  })

  const formikEmployeeVacation = useFormik({
    initialValues: initialValuesEmployeeVacation,
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

        const response = await createVacation(submitData)

        if (response && (response.status === 200 || response.status === 201)) {
          toast.success("შვებულება წარმატებით გაიგზავნა", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })

          setTimeout(() => {
            resetForm()
            navigate("/applications/vacation/my-requests")
          }, 1000)
        } else {
          throw new Error("Unexpected response status")
        }
      } catch (err) {
        console.error("Submission error:", err)
        toast.error(
          err?.response?.data?.message ||
            err?.response?.data?.data?.message ||
            "შეცდომა მოხდა. გთხოვთ სცადეთ მოგვიანებით.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        )
      } finally {
        setSubmitting(false)
      }
    },
  })

  useEffect(() => {
    if (user && !userLoading) {
      formikMyVacation.setValues({
        ...initialValuesMyVacation,
        employee_name: `${user.name} ${user.sur_name}`,
        department: user.department?.name || "",
        position: user.position || "",
      })
    }
  }, [user, userLoading, initialValuesMyVacation])

  useEffect(() => {
    const newDuration = calculateDuration(
      formikMyVacation.values.start_date,
      formikMyVacation.values.end_date,
      formikMyVacation.values
    )
    if (newDuration !== formikMyVacation.values.duration_days) {
      formikMyVacation.setFieldValue("duration_days", newDuration)

      // Show warnings for duration limits
      if (formikMyVacation.values.vacation_type === "paid_leave") {
        if (newDuration > vacationBalance?.remaining_days) {
          toast.warning(
            `მოთხოვნილი დღეების რაოდენობა (${newDuration}) აღემატება დარჩენილ ანაზღაურებად შვებულებას (${vacationBalance?.remaining_days})`
          )
        }
      } else if (
        formikMyVacation.values.vacation_type === "administrative_leave"
      ) {
        if (newDuration > 7) {
          toast.warning(
            "ადმინისტრაციული შვებულება არ შეიძლება აღემატებოდეს 7 დღეს"
          )
        }
      }
    }
  }, [
    formikMyVacation.values.start_date,
    formikMyVacation.values.end_date,
    formikMyVacation.values,
    calculateDuration,
    formikMyVacation,
    vacationBalance,
  ])

  useEffect(() => {
    const newDuration = calculateDuration(
      formikEmployeeVacation.values.start_date,
      formikEmployeeVacation.values.end_date,
      formikEmployeeVacation.values
    )
    if (newDuration !== formikEmployeeVacation.values.duration_days) {
      formikEmployeeVacation.setFieldValue("duration_days", newDuration)
    }
  }, [
    formikEmployeeVacation.values.start_date,
    formikEmployeeVacation.values.end_date,
    formikEmployeeVacation.values,
    calculateDuration,
    formikEmployeeVacation,
  ])

  const toggleTab = useCallback(
    tab => {
      if (formikMyVacation.isSubmitting || formikEmployeeVacation.isSubmitting)
        return
      if (tab !== activeTab) {
        setActiveTab(tab)
        if (tab === "1") {
          formikMyVacation.resetForm({
            values: {
              ...initialValuesMyVacation,
              employee_name: `${user.name} ${user.sur_name}`,
              department: user.department?.name || "",
              position: user.position || "",
            },
          })
        } else if (tab === "2") {
          formikEmployeeVacation.resetForm()
        }
      }
    },
    [
      activeTab,
      formikMyVacation,
      formikEmployeeVacation,
      initialValuesMyVacation,
      user,
    ]
  )

  const handleCheckboxChange = useCallback(
    fieldName => e => {
      formikMyVacation.setFieldValue(fieldName, e.target.checked ? "yes" : null)
      formikEmployeeVacation.setFieldValue(
        fieldName,
        e.target.checked ? "yes" : null
      )
    },
    [formikMyVacation, formikEmployeeVacation]
  )

  if (userLoading || departmentsLoading || balanceLoading) {
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
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="p-4 sm:p-6">
          {vacationBalance && (
            <>
              <VacationBalance balance={vacationBalance} />
              {vacationBalance.pending_requests > 0 && (
                <Alert color="warning" className="mb-4">
                  <i className="bx bx-time-five me-2"></i>
                  თქვენ გაქვთ {vacationBalance.pending_requests}, ანაზღაურებადი
                  შვებულების მოთხოვნა განხილვის პროცესში
                </Alert>
              )}
              {vacationBalance.approved_future_requests > 0 && (
                <Alert color="info" className="mb-4">
                  <i className="bx bx-calendar-check me-2"></i>
                  თქვენ გაქვთ {vacationBalance.approved_future_requests},
                  დამტკიცებული ანაზღაურებადი შვებულება
                </Alert>
              )}
            </>
          )}

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

              {!isAdmin && activeTab !== "1" && toggleTab("1")}

              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <Form onSubmit={formikMyVacation.handleSubmit}>
                    {/* Employee Information Section */}
                    <h5 className="mb-3 text-lg font-semibold">
                      თანამშრომლის ინფორმაცია
                    </h5>
                    <div className="row">
                      <div className="col-md-6">
                        <InputWithError
                          formik={formikMyVacation}
                          name="employee_name"
                          label="სახელი და გვარი"
                          disabled
                        />
                      </div>
                      <div className="col-md-6">
                        <InputWithError
                          formik={formikMyVacation}
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
                          formik={formikMyVacation}
                          name="position"
                          label="პოზიცია"
                          disabled
                        />
                      </div>
                    </div>

                    {/* Substitute Information Section */}
                    <h5 className="mb-3 text-lg font-semibold">
                      შემცვლელის ინფორმაცია
                    </h5>
                    <div className="row">
                      <div className="col-md-6">
                        <InputWithError
                          formik={formikMyVacation}
                          name="substitute_name"
                          label="შემცვლელის სახელი/გვარი"
                        />
                      </div>
                      <div className="col-md-6">
                        <InputWithError
                          formik={formikMyVacation}
                          name="substitute_position"
                          label="შემცვლელის პოზიცია"
                        />
                      </div>
                    </div>

                    {/* Vacation Details Section */}
                    <h5 className="mb-3 text-lg font-semibold">
                      შვებულების დეტალები
                    </h5>
                    <div className="row">
                      <div className="col-md-6">
                        <InputWithError
                          formik={formikMyVacation}
                          name="start_date"
                          label="დაწყების თარიღი"
                          type="date"
                        />
                      </div>
                      <div className="col-md-6">
                        <InputWithError
                          formik={formikMyVacation}
                          name="end_date"
                          label="დასრულების თარიღი"
                          type="date"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <Label for="vacation_type">
                            შვებულების ტიპი{" "}
                            {formikMyVacation.values.vacation_type ===
                              "paid_leave" && (
                              <Tooltip
                                title={`დარჩენილი ანაზღაურებადი შვებულება: ${vacationBalance?.remaining_days} დღე`}
                                arrow
                              >
                                <span className="badge bg-info">
                                  {vacationBalance?.remaining_days} დღე
                                </span>
                              </Tooltip>
                            )}
                          </Label>
                          <Input
                            type="select"
                            id="vacation_type"
                            name="vacation_type"
                            onChange={formikMyVacation.handleChange}
                            onBlur={formikMyVacation.handleBlur}
                            value={formikMyVacation.values.vacation_type}
                            invalid={
                              formikMyVacation.touched.vacation_type &&
                              Boolean(formikMyVacation.errors.vacation_type)
                            }
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
                          </Input>
                          {formikMyVacation.touched.vacation_type &&
                            formikMyVacation.errors.vacation_type && (
                              <div className="text-danger mt-1">
                                {formikMyVacation.errors.vacation_type}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Rest Days Section */}
                    <div className="row">
                      <div className="col-12">
                        <RestDaysCheckbox
                          holidays={holidays}
                          formik={formikMyVacation}
                          handleCheckboxChange={handleCheckboxChange}
                        />
                      </div>
                    </div>

                    {/* Duration Section */}
                    <div className="row">
                      <div className="col-12">
                        <div className="mb-3">
                          <Label className="mb-2 text-lg font-semibold">
                            ხანგრძლივობა დღეებში
                          </Label>
                          <Input
                            type="text"
                            value={formikMyVacation.values.duration_days}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="d-flex justify-content-end">
                      <Button
                        type="submit"
                        color="primary"
                        disabled={
                          !formikMyVacation.isValid ||
                          formikMyVacation.isSubmitting ||
                          (formikMyVacation.values.vacation_type ===
                            "paid_leave" &&
                            formikMyVacation.values.duration_days >
                              vacationBalance?.remaining_days) ||
                          (formikMyVacation.values.vacation_type ===
                            "administrative_leave" &&
                            formikMyVacation.values.duration_days > 7)
                        }
                      >
                        {formikMyVacation.isSubmitting
                          ? "იგზავნება..."
                          : "გაგზავნა"}
                      </Button>
                    </div>
                  </Form>
                </TabPane>

                {isAdmin && (
                  <TabPane tabId="2">
                    <Form onSubmit={formikEmployeeVacation.handleSubmit}>
                      {/* Employee Information Section */}
                      <h5 className="mb-3 text-lg font-semibold">
                        თანამშრომლის ინფორმაცია
                      </h5>
                      <div className="row">
                        <div className="col-md-6">
                          <InputWithError
                            formik={formikEmployeeVacation}
                            name="employee_name"
                            label="თანამშრომლის სახელი და გვარი"
                            disabled={false}
                          />
                        </div>
                        <div className="col-md-6">
                          <InputWithError
                            formik={formikEmployeeVacation}
                            name="department"
                            label="თანამშრომლის დეპარტამენტი"
                            type="select"
                            disabled={false}
                          >
                            <option value="">აირჩიეთ დეპარტამენტი</option>
                            {Array.isArray(departments) &&
                            departments.length > 0 ? (
                              departments.map(dept => (
                                <option key={dept.id} value={dept.name}>
                                  {dept.name}
                                </option>
                              ))
                            ) : (
                              <option value="" disabled>
                                დეპარტამენტები არ არის ხელმისაწვდომი
                              </option>
                            )}
                          </InputWithError>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <InputWithError
                            formik={formikEmployeeVacation}
                            name="position"
                            label="თანამშამლის პოზიცია"
                            disabled={false}
                          />
                        </div>
                      </div>

                      {/* Substitute Information Section */}
                      <h5 className="mb-3 text-lg font-semibold">
                        შემცვლელის ინფორმაცია
                      </h5>
                      <div className="row">
                        <div className="col-md-6">
                          <InputWithError
                            formik={formikEmployeeVacation}
                            name="substitute_name"
                            label="შემცვლელის სახელი/გვარი"
                          />
                        </div>
                        <div className="col-md-6">
                          <InputWithError
                            formik={formikEmployeeVacation}
                            name="substitute_position"
                            label="შემცვლელის პოზიცია"
                          />
                        </div>
                      </div>

                      {/* Vacation Details Section */}
                      <h5 className="mb-3 text-lg font-semibold">
                        შვებულების დეტალები
                      </h5>
                      <div className="row">
                        <div className="col-md-6">
                          <InputWithError
                            formik={formikEmployeeVacation}
                            name="start_date"
                            label="დაწყების თარიღი"
                            type="date"
                          />
                        </div>
                        <div className="col-md-6">
                          <InputWithError
                            formik={formikEmployeeVacation}
                            name="end_date"
                            label="დასრულების თარიღი"
                            type="date"
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <InputWithError
                            formik={formikEmployeeVacation}
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
                      </div>

                      {/* Rest Days Section */}
                      <div className="row">
                        <div className="col-12">
                          <RestDaysCheckbox
                            holidays={holidays}
                            formik={formikEmployeeVacation}
                            handleCheckboxChange={handleCheckboxChange}
                          />
                        </div>
                      </div>

                      {/* Duration Section */}
                      <div className="row">
                        <div className="col-12">
                          <div className="mb-3">
                            <Label className="mb-2 text-lg font-semibold">
                              ხანგრძლივობა დღეებში
                            </Label>
                            <Input
                              type="text"
                              value={
                                formikEmployeeVacation.values.duration_days
                              }
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="d-flex justify-content-end">
                        <Button
                          type="submit"
                          color="primary"
                          disabled={
                            !formikEmployeeVacation.isValid ||
                            formikEmployeeVacation.isSubmitting
                          }
                        >
                          {formikEmployeeVacation.isSubmitting
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
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </>
  )
}

export default VacationPage
