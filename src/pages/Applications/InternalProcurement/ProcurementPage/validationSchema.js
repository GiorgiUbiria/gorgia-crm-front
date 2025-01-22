import * as Yup from "yup"

const branchOptions = [
  "დიდუბე",
  "გლდანი",
  "საბურთალო",
  "ვაკე",
  "ლილო",
  "ბათუმი",
  "ქუთაისი",
  "ზუგდიდი",
  "თელავი",
  "მარნეული",
  "რუსთავი",
  "გორი",
  "საჩხერე",
  "წყალსადენი - საწყობი",
  "დსკ - საწყობი",
  "სარაჯიშვილი - საწყობი",
]

const categoryOptions = ["IT", "Marketing", "Security", "Network", "Farm"]

const productSchema = Yup.object().shape({
  name: Yup.string()
    .required("პროდუქტის სახელი სავალდებულოა")
    .max(255, "მაქსიმუმ 255 სიმბოლო"),

  quantity: Yup.number()
    .transform(value => (isNaN(value) ? undefined : value))
    .required("რაოდენობა სავალდებულოა")
    .integer("რაოდენობა უნდა იყოს მთელი რიცხვი")
    .min(1, "მინიმალური რაოდენობა არის 1"),

  dimensions: Yup.string()
    .required("ზომები სავალდებულოა")
    .max(255, "მაქსიმუმ 255 სიმბოლო"),

  description: Yup.string()
    .required("აღწერა სავალდებულოა")
    .max(1000, "მაქსიმუმ 1000 სიმბოლო"),

  search_variant: Yup.string()
    .required("მოძიებული ვარიანტი სავალდებულოა")
    .max(1000, "მაქსიმუმ 1000 სიმბოლო"),

  similar_purchase_planned: Yup.string()
    .required("მომავალი შესყიდვების ინფორმაცია სავალდებულოა")
    .max(1000, "მაქსიმუმ 1000 სიმბოლო"),

  in_stock_explanation: Yup.string()
    .required("ასორტიმენტში არსებობის ინფორმაცია სავალდებულოა")
    .max(1000, "მაქსიმუმ 1000 სიმბოლო"),

  payer: Yup.string()
    .required("გადამხდელის მითითება სავალდებულოა")
    .max(255, "მაქსიმუმ 255 სიმბოლო"),
})

export const procurementSchema = Yup.object()
  .shape({
    branch: Yup.string()
      .required("ფილიალის არჩევა სავალდებულოა")
      .oneOf(branchOptions, "არასწორი ფილიალი"),

    category: Yup.string()
      .required("კატეგორიის არჩევა სავალდებულოა")
      .oneOf(categoryOptions, "არასწორი კატეგორია"),

    purchase_purpose: Yup.string()
      .required("შესყიდვის მიზანი სავალდებულოა")
      .max(1000, "მაქსიმუმ 1000 სიმბოლო"),

    requested_arrival_date: Yup.date()
      .required("მოთხოვნილი მიღების თარიღი სავალდებულოა")
      .min(new Date(), "თარიღი არ შეიძლება იყოს წარსულში"),

    short_date_notice_explanation: Yup.string()
      .nullable()
      .when("requested_arrival_date", {
        is: date => {
          if (!date) return false
          const daysDiff = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24)
          return daysDiff < 14
        },
        then: schema =>
          schema
            .required("მცირე ვადის მიზეზის მითითება სავალდებულოა")
            .max(500, "მაქსიმუმ 500 სიმბოლო"),
        otherwise: schema => schema.nullable(),
      }),

    exceeds_needs_reason: Yup.string()
      .required("საჭიროების მითითება სავალდებულოა")
      .max(500, "მაქსიმუმ 500 სიმბოლო"),

    creates_stock: Yup.boolean().required(
      "მარაგის შექმნის მითითება სავალდებულოა"
    ),

    stock_purpose: Yup.string()
      .nullable()
      .when("creates_stock", {
        is: true,
        then: schema =>
          schema
            .required("მარაგის მიზნის მითითება სავალდებულოა")
            .max(500, "მაქსიმუმ 500 სიმბოლო"),
        otherwise: schema => schema.nullable(),
      }),

    delivery_address: Yup.string()
      .required("მიწოდების მისამართი სავალდებულოა")
      .max(255, "მაქსიმუმ 255 სიმბოლო"),

    products: Yup.array()
      .of(productSchema)
      .min(1, "მინიმუმ ერთი პროდუქტი სავალდებულოა")
      .required("პროდუქტების მითითება სავალდებულოა"),
  })
  .from("category", "category")
