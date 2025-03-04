import React, { useEffect, useCallback, useMemo } from "react"
import { Form, Button, Alert, Spinner } from "reactstrap"
import { useFormik } from "formik"
import { myVacationSchema } from "./validationSchema"
import {
  useCreateVacation,
  useVacationBalance,
} from "../../../../queries/vacation"
import { useNavigate } from "react-router-dom"
import VacationBalance from "../../../../components/Vacation/VacationBalance"
import InputWithError from "./InputWithError"
import RestDaysCheckbox from "./RestDaysCheckbox"
import { Tooltip } from "@mui/material"
import { toast } from "store/zustand/toastStore"

const MyVacationForm = ({ user }) => {
  const navigate = useNavigate()

  const { data: vacationBalanceResponse, isLoading: balanceLoading } =
    useVacationBalance()
  const vacationBalance = vacationBalanceResponse?.data

  const { mutate: createVacationMutation } = useCreateVacation()

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
    initialValues: {
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
    },
    validationSchema: myVacationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (
          values.vacation_type === "paid_leave" &&
          values.duration_days > vacationBalance?.remaining_days
        ) {
          toast.error(
            "მოთხოვნილი დღეების რაოდენობა აღემატება დარჩენილ ანაზღაურებად შვებულებას",
            "შეცდომა",
            {
              duration: 2000,
              size: "small",
            }
          )
          return
        }

        if (
          values.vacation_type === "administrative_leave" &&
          values.duration_days > 7
        ) {
          toast.error(
            "ადმინისტრაციული შვებულება არ შეიძლება აღემატებოდეს 7 დღეს",
            "შეცდომა",
            {
              duration: 2000,
              size: "small",
            }
          )
          return
        }

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

        createVacationMutation(submitData, {
          onSuccess: () => {
            toast.success("შვებულება წარმატებით გაიგზავნა", "წარმატება", {
              duration: 2000,
              size: "small",
            })

            setTimeout(() => {
              resetForm()
              navigate("/applications/vacation/my-requests")
            }, 1000)
          },
          onError: error => {
            console.error("Submission error:", error)
            toast.error(
              error?.response?.data?.message ||
                "შეცდომა მოხდა. გთხოვთ სცადეთ მოგვიანებით.",
              "შეცდომა",
              {
                duration: 2000,
                size: "small",
              }
            )
          },
        })
      } catch (err) {
        console.error("Error submitting vacation:", err)
        toast.error("შეცდომა მოხდა. გთხოვთ სცადეთ მოგვიანებით.", "შეცდომა", {
          duration: 2000,
          size: "small",
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
    if (newDuration !== formik.values.duration_days) {
      formik.setFieldValue("duration_days", newDuration)

      if (formik.values.vacation_type === "paid_leave") {
        if (newDuration > vacationBalance?.remaining_days) {
          toast.warning(
            `მოთხოვნილი დღეების რაოდენობა (${newDuration}) აღემატება დატჩენილ ანაზღაურებად შვებულებას (${vacationBalance?.remaining_days})`,
            "გაგრძელება",
            {
              duration: 2000,
              size: "small",
            }
          )
        }
      } else if (formik.values.vacation_type === "administrative_leave") {
        if (newDuration > 7) {
          toast.warning(
            "ადმინისტრაციული შვებულება არ შეიძლება აღემატებოდეს 7 დღეს",
            "გაგრძელება",
            {
              duration: 2000,
              size: "small",
            }
          )
        }
      }
    }
  }, [
    formik.values.start_date,
    formik.values.end_date,
    formik.values,
    calculateDuration,
    vacationBalance,
    formik,
  ])

  const handleCheckboxChange = useCallback(
    fieldName => e => {
      formik.setFieldValue(fieldName, e.target.checked ? "yes" : null)
    },
    [formik]
  )

  const shouldShowVacationBalance = useMemo(() => {
    return formik.values.vacation_type === "paid_leave"
  }, [formik.values.vacation_type])

  if (balanceLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
      </div>
    )
  }

  return (
    <>
      {shouldShowVacationBalance && vacationBalance && (
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

      <Form onSubmit={formik.handleSubmit}>
        <h5 className="mb-3 text-lg font-semibold">თანამშრომლის ინფორმაცია</h5>
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

        <h5 className="mb-3 text-lg font-semibold">შემცვლელის ინფორმაცია</h5>
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

        <h5 className="mb-3 text-lg font-semibold">შვებულების დეტალები</h5>
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
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="vacation_type">
                შვებულების ტიპი{" "}
                {formik.values.vacation_type === "paid_leave" && (
                  <Tooltip
                    title={`დარჩენილი ანაზღაურებადი შვებულება: ${vacationBalance?.remaining_days} დღე`}
                    arrow
                  >
                    <span className="badge bg-info">
                      {vacationBalance?.remaining_days} დღე
                    </span>
                  </Tooltip>
                )}
              </label>
              <select
                id="vacation_type"
                name="vacation_type"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.vacation_type}
                className={`form-control ${
                  formik.touched.vacation_type && formik.errors.vacation_type
                    ? "is-invalid"
                    : ""
                }`}
              >
                <option value="">აირჩიეთ ტიპი</option>
                <option value="paid_leave">ანაზღაურებადი</option>
                <option value="unpaid_leave">ანაზღაურების გარეშე</option>
                <option value="maternity_leave">
                  უხელფასო შვებულება ორსულობის, მშობიარობისა და ბავშვის მოვლის
                  გამო
                </option>
                <option value="administrative_leave">ადმინისტრაციული</option>
              </select>
              {formik.touched.vacation_type && formik.errors.vacation_type && (
                <div className="text-danger mt-1">
                  {formik.errors.vacation_type}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <RestDaysCheckbox
              holidays={[
                { name: "ორშაბათი", value: "is_monday" },
                { name: "სამშაბათი", value: "is_tuesday" },
                { name: "ოთხშაბათი", value: "is_wednesday" },
                { name: "ხუთშაბათი", value: "is_thursday" },
                { name: "პარასკევი", value: "is_friday" },
                { name: "შაბათი", value: "is_saturday" },
                { name: "კვირა", value: "is_sunday" },
              ]}
              formik={formik}
              handleCheckboxChange={handleCheckboxChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="mb-3">
              <label className="mb-2 text-lg font-semibold">
                ხანგრძლივობა დღეებში
              </label>
              <input
                type="text"
                value={formik.values.duration_days}
                readOnly
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <Button
            type="submit"
            color="primary"
            disabled={
              !formik.isValid ||
              formik.isSubmitting ||
              (formik.values.vacation_type === "paid_leave" &&
                formik.values.duration_days >
                  vacationBalance?.remaining_days) ||
              (formik.values.vacation_type === "administrative_leave" &&
                formik.values.duration_days > 7)
            }
          >
            {formik.isSubmitting ? "იგზავნება..." : "გაგზავნა"}
          </Button>
        </div>
      </Form>
    </>
  )
}

export default MyVacationForm
