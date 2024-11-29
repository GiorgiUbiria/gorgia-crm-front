import * as Yup from "yup"

const today = new Date()
today.setHours(0, 0, 0, 0)

export const vacationSchema = Yup.object().shape({
  name_and_surname: Yup.string()
    .required("სახელი და გვარი სავალდებულოა")
    .matches(/^[a-zA-Zა-ჰ\s]+$/, "მხოლოდ ასოები და ჰარები"),

  selected_user_id: Yup.string().when('isAdminSubmittingForOthers', {
    is: true,
    then: () => Yup.string().required("გამომგებიანი თანამშრომლის არჩევა სავალდებულოა"),
    otherwise: () => Yup.string().nullable()
  }),

  type_of_vocations: Yup.string()
    .required("შვებულების ტიპი სავალდებულოა"),

  start_date: Yup.date()
    .required("დაწყების თარიღი სავალდებულოა")
    .min(today, "თარიღი არ შეიძლება იყოს წარსულში"),

  end_date: Yup.date()
    .required("დასრულების თარიღი სავალდებულოა")
    .min(Yup.ref('start_date'), "დასრულების თარიღი არ შეიძლება იყოს დაწყების თარიღზე ადრე"),

  reason: Yup.string()
    .required("მიზნის მითითება სავალდებულოა")
    .max(500, "მაქსიმუმ 500 სიმბოლო"),

  monday: Yup.string().nullable().oneOf(['yes', '', null]),
  tuesday: Yup.string().nullable().oneOf(['yes', '', null]),
  wednesday: Yup.string().nullable().oneOf(['yes', '', null]),
  thursday: Yup.string().nullable().oneOf(['yes', '', null]),
  friday: Yup.string().nullable().oneOf(['yes', '', null]),
  saturday: Yup.string().nullable().oneOf(['yes', '', null]),
  sunday: Yup.string().nullable().oneOf(['yes', '', null]),

  isAdminSubmittingForOthers: Yup.boolean().default(false)
})
