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

const categoryOptions = [
  "IT",
  "Marketing",
  "Security",
  "Network",
  "Office Manager",
  "Farm",
]

const productSchema = Yup.object().shape({
  name: Yup.string()
    .required("პროდუქტის სახელი სავალდებულოა")
    .max(255, "მაქსიმუმ 255 სიმბოლო"),

  quantity: Yup.number()
    .required("რაოდენობა სავალდებულოა")
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
    .required("მოძავალი შესყიდვების ინფორმაცია სავალდებულოა")
    .max(1000, "მაქსიმუმ 1000 სიმბოლო"),

  in_stock_explanation: Yup.string()
    .test('category-dependent', 'ასორტიმენტში არსებობის ინფორმაცია სავალდებულოა', function(value) {
      const { category } = this.parent;
      
      // If category is IT or Marketing, field is optional
      if (category === 'IT' || category === 'Marketing') {
        return true;
      }
      
      // For other categories, field is required
      return Boolean(value);
    })
    .max(1000, "მაქსიმუმ 1000 სიმბოლო"),

  payer: Yup.string()
    .required("გადამხდელის მითითება სავალდებულოა")
    .max(255, "მაქსიმუმ 255 სიმბოლო"),
})

export const procurementSchema = Yup.object().shape({
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
    .when("requested_arrival_date", {
      is: date => {
        const daysDiff = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24)
        return daysDiff < 14
      },
      then: () =>
        Yup.string().required("მცირე ვადის მიზეზის მითითება სავალდებულოა"),
      otherwise: () => Yup.string().nullable(),
    })
    .max(500, "მაქსიმუმ 500 სიმბოლო"),

  exceeds_needs_reason: Yup.string()
    .required("საჭიროების გითითება სავალდებულოა")
    .max(500, "მაქსიმუმ 500 სიმბოლო"),

  creates_stock: Yup.boolean().required(
    "მარაგის შექმნის მითითება სავალდებულოა"
  ),

  stock_purpose: Yup.string()
    .when("creates_stock", {
      is: true,
      then: () => Yup.string().required("მარაგის მიზნის მითითება სავალდებულოა"),
      otherwise: () => Yup.string().nullable(),
    })
    .max(500, "მაქსიმუმ 500 სიმბოლო"),

  delivery_address: Yup.string()
    .required("მიწოდების მისამართი სავალდებულოა")
    .max(255, "მაქსიმუმ 255 სიმბოლო"),

  products: Yup.array()
    .of(
      productSchema.shape({
        category: Yup.string(),
      })
    )
    .min(1, "მინიმუმ ერთი პროდუქტი სავალდებულოა")
    .required("პროდუქტების მითითება სავალდებულოა"),
})
