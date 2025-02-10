import * as Yup from "yup"
import cities from "../common/distances"

export const businessSchema = Yup.object().shape({
  trip_type: Yup.string()
    .required("მივლინების სახეობის მითითება სავალდებულოა.")
    .oneOf(
      ["regional", "international"],
      "გთხოვთ, აირჩიოთ სწორი მივლინების სახეობა."
    ),
  employee_name: Yup.string().required(
    "თანამშრომლის სახელის მითითება სავალდებულოა."
  ),
  department: Yup.string().required(
    "თანამშრომლის დეპარტამენტის მითითება სავალდებულოა."
  ),
  position: Yup.string().required(
    "თანამშრომლის პოზიციის მითითება სავალდებულოა."
  ),
  substitute_name: Yup.string()
    .required("შემცვლელი პირის სახელის მითითება სავალდებულოა.")
    .notOneOf(
      [Yup.ref("employee_name")],
      "შემცვლელი პირი ვერ იქნება იგივე, რაც თანამშრომელი."
    ),
  substitute_position: Yup.string().required(
    "შემცვლელი პირის პოზიციის მითითება სავალდებულოა."
  ),
  purpose: Yup.string().required("მივლინების მიზნის მითითება სავალდებულოა."),
  start_date: Yup.date().required("დაწყების თარიღის მითითება სავალდებულოა."),
  end_date: Yup.date()
    .required("დასრულების თარიღის მითითება სავალდებულოა.")
    .min(
      Yup.ref("start_date"),
      "დასრულების თარიღი უნდა იყოს დაწყების თარიღის შემდეგ."
    ),
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
    .integer("სამუშაო დღეების რაოდენობა უნდა იყოს მთელი რიცხვი.")
    .min(1, "სამუშაო დღეების რაოდენობა უნდა იყოს მინიმუმ 1 დღე."),
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
    then: () =>
      Yup.string().required("ავტომობილის მოდელის მითითება სავალდებულოა."),
    otherwise: () => Yup.string().nullable(),
  }),
  vehicle_plate: Yup.string().when("vehicle_expense", {
    is: true,
    then: () =>
      Yup.string().required("ავტომობილის ნომრის მითითება სავალდებულოა."),
    otherwise: () => Yup.string().nullable(),
  }),
  fuel_type: Yup.string().when("vehicle_expense", {
    is: true,
    then: () => Yup.string().required("საწვავის ტიპის მითითება სავალდებულოა."),
    otherwise: () => Yup.string().nullable(),
  }),
  fuel_consumption_per_100: Yup.number().when("vehicle_expense", {
    is: true,
    then: () =>
      Yup.number()
        .required("საწვავის ხარჯის მითითება სავალდებულოა.")
        .min(0, "საწვავის ხარჯი უნდა იყოს მინიმუმ 0 ლიტრი/100კმ.")
        .nullable(),
    otherwise: () => Yup.number().nullable(),
  }),
  final_cost: Yup.number()
    .required("საბოლოო ღირებულების მითითება სავალდებულოა.")
    .min(0, "საბოლოო ღირებულება უნდა იყოს მინიმუმ 0 ლარი."),
})
