import PropTypes from "prop-types"
import React from "react"
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
} from "reactstrap"
import { useSelector, useDispatch } from "react-redux"
import { createSelector } from "reselect"
import { Link, useNavigate } from "react-router-dom"
import withRouter from "components/Common/withRouter"
import * as Yup from "yup"
import { useFormik } from "formik"
import { loginUser } from "../../services/auth"
import { fetchUserSuccess } from "../../store/user/actions"
import { toast } from "react-toastify"
import { FaHeart } from "react-icons/fa"

import profile from "assets/images/profile-img.png"
import logo from "assets/images/logo.svg"

const Login = props => {
  document.title = "Login | Gorgia LLC"

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async values => {
      try {
        const res = await loginUser(values)

        if (res.data.status !== 200) {
          toast.error(res.data.message)
        } else {
          sessionStorage.setItem("token", res.data.token)
          sessionStorage.setItem("authUser", JSON.stringify(res.data.user))
          console.log(res)
          dispatch(fetchUserSuccess(res.data.user))
        }
        navigate("/dashboard")
      } catch (error) {
        console.error("Login failed", error)
        toast.error("Login failed. Please try again.")
      }
    },
  })

  const LoginProperties = createSelector(
    state => state.Login,
    login => ({
      error: login.error,
    })
  )

  const { error } = useSelector(LoginProperties)

  const handleSubmit = e => {
    e.preventDefault()
    validation.handleSubmit()
    return false
  }

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary-subtle">
                  <Row>
                    <Col className="col-7">
                      <div className="text-primary p-4">
                        <h5 className="text-primary">მოგესალმებით !</h5>
                        <p>გაიარეთ ავტორიზაცია Gorgia LLC.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/" className="logo-light-element">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logo}
                            alt=""
                            className="rounded-circle"
                            height="34"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <Form className="form-horizontal" onSubmit={handleSubmit}>
                      {error && <Alert color="danger">{error}</Alert>}
                      <div className="mb-3">
                        <Label className="form-label">ელ-ფოსტა</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="ჩაწერეთ ელ-ფოსტა"
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
                        <Label className="form-label">პაროლი</Label>
                        <Input
                          name="password"
                          value={validation.values.password || ""}
                          type="password"
                          placeholder="ჩაწერეთ პაროლი"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
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
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customControlInline"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="customControlInline"
                        >
                          დამახსოვრება
                        </label>
                      </div>
                      <div className="mt-3 d-grid">
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                        >
                          ავტორიზაცია
                        </button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  არ გაქვს ანგარიში?{" "}
                  <Link to="/auth/register" className="fw-medium text-primary">
                    რეგისტრაცია
                  </Link>
                </p>
                <p>
                  © {new Date().getFullYear()} Gorgia LLC. დამზადებულია დიდი{" "}
                  <FaHeart className="text-danger" />
                  -ით ვებ-დეველოპერების მიერ
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(Login)

Login.propTypes = {
  history: PropTypes.object,
}
