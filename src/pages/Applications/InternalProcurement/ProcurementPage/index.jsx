import React, { useState } from "react"
import { Input, Label, Button, FormGroup } from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import { procurementSchema } from "./validationSchema"
import { useCreatePurchase } from "../../../../queries/purchase"

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

const CategoryOptions = {
  IT: "IT",
  Marketing: "მარკეტინგი",
  Security: "უსაფრთხოება",
  Network: "საცალო ქსელი",
  "Office Manager": "ოფის-მენეჯერი",
  Farm: "სამეურნეო",
}

const FormSection = ({ title, children, className = "" }) => (
  <div
    className={`bg-gray-50 dark:!bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:!border-gray-700 ${className}`}
  >
    {title && (
      <h3 className="text-lg font-medium text-gray-900 dark:!text-gray-300 mb-4 pb-2 border-b border-gray-200 dark:!border-gray-700">
        {title}
      </h3>
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
  ...props
}) => {
  // Get nested field error
  const getNestedError = (obj, path) => {
    return path.split(".").reduce((acc, part) => {
      return acc && acc[part]
    }, obj)
  }

  const error = getNestedError(formik.errors, name)
  const touched = getNestedError(formik.touched, name)

  const baseInputStyles = `
    w-full px-4 py-2.5 rounded-lg transition-all duration-200
    bg-white dark:!bg-gray-800 
    text-gray-900 dark:!text-gray-100
    placeholder:text-gray-400 dark:!placeholder:text-gray-500
    border-2 focus:outline-none focus:ring-2 focus:ring-primary-500/30
    ${
      touched && error
        ? "border-red-300 dark:!border-red-500"
        : "border-gray-300 hover:border-primary-500/50 dark:!border-gray-600 dark:!hover:border-primary-500/50"
    }
  `

  return (
    <div className="relative mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium mb-2 text-gray-700 dark:!text-gray-200"
      >
        {label}
      </label>
      <div className="relative">
        {type === "select" ? (
          <select
            id={name}
            name={name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values[name]}
            className={`${baseInputStyles} cursor-pointer appearance-none bg-no-repeat bg-right pr-10`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundSize: "1.5em 1.5em",
            }}
            {...props}
          >
            {children}
          </select>
        ) : type === "file" ? (
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
              dark:!file:bg-gray-700 dark:!file:text-gray-200
              dark:!text-gray-200
              ${touched && error ? "border-red-300" : "border-gray-300"}
            `}
            {...props}
          />
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
          <input
            type={type}
            id={name}
            name={name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values[name]}
            className={`
              h-4 w-4 border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500/50
              dark:!bg-gray-700 dark:!border-gray-600 dark:!focus:ring-primary-500/50
              ${touched && error ? "border-red-300" : ""}
            `}
            {...props}
          />
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
        <div className="mt-2 text-sm text-red-500 dark:!text-red-400 flex items-center gap-1">
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

const ProductForm = ({ formik, index, isExpanded, onToggle, onRemove }) => (
  <div className="border-2 dark:!border-gray-700 rounded-xl overflow-hidden bg-white dark:!bg-gray-800 transition-all duration-200 hover:shadow-lg dark:!hover:shadow-gray-800/50">
    <div
      className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 dark:!bg-gray-700/50"
      onClick={onToggle}
    >
      <h6 className="text-lg font-medium text-gray-900 dark:!text-gray-300">
        პროდუქტი {index + 1} - {formik.values.products[index].name || "უსახელო"}
      </h6>
      <button
        type="button"
        className="p-2 hover:bg-gray-200 dark:!hover:bg-gray-600 rounded-full transition-colors"
      >
        {isExpanded ? "▼" : "▶"}
      </button>
    </div>

    {isExpanded && (
      <div className="p-4 space-y-6 border-t-2 border-gray-100 dark:!border-gray-700">
        <FormSection title="ძირითადი ინფორმაცია">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputWithError
              formik={formik}
              name={`products.${index}.name`}
              label="პროდუქტის სახელი"
            />
            <InputWithError
              formik={formik}
              name={`products.${index}.quantity`}
              label="რაოდენობა"
              type="number"
            />
            <InputWithError
              formik={formik}
              name={`products.${index}.dimensions`}
              label="ზომები"
            />
            <InputWithError
              formik={formik}
              name={`products.${index}.payer`}
              label="ვინ ანაზღაურებს თანხას?"
            />
          </div>
        </FormSection>

        <FormSection title="დამატებითი ინფორმაცია">
          <div className="space-y-4">
            <InputWithError
              formik={formik}
              name={`products.${index}.description`}
              label="აღწერა"
              type="textarea"
            />
            <InputWithError
              formik={formik}
              name={`products.${index}.search_variant`}
              label="თქვენი მოძიებული ვარიანტი"
              type="textarea"
            />
            <InputWithError
              formik={formik}
              name={`products.${index}.similar_purchase_planned`}
              label="იგეგმება ანალოგიური პროდუქციის შესყიდვა?"
              type="textarea"
            />
          </div>
        </FormSection>

        {formik.values.products.length > 1 && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 
                rounded-lg hover:bg-red-100 transition-colors
                dark:!text-red-400 dark:!bg-red-900/30 dark:!hover:bg-red-900/50"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
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
  const [expandedProducts, setExpandedProducts] = useState([0])
  const [generalError, setGeneralError] = useState(null)
  const [file, setFile] = useState(null)

  const { mutate: createPurchase, isLoading } = useCreatePurchase()

  const toggleProduct = index => {
    setExpandedProducts(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

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

  const formik = useFormik({
    initialValues: {
      branch: "",
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
      products: [
        {
          name: "",
          quantity: "",
          dimensions: "",
          description: "",
          search_variant: "",
          similar_purchase_planned: "",
          in_stock_explanation: null,
          payer: "",
        },
      ],
    },
    validationSchema: procurementSchema,
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async values => {
      try {
        setGeneralError(null)

        console.log("Form submission started with file:", {
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
        })

        const formattedValues = {
          ...values,
          creates_stock: Boolean(values.creates_stock),
          stock_purpose: values.creates_stock ? values.stock_purpose : null,
          products: values.products.map(product => ({
            ...product,
            quantity: parseInt(product.quantity, 10),
            in_stock_explanation:
              values.category === "IT" || values.category === "Marketing"
                ? null
                : product.in_stock_explanation,
          })),
          file: file,
        }

        console.log("Formatted values before API call:", {
          category: formattedValues.category,
          hasFile: !!formattedValues.file,
          fileDetails: formattedValues.file
            ? {
                name: formattedValues.file.name,
                type: formattedValues.file.type,
                size: formattedValues.file.size,
              }
            : null,
        })

        createPurchase(formattedValues, {
          onSuccess: () => {
            console.log("Purchase creation successful")
            toast.success("თქვენი მოთხოვნა წარმატებით გაიგზავნა!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
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
                  // Handle nested product errors
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
              // Handle nested product errors
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

  // Function to show all current validation errors with better formatting
  const showCurrentValidationErrors = () => {
    const errors = formik.errors
    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.entries(errors)
        .map(([field, error]) => {
          if (field === "products" && typeof error === "object") {
            // Handle product array errors
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

  const addProduct = () => {
    const newProductIndex = formik.values.products.length
    formik.setFieldValue("products", [
      ...formik.values.products,
      {
        name: "",
        quantity: "",
        dimensions: "",
        description: "",
        search_variant: "",
        similar_purchase_planned: "",
        in_stock_explanation: "",
        payer: "",
      },
    ])
    setExpandedProducts(prev => [...prev, newProductIndex])
  }

  const removeProduct = index => {
    const products = [...formik.values.products]
    products.splice(index, 1)
    formik.setFieldValue("products", products)
    setExpandedProducts(prev => prev.filter(i => i !== index))
  }

  return (
    <div className="min-h-screen dark:!bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:!bg-gray-800 shadow-lg rounded-xl">
          <div className="p-6">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {generalError && (
                <div className="p-4 rounded-lg bg-red-50 dark:!bg-red-900/30 border-2 border-red-200 dark:!border-red-800">
                  <pre className="text-red-700 dark:!text-red-200 whitespace-pre-wrap text-sm">
                    {generalError}
                  </pre>
                </div>
              )}

              <FormSection title="ძირითადი ინფორმაცია">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputWithError
                    formik={formik}
                    name="branch"
                    label="ფილიალი"
                    type="select"
                  >
                    <option value="">აირჩიეთ ფილიალი</option>
                    {branchOptions.map(branch => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
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

                  <InputWithError
                    formik={formik}
                    name="delivery_address"
                    label="მიწოდების მისამართი"
                  />
                </div>
              </FormSection>

              <FormSection title="შესყიდვის ინფორმაცია">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithError
                    formik={formik}
                    name="purchase_purpose"
                    label="შესყიდვის მიზანი"
                    type="textarea"
                    rows="2"
                  />
                  <InputWithError
                    formik={formik}
                    name="exceeds_needs_reason"
                    label="შესყიდვის საჭიროება"
                    type="textarea"
                    rows="2"
                  />
                </div>
              </FormSection>

              <FormSection title="მარაგის ინფორმაცია">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-700 dark:!text-gray-200">
                      იქმნება მარაგი?
                    </Label>
                    <div className="flex gap-4 mt-2">
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
                          className="text-gray-700 dark:!text-gray-200"
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
                          className="text-gray-700 dark:!text-gray-200"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
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

              {(formik.values.category === "Marketing" ||
                formik.values.category === "Network") && (
                <FormSection title="მართვის ინფორმაცია">
                  <div className="space-y-4">
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

              {formik.values.category === "Network" && (
                <FormSection title="ქსელის ინფორმაცია">
                  <div className="space-y-4">
                    <InputWithError
                      formik={formik}
                      name="file"
                      label="ფაილის ატვირთვა"
                      type="file"
                    />
                  </div>
                </FormSection>
              )}

              <FormSection title="პროდუქტების სია">
                <div className="space-y-4">
                  {formik.values.products.map((product, index) => (
                    <ProductForm
                      key={index}
                      formik={formik}
                      index={index}
                      isExpanded={expandedProducts.includes(index)}
                      onToggle={() => toggleProduct(index)}
                      onRemove={removeProduct}
                    />
                  ))}
                </div>
              </FormSection>

              <div>
                <Button type="button" color="primary" onClick={addProduct}>
                  პროდუქტის დამატება
                </Button>
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={showCurrentValidationErrors}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 
                    hover:bg-gray-200 rounded-lg transition-colors
                    dark:!bg-gray-700 dark:!text-gray-300 dark:!hover:bg-gray-600"
                >
                  შეამოწმე ვალიდაცია
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-primary-600 
                    hover:bg-primary-700 rounded-lg disabled:opacity-50 
                    disabled:cursor-not-allowed transition-colors
                    focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
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
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default ProcurementPage
