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
import { businessSchema } from "./validationSchema"
import { createBusinessTrip } from "../../../../services/admin/business"
import { getPublicDepartments as getDepartments } from "../../../../services/admin/department"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import useFetchUser from "hooks/useFetchUser"
import useUserRoles from "hooks/useUserRoles"
import classnames from "classnames"
import cities from "../common/distances"

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
      {type === "select" ? (
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
      ) : (
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
        />
      )}
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
  const [availableDestinations, setAvailableDestinations] = useState([])

  const [departments, setDepartments] = useState([])
  const [departmentsLoading, setDepartmentsLoading] = useState(true)
  const [departmentsError, setDepartmentsError] = useState(null)
  const [activeTab, setActiveTab] = useState("1")

  useEffect(() => {
    const fetchDepartments = async () => {
      setDepartmentsLoading(true)
      try {
        const response = await getDepartments()
        console.log("Departments response:", response)

        if (response?.data) {
          console.log("Departments data:", response.data)
          setDepartments(response.data)
        } else {
          setDepartmentsError("დეპარტამენტების ჩატვირთვა ვერ მოხერხდა")
        }
      } catch (error) {
        console.error("Error fetching departments:", error)
        setDepartmentsError("დეპარტამენტების ჩატვირთვა ვერ მოხერხდა")
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

  const initialValuesMyTrip = useMemo(
    () => ({
      trip_type: "",
      employee_name: user ? `${user.name} ${user.sur_name}` : "",
      department: user?.department?.name || "",
      position: user?.position || "",
      substitute_name: "",
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
      fuel_type: "",
      fuel_consumption_per_100: 0,
      total_fuel: 0,
      final_cost: 0,
    }),
    [user]
  )

  const initialValuesEmployeeTrip = useMemo(
    () => ({
      trip_type: "",
      employee_name: "",
      department: "",
      position: "",
      substitute_name: "",
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
      fuel_type: "",
      fuel_consumption_per_100: 0,
      total_fuel: 0,
      final_cost: 0,
    }),
    []
  )

  const calculateFinalCost = values => {
    const {
      accommodation_cost = 0,
      transportation_cost = 0,
      food_cost = 0,
      fuel_cost = 0,
    } = values
    return (
      Number(accommodation_cost) +
      Number(transportation_cost) +
      Number(food_cost) +
      (values.vehicle_expense ? Number(fuel_cost) : 0)
    )
  }

  const calculateTotalFuel = useCallback(values => {
    if (
      !values.vehicle_expense ||
      !values.departure_location ||
      !values.arrival_location ||
      !values.fuel_consumption_per_100
    ) {
      return 0
    }

    const distance =
      cities[values.departure_location]?.[values.arrival_location]
    if (!distance) {
      return 0
    }

    // Calculate fuel for round trip (distance * 2) and convert to litres per 100km
    return (distance * 2 * values.fuel_consumption_per_100) / 100
  }, [])

  const formikMyTrip = useFormik({
    initialValues: initialValuesMyTrip,
    validationSchema: businessSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const final_cost = calculateFinalCost(values)
        const submitData = {
          ...values,
          start_date: values.start_date
            ? new Date(values.start_date).toISOString().split("T")[0]
            : "",
          end_date: values.end_date
            ? new Date(values.end_date).toISOString().split("T")[0]
            : "",
          accommodation_cost: Number(values.accommodation_cost),
          transportation_cost: Number(values.transportation_cost),
          food_cost: Number(values.food_cost),
          fuel_cost: values.vehicle_expense ? Number(values.fuel_cost) : 0,
          final_cost,
        }

        const res = await createBusinessTrip(submitData)
        if (res.status === 200) {
          toast.success("მივლინება წარმატებით გაიგზავნა", {
            position: "top-right",
            autoClose: 3000,
          })

          resetForm({
            values: {
              ...initialValuesMyTrip,
              employee_name: `${user.name} ${user.sur_name}`,
              department: user.department?.name || "",
              position: user.position || "",
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

  const formikEmployeeTrip = useFormik({
    initialValues: initialValuesEmployeeTrip,
    validationSchema: businessSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const final_cost = calculateFinalCost(values)
        const submitData = {
          ...values,
          start_date: values.start_date
            ? new Date(values.start_date).toISOString().split("T")[0]
            : "",
          end_date: values.end_date
            ? new Date(values.end_date).toISOString().split("T")[0]
            : "",
          accommodation_cost: Number(values.accommodation_cost),
          transportation_cost: Number(values.transportation_cost),
          food_cost: Number(values.food_cost),
          fuel_cost: values.vehicle_expense ? Number(values.fuel_cost) : 0,
          final_cost,
          vehicle_model: values.vehicle_expense
            ? values.vehicle_model
            : "არ არის მითითებული",
          vehicle_plate: values.vehicle_expense
            ? values.vehicle_plate
            : "არ არის მითითებული",
        }

        console.log("Submitting Employee Trip data:", submitData)

        const res = await createBusinessTrip(submitData)
        if (res.status === 200) {
          toast.success("მივლინება წარმატებით გაიგზავნა", {
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

  useEffect(() => {
    if (formikMyTrip.values.departure_location) {
      const destinations = cities[formikMyTrip.values.departure_location] || {}
      setAvailableDestinations(Object.keys(destinations))

      // Reset arrival location if it's not valid for the new departure location
      if (
        formikMyTrip.values.arrival_location &&
        !destinations[formikMyTrip.values.arrival_location]
      ) {
        formikMyTrip.setFieldValue("arrival_location", "")
      }
    } else {
      setAvailableDestinations([])
    }
  }, [formikMyTrip.values.departure_location])

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

  useEffect(() => {
    const newTotalFuel = calculateTotalFuel(formikMyTrip.values)
    if (newTotalFuel !== formikMyTrip.values.total_fuel) {
      formikMyTrip.setFieldValue("total_fuel", newTotalFuel)
    }
  }, [
    formikMyTrip.values.departure_location,
    formikMyTrip.values.arrival_location,
    formikMyTrip.values.fuel_consumption_per_100,
    formikMyTrip.values.vehicle_expense,
    calculateTotalFuel,
    formikMyTrip,
  ])

  useEffect(() => {
    const newTotalFuel = calculateTotalFuel(formikEmployeeTrip.values)
    if (newTotalFuel !== formikEmployeeTrip.values.total_fuel) {
      formikEmployeeTrip.setFieldValue("total_fuel", newTotalFuel)
    }
  }, [
    formikEmployeeTrip.values.departure_location,
    formikEmployeeTrip.values.arrival_location,
    formikEmployeeTrip.values.fuel_consumption_per_100,
    formikEmployeeTrip.values.vehicle_expense,
    calculateTotalFuel,
    formikEmployeeTrip,
  ])

  const toggleTab = useCallback(
    tab => {
      if (formikMyTrip.isSubmitting || formikEmployeeTrip.isSubmitting) return
      if (tab !== activeTab) {
        setActiveTab(tab)
        if (tab === "1") {
          formikMyTrip.resetForm({
            values: {
              ...initialValuesMyTrip,
              employee_name: `${user.name} ${user.sur_name}`,
              department: user.department?.name || "",
              position: user.position || "",
            },
          })
        } else if (tab === "2") {
          formikEmployeeTrip.resetForm()
        }
      }
    },
    [activeTab, formikMyTrip, formikEmployeeTrip, initialValuesMyTrip, user]
  )

  const handleVehicleExpenseChangeMyTrip = useCallback(
    e => {
      const value = e.target.value === "true"
      formikMyTrip.setFieldValue("vehicle_expense", value)
    },
    [formikMyTrip]
  )

  const handleVehicleExpenseChangeEmployeeTrip = useCallback(
    e => {
      const value = e.target.value === "true"
      formikEmployeeTrip.setFieldValue("vehicle_expense", value)
    },
    [formikEmployeeTrip]
  )

  const handleCostChangeMyTrip = useCallback(() => {
    formikMyTrip.setFieldValue(
      "final_cost",
      calculateFinalCost(formikMyTrip.values)
    )
  }, [formikMyTrip.values])

  const handleCostChangeEmployeeTrip = useCallback(() => {
    formikEmployeeTrip.setFieldValue(
      "final_cost",
      calculateFinalCost(formikEmployeeTrip.values)
    )
  }, [formikEmployeeTrip.values])

  useEffect(() => {
    handleCostChangeMyTrip()
  }, [
    formikMyTrip.values.accommodation_cost,
    formikMyTrip.values.transportation_cost,
    formikMyTrip.values.food_cost,
    formikMyTrip.values.fuel_cost,
    formikMyTrip.values.vehicle_expense,
    handleCostChangeMyTrip,
  ])

  useEffect(() => {
    handleCostChangeEmployeeTrip()
  }, [
    formikEmployeeTrip.values.accommodation_cost,
    formikEmployeeTrip.values.transportation_cost,
    formikEmployeeTrip.values.food_cost,
    formikEmployeeTrip.values.fuel_cost,
    formikEmployeeTrip.values.vehicle_expense,
    handleCostChangeEmployeeTrip,
  ])

  const renderForm = (formik, handleVehicleExpenseChange, currentTab) => {
    if (departmentsLoading) {
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
      <Form onSubmit={formik.handleSubmit}>
        <h5 className="mt-4 text-lg font-semibold">მივლინების ტიპი</h5>
        <InputWithError formik={formik} name="trip_type" label="" type="select">
          <option value="">აირჩიეთ ტიპი</option>
          <option value="regional">რეგიონალური</option>
          <option value="international">საერთაშორისო</option>
        </InputWithError>

        <h5 className="mt-4 text-lg font-semibold">მივლინების ადგილი</h5>
        <div className="row">
          <div className="col-md-6">
            <InputWithError
              formik={formik}
              name="departure_location"
              label="გასვლის ადგილი"
              type="select"
            >
              <option value="">აირჩიეთ გასვლის ადგილი</option>
              {Object.keys(cities).map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </InputWithError>
          </div>
          <div className="col-md-6">
            <InputWithError
              formik={formik}
              name="arrival_location"
              label="დანიშნულების ადგილი"
              type="select"
              disabled={!formik.values.departure_location}
            >
              <option value="">აირჩიეთ დანიშნულების ადგილი</option>
              {availableDestinations.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </InputWithError>
          </div>
        </div>

        <h5 className="mt-4 text-lg font-semibold">მივლინების მიზანი</h5>
        <InputWithError
          formik={formik}
          name="purpose"
          label=""
          type="textarea"
        />

        <h5 className="mt-4 text-lg font-semibold">ხანგრძლივობა</h5>
        <div className="row">
          <div className="col-md-4">
            <InputWithError
              formik={formik}
              name="start_date"
              label="დაწყების თარიღი"
              type="date"
            />
          </div>
          <div className="col-md-4">
            <InputWithError
              formik={formik}
              name="end_date"
              label="დასრულების თარიღი"
              type="date"
            />
          </div>
          <div className="col-md-4">
            <Label for="duration_days">ხანგრძლივობა დღეებში</Label>
            <Input
              type="text"
              id="duration_days"
              name="duration_days"
              value={formik.values.duration_days}
              readOnly
            />
          </div>
        </div>

        <h5 className="mt-4 text-lg font-semibold">თანამშრომლის ინფორმაცია</h5>
        <div className="row">
          <div className="col-md-6">
            <InputWithError
              formik={formik}
              name="employee_name"
              label="სახელი და გვარი"
              disabled={currentTab === "1"}
            />
          </div>
          <div className="col-md-6">
            <InputWithError
              formik={formik}
              name="department"
              label="დეპარტამენტი"
              type="select"
              disabled={currentTab === "1"}
            >
              <option value="">აირჩიეთ დეპარტამენტი</option>
              {departments && departments.length > 0 ? (
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
              formik={formik}
              name="position"
              label="პოზიცია"
              disabled={currentTab === "1"}
            />
          </div>
        </div>

        <h5 className="mt-4 text-lg font-semibold">შემცვლელის ინფორმაცია</h5>
        <div className="row">
          <div className="col-md-6">
            <InputWithError
              formik={formik}
              name="substitute_name"
              label="შემცვლელის სახელი/გვარი"
            />
          </div>
          <div className="col-md-6">
            <InputWithError
              formik={formik}
              name="substitute_position"
              label="შემცვლელის პოზიცია"
            />
          </div>
        </div>

        <h5 className="mt-4 text-lg font-semibold">ფინანსები</h5>
        <div className="row">
          <div className="col-md-6">
            <InputWithError
              formik={formik}
              name="accommodation_cost"
              label="სასტუმროს ღირებულება"
              type="number"
            />
          </div>
          <div className="col-md-6">
            <InputWithError
              formik={formik}
              name="transportation_cost"
              label="მოგზაურობის ღირებულება"
              type="number"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <InputWithError
              formik={formik}
              name="food_cost"
              label="საკვების ღირებულება"
              type="number"
            />
          </div>
          <div className="col-md-6">
            <Label for="vehicle_expense">საკუთარი ტრანსპორტის ხარჯი</Label>
            <Input
              type="select"
              id="vehicle_expense"
              name="vehicle_expense"
              onChange={handleVehicleExpenseChange}
              onBlur={formik.handleBlur}
              value={formik.values.vehicle_expense}
              invalid={
                formik.touched.vehicle_expense &&
                Boolean(formik.errors.vehicle_expense)
              }
            >
              <option value="">აირჩიეთ</option>
              <option value={true}>დიახ</option>
              <option value={false}>არა</option>
            </Input>
            {formik.touched.vehicle_expense &&
              formik.errors.vehicle_expense && (
                <div className="text-danger mt-1">
                  {formik.errors.vehicle_expense}
                </div>
              )}
          </div>
        </div>

        {formik.values.vehicle_expense && (
          <>
            <h5 className="mt-4 text-lg font-semibold">ტრანსპორტის დეტალები</h5>
            <div className="row">
              <div className="col-md-6">
                <InputWithError
                  formik={formik}
                  name="vehicle_model"
                  label="ავტომობილის მოდელი"
                />
              </div>
              <div className="col-md-6">
                <InputWithError
                  formik={formik}
                  name="vehicle_plate"
                  label="ავტომობილის ნომერი"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <InputWithError
                  formik={formik}
                  name="fuel_type"
                  label="საწვავის ტიპი"
                  type="select"
                >
                  <option value="">აირჩიეთ საწვავის ტიპი</option>
                  <option value="benzin">ბენზინი</option>
                  <option value="diesel">დიზელი</option>
                  <option value="gas">გაზი</option>
                </InputWithError>
              </div>
              <div className="col-md-4">
                <InputWithError
                  formik={formik}
                  name="fuel_consumption_per_100"
                  label="წვა 100კმ-ზე"
                  type="number"
                  max={10}
                  step="0.1"
                />
              </div>
              <div className="col-md-4">
                <Label for="total_fuel">სულ საჭირო საწვავი (წასვლა/წამოსვლა)</Label>
                <Input
                  type="text"
                  id="total_fuel"
                  name="total_fuel"
                  value={formik.values.total_fuel?.toFixed(2) || "0.00"}
                  readOnly
                />
              </div>
            </div>
          </>
        )}

        <h5 className="mt-4 text-lg mb-2 font-semibold">საბოლოო ღირებულება</h5>
        <div className="row">
          <div className="col-md-6">
            <Input
              type="text"
              id="final_cost"
              name="final_cost"
              value={formik.values.final_cost}
              readOnly
            />
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <Button
            type="submit"
            color="primary"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            {formik.isSubmitting ? "იგზავნება..." : "გაგზავნა"}
          </Button>
        </div>
      </Form>
    )
  }

  if (userLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
      </div>
    )
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="p-4 sm:p-6">
          <Card>
            <CardBody className="p-6">
              {isAdmin && (
                <Nav tabs className="mb-6 border-b border-gray-200">
                  <NavItem>
                    <NavLink
                      className={classnames(
                        "border-0 pb-3 px-6 cursor-pointer transition-colors hover:text-blue-600",
                        {
                          "border-b-2 border-blue-600 text-blue-600":
                            activeTab === "1",
                        }
                      )}
                      onClick={() => toggleTab("1")}
                    >
                      ჩემი მივლინება
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames(
                        "border-0 pb-3 px-6 cursor-pointer transition-colors hover:text-blue-600",
                        {
                          "border-b-2 border-blue-600 text-blue-600":
                            activeTab === "2",
                        }
                      )}
                      onClick={() => toggleTab("2")}
                    >
                      თანამშრომლის მივლინება
                    </NavLink>
                  </NavItem>
                </Nav>
              )}

              {!isAdmin && activeTab !== "1" && toggleTab("1")}

              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  {renderForm(
                    formikMyTrip,
                    handleVehicleExpenseChangeMyTrip,
                    "1"
                  )}
                </TabPane>

                {isAdmin && (
                  <TabPane tabId="2">
                    {renderForm(
                      formikEmployeeTrip,
                      handleVehicleExpenseChangeEmployeeTrip,
                      "2"
                    )}
                  </TabPane>
                )}
              </TabContent>
            </CardBody>
          </Card>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default BusinessPage
