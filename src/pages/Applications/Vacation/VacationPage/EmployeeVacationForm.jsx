import React, { useEffect, useCallback, useMemo } from "react"
import { Form, Button, Alert, Label, Input } from "reactstrap"
import { useFormik } from "formik"
import { employeeVacationSchema } from "./validationSchema"
import InputWithError from "./InputWithError"
import RestDaysCheckbox from "./RestDaysCheckbox"
import VacationBalance from "../../../../components/Vacation/VacationBalance"
import { useCreateVacationForEmployee } from "../../../../queries/vacation"
import { toast } from "store/zustand/toastStore"

const EmployeeVacationForm = ({ departments, navigate }) => {
  const { mutate: createVacationMutation, isLoading: isSubmitting } =
    useCreateVacationForEmployee()

  const formik = useFormik({
    initialValues: {
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
    },
    validationSchema: employeeVacationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (
          values.vacation_type === "administrative_leave" &&
          values.duration_days > 7
        ) {
          toast.error(
            "ადმინისტრაციული შვებულება არ შეიძლება აღემატებოდეს 7 დღის გრძელებას.",
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

        await createVacationMutation(submitData, {
          onSuccess: () => {
            toast.success("შვებულება წარმატებით გაიგზავნა!", "შესრულდა", {
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

  useEffect(() => {
    const newDuration = calculateDuration(
      formik.values.start_date,
      formik.values.end_date,
      formik.values
    )
    if (newDuration !== formik.values.duration_days) {
      formik.setFieldValue("duration_days", newDuration)

      if (formik.values.vacation_type === "administrative_leave") {
        if (newDuration > 7) {
          toast.warning(
            "ადმინისტრაციული შვებულება არ შეიძლება გაგრძელდეს 7 დღის გრძელებას.",
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

  return (
    <>
      {shouldShowVacationBalance && (
        <>
          <VacationBalance balance={formik.values.remaining_days} />
          {formik.values.pending_requests > 0 && (
            <Alert color="warning" className="mb-4">
              <i className="bx bx-time-five me-2"></i>
              თქვენ გაქვთ {formik.values.pending_requests}, ანაზღაურებადი
              შვებულების მოთხოვნა განხილვის პროცესში
            </Alert>
          )}
          {formik.values.approved_future_requests > 0 && (
            <Alert color="info" className="mb-4">
              <i className="bx bx-calendar-check me-2"></i>
              თქვენ გაქვთ {formik.values.approved_future_requests}, დამტკიცებული
              ანაზღაურებადი შვებულება
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
              label="თანამშრომლის სახელი და გვარი"
            />
          </div>
          <div className="col-md-6">
            <InputWithError
              formik={formik}
              name="department"
              label="თანამშრომლის დეპარტამენტი"
              type="select"
            >
              <option value="">აირჩიე დეპარტამენტი</option>
              {departments.length > 0 ? (
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
              label="თანამშრომლის პოზიცია"
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
            <Label for="vacation_type">შვებულების ტიპი</Label>
            <Input
              type="select"
              id="vacation_type"
              name="vacation_type"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.vacation_type}
              invalid={
                formik.touched.vacation_type &&
                Boolean(formik.errors.vacation_type)
              }
            >
              <option value="">აირჩიეთ ტიპი</option>
              <option value="paid_leave">ანაზღაურებადი</option>
              <option value="unpaid_leave">ანაზღაურების გარეშე</option>
              <option value="maternity_leave">
                უხელფასო შვებულება ორსულობის, მშობიარობისა და ბავშვის მოვლის
                გამო
              </option>
              <option value="administrative_leave">ადმინისტრაციული</option>
            </Input>
            {formik.touched.vacation_type && formik.errors.vacation_type && (
              <div className="text-danger mt-1">
                {formik.errors.vacation_type}
              </div>
            )}
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
              <Label className="mb-2 text-lg font-semibold">
                ხანგრძლივობა დღეებში
              </Label>
              <Input type="text" value={formik.values.duration_days} readOnly />
            </div>
          </div>
        </div>

        <div className="d-flex flex-column align-items-end">
          <div className="mb-3">
            {isSubmitting && (
              <div className="text-danger">ფორმა იგზავნება...</div>
            )}
            {formik.values.vacation_type === "administrative_leave" &&
              formik.values.duration_days > 7 && (
                <div className="text-danger">
                  ადმინისტრაციული შვებულება არ შეიძლება აღემატებოდეს 7 დღის.
                </div>
              )}
          </div>
          <Button
            type="submit"
            color="primary"
            disabled={
              isSubmitting ||
              !formik.dirty ||
              !formik.isValid ||
              (formik.values.vacation_type === "administrative_leave" &&
                formik.values.duration_days > 7)
            }
          >
            {isSubmitting ? "იგზავნება..." : "გაგზავნა"}
          </Button>
        </div>
      </Form>
    </>
  )
}

export default EmployeeVacationForm
