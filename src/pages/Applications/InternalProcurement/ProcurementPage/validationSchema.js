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
  "ლუსონი",
  "ანთა - სოფ. სარალი",
]

const categoryOptions = ["IT", "Marketing", "Security", "Network", "Farm"]

const getProductSchema = (hasFile) => Yup.object().shape({
  name: Yup.string()
    .required("პროდუქტის სახელი სავალდებულოა")
    .max(255, "მაქსიმუმ 255 სიმბოლო"),

  quantity: hasFile
    ? Yup.number()
      .transform((value, originalValue) => {
        if (originalValue === "") return null
        const num = Number(originalValue)
        return isNaN(num) ? null : num
      })
      .nullable()
      .max(999999999, "რაოდენობა ძალიან დიდია")
    : Yup.number()
      .transform((value, originalValue) => {
        if (originalValue === "") return null
        const num = Number(originalValue)
        return isNaN(num) ? null : num
      })
      .required("რაოდენობა სავალდებულოა")
      .max(999999999, "რაოდენობა ძალიან დიდია"),

  dimensions: hasFile
    ? Yup.string().nullable().max(255, "მაქსიმუმ 255 სიმბოლო")
    : Yup.string().required("ზომები სავალდებულოა").max(255, "მაქსიმუმ 255 სიმბოლო"),

  description: hasFile
    ? Yup.string().nullable().max(1000, "მაქსიმუმ 1000 სიმბოლო")
    : Yup.string().required("აღწერა სავალდებულოა").max(1000, "მაქსიმუმ 1000 სიმბოლო"),

  search_variant: hasFile
    ? Yup.string().nullable().max(1000, "მაქსიმუმ 1000 სიმბოლო")
    : Yup.string().required("მოძიებული ვარიანტი სავალდებულოა").max(1000, "მაქსიმუმ 1000 სიმბოლო"),

  similar_purchase_planned: hasFile
    ? Yup.string().nullable().max(1000, "მაქსიმუმ 1000 სიმბოლო")
    : Yup.string().required("ანალოგიური შესყიდვის ინფორმაცია სავალდებულოა").max(1000, "მაქსიმუმ 1000 სიმბოლო"),

  in_stock_explanation: hasFile
    ? Yup.string().nullable().max(1000, "მაქსიმუმ 1000 სიმბოლო")
    : Yup.string().required("ასორტიმენტის ინფორმაცია სავალდებულოა").max(1000, "მაქსიმუმ 1000 სიმბოლო"),

  payer: hasFile
    ? Yup.string().nullable().max(255, "მაქსიმუმ 255 სიმბოლო")
    : Yup.string().required("გადამხდელის მითითება სავალდებულოა").max(255, "მაქსიმუმ 255 სიმბოლო"),

  branches: Yup.array()
    .required("ფილიალების მითითება სავალდებულოა")
    .min(1, "მინიმუმ ერთი ფილიალი სავალდებულოა")
    .test(
      "branches-in-parent",
      "ფილიალები უნდა იყოს არჩეული ფილიალებიდან",
      function (value) {
        if (!value || value.length === 0) return true
        const parentBranches = this.from[1]?.value?.branches || []
        return value.every(branch => parentBranches.includes(branch))
      }
    ),
})

export const procurementSchema = Yup.object()
  .shape({
    procurement_type: Yup.string()
      .required("შესყიდვის ტიპის არჩევა სავალდებულოა")
      .oneOf(
        ["purchase", "price_inquiry", "service"],
        "არასწორი შესყიდვის ტიპი"
      ),

    branches: Yup.array()
      .of(Yup.string().oneOf(branchOptions, "არასწორი ფილიალი"))
      .min(1, "მინიმუმ ერთი ფილიალი სავალდებულოა")
      .required("ფილიალების არჩევა სავალდებულოა"),

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

    file: Yup.mixed()
      .nullable()
      .test(
        "fileSize",
        "ფაილის ზომა არ უნდა აღემატებოდეს 10MB-ს",
        value => !value || value.size <= 10 * 1024 * 1024
      )
      .test(
        "fileType",
        "დაშვებულია მხოლოდ PDF, Excel, Word, და სურათის ფაილები",
        value => {
          if (!value) return true
          const extension = value.name.split(".").pop().toLowerCase()
          return [
            "pdf",
            "xls",
            "xlsx",
            "doc",
            "docx",
            "jpg",
            "jpeg",
            "png",
          ].includes(extension)
        }
      ),

    products: Yup.array()
      .of(Yup.lazy(() => getProductSchema(Yup.ref("file"))))
      .nullable()
      .test(
        "products-or-file-required",
        "პროდუქტების სია ან ფაილი სავალდებულოა",
        function (value, context) {
          const hasFile = context.parent.file
          return hasFile || (Array.isArray(value) && value.length > 0)
        }
      )
      .test(
        "products-branch-consistency",
        "ყველა პროდუქტს უნდა ჰქონდეს მითითებული ფილიალი",
        function (value) {
          if (!value || value.length === 0) return true
          return value.every(product => product.branches.length > 0)
        }
      ),

    external_url: Yup.string()
      .nullable()
      .max(255, "მაქსიმუმ 255 სიმბოლო")
      .url("არასწორი URL ფორმატი"),
  })
  .from("category", "category")
  .from("file", "file")
