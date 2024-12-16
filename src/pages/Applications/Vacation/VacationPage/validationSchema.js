import * as Yup from "yup"

const today = new Date()
today.setHours(0, 0, 0, 0)

export const vacationSchema = Yup.object().shape({
  vacation_type: Yup.string()
    .required("შვებულების ტიპი სავალდებულოა.")
    .oneOf(
      ["paid_leave", "unpaid_leave", "administrative_leave", "maternity_leave"],
      "გთხოვთ, აირჩიოთ სწორი შვებულების ტიპი."
    ),
  employee_name: Yup.string()
    .required("თანამშრომლის სახელი სავალდებულოა.")
    .matches(
      /^[ა-ჰ\s]+$/,
      "თანამშრომლის სახელი უნდა შეიცავდეს მხოლოდ ქართული ასოებს."
    )
    .min(2, "თანამშრომლის სახელი უნდა იყოს მინიმუმ 2 სიმბოლო.")
    .max(50, "თანამშრომლის სახელი არ უნდა აღემატებოდეს 50 სიმბოლოს."),
  department: Yup.string()
    .required("დეპარტამენტი სავალდებულოა.")
    .min(2, "დეპარტამენტის სახელი უნდა იყოს მინიმუმ 2 სიმბოლო.")
    .max(100, "დეპარტამენტის სახელი არ უნდა აღემატებოდეს 100 სიმბოლოს."),
  position: Yup.string()
    .required("პოზიცია სავალდებულოა.")
    .min(2, "პოზიციის სახელი უნდა იყოს მინიმუმ 2 სიმბოლო.")
    .max(100, "პოზიციის სახელი არ უნდა აღემატებოდეს 100 სიმბოლოს."),
  substitute_name: Yup.string()
    .required("შემცვლელი თანამშრომლის სახელი სავალდებულოა.")
    .matches(
      /^[ა-ჰ\s]+$/,
      "შემცვლელის სახელი უნდა შეიცავდეს მხოლოდ ქართული ასოებს."
    )
    .min(2, "შემცვლელის სახელი უნდა იყოს მინიმუმ 2 სიმბოლო.")
    .max(50, "შემცვლელის სახელი არ უნდა აღემატებოდეს 50 სიმბოლოს.")
    .notOneOf(
      [Yup.ref("employee_name")],
      "შემცვლელი ვერ იქნება იგივე, რაც თანამშრომელი."
    ),
  substitute_position: Yup.string()
    .required("შემცვლელის პოზიცია სავალდებულოა.")
    .min(2, "შემცვლელის პოზიციის სახელი უნდა იყოს მინიმუმ 2 სიმბოლო.")
    .max(100, "შემცვლელის პოზიციის სახელი არ უნდა აღემატებოდეს 100 სიმბოლოს."),
  start_date: Yup.date()
    .required("დაწყების თარიღი სავალდებულოა.")
    .min(today, "დაწყების თარიღი ვერ იქნება წარსულში.")
    .max(
      new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()),
      "დაწყების თარიღი ვერ იქნება დღიდან ერთ წელზე მეტი."
    ),
  end_date: Yup.date()
    .required("დასრულების თარიღი სავალდებულოა.")
    .min(
      Yup.ref("start_date"),
      "დასრულების თარიღი უნდა იყოს დაწყების თარიღის შემდეგ ან ტოლი."
    )
    .test("duration", "შვებულება ვერ იქნება 90 დღეზე მეტი.", function (value) {
      const start = this.parent.start_date
      if (start && value) {
        const diffTime = Math.abs(value - start)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays <= 90
      }
      return true
    }),
  is_monday: Yup.string()
    .nullable()
    .oneOf(["yes", null], "ორშაბათისთვის არასწორი მნიშვნელობა."),
  is_tuesday: Yup.string()
    .nullable()
    .oneOf(["yes", null], "სამშაბათისთვის არასწორი მნიშვნელობა."),
  is_wednesday: Yup.string()
    .nullable()
    .oneOf(["yes", null], "ოთხშაბათისთვის არასწორი მნიშვნელობა."),
  is_thursday: Yup.string()
    .nullable()
    .oneOf(["yes", null], "ხუთშაბათისთვის არასწორი მნიშვნელობა."),
  is_friday: Yup.string()
    .nullable()
    .oneOf(["yes", null], "პარასკევისთვის არასწორი მნიშვნელობა."),
  is_saturday: Yup.string()
    .nullable()
    .oneOf(["yes", null], "შაბათისთვის არასწორი მნიშვნელობა."),
  is_sunday: Yup.string()
    .nullable()
    .oneOf(["yes", null], "კვირისთვის არასწორი მნიშვნელობა."),
  duration_days: Yup.number()
    .required("ხანგრძლივობა დღეებში სავალდებულოა.")
    .positive("ხანგრძლივობა უნდა იყოს მინიმუმ 1 დღე.")
    .integer("ხანგრძლივობა უნდა იყოს მთელი რიცხვი.")
    .max(90, "ხანგრძლივობა ვერ იქნება 90 დღეზე მეტი."),
})
