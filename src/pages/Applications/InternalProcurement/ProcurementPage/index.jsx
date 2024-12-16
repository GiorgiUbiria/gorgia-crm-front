import React, { useEffect, useState } from "react"
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
import { getPurchaseList, createPurchase } from "../../../../services/purchase"
import {
  getDepartments,
  getPurchaseDepartments,
} from "../../../../services/auth"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./index.css"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import { procurementSchema } from "./validationSchema"
import useFetchUser from "hooks/useFetchUser"

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

const ProcurementPage = () => {
  const navigate = useNavigate()
  const [departments, setDepartments] = useState([])
  const { user } = useFetchUser()

  console.log(user)

  const formik = useFormik({
    initialValues: {
      department_id: "",
      objective: "",
      deadline: "",
      short_period_reason: "",
      requested_procurement_object_exceed: "",
      stock_purpose: "",
      delivery_address: "",
      brand_model: "",
      alternative: "",
      competetive_price: "",
      who_pay_amount: "",
      name_surname_of_employee: "",
      reason: "",
      planned_next_month: "",
    },
    validationSchema: procurementSchema,
    onSubmit: async values => {
      const submitData = {
        ...values,
        department_purchase_id: Number(values.department_id),
        deadline: new Date(values.deadline).toISOString().split("T")[0],
      }

      try {
        await createPurchase(submitData)

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

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getPurchaseList()
        setPurchases(res.data.internal_purchases)
      } catch (err) {
        console.log(err)
      }
    }

    fetchRequests()

    const fetchDepartments = async () => {
      let departmentsArray = []
      try {
        const res = await getDepartments()
        departmentsArray = [...departmentsArray, ...res.data.departments]
      } catch (err) {
        console.error(err)
      } finally {
        setDepartments(departmentsArray)
      }
    }

    const fetchPurchaseDepartments = async () => {
      let departmentsArray = []
      try {
        const res = await getPurchaseDepartments()
        departmentsArray = [...departmentsArray, ...res.data.departments]
      } catch (err) {
        console.error(err)
      } finally {
        setDepartments(prevDepartments => [
          ...prevDepartments,
          ...departmentsArray,
        ])
      }
    }

    fetchDepartments()
    fetchPurchaseDepartments()
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="განცხადებები"
            breadcrumbItem="შიდა შესყიდვების დამატება"
          />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <Form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                    <Row>
                      <Col lg="6">
                        <InputWithError
                          formik={formik}
                          name="department_id"
                          label="დეპარტამენტი"
                          type="select"
                        >
                          <option value="">აირჩიეთ დეპარტამენტი</option>
                          {departments.map(dep => (
                            <option key={dep.id} value={dep.id}>
                              {dep.name}
                            </option>
                          ))}
                        </InputWithError>
                      </Col>
                      <Col lg="6">
                        <InputWithError
                          formik={formik}
                          name="objective"
                          label="ზოგადად აღწერეთ რა არის შესყიდვის ობიექტი?"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <InputWithError
                          formik={formik}
                          name="deadline"
                          label="რა ვადაში ითხოვთ შესყიდვის ობიექტის მიღებას?"
                          type="date"
                        />
                      </Col>
                      <Col lg="6">
                        <InputWithError
                          formik={formik}
                          name="short_period_reason"
                          label="თუ შესყიდვის ობიექტის მიღებისთვის ითხოვთ მცირე ვადას, განმარტეთ მიზეზი:"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <InputWithError
                          formik={formik}
                          name="requested_procurement_object_exceed"
                          label="ხომ არ აღემატება მოთხოვნილი შესყიდვის ობიექტი საჭიროებს?"
                        />
                      </Col>
                      <Col lg="6">
                        <InputWithError
                          formik={formik}
                          name="stock_purpose"
                          label="იქმნება თუ არა მარაგი და რა მიზნით?"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <InputWithError
                          formik={formik}
                          name="delivery_address"
                          label="მიწოდების ადგილი (მისამართი)"
                        />
                      </Col>
                      <Col lg="6">
                        <InputWithError
                          formik={formik}
                          name="brand_model"
                          label="სპეციფიურობის გათვალისწინებით მიუთითეთ მარკა, მოდელი, ნიშანდება"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <InputWithError
                          formik={formik}
                          name="alternative"
                          label="დასაშვებია თუ არა შესყიდის ობიექტის ალტერნატივა?"
                        />
                      </Col>
                      <Col lg="6">
                        <InputWithError
                          formik={formik}
                          name="competetive_price"
                          label="მიუთითეთ ინფორმაცია მიმწოდებლის შესახებ, კონკურენტული ფასი"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <InputWithError
                          formik={formik}
                          name="who_pay_amount"
                          label="ვინ ანაზღაურებს ამ თანხას?"
                        />
                      </Col>
                      <Col lg="6">
                        <InputWithError
                          formik={formik}
                          name="name_surname_of_employee"
                          label="თანამშრომლის სახელი გვარი, რომელიც მარკეტში/საწოობში ჩაიბარებს ნივთს"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <InputWithError
                          formik={formik}
                          name="reason"
                          label="რით არის განპირობებული შესყიდვის საჭიროება?"
                        />
                      </Col>
                      <Col lg="6">
                        <InputWithError
                          formik={formik}
                          name="planned_next_month"
                          label="იგეგმება თუ არა უახლოეს 1 თვეში ანალოგიური პროდუქციის შესყიდვა?"
                        />
                      </Col>
                    </Row>
                    <FormGroup>
                      <Label for="file">დამატებითი დოკუმენტი</Label>
                      <Input
                        type="file"
                        name="file"
                        id="file"
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          console.log('Selected file:', file); // Debug log
                          formik.setFieldValue('file', file);
                        }}
                      />
                      <small className="form-text text-muted">
                        დაშვებული ფორმატები: PDF, DOC, DOCX, XLS, XLSX. მაქსიმალური ზომა: 10MB
                      </small>
                    </FormGroup>
                    <div className="d-flex justify-content-end">
                      <Button type="submit" color="primary">
                        გაგზავნა
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default ProcurementPage
