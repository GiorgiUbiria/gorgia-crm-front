import * as Yup from "yup"

const today = new Date()
today.setHours(0, 0, 0, 0)

export const vacationSchema = Yup.object().shape({
  vacation_type: Yup.string()
    .required("შვებულების ტიპის მითითება სავალდებულოა.")
    .oneOf(
      ["paid_leave", "unpaid_leave", "administrative_leave", "maternity_leave"],
      "გთხოვთ, აირჩიოთ სწორი შვებულების ტიპი: ანაზღაურებადი, ანაზღაურების გარეშე, ადმინისტრაციული, უხელფასო შვებულება ორსულობის, მშობიარობის ან ბავშვის მოვლის გამო."
    ),
  employee_name: Yup.string()
    .required("თანამშრომლის სახელის მითითება სავალდებულოა.")
    .matches(
      /^[ა-ჰ\s]+$/,
      "თანამშრომლის სახელი უნდა შეიცავდეს მხოლოდ ქართული ასოებს."
    )
    .min(2, "თანამშრომლის სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს.")
    .max(50, "თანამშრომლის სახელის სიგრძე არ უნდა აღემატებოდეს 50 სიმბოლოს."),
  department: Yup.string()
    .required("თანამშრომლის დეპარტამენტის მითითება სავალდებულოა.")
    .min(
      2,
      "თანამშრომლის დეპარტამენტის სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს."
    )
    .max(
      100,
      "თანამშრომლის დეპარტამენტის სახელი არ უნდა აღემატებოდეს 100 სიმბოლოს."
    ),
  position: Yup.string()
    .required("პანამშრომლის პოზიციის მითითება სავალდებულოა.")
    .min(
      2,
      "თანამშრომლის პოზიციის დასახელება უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს."
    )
    .max(
      100,
      "თანამშრომლის პოზიციის დასახელება არ უნდა აღემატებოდეს 100 სიმბოლოს."
    ),
  substitute_name: Yup.string()
    .required("შემცვლელი პირის სახელის მითითება სავალდებულოა.")
    .matches(
      /^[ა-ჰ\s]+$/,
      "შემცვლელი პირის სახელი უნდა შეიცავდეს მხოლოდ ქართული ასოებს."
    )
    .min(2, "შემცვლელი პირის სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს.")
    .max(50, "შემცვლელი პირის სახელის სიგრძე არ უნდა აღემატებოდეს 50 სიმბოლოს.")
    .notOneOf(
      [Yup.ref("employee_name")],
      "შემცვლელი პირი ვერ იქნება იგივე, რაც თანამშრომელი."
    ),
  substitute_position: Yup.string()
    .required("შემცვლელი პირის პოზიციის მითითება სავალდებულოა.")
    .min(
      2,
      "შემცვლელი პირის პოზიციის სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს."
    )
    .max(
      100,
      "შემცვლელი პირის პოზიციის სახელი არ უნდა აღემატებოდეს 100 სიმბოლოს."
    ),
  start_date: Yup.date()
    .required("დაწყების თარიღის მითითება სავალდებულოა.")
    .min(today, "დაწყების თარიღი ვერ იქნება წარსულში.")
    .max(
      new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()),
      "დაწყების თარიღი ვერ იქნება დღეიდან ერთი წლის შემდეგ."
    ),
  end_date: Yup.date()
    .required("დასრულების თარიღი სავალდებულოა.")
    .min(
      Yup.ref("start_date"),
      "დასრულების თარიღი უნდა იყოს დაწყების თარიღის შემდეგ ან იმავე დღეს."
    )
    .test(
      "duration",
      "შვებულება ვერ გაგრძელდება 90 დღეზე მეტს.",
      function (value) {
        const start = this.parent.start_date
        if (start && value) {
          const diffTime = Math.abs(value - start)
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          return diffDays <= 90
        }
        return true
      }
    ),
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
    .required("ხანგრძლივობის მითითება დღეებში სავალდებულოა.")
    .positive("ხანგრძლივობის დრო უნდა იყოს მინიმუმ 1 დღე.")
    .integer("ხანგრძლივობის მნიშვნელობა უნდა იყოს მთელი რიცხვი.")
    .max(90, "ხანგრძლივობა ვერ იქნება 90 დღეზე მეტი."),
})
