import React, { useState, useEffect } from "react"
import * as Yup from "yup"
import { useFormik } from "formik"
import { Link, useNavigate } from "react-router-dom"
import {
  Row,
  Col,
  CardBody,
  Card,
  Container,
  Form,
  Label,
  Input,
  FormFeedback,
} from "reactstrap"
import profileImg from "../../assets/images/profile-img.png"
import { registerUser } from "services/auth"
import { getPublicDepartments } from "services/admin/department"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Reusable Input Field Componens
const InputField = ({ label, name, type = "text", placeholder, formik }) => (
  <div className="mb-3">
    <Label className="form-label">{label}</Label>
    <Input
      name={name}
      id={name}
      type={type}
      className="form-control"
      placeholder={placeholder}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values[name] || ""}
      invalid={formik.touched[name] && !!formik.errors[name]}
    />
    {formik.touched[name] && formik.errors[name] && (
      <FormFeedback type="invalid">{formik.errors[name]}</FormFeedback>
    )}
  </div>
)

const Register = () => {
  document.title = "Register | Gorgia LLC"

  const navigate = useNavigate()
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getPublicDepartments()
        setDepartments(response.data?.departments || response.data || [])
      } catch (error) {
        console.error("დეპარტამენტები ვერ მოიძებნა: ", error)
        setDepartments([])
      }
    }
    fetchDepartments()
  }, [])

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: "",
      name: "",
      sur_name: "",
      password: "",
      mobile_number: "",
      department_id: "",
      position: "",
      id_number: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("გთხოვთ შეიყვანოთ Email")
        .email("არასწორი Email ფორმატი")
        .matches(/@gorgia\.ge$/, "Email უნდა მთავრდებოდეს @gorgia.ge-ით"),
      name: Yup.string()
        .required("გთხოვთ შეიყვანოთ სახელი")
        .matches(
          /^[\u10A0-\u10FF]{2,30}$/,
          "სახელი უნდა შეიცავდეს მხოლოდ ქართულ ასოებს (2-30 სიმბოლო)"
        ),
      sur_name: Yup.string()
        .required("გთხოვთ შეიყვანოთ გვარი")
        .matches(
          /^[\u10A0-\u10FF]{2,30}$/,
          "გვარი უნდა შეიცავდეს მხოლოდ ქართულ ასოებს (2-30 სიმბოლო)"
        ),
      password: Yup.string().required("გთხოვთ შეიყვანოთ პაროლი"),
      department_id: Yup.number().required("გთხოვთ აირჩიოთ დეპარტამენტი"),
      position: Yup.string().required("გთხოვთ ჩაწეროთ პოზიცია"),
      id_number: Yup.number().required("გთხოვთ ჩაწეროთ პირადი ნომერი"),
      mobile_number: Yup.string()
        .required("გთხოვთ შეიყვანოთ მობილურის ნომერი")
        .matches(/^[0-9]+$/, "ტელეფონის ნომერი უნდა შეიცავდეს მხოლოდ ციფრებს")
        .min(9, "ტელეფონის ნომერი უნდა იყოს მინიმუმ 9 ციფრი"),
    }),
    onSubmit: async values => {
      try {
        const response = await registerUser({
          ...values,
          department_id: Number(values.department_id),
        })

        if (response.status === 200) {
          toast.success(
            "მომხმარებელი წარმატებით დარეგისტრირდა! გთხოვთ დაელოდოთ ადმინისტრატორის დადასტურებას."
          )
          setTimeout(() => {
            navigate("/auth/login")
          }, 2000)
        }
      } catch (error) {
        const errorMessage = error.response?.data
          ? typeof error.response.data === "object"
            ? Object.values(error.response.data).flat().join(", ")
            : error.response.data.message
          : "რეგისტრაცია ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან."

        toast.error("რეგისტრაცია ვერ მოხერხდა: " + errorMessage)
      }
    },
  })

  return (
    <React.Fragment>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={8} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary-subtle">
                  <Row>
                    <Col className="col-7">
                      <div className="text-primary p-4">
                        <h5 className="text-primary">რეგისტრაცია</h5>
                        <p>შექმენით თქვენი ანგარიში</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profileImg} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={e => {
                        e.preventDefault()
                        validation.handleSubmit()
                      }}
                    >
                      <InputField
                        label="ელ-ფოსტა"
                        name="email"
                        type="email"
                        placeholder="ჩაწერეთ ელ-ფოსტა აუცილებელია @gorgia.ge-ის ელ-ფოსტა"
                        formik={validation}
                      />

                      <InputField
                        label="სახელი"
                        name="name"
                        placeholder="ჩაწერეთ თქვენი სახელი"
                        formik={validation}
                      />

                      <InputField
                        label="გვარი"
                        name="sur_name"
                        placeholder="ჩაწერეთ თქვენი გვარი"
                        formik={validation}
                      />

                      <InputField
                        label="პირადი ნომერი"
                        name="id_number"
                        placeholder="ჩაწერეთ პირადი ნომერი"
                        formik={validation}
                      />

                      <div className="mb-3">
                        <Label className="form-label">დეპარტამენტი</Label>
                        <Input
                          type="select"
                          name="department_id"
                          value={validation.values.department_id || ""}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.department_id &&
                            !!validation.errors.department_id
                          }
                        >
                          <option value="">აირჩიე დეპარტამენტი</option>
                          {Array.isArray(departments) &&
                            departments.map(dept => (
                              <option key={dept.id} value={dept.id}>
                                {dept.name}
                              </option>
                            ))}
                        </Input>
                        {validation.touched.department_id &&
                          validation.errors.department_id && (
                            <FormFeedback type="invalid">
                              {validation.errors.department_id}
                            </FormFeedback>
                          )}
                      </div>

                      <InputField
                        label="პოზიცია"
                        name="position"
                        placeholder="ჩაწერეთ თქვენი პოზიცია"
                        formik={validation}
                      />

                      <InputField
                        label="ტელეფონის ნომერი"
                        name="mobile_number"
                        type="tel"
                        placeholder="ჩაწერეთ ტელეფონის ნომერი"
                        formik={validation}
                      />

                      <InputField
                        label="პაროლი"
                        name="password"
                        type="password"
                        placeholder="ჩაწერეთ პაროლი"
                        formik={validation}
                      />

                      <div className="mt-4 d-grid">
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                        >
                          რეგისტრაცია
                        </button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  გაქვთ უკვე ანგარიში?{" "}
                  <Link to="/pages-login" className="fw-medium text-primary">
                    ავტორიზაცია
                  </Link>{" "}
                </p>
                <p>
                  © {new Date().getFullYear()} Gorgia LLC. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger" /> by GORGIA
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Register
