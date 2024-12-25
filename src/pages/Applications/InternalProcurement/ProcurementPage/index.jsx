import React, { useState } from "react"
import { Col, Form, Input, Label, Row, Button, FormGroup } from "reactstrap"
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
}) => (
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
        invalid={formik.touched[name] && Boolean(formik.errors[name])}
        {...props}
      >
        {children}
      </Input>
    ) : (
      <Input
        type={type}
        id={name}
        name={name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[name]}
        invalid={formik.touched[name] && Boolean(formik.errors[name])}
        {...props}
      />
    )}
    {formik.touched[name] && formik.errors[name] && (
      <div className="text-danger mt-1">{formik.errors[name]}</div>
    )}
  </div>
)

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

  const { mutate: createPurchase, isLoading } = useCreatePurchase()

  const toggleProduct = index => {
    setExpandedProducts(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  const formik = useFormik({
    initialValues: {
      branch: "",
      category: "",
      purchase_purpose: "",
      requested_arrival_date: "",
      short_date_notice_explanation: "",
      exceeds_needs_reason: "",
      creates_stock: false,
      stock_purpose: "",
      delivery_address: "",
      products: [
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
      ],
    },
    validationSchema: procurementSchema,
    onSubmit: async values => {
      try {
        // Validate all fields first
        await procurementSchema.validate(values, { abortEarly: false })

        // Add category to each product before submission
        const productsWithCategory = values.products.map(product => ({
          ...product,
          category: values.category,
        }))

        const dataToSubmit = {
          ...values,
          products: productsWithCategory,
        }

        createPurchase(dataToSubmit, {
          onSuccess: () => {
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
            // Combine backend validation errors into a single message
            if (err?.response?.data?.errors) {
              const errorMessages = Object.entries(err.response.data.errors)
                .map(([field, messages]) => `${field}: ${messages[0]}`)
                .join("\n")

              toast.error(errorMessages, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              })
            } else {
              // Handle general error
              const errorMessage =
                err?.response?.data?.message ||
                err?.response?.data?.data?.message ||
                "დაფიქსირდა შეცდომა. გთხოვთ სცადოთ მოგვიანებით"

              toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              })
            }
          },
        })
      } catch (err) {
        // Combine Yup validation errors into a single message
        if (err.inner) {
          const errorMessages = err.inner
            .map(error => `${error.path}: ${error.message}`)
            .join("\n")

          toast.error(errorMessages, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })
        }
      }
    },
  })

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
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4 sm:mb-6">
          <span>განცხადებები</span>
          <span className="text-gray-400">/</span>
          <span className="font-medium text-gray-900">
            შიდა შესყიდვების დამატება
          </span>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-6">
            <Form onSubmit={formik.handleSubmit}>
              <div className="space-y-6">
                {/* First Row */}
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

                {/* Purpose and Needs */}
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

                {/* Stock Creation and Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <InputWithError
                    formik={formik}
                    name="requested_arrival_date"
                    label="მოთხოვნის მიღების თარიღი"
                    type="date"
                  />
                </div>

                {/* Products Section */}
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

                {/* Add Product Button */}
                <div>
                  <Button type="button" color="primary" onClick={addProduct}>
                    პროდუქტის დამატება
                  </Button>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button type="submit" color="primary" disabled={isLoading}>
                    {isLoading ? "იგზავნება..." : "გაგზავნა"}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default ProcurementPage
