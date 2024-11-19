import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, CardBody, Card, Container, Form, Label, Input, FormFeedback } from "reactstrap";
import profileImg from "../../assets/images/profile-img.png";
import logoImg from "../../assets/images/logo.svg";
import lightlogo from "../../assets/images/logo-light.svg";
import { registerUser } from "services/auth";


const Register = () => {

  //meta title
  document.title = "Register | Gorgia LLC";

  // State to track API response
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();


  //form validation
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: '',
      username: '',
      password: '',
      mobile_number: '', 
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("გთხოვთ შეიყვანოთ Email")
        .email("არასწორი Email ფორმატი")
        .matches(/@gorgia\.ge$/, "Email უნდა მთავრდებოდეს @gorgia.ge-ით"),
      username: Yup.string().required("გთხოვთ შეიყვანოთ სახელი"),
      password: Yup.string().required("გთხოვთ შეიყვანოთ პაროლი"),
      mobile_number: Yup.string()
        .nullable()
        .matches(/^[0-9]+$/, "ტელეფონის ნომერი უნდა შეიცავდეს მხოლოდ ციფრებს")
        .min(9, "ტელეფონის ნომერი უნდა იყოს მინიმუმ 9 ციფრი"),
    }),
    onSubmit: async (values) => {
      try {
        setErrorMessage("");
        setSuccessMessage("");
        navigate('/')
        console.log("someeeeeeeeeee");
        
        const response = await registerUser(values);
          if (response.status === 201) {
          setSuccessMessage("User registered successfully!");
          console.log('Registration successful:', response.data);

        }
      } catch (error) {
        if (error.response && error.response.data) {
          setErrorMessage("Registration failed: " + error.response.data.message);
        } else {
          setErrorMessage("Registration failed. Please try again.");
        }
        console.error('Registration error:', error);
      }
    }
  });

  return (
    <React.Fragment>
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
                  <div>
                    <div className="auth-logo">
                      <Link to="/" className="auth-logo-light">
                        <div className="avatar-md profile-user-wid mb-4">
                          <span className="avatar-title rounded-circle bg-light">
                            <img
                              src={lightlogo}
                              alt=""
                              className="rounded-circle"
                              height="34"
                            />
                          </span>
                        </div>
                      </Link>
                      <Link to="/" className="auth-logo-dark">
                        <div className="avatar-md profile-user-wid mb-4">
                          <span className="avatar-title rounded-circle bg-light">
                            <img
                              src={logoImg}
                              alt=""
                              className="rounded-circle"
                              height="34"
                            />
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className="p-2">
                    <Form className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
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
                            validation.touched.email && validation.errors.email ? true : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">სახელი</Label>
                        <Input
                          name="username"
                          type="text"
                          placeholder="ჩაწერეთ თქვენი სახელი"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.username || ""}
                          invalid={
                            validation.touched.username && validation.errors.username ? true : false
                          }
                        />
                        {validation.touched.username && validation.errors.username ? (
                          <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                        ) : null}
                      </div>
                      
                      <div className="mb-3">
                        <Label className="form-label">მობილურის ნომერი</Label>
                        <Input
                          name="mobile_number"
                          type="text"
                          placeholder="ჩაწერეთ მობილურის ნომერი"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.mobile_number || ""}
                          invalid={
                            validation.touched.mobile_number && validation.errors.mobile_number ? true : false
                          }
                        />
                        {validation.touched.mobile_number && validation.errors.mobile_number ? (
                          <FormFeedback type="invalid">{validation.errors.mobile_number}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">პაროლი</Label>
                        <Input
                          name="password"
                          type="password"
                          placeholder="ჩაწერეთ პაროლი"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.password || ""}
                          invalid={
                            validation.touched.password && validation.errors.password ? true : false
                          }
                        />
                        {validation.touched.password && validation.errors.password ? (
                          <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                        ) : null}
                      </div>

                      {/* Display success or error message */}
                      {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}
                      {successMessage && <div className="text-success mb-3">{successMessage}</div>}

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
                  გაქვთ უკვე ანგარიში?{" "} <Link
                    to="/pages-login"
                    className="fw-medium text-primary"
                  >ავტორიზაცია
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
  );
};

export default Register;
