import * as Yup from "yup"
import { startOfDay } from "date-fns"

export const myVacationSchema = Yup.object().shape({
  vacation_type: Yup.string().required("აუცილებელია შვებულების ტიპის არჩევა"),
  substitute_name: Yup.string().required("აუცილებელია შემცვლელის სახელი"),
  substitute_position: Yup.string().required("აუცილებელია შემცვლელის პოზიცია"),
  start_date: Yup.date()
    .required("შევატყობინოთ დაწყების თარიღი")
    .nullable()
    .min(
      startOfDay(new Date()),
      "დაწყების თარიღი უნდა იყოს დღეს ან დღეის შემდეგ"
    ),
  end_date: Yup.date()
    .required("შევატყობინოთ დასრულების თარიღი")
    .nullable()
    .min(
      Yup.ref("start_date"),
      "დასრულების თარიღი უნდა იყოს დაწყების თარიღზე მეტი"
    ),
  is_monday: Yup.string()
    .nullable()
    .oneOf(["yes", null], "შეიძლება მხოლოდ 'yes' ან 'null'"),
  is_tuesday: Yup.string()
    .nullable()
    .oneOf(["yes", null], "შეიძლება მხოლოდ 'yes' ან 'null'"),
  is_wednesday: Yup.string()
    .nullable()
    .oneOf(["yes", null], "შეიძლება მხოლოდ 'yes' ან 'null'"),
  is_thursday: Yup.string()
    .nullable()
    .oneOf(["yes", null], "შეიძლება მხოლოდ 'yes' ან 'null'"),
  is_friday: Yup.string()
    .nullable()
    .oneOf(["yes", null], "შეიძლება მხოლოდ 'yes' ან 'null'"),
  is_saturday: Yup.string()
    .nullable()
    .oneOf(["yes", null], "შეიძლება მხოლოდ 'yes' ან 'null'"),
  is_sunday: Yup.string()
    .nullable()
    .oneOf(["yes", null], "შეიძლება მხოლოდ 'yes' ან 'null'"),
  duration_days: Yup.number()
    .required("აუცილებელია დღეების რაოდენობის მითითება")
    .integer("დღეების რაოდენობა უნდა იყოს მთელი რიცხვი")
    .min(1, "მინიმუმ 1 დღე")
    .max(90, "მაქსიმუმ 90 დღე"),
})

export const employeeVacationSchema = Yup.object().shape({
  vacation_type: Yup.string()
    .required("აუცილებელია შვებულების ტიპის არჩევა")
    .oneOf(
      ["paid_leave", "unpaid_leave", "administrative_leave", "maternity_leave"],
      "არასწორი შვებულების ტიპი"
    ),
  employee_name: Yup.string()
    .required("აუცილებელია თანამშრომლის სახელი")
    .matches(/^[ა-ჰ\s]+$/, "სახელი უნდა იყოს ქართულად")
    .min(2, "სახელი უნდა შეიცავდეს მინიმუმ 2 ასოს")
    .max(50, "სახელი არ უნდა აღემატებოდეს 50 ასოს"),
  department: Yup.string()
    .required("აუცილებელია დეპარტამენტის არჩევა")
    .min(2, "დეპარტამენტი უნდა შეიცავდეს მინიმუმ 2 ასოს")
    .max(100, "დეპარტამენტი არ უნდა აღემატებოდეს 100 ასოს"),
  substitute_name: Yup.string()
    .required("აუცილებელია შემცვლელის სახელი")
    .matches(/^[ა-ჰ\s]+$/, "სახელი უნდა იყოს ქართულად")
    .min(2, "სახელი უნდა შეიცავდეს მინიმუმ 2 ასოს")
    .max(50, "სახელი არ უნდა აღემატებოდეს 50 ასოს")
    .notOneOf(
      [Yup.ref("employee_name")],
      "დასვიათი არ უნდა იყოს ისევე როგორც თანამშრომელი"
    ),
  substitute_position: Yup.string()
    .required("აუცილებელია შემცვლელის პოზიცია")
    .min(2, "პოზიცია უნდა შეიცავდეს მინიმუმ 2 ასოს")
    .max(100, "პოზიცია არ უნდა აღემატებოდეს 100 ასოს"),
  start_date: Yup.date()
    .required("შევატყობინოთ დაწყების თარიღი")
    .nullable()
    .min(
      startOfDay(new Date()),
      "დაწყების თარიღი უნდა იყოს დღეს ან დღეის შემდეგ"
    ),
  end_date: Yup.date()
    .required("შევატყობინოთ დასრულების თარიღი")
    .nullable()
    .min(
      Yup.ref("start_date"),
      "დასრულების თარიღი უნდა იყოს დაწყების თარიღზე მეტი"
    )
    .max(
      new Date(new Date().setDate(new Date().getDate() + 90)),
      "დასრულების თარიღი არ უნდა აღემატებოდეს 90 დღეს"
    ),
  is_monday: Yup.string()
    .nullable()
    .oneOf(["yes", null], "შეიძლება მხოლოდ 'yes' ან 'null'"),
  is_tuesday: Yup.string()
    .nullable()
    .oneOf(["yes", null], "შეიძლება მხოლოდ 'yes' ან 'null'"),
  is_wednesday: Yup.string()
    .nullable()
    .oneOf(["yes", null], "შეიძლება მხოლოდ 'yes' ან 'null'"),
  is_thursday: Yup.string()
    .nullable()
    .oneOf(["yes", null], "შეიძლება მხოლოდ 'yes' ან 'null'"),
  is_friday: Yup.string()
    .nullable()
    .oneOf(["yes", null], "შეიძლება მხოლოდ 'yes' ან 'null'"),
  is_saturday: Yup.string()
    .nullable()
    .oneOf(["yes", null], "შეიძლება მხოლოდ 'yes' ან 'null'"),
  is_sunday: Yup.string()
    .nullable()
    .oneOf(["yes", null], "შეიძლება მხოლოდ 'yes' ან 'null'"),
  duration_days: Yup.number()
    .required("აუცილებელია დღეების რაოდენობის მითითება")
    .integer("დღეების რაოდენობა უნდა იყოს მთელ რიცხვი")
    .min(1, "მინიმუმ 1 დღე")
    .max(90, "მაქსიმუმ 90 დღე"),
})
