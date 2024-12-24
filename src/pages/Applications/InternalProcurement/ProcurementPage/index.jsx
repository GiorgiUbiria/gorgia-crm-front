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
import useFetchUser from "hooks/useFetchUser"

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
        <Row className="g-2">
          <Col md="4">
            <InputWithError
              formik={formik}
              name={`products.${index}.name`}
              label="პროდუქტის სახელი"
            />
          </Col>
          <Col md="4">
            <InputWithError
              formik={formik}
              name={`products.${index}.quantity`}
              label="რაოდენობა"
              type="number"
            />
          </Col>
          <Col md="4">
            <InputWithError
              formik={formik}
              name={`products.${index}.dimensions`}
              label="ზომები"
            />
          </Col>
        </Row>
        <Row className="g-2">
          <Col md="6">
            <InputWithError
              formik={formik}
              name={`products.${index}.description`}
              label="აღწერა"
              type="textarea"
              rows="2"
            />
          </Col>
          <Col md="6">
            <InputWithError
              formik={formik}
              name={`products.${index}.additional_information`}
              label="დამატებითი ინფორმაცია"
              type="textarea"
              rows="2"
            />
          </Col>
        </Row>
        <Row className="g-2">
          <Col md="6">
            <FormGroup className="mb-2">
              <Label>ალტერნატივის შესაძლებლობა</Label>
              <div>
                <FormGroup check inline>
                  <Input
                    type="radio"
                    name={`products.${index}.alternate_possibility`}
                    onChange={() =>
                      formik.setFieldValue(
                        `products.${index}.alternate_possibility`,
                        true
                      )
                    }
                    checked={
                      formik.values.products[index].alternate_possibility ===
                      true
                    }
                  />
                  <Label check>დიახ</Label>
                </FormGroup>
                <FormGroup check inline>
                  <Input
                    type="radio"
                    name={`products.${index}.alternate_possibility`}
                    onChange={() =>
                      formik.setFieldValue(
                        `products.${index}.alternate_possibility`,
                        false
                      )
                    }
                    checked={
                      formik.values.products[index].alternate_possibility ===
                      false
                    }
                  />
                  <Label check>არა</Label>
                </FormGroup>
              </div>
            </FormGroup>
          </Col>
          {formik.values.products[index].alternate_possibility && (
            <Col md="6">
              <InputWithError
                formik={formik}
                name={`products.${index}.alternate_possibility_reason`}
                label="ალტერნატივის მიზეზი"
                type="textarea"
                rows="2"
              />
            </Col>
          )}
        </Row>
        <Row className="g-2">
          <Col md="6">
            <FormGroup className="mb-2">
              <Label>მომწოდებელი არსებობს?</Label>
              <div>
                <FormGroup check inline>
                  <Input
                    type="radio"
                    name={`products.${index}.supplier_exists`}
                    onChange={() =>
                      formik.setFieldValue(
                        `products.${index}.supplier_exists`,
                        true
                      )
                    }
                    checked={
                      formik.values.products[index].supplier_exists === true
                    }
                  />
                  <Label check>დიახ</Label>
                </FormGroup>
                <FormGroup check inline>
                  <Input
                    type="radio"
                    name={`products.${index}.supplier_exists`}
                    onChange={() =>
                      formik.setFieldValue(
                        `products.${index}.supplier_exists`,
                        false
                      )
                    }
                    checked={
                      formik.values.products[index].supplier_exists === false
                    }
                  />
                  <Label check>არა</Label>
                </FormGroup>
              </div>
            </FormGroup>
          </Col>
        </Row>
        {formik.values.products[index].supplier_exists && (
          <Row className="g-2">
            <Col md="4">
              <InputWithError
                formik={formik}
                name={`products.${index}.supplier_name`}
                label="მომწოდებლის სახელი"
              />
            </Col>
            <Col md="4">
              <InputWithError
                formik={formik}
                name={`products.${index}.supplier_contact_information`}
                label="მომწოდებლის საკონტაქტო ინფორმაცია"
              />
            </Col>
            <Col md="4">
              <InputWithError
                formik={formik}
                name={`products.${index}.supplier_offer_details`}
                label="მომწოდებლის შეთავაზების დეტალები"
                type="textarea"
                rows="2"
              />
            </Col>
          </Row>
        )}
        <Row className="g-2">
          <Col md="6">
            <FormGroup className="mb-2">
              <Label>მსგავსი შესყიდვა იგეგმება?</Label>
              <div>
                <FormGroup check inline>
                  <Input
                    type="radio"
                    name={`products.${index}.similar_purchase_planned`}
                    onChange={() =>
                      formik.setFieldValue(
                        `products.${index}.similar_purchase_planned`,
                        true
                      )
                    }
                    checked={
                      formik.values.products[index].similar_purchase_planned ===
                      true
                    }
                  />
                  <Label check>დიახ</Label>
                </FormGroup>
                <FormGroup check inline>
                  <Input
                    type="radio"
                    name={`products.${index}.similar_purchase_planned`}
                    onChange={() =>
                      formik.setFieldValue(
                        `products.${index}.similar_purchase_planned`,
                        false
                      )
                    }
                    checked={
                      formik.values.products[index].similar_purchase_planned ===
                      false
                    }
                  />
                  <Label check>არა</Label>
                </FormGroup>
              </div>
            </FormGroup>
          </Col>
          <Col md="6">
            <InputWithError
              formik={formik}
              name={`products.${index}.payer`}
              label="გადამხდელი"
              type="select"
            >
              <option value="">აირჩიეთ გადამხდელი</option>
              <option value="company">კომპანია</option>
              <option value="department">დეპარტამენტი</option>
              <option value="other">სხვა</option>
            </InputWithError>
          </Col>
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
  const { user } = useFetchUser()
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
      responsible_for_purchase: user?.id || "",
      purchase_purpose: "",
      requested_arrival_date: "",
      short_date_notice_explanation: "",
      exceeds_needs: false,
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
          additional_information: "",
          alternate_possibility: false,
          alternate_possibility_reason: "",
          supplier_exists: false,
          supplier_name: "",
          supplier_contact_information: "",
          supplier_offer_details: "",
          similar_purchase_planned: false,
          payer: "",
        },
      ],
    },
    validationSchema: procurementSchema,
    onSubmit: async values => {
      console.log("Submitting form with values:", values)
      try {
        console.log("Calling createPurchase API...")
        const response = await createPurchase(values)
        console.log("API Response:", response)

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
        console.error("Submission error:", err)
        console.error("Error response:", err.response)
        const errorMessage =
          err?.response?.data?.message ||
          err?.response?.data?.data?.message ||
          "დაფიქსირდა შეცდომა. გთხოვთ სცადოთ მოგვიანებით"

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        })
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
        additional_information: "",
        alternate_possibility: false,
        alternate_possibility_reason: "",
        supplier_exists: false,
        supplier_name: "",
        supplier_contact_information: "",
        supplier_offer_details: "",
        similar_purchase_planned: false,
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
                      label="კატეგორია"
                      type="select"
                    >
                      <option value="">აირჩიეთ კატეგორია</option>
                      {categoryOptions.map(category => (
                        <option key={category} value={category}>
                          {category}
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
                      name="requested_arrival_date"
                      label="მოთხოვნილი მიღების თარიღი"
                      type="date"
                    />
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

                <Row className="g-2">
                  <Col md="6">
                    <FormGroup className="mb-2">
                      <Label>აღემატება საჭიროებას?</Label>
                      <div>
                        <FormGroup check inline>
                          <Input
                            type="radio"
                            name="exceeds_needs"
                            onChange={() =>
                              formik.setFieldValue("exceeds_needs", true)
                            }
                            checked={formik.values.exceeds_needs === true}
                          />
                          <Label check>დიახ</Label>
                        </FormGroup>
                        <FormGroup check inline>
                          <Input
                            type="radio"
                            name="exceeds_needs"
                            onChange={() =>
                              formik.setFieldValue("exceeds_needs", false)
                            }
                            checked={formik.values.exceeds_needs === false}
                          />
                          <Label check>არა</Label>
                        </FormGroup>
                      </div>
                    </FormGroup>
                    {formik.values.exceeds_needs && (
                      <InputWithError
                        formik={formik}
                        name="exceeds_needs_reason"
                        label="საჭიროების გადაჭარბების მიზეზი"
                        type="textarea"
                        rows="2"
                      />
                    )}
                  </Col>
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
