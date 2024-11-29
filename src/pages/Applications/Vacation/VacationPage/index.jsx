import React, { useEffect, useState, useMemo } from "react"
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
} from "reactstrap"
import { useFormik } from "formik"
import { vacationSchema } from "./validationSchema"
import Breadcrumbs from "components/Common/Breadcrumb"
import { createVacation } from "../../../../services/vacation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import useFetchUser from "hooks/useFetchUser"
import useFetchUsers from "hooks/useFetchUsers"
import classnames from "classnames"

const InputWithError = ({
  formik,
  name,
  label,
  type = "text",
  children,
  ...props
}) => (
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
        {...props}
      />
    )}
    {formik.touched[name] && formik.errors[name] && (
      <div className="text-danger mt-1">{formik.errors[name]}</div>
    )}
  </div>
)

const VacationPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("1")
  const { user, loading: userLoading } = useFetchUser()
  const isAdmin = user?.roles?.[0]?.slug === "admin"
  const [duration, setDuration] = useState(0)

  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useFetchUsers({
    isAdmin: isAdmin && activeTab === "2",
  })

  const holidays = useMemo(
    () => [
      { name: "ორშაბათი", value: "monday" },
      { name: "სამშაბათი", value: "tuesday" },
      { name: "ოთხშაბათი", value: "wednesday" },
      { name: "ხუთშაბათი", value: "thursday" },
      { name: "პარასკევი", value: "friday" },
      { name: "შაბათი", value: "saturday" },
      { name: "კვირა", value: "sunday" },
    ],
    []
  )

  const calculateDuration = (startDate, endDate, restDays) => {
    if (!startDate || !endDate) return 0

    const start = new Date(startDate)
    const end = new Date(endDate)
    let totalDays = 0

    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay()
      const dayMap = {
        0: "sunday",
        1: "monday",
        2: "tuesday",
        3: "wednesday",
        4: "thursday",
        5: "friday",
        6: "saturday",
      }

      const currentDay = dayMap[dayOfWeek]
      if (restDays[currentDay] !== "yes") {
        totalDays++
      }
    }

    return Math.max(1, totalDays)
  }

  const initialValues = {
    name_and_surname: user ? `${user.name} ${user.sur_name}` : "",
    selected_user_id: "",
    type_of_vocations: "",
    start_date: "",
    end_date: "",
    reason: "",
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
    isAdminSubmittingForOthers: Boolean(isAdmin && activeTab === "2"),
  }

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
      formik.resetForm({
        values: {
          ...initialValues,
          name_and_surname: user ? `${user.name} ${user.sur_name}` : "",
          isAdminSubmittingForOthers: Boolean(isAdmin && tab === "2"),
        },
      })
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema: vacationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const submitData = {
          ...values,
          duration: calculateDuration(
            values.start_date,
            values.end_date,
            values
          ),
          start_date: values.start_date
            ? new Date(values.start_date).toISOString().split("T")[0]
            : "",
          end_date: values.end_date
            ? new Date(values.end_date).toISOString().split("T")[0]
            : "",
          selected_user_id:
            activeTab === "2" ? Number(values.selected_user_id) : user?.id,
        }

        console.log("Submitting data:", submitData)

        const res = await createVacation(submitData)
        if (res.status === 200) {
          toast.success("თქვენი მოთხოვნა წარმატებით გაიგზავნა!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })

          formik.resetForm()
          setTimeout(() => {
            navigate("/applications/vacation/my-requests")
          }, 1000)
        }
      } catch (err) {
        console.error("Submission error:", err)
        const errorMessage =
          err?.response?.data?.message ||
          err?.response?.data?.data?.message ||
          "დაფიქსირდა შეცდომა. გთხოვთ სცადოთ მოგვიანებით"

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
    const newDuration = calculateDuration(
      formik.values.start_date,
      formik.values.end_date,
      formik.values
    )
    setDuration(newDuration)
  }, [formik.values])

  useEffect(() => {
    if (user && !userLoading) {
      formik.setFieldValue("name_and_surname", `${user.name} ${user.sur_name}`)
    }
  }, [user, userLoading])

  useEffect(() => {
    if (usersError) {
      toast.error("მომხმარებლების სია ვერ ჩაიტვირთა")
    }
  }, [usersError])

  const handleCheckboxChange = fieldName => e => {
    formik.setFieldValue(fieldName, e.target.checked ? "yes" : "")
  }

  return (
    <React.Fragment>
      <div className="page-content">
        {userLoading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <Container fluid>
            <Breadcrumbs
              title="განცხადებები"
              breadcrumbItem="შვებულების მოთხოვნა"
            />
            <div className="row">
              <div className="col-12">
                <Card>
                  <CardBody>
                    {isAdmin && (
                      <Nav tabs className="mb-3">
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: activeTab === "1",
                            })}
                            onClick={() => toggleTab("1")}
                            style={{ cursor: "pointer" }}
                          >
                            ჩემი შვებულება
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: activeTab === "2",
                            })}
                            onClick={() => toggleTab("2")}
                            style={{ cursor: "pointer" }}
                          >
                            თანამშრომლის შვებულება
                          </NavLink>
                        </NavItem>
                      </Nav>
                    )}

                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="1">
                        <Form onSubmit={formik.handleSubmit}>
                          <div className="row">
                            <div className="col-md-6">
                              <InputWithError
                                formik={formik}
                                name="name_and_surname"
                                label="სახელი და გვარი"
                                disabled={true}
                              />
                            </div>
                            <div className="col-md-6">
                              <InputWithError
                                formik={formik}
                                name="type_of_vocations"
                                label="შვებულების ტიპი"
                                type="select"
                              >
                                <option value="">აირჩიე ტიპი</option>
                                <option value="paid">ანაზღაურებადი</option>
                                <option value="unpaid">
                                  ანაზღაურების გარეშე
                                </option>
                                <option value="maternity">
                                  უხელფასო შვებულება ორსულობის, მშობიარობის და
                                  ბავშვის მოვლის გამო
                                </option>
                                <option value="administrative">
                                  ადმინისტრაციული
                                </option>
                              </InputWithError>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <InputWithError
                                formik={formik}
                                name="start_date"
                                label="დაწყების თარიღი"
                                type="date"
                              />
                            </div>
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
                              <div className="mb-3">
                                <Label>დასვენების დღე/ები</Label>
                                <div className="d-flex flex-wrap">
                                  {holidays.map((holiday, index) => (
                                    <div
                                      className="form-check form-check-inline"
                                      key={index}
                                    >
                                      <Input
                                        type="checkbox"
                                        id={holiday.value}
                                        name={holiday.value}
                                        checked={
                                          formik.values[holiday.value] === "yes"
                                        }
                                        onChange={handleCheckboxChange(
                                          holiday.value
                                        )}
                                        className="form-check-input"
                                      />
                                      <Label
                                        className="form-check-label"
                                        for={holiday.value}
                                      >
                                        {holiday.name}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-12">
                              <InputWithError
                                formik={formik}
                                name="reason"
                                label="მიზეზი"
                                type="textarea"
                                rows="3"
                                placeholder="მიუთითეთ შვებულების მიზეზი"
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-12">
                              <div className="mb-3">
                                <Label>შვებულების დღეების რაოდენობა</Label>
                                <Input type="text" value={duration} readOnly />
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

                      {isAdmin && (
                        <TabPane tabId="2">
                          <Form onSubmit={formik.handleSubmit}>
                            <div className="row">
                              <div className="col-md-6">
                                <InputWithError
                                  formik={formik}
                                  name="selected_user_id"
                                  label="აირჩიეთ თანამშრომელი"
                                  type="select"
                                  disabled={usersLoading}
                                >
                                  <option value="">აირჩიეთ თანამშრომელი</option>
                                  {users?.map(user => (
                                    <option key={user.id} value={user.id}>
                                      {user.name} {user.sur_name}
                                    </option>
                                  ))}
                                </InputWithError>
                              </div>
                              <div className="col-md-6">
                                <InputWithError
                                  formik={formik}
                                  name="type_of_vocations"
                                  label="შვებულების ტიპი"
                                  type="select"
                                >
                                  <option value="">აირჩიე ტიპი</option>
                                  <option value="paid">ანაზღაურებადი</option>
                                  <option value="unpaid">
                                    ანაზღაურების გარეშე
                                  </option>
                                  <option value="maternity">
                                    უხელფასო შვებულება ორსულობის, მშობიარობის და
                                    ბავშვის მოვლის გამო
                                  </option>
                                  <option value="administrative">
                                    ადმინისტრაციული
                                  </option>
                                </InputWithError>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <InputWithError
                                  formik={formik}
                                  name="start_date"
                                  label="დაწყების თარიღი"
                                  type="date"
                                />
                              </div>
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
                                <div className="mb-3">
                                  <Label>დასვენების დღე/ები</Label>
                                  <div className="d-flex flex-wrap">
                                    {holidays.map((holiday, index) => (
                                      <div
                                        className="form-check form-check-inline"
                                        key={index}
                                      >
                                        <Input
                                          type="checkbox"
                                          id={holiday.value}
                                          name={holiday.value}
                                          checked={
                                            formik.values[holiday.value] ===
                                            "yes"
                                          }
                                          onChange={handleCheckboxChange(
                                            holiday.value
                                          )}
                                          className="form-check-input"
                                        />
                                        <Label
                                          className="form-check-label"
                                          for={holiday.value}
                                        >
                                          {holiday.name}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-12">
                                <InputWithError
                                  formik={formik}
                                  name="reason"
                                  label="მიზეზი"
                                  type="textarea"
                                  rows="3"
                                  placeholder="მიუთითეთ შვებულების მიზეზი"
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-12">
                                <div className="mb-3">
                                  <Label>შვებულების დღეების რაოდენობა</Label>
                                  <Input
                                    type="text"
                                    value={duration}
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
                                  !formik.isValid || formik.isSubmitting
                                }
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
        )}
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default VacationPage
