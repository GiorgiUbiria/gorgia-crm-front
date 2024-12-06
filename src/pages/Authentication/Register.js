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
      id_number: ""
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("გთხოვთ შეიყვანოთ Email")
        .email("არასწორი Email ფორმატი")
        .matches(/@gorgia\.ge$/, "Email უნდა მთავრდებოდეს @gorgia.ge-ით"),
      name: Yup.string().required("გთხოვთ შეიყვანოთ სახელი"),
      sur_name: Yup.string().required("გთხოვთ შეიყვანოთ გვარი"),
      password: Yup.string().required("გთხოვთ შეიყვანოთ პაროლი"),
      department_id: Yup.number().required("გთხოვთ აირჩიოთ დეპარტამენტი"),
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
                        return false
                      }}
                    >
                      <div className="mb-3">
                        <Label className="form-label">ელ-ფოსტა</Label>
                        <Input
                          id="email"
                          name="email"
                          className="form-control"
                          placeholder="ჩაწერეთ ელ-ფოსტა აუცილებელია @gorgia.ge-ის ელ-ფოსტა"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email
                              ? true
                              : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">სახელი</Label>
                        <Input
                          name="name"
                          id="name"
                          className="form-control"
                          type="text"
                          placeholder="ჩაწერეთ თქვენი სახელი"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.name || ""}
                          invalid={
                            validation.touched.name && validation.errors.name
                          }
                        />
                        {validation.touched.name && validation.errors.name ? (
                          <FormFeedback type="invalid">
                            {validation.errors.name}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">გვარი</Label>
                        <Input
                          name="sur_name"
                          id="sur_name"
                          className="form-control"
                          type="text"
                          placeholder="ჩაწერეთ მქვენი გვარი"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.sur_name || ""}
                          invalid={
                            validation.touched.sur_name &&
                            validation.errors.sur_name
                          }
                        />
                        {validation.touched.sur_name &&
                        validation.errors.sur_name ? (
                          <FormFeedback type="invalid">
                            {validation.errors.sur_name}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">პირადი ნომერი</Label>
                        <Input
                          name="id_number"
                          id="id_number"
                          className="form-control"
                          type="text"
                          placeholder="ჩაწერეთ პირადი ნომერი"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.id_number || ""}
                          invalid={
                            validation.touched.id_number &&
                            validation.errors.id_number
                          }
                        />
                        {validation.touched.id_number &&
                        validation.errors.id_number ? (
                          <FormFeedback type="invalid">
                            {validation.errors.id_number}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">პეპარტამენტი</Label>
                        <Input
                          type="select"
                          name="department_id"
                          value={validation.values.department_id || ""}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.department_id &&
                            validation.errors.department_id
                              ? true
                              : false
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
                        validation.errors.department_id ? (
                          <FormFeedback type="invalid">
                            {validation.errors.department_id}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">მობილურის ნომერი</Label>
                        <Input
                          name="mobile_number"
                          id="mobile_number"
                          className="form-control"
                          type="text"
                          placeholder="ჩაწერეთ მობილურის ნომერი"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.mobile_number || ""}
                          invalid={
                            validation.touched.mobile_number &&
                            validation.errors.mobile_number
                              ? true
                              : false
                          }
                        />
                        {validation.touched.mobile_number &&
                        validation.errors.mobile_number ? (
                          <FormFeedback type="invalid">
                            {validation.errors.mobile_number}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">პაროლი</Label>
                        <Input
                          name="password"
                          type="password"
                          id="password"
                          className="form-control"
                          placeholder="ჩაწერეთ პაროლი"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.password || ""}
                          invalid={
                            validation.touched.password &&
                            validation.errors.password
                              ? true
                              : false
                          }
                        />
                        {validation.touched.password &&
                        validation.errors.password ? (
                          <FormFeedback type="invalid">
                            {validation.errors.password}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mt-4 d-grid">
                        <button
                          className="btn btn-primary btn-block "
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
