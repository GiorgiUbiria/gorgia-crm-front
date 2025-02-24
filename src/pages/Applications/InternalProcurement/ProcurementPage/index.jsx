import React, { useState } from "react"
import { Input, Label, FormGroup } from "reactstrap"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import { procurementSchema } from "./validationSchema"
import { useCreatePurchase } from "../../../../queries/purchase"
import { toast } from "store/zustand/toastStore"

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

const CategoryOptions = {
  IT: "IT",
  Marketing: "მარკეტინგი",
  Security: "უსაფრთხოება",
  Network: "საცალო ქსელი",
  Farm: "სამეურნეო",
}

const BranchSelector = ({ formik }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const filteredBranches = branchOptions.filter(branch =>
    branch.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2 text-gray-700 dark:!text-gray-300">
        ფილიალები
      </label>
      <div className="rounded-lg border border-gray-200 dark:!border-gray-700 bg-white dark:!bg-gray-800 overflow-hidden">
        <div className="p-2 border-b border-gray-200 dark:!border-gray-700">
          <input
            type="text"
            placeholder="მოძებნე ფილიალი..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:!bg-gray-700 border border-gray-200 dark:!border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div className="max-h-[240px] overflow-y-auto p-2 grid grid-cols-2 gap-2">
          {filteredBranches.map(branch => (
            <label
              key={branch}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 dark:!hover:bg-gray-700 cursor-pointer group transition-colors"
            >
              <input
                type="checkbox"
                checked={formik.values.branches.includes(branch)}
                onChange={e => {
                  const checked = e.target.checked
                  const branches = checked
                    ? [...formik.values.branches, branch]
                    : formik.values.branches.filter(b => b !== branch)
                  formik.setFieldValue("branches", branches)
                }}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500/30 
                dark:!border-gray-600 dark:!bg-gray-700 transition-colors"
              />
              <span className="text-sm text-gray-700 dark:!text-gray-200 group-hover:text-gray-900 dark:!group-hover:text-white transition-colors">
                {branch}
              </span>
            </label>
          ))}
        </div>
      </div>
      {formik.touched.branches && formik.errors.branches && (
        <div className="mt-2 text-sm text-red-500 dark:!text-red-400 flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{formik.errors.branches}</span>
        </div>
      )}
    </div>
  )
}

const FormSection = ({ title, children, className = "" }) => (
  <div
    className={`bg-white dark:!bg-gray-800/95 rounded-xl p-6 border border-gray-200/50 dark:!border-gray-700/50 
    shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm ${className}`}
  >
    {title && (
      <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100 dark:!border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:!text-gray-100">
          {title}
        </h3>
      </div>
    )}
    {children}
  </div>
)

const InputWithError = ({
  formik,
  name,
  label,
  type = "text",
  children,
  multiple = false,
  ...props
}) => {
  const getNestedError = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj)
  }

  const error = getNestedError(formik.errors, name)
  const touched = getNestedError(formik.touched, name)

  const baseInputStyles = `
    w-full px-4 py-3 rounded-lg transition-all duration-200
    bg-white dark:!bg-gray-800/90 
    text-gray-900 dark:!text-gray-100
    placeholder:text-gray-400 dark:!placeholder:text-gray-500
    border focus:outline-none focus:ring-2 focus:ring-primary-500/20
    ${
      touched && error
        ? "border-red-300 dark:!border-red-500/50"
        : "border-gray-200 hover:border-primary-500/30 dark:!border-gray-700 dark:!hover:border-primary-500/30"
    }
  `

  return (
    <div className="relative">
      <label
        htmlFor={name}
        className="block text-sm font-medium mb-2 text-gray-700 dark:!text-gray-300"
      >
        {label}
      </label>
      <div className="relative group">
        {type === "select" ? (
          <div className="relative">
            <select
              id={name}
              name={name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[name]}
              multiple={multiple}
              className={`${baseInputStyles} appearance-none cursor-pointer pr-10 ${
                multiple ? "min-h-[120px]" : ""
              }`}
              {...props}
            >
              {children}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        ) : type === "file" ? (
          <div className="relative group">
            <input
              type={type}
              id={name}
              name={name}
              onBlur={formik.handleBlur}
              onChange={event => {
                formik.setFieldValue(name, event.currentTarget.files[0])
              }}
              className={`
                block w-full text-sm rounded-lg cursor-pointer
                file:mr-4 file:py-2.5 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-primary-50 file:text-primary-700
                hover:file:bg-primary-100
                dark:!file:bg-primary-900/20 dark:!file:text-primary-400
                dark:!file:hover:bg-primary-900/30
                dark:!text-gray-200
                transition-all duration-200
                ${touched && error ? "border-red-300" : "border-gray-200"}
              `}
              {...props}
            />
          </div>
        ) : type === "textarea" ? (
          <textarea
            id={name}
            name={name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values[name]}
            className={`${baseInputStyles} min-h-[80px] resize-y`}
            {...props}
          />
        ) : type === "radio" ? (
          <div className="flex items-center gap-4">
            <input
              type={type}
              id={name}
              name={name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[name]}
              className={`
                h-4 w-4 border-gray-300 text-primary-600 
                focus:ring-2 focus:ring-primary-500/50
                dark:!bg-gray-700 dark:!border-gray-600 
                dark:!focus:ring-primary-500/50
                ${touched && error ? "border-red-300" : ""}
                transition-all duration-200
              `}
              {...props}
            />
            <label
              htmlFor={name}
              className="text-sm text-gray-700 dark:!text-gray-300"
            >
              {props.label}
            </label>
          </div>
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values[name]}
            className={baseInputStyles}
            {...props}
          />
        )}
      </div>
      {touched && error && (
        <div className="mt-2 text-sm text-red-500 dark:!text-red-400 flex items-center gap-1.5 animate-fadeIn">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

const ProductBranchSelector = ({ formik, index }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const filteredBranches = formik.values.branches.filter(branch =>
    branch.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const ensureArray = value => {
    if (Array.isArray(value)) return value
    if (typeof value === "string") return value.split(",").map(b => b.trim())
    if (!value) return []
    return [value]
  }

  const handleBranchChange = (branch, checked) => {
    const currentBranches = ensureArray(formik.values.products[index].branches)
    const newBranches = checked
      ? [...currentBranches, branch]
      : currentBranches.filter(b => b !== branch)

    formik.setFieldValue(`products.${index}.branches`, newBranches)
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2 text-gray-700 dark:!text-gray-300">
        ფილიალები
      </label>
      <div className="rounded-lg border border-gray-200 dark:!border-gray-700 bg-white dark:!bg-gray-800 overflow-hidden">
        <div className="p-2 border-b border-gray-200 dark:!border-gray-700">
          <input
            type="text"
            placeholder="მოძებნე ფილიალი..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:!bg-gray-700 border border-gray-200 dark:!border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div className="max-h-[240px] overflow-y-auto p-2 grid grid-cols-2 gap-2">
          {filteredBranches.map(branch => (
            <label
              key={branch}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 dark:!hover:bg-gray-700 cursor-pointer group transition-colors"
            >
              <input
                type="checkbox"
                checked={
                  formik.values.products[index]?.branches?.includes(branch) ||
                  false
                }
                onChange={e => handleBranchChange(branch, e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500/30 
                dark:!border-gray-600 dark:!bg-gray-700 transition-colors"
              />
              <span className="text-sm text-gray-700 dark:!text-gray-200 group-hover:text-gray-900 dark:!group-hover:text-white transition-colors">
                {branch}
              </span>
            </label>
          ))}
        </div>
      </div>
      {formik.touched.products?.[index]?.branches &&
        formik.errors.products?.[index]?.branches && (
          <div className="mt-2 text-sm text-red-500 dark:!text-red-400 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{formik.errors.products[index].branches}</span>
          </div>
        )}
    </div>
  )
}

const ProductForm = ({
  formik,
  index,
  isExpanded,
  onToggle,
  onRemove,
  onFieldChange,
}) => (
  <div className="border dark:!border-gray-700/50 rounded-xl overflow-hidden bg-white dark:!bg-gray-800/95 transition-all duration-300 hover:shadow-lg dark:!hover:shadow-gray-800/50 group">
    <div
      className="flex justify-between items-center cursor-pointer p-4 bg-gray-50/80 dark:!bg-gray-700/30 group-hover:bg-gray-100 dark:!group-hover:bg-gray-700/50 transition-colors duration-200"
      onClick={onToggle}
    >
      <h6 className="text-lg font-medium text-gray-900 dark:!text-gray-200">
        პროდუქტი {index + 1} - {formik.values.products[index].name || "უსახელო"}
      </h6>
      <button
        type="button"
        className="p-2 text-gray-500 hover:text-gray-700 dark:!text-gray-400 dark:!hover:text-gray-200 rounded-lg transition-colors"
      >
        {isExpanded ? (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
      </button>
    </div>

    {isExpanded && (
      <div className="p-6 space-y-6 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InputWithError
            formik={formik}
            name={`products.${index}.name`}
            label="პროდუქტის სახელი"
            onChange={e => onFieldChange(index, "name", e.target.value)}
          />
          <InputWithError
            formik={formik}
            name={`products.${index}.quantity`}
            label="რაოდენობა"
            type="number"
            onChange={e => onFieldChange(index, "quantity", e.target.value)}
          />
          <InputWithError
            formik={formik}
            name={`products.${index}.dimensions`}
            label="ზომები"
            onChange={e => onFieldChange(index, "dimensions", e.target.value)}
          />
          <InputWithError
            formik={formik}
            name={`products.${index}.payer`}
            label="ვინ ანაზღაურებს თანხას?"
            onChange={e => onFieldChange(index, "payer", e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <ProductBranchSelector formik={formik} index={index} />

          <InputWithError
            formik={formik}
            name={`products.${index}.description`}
            label="აღწერა"
            type="textarea"
            onChange={e => onFieldChange(index, "description", e.target.value)}
          />
          <InputWithError
            formik={formik}
            name={`products.${index}.search_variant`}
            label="თქვენი მოძიებული ვარიანტი"
            type="textarea"
            onChange={e =>
              onFieldChange(index, "search_variant", e.target.value)
            }
          />
          <InputWithError
            formik={formik}
            name={`products.${index}.similar_purchase_planned`}
            label="იგეგმება ანალოგიური პროდუქციის შესყიდვა?"
            type="textarea"
            onChange={e =>
              onFieldChange(index, "similar_purchase_planned", e.target.value)
            }
          />
          <InputWithError
            formik={formik}
            name={`products.${index}.in_stock_explanation`}
            label="გვაქვს თუ არა ეს პროდუქცია ასორტიმენტში ჩვენ?"
            type="textarea"
            onChange={e =>
              onFieldChange(index, "in_stock_explanation", e.target.value)
            }
          />
        </div>

        {formik.values.products.length > 1 && (
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50/50 
                rounded-lg hover:bg-red-100/50 transition-colors group/delete
                dark:!text-red-400 dark:!bg-red-900/20 dark:!hover:bg-red-900/30"
            >
              <svg
                className="w-4 h-4 mr-2 transition-transform group-hover/delete:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              პროდუქტის წაშლა
            </button>
          </div>
        )}
      </div>
    )}
  </div>
)

const ProcurementPage = () => {
  document.title = "შიდა შესყიდვების დამატება | Gorgia LLC"
  const navigate = useNavigate()

  // Replace Zustand store with local state
  const [expandedProducts, setExpandedProducts] = useState([0])
  const [generalError, setGeneralError] = useState(null)
  const [file, setFile] = useState(null)

  const { mutate: createPurchase, isLoading } = useCreatePurchase()

  const handleFileChange = event => {
    const selectedFile = event.target.files[0]
    console.log("File selected:", {
      name: selectedFile?.name,
      type: selectedFile?.type,
      size: selectedFile?.size,
    })
    setFile(selectedFile)
    formik.setFieldValue("file", selectedFile)
  }

  // Initial form values (moved from store)
  const initialProductState = {
    name: "",
    quantity: "",
    dimensions: "",
    description: "",
    search_variant: "",
    similar_purchase_planned: "",
    in_stock_explanation: "",
    payer: "",
    branches: [],
  }

  const initialFormState = {
    procurement_type: "",
    branches: [],
    category: "",
    purchase_purpose: "",
    requested_arrival_date: "",
    short_date_notice_explanation: null,
    exceeds_needs_reason: "",
    creates_stock: false,
    stock_purpose: null,
    delivery_address: "",
    external_url: "",
    file: null,
    products: [{ ...initialProductState }],
  }

  const formik = useFormik({
    initialValues: initialFormState,
    validationSchema: procurementSchema,
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async values => {
      try {
        setGeneralError(null)

        const ensureArray = value => {
          if (Array.isArray(value)) return value
          if (typeof value === "string")
            return value.split(",").map(b => b.trim())
          if (!value) return []
          return [value]
        }

        const formattedValues = {
          ...values,
          creates_stock: Boolean(values.creates_stock),
          stock_purpose: values.creates_stock ? values.stock_purpose : null,
          products:
            values.products?.map(product => ({
              ...product,
              quantity: parseInt(product.quantity, 10),
              in_stock_explanation:
                values.category === "IT" || values.category === "Marketing"
                  ? null
                  : product.in_stock_explanation,
              branches: ensureArray(product.branches),
            })) || [],
          branches: ensureArray(values.branches),
          file: file,
        }

        console.log("Formatted values before API call:", formattedValues)

        createPurchase(formattedValues, {
          onSuccess: () => {
            console.log("Purchase creation successful")
            toast.success("თქვენი მოთხოვნა წარმატებით გაიგზავნა!", "შესრულდა", {
              duration: 2000,
              size: "small",
            })

            formik.resetForm()
            setTimeout(() => {
              navigate("/applications/purchases/my-requests")
            }, 1000)
          },
          onError: err => {
            console.error("Purchase creation failed:", {
              error: err,
              responseData: err?.response?.data,
              fileState: {
                fileInState: file
                  ? {
                      name: file.name,
                      type: file.type,
                      size: file.size,
                    }
                  : null,
                fileInFormik: formik.values.file
                  ? {
                      name: formik.values.file.name,
                      type: formik.values.file.type,
                      size: formik.values.file.size,
                    }
                  : null,
              },
            })
            if (err?.response?.data?.errors) {
              const errorMessages = Object.entries(err.response.data.errors)
                .map(([field, messages]) => {
                  if (field.startsWith("products.")) {
                    const [, index, subField] =
                      field.match(/products\.(\d+)\.(.+)/) || []
                    if (index !== undefined && subField) {
                      return `პროდუქტი ${parseInt(index) + 1} - ${subField}: ${
                        messages[0]
                      }`
                    }
                  }
                  return `${field}: ${messages[0]}`
                })
                .join("\n")

              setGeneralError(errorMessages)
            } else {
              const errorMessage =
                err?.response?.data?.message ||
                err?.response?.data?.data?.message ||
                "დაფიქსირდა შეცდომა. გთხოვთ სცადოთ მოგვიანებით"

              setGeneralError(errorMessage)
            }
          },
        })
      } catch (err) {
        console.error("Form submission error:", err)
        if (err.inner) {
          const errorMessages = err.inner
            .map(error => {
              if (error.path.startsWith("products.")) {
                const [, index, subField] =
                  error.path.match(/products\.(\d+)\.(.+)/) || []
                if (index !== undefined && subField) {
                  return `პროდუქტი ${parseInt(index) + 1} - ${subField}: ${
                    error.message
                  }`
                }
              }
              return `${error.path}: ${error.message}`
            })
            .join("\n")

          setGeneralError(errorMessages)
        }
      }
    },
  })

  // Replace store functions with local handlers
  const handleProductFieldChange = (index, field, value) => {
    formik.setFieldValue(`products.${index}.${field}`, value)
  }

  const toggleProduct = index => {
    setExpandedProducts(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  const addProduct = () => {
    const newProducts = [...formik.values.products, { ...initialProductState }]
    formik.setFieldValue("products", newProducts)
    setExpandedProducts(prev => [...prev, formik.values.products.length])
  }

  const removeProduct = index => {
    const newProducts = formik.values.products.filter((_, i) => i !== index)
    formik.setFieldValue("products", newProducts)
    setExpandedProducts(prev => prev.filter(i => i !== index))
  }

  const showCurrentValidationErrors = () => {
    const errors = formik.errors
    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.entries(errors)
        .map(([field, error]) => {
          if (field === "products" && typeof error === "object") {
            if (Array.isArray(error)) {
              return error
                .map((productError, index) => {
                  if (typeof productError === "object") {
                    return Object.entries(productError)
                      .map(
                        ([key, value]) =>
                          `პროდუქტი ${index + 1} - ${key}: ${value}`
                      )
                      .join("\n")
                  }
                  return `პროდუქტი ${index + 1}: ${productError}`
                })
                .join("\n")
            }
            return `products: ${error}`
          }
          if (typeof error === "string") {
            return `${field}: ${error}`
          }
          return null
        })
        .filter(Boolean)
        .join("\n")
      setGeneralError(errorMessages)
    } else {
      setGeneralError(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br dark:!from-gray-900 dark:!to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {generalError && (
              <div className="p-4 rounded-xl bg-red-50/80 dark:!bg-red-900/20 border-2 border-red-200/50 dark:!border-red-800/50 backdrop-blur-sm animate-fadeIn">
                <pre className="text-red-700 dark:!text-red-300 whitespace-pre-wrap text-sm font-medium">
                  {generalError}
                </pre>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormSection title="ძირითადი ინფორმაცია">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputWithError
                      formik={formik}
                      name="procurement_type"
                      label="შესყიდვის ტიპი"
                      type="select"
                    >
                      <option value="">აირჩიეთ შესყიდვის ტიპი</option>
                      <option value="purchase">შესყიდვა</option>
                      <option value="price_inquiry">ფასის მოკვლევა</option>
                      <option value="service">მომსახურება</option>
                    </InputWithError>

                    <InputWithError
                      formik={formik}
                      name="category"
                      label="მიმართულება"
                      type="select"
                    >
                      <option value="">აირჩიეთ მიმართულება</option>
                      {categoryOptions.map(category => (
                        <option key={category} value={category}>
                          {CategoryOptions[category]}
                        </option>
                      ))}
                    </InputWithError>
                  </div>

                  <BranchSelector formik={formik} />
                </div>
              </FormSection>

              <FormSection title="შესყიდვის ინფორმაცია">
                <div className="space-y-6">
                  <InputWithError
                    formik={formik}
                    name="purchase_purpose"
                    label="შესყიდვის მიზანი"
                    type="textarea"
                    rows="3"
                  />
                  <InputWithError
                    formik={formik}
                    name="exceeds_needs_reason"
                    label="შესყიდვის საჭიროება"
                    type="textarea"
                    rows="3"
                  />

                  <InputWithError
                    formik={formik}
                    name="delivery_address"
                    label="მიწოდების მისამართი"
                  />
                </div>
              </FormSection>
            </div>

            <FormSection title="მარაგის ინფორმაცია">
              <div className="space-y-2 sm:space-y-4">
                <div>
                  <Label className="text-sm sm:text-base text-gray-700 dark:!text-gray-200">
                    იქმნება მარაგი?
                  </Label>
                  <div className="flex gap-2 sm:gap-4 mt-1 sm:mt-2">
                    <FormGroup check inline>
                      <Input
                        type="radio"
                        name="creates_stock"
                        onChange={() =>
                          formik.setFieldValue("creates_stock", true)
                        }
                        checked={formik.values.creates_stock === true}
                        className="text-primary-600 focus:ring-primary-500/50 dark:!bg-gray-700 dark:!border-gray-600"
                      />
                      <Label
                        check
                        className="text-sm sm:text-base text-gray-700 dark:!text-gray-200"
                      >
                        დიახ
                      </Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Input
                        type="radio"
                        name="creates_stock"
                        onChange={() =>
                          formik.setFieldValue("creates_stock", false)
                        }
                        checked={formik.values.creates_stock === false}
                        className="text-primary-600 focus:ring-primary-500/50 dark:!bg-gray-700 dark:!border-gray-600"
                      />
                      <Label
                        check
                        className="text-sm sm:text-base text-gray-700 dark:!text-gray-200"
                      >
                        არა
                      </Label>
                    </FormGroup>
                  </div>
                </div>
                {formik.values.creates_stock && (
                  <InputWithError
                    formik={formik}
                    name="stock_purpose"
                    label="მარაგის მიზანი"
                    type="textarea"
                    rows="2"
                  />
                )}
              </div>
            </FormSection>

            <FormSection title="მოთხოვნის ინფორმაცია">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div className="space-y-2 sm:space-y-4">
                  <InputWithError
                    formik={formik}
                    name="requested_arrival_date"
                    label="მოთხოვნის მიღების თარიღი"
                    type="date"
                  />
                  {formik.values.requested_arrival_date &&
                    (new Date(formik.values.requested_arrival_date) -
                      new Date()) /
                      (1000 * 60 * 60 * 24) <
                      14 && (
                      <InputWithError
                        formik={formik}
                        name="short_date_notice_explanation"
                        label="მცირე ვადის მიზეზი"
                        type="textarea"
                        rows="2"
                      />
                    )}
                </div>
              </div>
            </FormSection>

            {formik.values.category === "Marketing" && (
              <FormSection title="დამატებითი ინფორმაცია">
                <div className="space-y-2 sm:space-y-4">
                  <InputWithError
                    formik={formik}
                    name="external_url"
                    label="გარე ბმული"
                    type="text"
                  />
                  <InputWithError
                    formik={formik}
                    name="file"
                    label="ფაილის ატვირთვა"
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>
              </FormSection>
            )}
            {formik.values.category !== "Marketing" &&
              formik.values.category !== "" && (
                <FormSection title="დამატებითი ინფორმაცია">
                  <div className="space-y-2 sm:space-y-4">
                    <InputWithError
                      formik={formik}
                      name="file"
                      label="ფაილის ატვირთვა"
                      type="file"
                      onChange={handleFileChange}
                    />
                  </div>
                </FormSection>
              )}

            <FormSection title="პროდუქტების სია">
              <div className="space-y-2 sm:space-y-4">
                {formik.values.products.map((product, index) => (
                  <ProductForm
                    key={index}
                    formik={formik}
                    index={index}
                    isExpanded={expandedProducts.includes(index)}
                    onToggle={() => toggleProduct(index)}
                    onRemove={() => removeProduct(index)}
                    onFieldChange={handleProductFieldChange}
                  />
                ))}
              </div>
            </FormSection>

            <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/80 dark:!bg-gray-900/80 backdrop-blur-md border-t border-gray-200/50 dark:!border-gray-700/50 z-50">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  type="button"
                  onClick={addProduct}
                  className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-primary-600 bg-primary-50/50 
                    hover:bg-primary-100/50 rounded-lg transition-colors
                    dark:!text-primary-400 dark:!bg-primary-900/20 dark:!hover:bg-primary-900/30"
                >
                  + პროდუქტის დამატება
                </button>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={showCurrentValidationErrors}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100/80 
                      hover:bg-gray-200/80 rounded-lg transition-colors
                      dark:!text-gray-300 dark:!bg-gray-800/80 dark:!hover:bg-gray-700/80"
                  >
                    შეამოწმე ვალიდაცია
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-primary-600 
                      hover:bg-primary-700 rounded-lg disabled:opacity-50 
                      disabled:cursor-not-allowed transition-all
                      focus:outline-none focus:ring-2 focus:ring-primary-500/30
                      transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="w-4 h-4 mr-2 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        იგზავნება...
                      </span>
                    ) : (
                      "გაგზავნა"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProcurementPage
