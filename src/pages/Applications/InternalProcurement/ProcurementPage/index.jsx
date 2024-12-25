import React, { useState } from "react"
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  Label,
  Row,
  Button,
  FormGroup,
} from "reactstrap"
import Breadcrumbs from "../../../../components/Common/Breadcrumb"
import { createPurchase } from "../../../../services/purchase"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./index.css"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import { procurementSchema } from "./validationSchema"

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
  const navigate = useNavigate()
  const [expandedProducts, setExpandedProducts] = useState([0]) // First product is expanded by default

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
        // Add category to each product before submission
        const productsWithCategory = values.products.map(product => ({
          ...product,
          category: values.category,
        }))

        const dataToSubmit = {
          ...values,
          products: productsWithCategory,
        }

        console.group("Form Submission")
        console.log("Submitting values:", dataToSubmit)

        await createPurchase(dataToSubmit)
        console.log("Submission successful")
        console.groupEnd()

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
      } catch (err) {
        console.group("Submission Error")
        console.error("Full error object:", err)
        console.error("Response data:", err?.response?.data)
        console.groupEnd()

        // Handle validation errors from the backend
        if (err?.response?.data?.errors) {
          const errors = err.response.data.errors
          console.group("Backend Validation Errors")
          console.table(errors)
          console.groupEnd()

          Object.entries(errors).forEach(([field, messages]) => {
            toast.error(`${field}: ${messages[0]}`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            })
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
      }
    },
    validate: values => {
      try {
        console.group("Frontend Validation")
        console.log("Validating values:", values)

        procurementSchema.validateSync(values, { abortEarly: false })
        console.log("Frontend validation passed")
        console.groupEnd()
      } catch (err) {
        console.group("Frontend Validation Errors")
        if (err.inner) {
          const errors = err.inner.reduce((acc, error) => {
            acc[error.path] = error.message
            return acc
          }, {})
          console.table(errors)

          err.inner.forEach(error => {
            toast.error(`${error.path}: ${error.message}`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            })
          })
        }
        console.groupEnd()
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
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="განცხადებები"
            breadcrumbItem="შიდა შესყიდვების დამატება"
          />
          <Card>
            <CardBody>
              <Form onSubmit={formik.handleSubmit}>
                <Row className="g-2">
                  <Col md="4">
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
                  </Col>
                  <Col md="4">
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
                  </Col>
                  <Col md="4">
                    <InputWithError
                      formik={formik}
                      name="delivery_address"
                      label="მიწოდების მისამართი"
                    />
                  </Col>
                </Row>

                <Row className="g-2">
                  <Col md="6">
                    <InputWithError
                      formik={formik}
                      name="purchase_purpose"
                      label="შესყიდვის მიზანი"
                      type="textarea"
                      rows="2"
                    />
                  </Col>
                  <Col md="6">
                    <InputWithError
                      formik={formik}
                      name="exceeds_needs_reason"
                      label="შესყიდვის საჭიროება"
                      type="textarea"
                      rows="2"
                    />
                  </Col>
                </Row>

                <Row className="g-2">
                  <Col md="6">
                    <FormGroup className="mb-2">
                      <Label>იქმნება მარაგი?</Label>
                      <div>
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
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <InputWithError
                      formik={formik}
                      name="requested_arrival_date"
                      label="მოთხოვნის მიღების თარიღი"
                      type="date"
                    />
                  </Col>
                </Row>

                <Row className="g-2">
                  <Col md="6">
                    {formik.values.creates_stock && (
                      <InputWithError
                        formik={formik}
                        name="stock_purpose"
                        label="მარაგის მიზანი"
                        type="textarea"
                        rows="2"
                      />
                    )}
                  </Col>
                  <Col md="6">
                    {formik.values.requested_arrival_date && (
                      <InputWithError
                        formik={formik}
                        name="short_date_notice_explanation"
                        label="მცირე ვადის მიზეზი (თუ 7 დღეზე ნაკლებია)"
                        type="textarea"
                        rows="2"
                      />
                    )}
                  </Col>
                </Row>

                <div className="mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0">პროდუქტები</h5>
                    <Button
                      type="button"
                      color="primary"
                      size="sm"
                      onClick={addProduct}
                    >
                      + დაამატე პროდუქტი
                    </Button>
                  </div>
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

                <div className="d-flex justify-content-end mt-3">
                  <Button type="submit" color="primary">
                    გაგზავნა
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default ProcurementPage
