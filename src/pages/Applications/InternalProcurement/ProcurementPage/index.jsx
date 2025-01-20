import React, { useState } from "react"
import {
  Col,
  Form,
  Input,
  Label,
  Row,
  Button,
  FormGroup,
  Alert,
} from "reactstrap"
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

  return (
    <div className="mb-3">
      <Label for={name}>{label}</Label>
      {type === "select" ? (
        <Input
          type={type}
          id={name}
          name={name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[name]}
          invalid={touched && Boolean(error)}
          {...props}
        >
          {children}
        </Input>
      ) : type === "file" ? (
        <Input
          type={type}
          id={name}
          name={name}
          onBlur={formik.handleBlur}
          onChange={event => {
            formik.setFieldValue(name, event.currentTarget.files[0])
          }}
          invalid={touched && Boolean(error)}
          {...props}
        />
      ) : (
        <Input
          type={type}
          id={name}
          name={name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[name]}
          invalid={touched && Boolean(error)}
          {...props}
        />
      )}
      {touched && error && <div className="text-danger mt-1">{error}</div>}
    </div>
  )
}

const ProductForm = ({ formik, index, isExpanded, onToggle, onRemove }) => (
  <div className="border rounded p-2 mb-2">
    <div
      className="d-flex justify-content-between align-items-center"
      onClick={onToggle}
      style={{ cursor: "pointer" }}
    >
      <h6 className="mb-0">
        პროდუქტი {index + 1} - {formik.values.products[index].name || "უსახელო"}
      </h6>
      <Button type="button" color="link" className="p-0">
        {isExpanded ? "▼" : "▶"}
      </Button>
    </div>

    {isExpanded && (
      <div className="mt-2">
        <Row className="g-3">
          <Col md="3">
            <InputWithError
              formik={formik}
              name={`products.${index}.name`}
              label="პროდუქტის სახელი"
            />
          </Col>
          <Col md="3">
            <InputWithError
              formik={formik}
              name={`products.${index}.quantity`}
              label="რაოდენობა"
              type="number"
            />
          </Col>
          <Col md="3">
            <InputWithError
              formik={formik}
              name={`products.${index}.dimensions`}
              label="ზომები"
            />
          </Col>
          <Col md="3">
            <InputWithError
              formik={formik}
              name={`products.${index}.payer`}
              label="ვინ ანაზღაურებს თანხას?"
              type="text"
            ></InputWithError>
          </Col>
        </Row>
        <Row className="g-2">
          <Col md="12">
            <InputWithError
              formik={formik}
              name={`products.${index}.description`}
              label="აღწერა"
              type="textarea"
              rows="2"
            />
          </Col>
        </Row>
        <Row className="g-2">
          <Col md="12">
            <InputWithError
              formik={formik}
              name={`products.${index}.search_variant`}
              label="თქვენი მოძიებული ვარიანტი (მომწოდებელი, საკონტაქტო ინფორმაცია, ფასი)"
              type="textarea"
              rows="2"
            />
          </Col>
        </Row>
        <Row className="g-2">
          <Col md="12">
            <FormGroup className="mb-2">
              <InputWithError
                formik={formik}
                name={`products.${index}.similar_purchase_planned`}
                label="იგეგმება, თუ არა უახლოეს 1 თვეში ანალოგიური პროდუქციის შესყიდვა?"
                type="textarea"
                rows="2"
              />
            </FormGroup>
          </Col>
        </Row>
        <Row className="g-2">
          {formik.values.category &&
            formik.values.category !== "IT" &&
            formik.values.category !== "Marketing" && (
              <Col md="12">
                <InputWithError
                  formik={formik}
                  name={`products.${index}.in_stock_explanation`}
                  label="გვაქვს თუ არა ეს პროდუქცია ასორტიმენტში ჩვენ?"
                  type="textarea"
                  rows="2"
                />
              </Col>
            )}
        </Row>
        {formik.values.products.length > 1 && (
          <div className="mt-2">
            <Button
              type="button"
              color="danger"
              size="sm"
              onClick={() => onRemove(index)}
            >
              პროდუქტის წაშლა
            </Button>
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
    <>
      <div className="max-w-full shadow-sm mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div>
          <div className="p-4 sm:p-6">
            <Form onSubmit={formik.handleSubmit}>
              <div className="space-y-6">
                {generalError && (
                  <Alert color="danger" className="mb-4">
                    <pre className="mb-0 whitespace-pre-wrap">
                      {generalError}
                    </pre>
                  </Alert>
                )}

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <Label>იქმნება მარაგი?</Label>
                      <div className="flex gap-4">
                        <FormGroup check inline>
                          <Input
                            type="radio"
                            name="creates_stock"
                            onChange={() =>
                              formik.setFieldValue("creates_stock", true)
                            }
                            checked={formik.values.creates_stock === true}
                          />
                          <Label check>დიახ</Label>
                        </FormGroup>
                        <FormGroup check inline>
                          <Input
                            type="radio"
                            name="creates_stock"
                            onChange={() =>
                              formik.setFieldValue("creates_stock", false)
                            }
                            checked={formik.values.creates_stock === false}
                          />
                          <Label check>არა</Label>
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

                <div className="space-y-4">
                  {formik.values.category === "Marketing" && (
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
                  )}
                </div>

                {formik.values.category === "Network" && (
                  <div className="space-y-4">
                    <InputWithError
                      formik={formik}
                      name="file"
                      label="ფაილის ატვირთვა"
                      type="file"
                    />
                  </div>
                )}

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

                <div>
                  <Button type="button" color="primary" onClick={addProduct}>
                    პროდუქტის დამატება
                  </Button>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    color="secondary"
                    onClick={showCurrentValidationErrors}
                  >
                    შეამოწმე ვალიდაცია
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    disabled={isLoading}
                    onClick={() => {
                      if (Object.keys(formik.errors).length > 0) {
                        showCurrentValidationErrors()
                      }
                    }}
                  >
                    {isLoading ? "იგზავნება..." : "გაგზავნა"}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default ProcurementPage
