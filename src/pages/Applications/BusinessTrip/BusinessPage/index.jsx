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
import { businessSchema } from "./validationSchema"
import Breadcrumbs from "components/Common/Breadcrumb"
import { createBusinessTrip } from "../../../../services/admin/business"
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

const BusinessPage = () => {
  const navigate = useNavigate()
  const { user, loading: userLoading } = useFetchUser()
  const roles = useUserRoles()
  const isAdmin = useMemo(() => roles.includes("admin"), [roles])

  const [departments, setDepartments] = useState([])
  const [departmentsLoading, setDepartmentsLoading] = useState(false)
  const [departmentsError, setDepartmentsError] = useState(null)
  const [activeTab, setActiveTab] = useState("1")

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

  // Initial values for "My Trip" (Tab 1)
  const initialValuesMyTrip = useMemo(
    () => ({
      trip_type: "",
      employee_name: user ? `${user.name} ${user.sur_name}` : "",
      department: user?.department?.name || "",
      position: user?.position || "",
      substitute_name: "",
      substitute_department: "",
      substitute_position: "",
      start_date: "",
      end_date: "",
      purpose: "",
      departure_location: "",
      arrival_location: "",
      duration_days: 0,
      accommodation_cost: 0,
      transportation_cost: 0,
      food_cost: 0,
      vehicle_expense: false,
      vehicle_model: "",
      vehicle_plate: "",
      fuel_cost: 0,
      final_cost: 0,
    }),
    [user]
  )

  // Initial values for "Employee Trip" (Tab 2)
  const initialValuesEmployeeTrip = useMemo(
    () => ({
      trip_type: "",
      employee_name: "",
      department: "",
      position: "",
      substitute_name: "",
      substitute_department: "",
      substitute_position: "",
      start_date: "",
      end_date: "",
      purpose: "",
      departure_location: "",
      arrival_location: "",
      duration_days: 0,
      accommodation_cost: 0,
      transportation_cost: 0,
      food_cost: 0,
      vehicle_expense: false,
      vehicle_model: "",
      vehicle_plate: "",
      fuel_cost: 0,
      final_cost: 0,
    }),
    []
  )

  // Formik for "My Trip" (Tab 1)
  const formikMyTrip = useFormik({
    initialValues: initialValuesMyTrip,
    validationSchema: businessSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        // Assign default values if vehicle_expense is false
        const submitData = {
          trip_type: values.trip_type,
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
          duration_days: values.duration_days,
          purpose: values.purpose,
          departure_location: values.departure_location,
          arrival_location: values.arrival_location,
          accommodation_cost: Number(values.accommodation_cost),
          transportation_cost: Number(values.transportation_cost),
          food_cost: Number(values.food_cost),
          vehicle_expense: values.vehicle_expense,
          vehicle_model: values.vehicle_expense
            ? values.vehicle_model
            : "არ არის მითითებული",
          vehicle_plate: values.vehicle_expense
            ? values.vehicle_plate
            : "არ არის მითითებული",
          fuel_cost: values.vehicle_expense ? Number(values.fuel_cost) : 0,
          final_cost: Number(values.final_cost),
        }

        console.log("Submitting My Trip data:", submitData)

        const res = await createBusinessTrip(submitData)
        if (res.status === 200) {
          toast.success("მივლინება წარმატებით იქცა!", {
            position: "top-right",
            autoClose: 3000,
          })

          resetForm({
            values: {
              ...initialValuesMyTrip,
              employee_name: `${user.name} ${user.sur_name}`,
              department: user.department?.name || "",
              position: user.position || "",
              // Other fields will reset to their initial values or the specified defaults
            },
          })
          navigate("/applications/business-trip/my-requests")
        }
      } catch (err) {
        console.error("Submission error:", err)
        const errorMessage =
          err?.response?.data?.message ||
          err?.response?.data?.data?.message ||
          "შეცდომა მოხდა. გთხოვთ სცადეთ მოგვიანებით."

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        })
      } finally {
        setSubmitting(false)
      }
    },
  })

  // Formik for "Employee Trip" (Tab 2)
  const formikEmployeeTrip = useFormik({
    initialValues: initialValuesEmployeeTrip,
    validationSchema: businessSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const submitData = {
          trip_type: values.trip_type,
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
          duration_days: values.duration_days,
          purpose: values.purpose,
          departure_location: values.departure_location,
          arrival_location: values.arrival_location,
          accommodation_cost: Number(values.accommodation_cost),
          transportation_cost: Number(values.transportation_cost),
          food_cost: Number(values.food_cost),
          vehicle_expense: values.vehicle_expense,
          vehicle_model: values.vehicle_expense
            ? values.vehicle_model
            : "არ არის მითითებული",
          vehicle_plate: values.vehicle_expense
            ? values.vehicle_plate
            : "არ არის მითითებული",
          fuel_cost: values.vehicle_expense ? Number(values.fuel_cost) : 0,
          final_cost: Number(values.final_cost),
        }

        console.log("Submitting Employee Trip data:", submitData)

        const res = await createBusinessTrip(submitData)
        if (res.status === 200) {
          toast.success("მივლინება წარმატებით იქცა!", {
            position: "top-right",
            autoClose: 3000,
          })

          resetForm()
          navigate("/applications/business-trip/my-requests")
        }
      } catch (err) {
        console.error("Submission error:", err)
        const errorMessage =
          err?.response?.data?.message ||
          err?.response?.data?.data?.message ||
          "შეცდომა მოხდა. გთხოვთ სცადეთ მოგვიანებით."

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        })
      } finally {
        setSubmitting(false)
      }
    },
  })

  // Calculate duration whenever relevant fields change for My Trip
  useEffect(() => {
    const newDuration = calculateDuration(
      formikMyTrip.values.start_date,
      formikMyTrip.values.end_date,
      formikMyTrip.values
    )
    if (newDuration !== formikMyTrip.values.duration_days) {
      formikMyTrip.setFieldValue("duration_days", newDuration)
    }
  }, [
    formikMyTrip.values.start_date,
    formikMyTrip.values.end_date,
    formikMyTrip.values,
    calculateDuration,
    formikMyTrip,
  ])

  // Calculate duration whenever relevant fields change for Employee Trip
  useEffect(() => {
    const newDuration = calculateDuration(
      formikEmployeeTrip.values.start_date,
      formikEmployeeTrip.values.end_date,
      formikEmployeeTrip.values
    )
    if (newDuration !== formikEmployeeTrip.values.duration_days) {
      formikEmployeeTrip.setFieldValue("duration_days", newDuration)
    }
  }, [
    formikEmployeeTrip.values.start_date,
    formikEmployeeTrip.values.end_date,
    formikEmployeeTrip.values,
    calculateDuration,
    formikEmployeeTrip,
  ])

  const toggleTab = useCallback(
    tab => {
      if (formikMyTrip.isSubmitting || formikEmployeeTrip.isSubmitting) return
      if (tab !== activeTab) {
        setActiveTab(tab)
        if (tab === "1") {
          // Reset My Trip form to initial values with user info
          formikMyTrip.resetForm({
            values: {
              ...initialValuesMyTrip,
              employee_name: `${user.name} ${user.sur_name}`,
              department: user.department?.name || "",
              position: user.position || "",
            },
          })
        } else if (tab === "2") {
          // Reset Employee Trip form
          formikEmployeeTrip.resetForm()
        }
      }
    },
    [activeTab, formikMyTrip, formikEmployeeTrip, initialValuesMyTrip, user]
  )

  // Handle vehicle_expense as a boolean for My Trip
  const handleVehicleExpenseChangeMyTrip = useCallback(
    e => {
      const value = e.target.value === "true"
      formikMyTrip.setFieldValue("vehicle_expense", value)
    },
    [formikMyTrip]
  )

  // Handle vehicle_expense as a boolean for Employee Trip
  const handleVehicleExpenseChangeEmployeeTrip = useCallback(
    e => {
      const value = e.target.value === "true"
      formikEmployeeTrip.setFieldValue("vehicle_expense", value)
    },
    [formikEmployeeTrip]
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
            breadcrumbItem="მივლინების გაგზავნა"
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
                          ჩემი მივლინება
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === "2" })}
                          onClick={() => toggleTab("2")}
                          style={{ cursor: "pointer" }}
                        >
                          თანამშრომლის მივლინება
                        </NavLink>
                      </NavItem>
                    </Nav>
                  )}

                  {!isAdmin && activeTab !== "1" && toggleTab("1")}

                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <Form onSubmit={formikMyTrip.handleSubmit}>
                        <div className="row">
                          <div className="col-md-6">
                            <InputWithError
                              formik={formikMyTrip}
                              name="employee_name"
                              label="სახელი და გვარი"
                              disabled
                            />
                          </div>
                          <div className="col-md-6">
                            <InputWithError
                              formik={formikMyTrip}
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
                              formik={formikMyTrip}
                              name="position"
                              label="პოზიცია"
                              disabled
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <InputWithError
                              formik={formikMyTrip}
                              name="substitute_name"
                              label="შემცვლელის სახელი"
                            />
                          </div>
                          <div className="col-md-6">
                            <InputWithError
                              formik={formikMyTrip}
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
                              formik={formikMyTrip}
                              name="substitute_position"
                              label="შემცვლელის პოზიცია"
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <InputWithError
                              formik={formikMyTrip}
                              name="trip_type"
                              label="მივლინების ტიპი"
                              type="select"
                            >
                              <option value="">აირჩიეთ ტიპი</option>
                              <option value="regional">რეგიონალური</option>
                              <option value="international">
                                საერთაშორისო
                              </option>
                            </InputWithError>
                          </div>
                          <div className="col-md-6">
                            <InputWithError
                              formik={formikMyTrip}
                              name="purpose"
                              label="მივლინების მიზანი"
                              type="textarea"
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <InputWithError
                              formik={formikMyTrip}
                              name="departure_location"
                              label="გასვლის ადგილი"
                            />
                          </div>
                          <div className="col-md-6">
                            <InputWithError
                              formik={formikMyTrip}
                              name="arrival_location"
                              label="ჩასვლის ადგილი"
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <InputWithError
                              formik={formikMyTrip}
                              name="accommodation_cost"
                              label="სასტუმროს ღირებულება"
                              type="number"
                            />
                          </div>
                          <div className="col-md-6">
                            <InputWithError
                              formik={formikMyTrip}
                              name="transportation_cost"
                              label="მოგზაურობის ღირებულება"
                              type="number"
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <InputWithError
                              formik={formikMyTrip}
                              name="food_cost"
                              label="საკვების ღირებულება"
                              type="number"
                            />
                          </div>
                          <div className="col-md-6">
                            <Label for="vehicle_expense">
                              ტრანსპორტის ხარჯი
                            </Label>
                            <Input
                              type="select"
                              id="vehicle_expense"
                              name="vehicle_expense"
                              onChange={handleVehicleExpenseChangeMyTrip}
                              onBlur={formikMyTrip.handleBlur}
                              value={formikMyTrip.values.vehicle_expense}
                              invalid={
                                formikMyTrip.touched.vehicle_expense &&
                                Boolean(formikMyTrip.errors.vehicle_expense)
                              }
                            >
                              <option value="">აირჩიეთ</option>
                              <option value={true}>დიახ</option>
                              <option value={false}>არა</option>
                            </Input>
                            {formikMyTrip.touched.vehicle_expense &&
                              formikMyTrip.errors.vehicle_expense && (
                                <div className="text-danger mt-1">
                                  {formikMyTrip.errors.vehicle_expense}
                                </div>
                              )}
                          </div>
                        </div>

                        {formikMyTrip.values.vehicle_expense && (
                          <>
                            <div className="row">
                              <div className="col-md-6">
                                <InputWithError
                                  formik={formikMyTrip}
                                  name="vehicle_model"
                                  label="ავტომობილის მოდელი"
                                />
                              </div>
                              <div className="col-md-6">
                                <InputWithError
                                  formik={formikMyTrip}
                                  name="vehicle_plate"
                                  label="ავტომობილის ნომერი"
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <InputWithError
                                  formik={formikMyTrip}
                                  name="fuel_cost"
                                  label="საწვავის ღირებულება"
                                  type="number"
                                />
                              </div>
                            </div>
                          </>
                        )}

                        <div className="row">
                          <div className="col-md-6">
                            <InputWithError
                              formik={formikMyTrip}
                              name="final_cost"
                              label="საბოლოო ღირებულება"
                              type="number"
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <InputWithError
                              formik={formikMyTrip}
                              name="start_date"
                              label="დაწყების თარიღი"
                              type="date"
                            />
                          </div>
                          <div className="col-md-6">
                            <InputWithError
                              formik={formikMyTrip}
                              name="end_date"
                              label="დასრულების თარიღი"
                              type="date"
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-12">
                            <div className="mb-3">
                              <Label>ხანგრძლივობა დღეებში</Label>
                              <Input
                                type="text"
                                value={formikMyTrip.values.duration_days}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>

                        <div className="d-flex justify-content-end">
                          <Button
                            type="submit"
                            color="primary"
                            disabled={
                              !formikMyTrip.isValid || formikMyTrip.isSubmitting
                            }
                          >
                            {formikMyTrip.isSubmitting
                              ? "იგზავნება..."
                              : "გაგზავნა"}
                          </Button>
                        </div>
                      </Form>
                    </TabPane>

                    {isAdmin && (
                      <TabPane tabId="2">
                        <Form onSubmit={formikEmployeeTrip.handleSubmit}>
                          <div className="row">
                            <div className="col-md-6">
                              <InputWithError
                                formik={formikEmployeeTrip}
                                name="employee_name"
                                label="თანამშრომლის სახელი და გვარი"
                                disabled={false}
                              />
                            </div>
                            <div className="col-md-6">
                              <InputWithError
                                formik={formikEmployeeTrip}
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
                                formik={formikEmployeeTrip}
                                name="position"
                                label="თანამშრომლის პოზიცია"
                                disabled={false}
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <InputWithError
                                formik={formikEmployeeTrip}
                                name="substitute_name"
                                label="შემცვლელის სახელი"
                              />
                            </div>
                            <div className="col-md-6">
                              <InputWithError
                                formik={formikEmployeeTrip}
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
                                formik={formikEmployeeTrip}
                                name="substitute_position"
                                label="შემცვლელის პოზიცია"
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <InputWithError
                                formik={formikEmployeeTrip}
                                name="trip_type"
                                label="მივლინების ტიპი"
                                type="select"
                              >
                                <option value="">აირჩიეთ ტიპი</option>
                                <option value="regional">რეგიონალური</option>
                                <option value="international">
                                  საერთაშორისო
                                </option>
                              </InputWithError>
                            </div>
                            <div className="col-md-6">
                              <InputWithError
                                formik={formikEmployeeTrip}
                                name="purpose"
                                label="მივლინების მიზანი"
                                type="textarea"
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <InputWithError
                                formik={formikEmployeeTrip}
                                name="departure_location"
                                label="გასვლის ადგილი"
                              />
                            </div>
                            <div className="col-md-6">
                              <InputWithError
                                formik={formikEmployeeTrip}
                                name="arrival_location"
                                label="ჩასვლის ადგილი"
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <InputWithError
                                formik={formikEmployeeTrip}
                                name="accommodation_cost"
                                label="სასტუმროს ღირებულება"
                                type="number"
                              />
                            </div>
                            <div className="col-md-6">
                              <InputWithError
                                formik={formikEmployeeTrip}
                                name="transportation_cost"
                                label="მოგზაურობის ღირებულება"
                                type="number"
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <InputWithError
                                formik={formikEmployeeTrip}
                                name="food_cost"
                                label="საკვების ღირებულება"
                                type="number"
                              />
                            </div>
                            <div className="col-md-6">
                              <Label for="vehicle_expense">
                                ტრანსპორტის ხარჯი
                              </Label>
                              <Input
                                type="select"
                                id="vehicle_expense"
                                name="vehicle_expense"
                                onChange={
                                  handleVehicleExpenseChangeEmployeeTrip
                                }
                                onBlur={formikEmployeeTrip.handleBlur}
                                value={
                                  formikEmployeeTrip.values.vehicle_expense
                                }
                                invalid={
                                  formikEmployeeTrip.touched.vehicle_expense &&
                                  Boolean(
                                    formikEmployeeTrip.errors.vehicle_expense
                                  )
                                }
                              >
                                <option value="">აირჩიეთ</option>
                                <option value={true}>დიახ</option>
                                <option value={false}>არა</option>
                              </Input>
                              {formikEmployeeTrip.touched.vehicle_expense &&
                                formikEmployeeTrip.errors.vehicle_expense && (
                                  <div className="text-danger mt-1">
                                    {formikEmployeeTrip.errors.vehicle_expense}
                                  </div>
                                )}
                            </div>
                          </div>

                          {formikEmployeeTrip.values.vehicle_expense && (
                            <>
                              <div className="row">
                                <div className="col-md-6">
                                  <InputWithError
                                    formik={formikEmployeeTrip}
                                    name="vehicle_model"
                                    label="ავტომობილის მოდელი"
                                  />
                                </div>
                                <div className="col-md-6">
                                  <InputWithError
                                    formik={formikEmployeeTrip}
                                    name="vehicle_plate"
                                    label="ავტომობილის ნომერი"
                                  />
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-6">
                                  <InputWithError
                                    formik={formikEmployeeTrip}
                                    name="fuel_cost"
                                    label="საწვავის ღირებულება"
                                    type="number"
                                  />
                                </div>
                              </div>
                            </>
                          )}

                          <div className="row">
                            <div className="col-md-6">
                              <InputWithError
                                formik={formikEmployeeTrip}
                                name="final_cost"
                                label="საბოლოო ღირებულება"
                                type="number"
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <InputWithError
                                formik={formikEmployeeTrip}
                                name="start_date"
                                label="დაწყების თარიღი"
                                type="date"
                              />
                            </div>
                            <div className="col-md-6">
                              <InputWithError
                                formik={formikEmployeeTrip}
                                name="end_date"
                                label="დასრულების თარიღი"
                                type="date"
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-12">
                              <div className="mb-3">
                                <Label>ხანგრძლივობა დღეებში</Label>
                                <Input
                                  type="text"
                                  value={
                                    formikEmployeeTrip.values.duration_days
                                  }
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>

                          <div className="d-flex justify-content-end">
                            <Button
                              type="submit"
                              color="primary"
                              disabled={
                                !formikEmployeeTrip.isValid ||
                                formikEmployeeTrip.isSubmitting
                              }
                            >
                              {formikEmployeeTrip.isSubmitting
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

export default BusinessPage
