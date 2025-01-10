import * as Yup from "yup"
import cities from "../common/distances"

const today = new Date()
today.setHours(0, 0, 0, 0)

export const businessSchema = Yup.object().shape({
  trip_type: Yup.string()
    .required("მივლინების სახეობის მითითება სავალდებულოა.")
    .oneOf(
      ["regional", "international"],
      "გთხოვთ, აირჩიოთ სწორი მივლინების სახეობა."
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
    .required("თანამშრომლის პოზიციის მითითება სავალდებულოა.")
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
    .required("დასრულების თარიღის მითითება სავალდებულოა.")
    .min(
      Yup.ref("start_date"),
      "დასრულების თარიღი უნდა იყოს დაწყების თარიღის შემდეგ ან იმავე დღეს."
    ),
  purpose: Yup.string()
    .required("მივლინების მიზნის მითითება სავალდებულოა.")
    .min(2, "მიზანი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს.")
    .max(253, "მიზანი არ უნდა აღემატებოდეს 253 სიმბოლოს."),
  departure_location: Yup.string()
    .required("გასვლის ადგილის მითითება სავალდებულოა.")
    .oneOf(Object.keys(cities), "გთხოვთ აირჩიოთ სწორი გასვლის ადგილი."),
  arrival_location: Yup.string()
    .required("დანიშნულების ადგილის მითითება სავალდებულოა.")
    .test(
      "valid-destination",
      "არასწორი დანიშნულების ადგილი",
      function (value) {
        const departure = this.parent.departure_location
        if (!departure || !value) return true
        return cities[departure] && value in cities[departure]
      }
    ),
  duration_days: Yup.number()
    .required("სამუშაო დღეების რაოდენობის მითითება სავალდებულოა.")
    .min(1, "სამუშაო დღეების რაოდენობა უნდა იყოს მინიმუმ 1 დღე.")
    .max(365, "სამუშაო დღეების რაოდენობა არ უნდა აღემატებოდეს 365 დღეს."),
  accommodation_cost: Yup.number()
    .required("სასტუმროს ღირებულების მითითება სავალდებულოა.")
    .min(0, "სასტუმროს ღირებულება უნდა იყოს მინიმუმ 0 ლარი."),
  transportation_cost: Yup.number()
    .required("მოგზაურობის ღირებულების მითითება სავალდებულოა.")
    .min(0, "მოგზაურობის ღირებულება უნდა იყოს მინიმუმ 0 ლარი."),
  food_cost: Yup.number()
    .required("საკვების ღირებულების მითითება სავალდებულოა.")
    .min(0, "საკვების ღირებულება უნდა იყოს მინიმუმ 0 ლარი."),
  vehicle_expense: Yup.boolean().required(
    "საკუთარი ავტომობილით მგზავრობის სტატუსის მითითება სავალდებულოა."
  ),
  vehicle_model: Yup.string().when("vehicle_expense", {
    is: true,
    then: () => Yup.string().required("ავტომობილის მოდელის მითითება სავალდებულოა."),
    otherwise: () => Yup.string().nullable(),
  }),
  vehicle_plate: Yup.string().when("vehicle_expense", {
    is: true,
    then: () => Yup.string().required("ავტომობილის ნომრის მითითება სავალდებულოა."),
    otherwise: () => Yup.string().nullable(),
  }),
  fuel_type: Yup.string().when("vehicle_expense", {
    is: true,
    then: () => Yup.string().required("საწვავის ტიპის მითითება სავალდებულოა."),
    otherwise: () => Yup.string().nullable(),
  }),
  fuel_consumption_per_100: Yup.number().when("vehicle_expense", {
    is: true,
    then: () => Yup.number()
      .required("საწვავის ხარჯის მითითება სავალდებულოა.")
      .min(0, "საწვავის ხარჯი უნდა იყოს მინიმუმ 0 ლიტრი/100კმ."),
    otherwise: () => Yup.number().nullable(),
  }),
  total_fuel: Yup.number().nullable(),
  final_cost: Yup.number()
    .required("საბოლოო ღირებულების მითითება სავალდებულოა.")
    .min(0, "საბოლოო ღირებულება უნდა იყოს მინიმუმ 0 ლარი."),
})
