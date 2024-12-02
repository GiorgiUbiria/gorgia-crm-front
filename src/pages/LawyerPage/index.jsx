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
  TabContent,
  TabPane,
} from "reactstrap"
import classnames from "classnames"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Breadcrumbs from "../../components/Common/Breadcrumb"
import { createAgreement } from "services/agreement"
import "../../assets/scss/custom/pages/_lawyer.scss"

const LawyerPage = () => {
  document.title = "ხელშეკრულების მოთხოვნა | Gorgia LLC"

  const [activeTab, setActiveTab] = useState(1)
  const [passedSteps, setPassedSteps] = useState([1])
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    contragent_name: "",
    contragent_id: "",
    contragent_address: "",
    contragent_phone_number: "",
    contragent_email: "",
    contragent_director: "",
    contragent_power_of_attorney: "",
    contragent_power_of_attorney_phone_number: "",
    conscription_term: "",
    product_delivery_address: "",
    product_cost: "",
    product_payment_term: "",
    bank_account: "",
    buyer_name: "",
    buyer_surname: "",
    buyer_signature: "",
    director_name: "",
    director_surname: "",
    director_signature: "",
  })

  const handleInputChange = e => {
    const { id, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }))
    validateField(id, value)
  }

  const validateField = (field, value) => {
    let errorMsg = ""
    switch (field) {
      case "contragent_name":
        if (!value) errorMsg = "კონტრაგენტის სრული დასახელება აუცილებელია"
        break
      case "contragent_id":
        if (!value) errorMsg = "საიდენტიფიკაციო კოდი აუცილებელია"
        else if (!/^\d{9,11}$/.test(value))
          errorMsg = "არასწორი ფორმატი. უნდა შეიცავდეს 9-11 ციფრს"
        break
      case "contragent_address":
        if (!value) errorMsg = "მისამართი აუცილებელია"
        break
      case "contragent_phone_number":
        if (!value) errorMsg = "ტელეფონის ნომერი აუცილებელია"
        else if (!/^[0-9+\-\s()]*$/.test(value))
          errorMsg = "არასწორი ტელეფონის ნომრის ფორმატი"
        break
      case "contragent_email":
        if (!value) errorMsg = "ელ.ფოსტა აუცილებელია"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          errorMsg = "არასწორი ელ.ფოსტის ფორმატი"
        break
      case "contragent_director":
        if (!value) errorMsg = "დირექტორის სახელი აუცილებელია"
        break
      case "contragent_power_of_attorney":
        if (!value) errorMsg = "მინდობილობა აუცილებელია"
        break
      case "contragent_power_of_attorney_phone_number":
        if (!value) errorMsg = "მინდობილი პირის ტელეფონის ნომერი აუცილებელია"
        else if (!/^[0-9+\-\s()]*$/.test(value))
          errorMsg = "არასწორი ტელეფონის ნომრის ფორმატი"
        break
      case "conscription_term":
        if (!value) errorMsg = "კონსიგნაციის ვადა აუცილებელია"
        break
      case "product_delivery_address":
        if (!value) errorMsg = "პროდუქტის მიწოდების ადგილი აუცილებელია"
        break
      case "product_cost":
        if (!value) errorMsg = "პროდუქტის ღირებულება აუცილებელია"
        else if (isNaN(value) || Number(value) <= 0)
          errorMsg = "გთხოვთ შეიყვანოთ დადებითი რიცხვი"
        break
      case "product_payment_term":
        if (!value) errorMsg = "გადახდის ვადა აუცილებელია"
        break
      case "bank_account":
        if (!value) errorMsg = "საბანკო რეკვიზიტები აუცილებელია"
        break
      case "buyer_name":
        if (!value) errorMsg = "მყიდველის სახელი აუცილებელია"
        break
      case "buyer_surname":
        if (!value) errorMsg = "მყიდველის გვარი აუცილებელია"
        break
      case "buyer_signature":
        if (!value) errorMsg = "მყიდველის ხელმოწერა აუცილებელია"
        break
      case "director_name":
        if (!value) errorMsg = "დირექტორის სახელი აუცილებელია"
        break
      case "director_surname":
        if (!value) errorMsg = "დირექტორის გვარი აუცილებელია"
        break
      case "director_signature":
        if (!value) errorMsg = "დირექტორის ხელმოწერა აუცილებელია"
        break
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: errorMsg,
    }))

    return !errorMsg
  }

  const validateForm = () => {
    let isValid = true
    Object.keys(formData).forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false
      }
    })

    if (!isValid) {
      toast.error("გთხოვთ შეავსოთ ყველა სავალდებულო ველი")
    }

    return isValid
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    toast.info("მიმდინარეობს დამუშავება...", {
      autoClose: false,
      toastId: "submitProgress",
    })

    const formDataToSend = new FormData()
    Object.keys(formData).forEach(key => {
      if (key === "notary_agreement") {
        formDataToSend.append("notary_agreement", formData[key] ? 1 : 0)
      } else if (formData[key] !== "") {
        formDataToSend.append(key, formData[key])
      }
    })

    formDataToSend.append("status", "pending")
    formDataToSend.append("created_at", new Date().toISOString())
    formDataToSend.append("updated_at", new Date().toISOString())

    try {
      const response = await createAgreement(formDataToSend)
      toast.dismiss("submitProgress")

      if (response) {
        toast.success("ხელშეკრულება წარმატებით შეიქმნა")
        setFormData({
          contragent_name: "",
          contragent_id: "",
          contragent_address: "",
          contragent_phone_number: "",
          contragent_email: "",
          contragent_director: "",
          contragent_power_of_attorney: "",
          contragent_power_of_attorney_phone_number: "",
          conscription_term: "",
          product_delivery_address: "",
          product_cost: "",
          product_payment_term: "",
          bank_account: "",
          buyer_name: "",
          buyer_surname: "",
          buyer_signature: "",
          director_name: "",
          director_surname: "",
          director_signature: "",
        })
        setActiveTab(4)
        setPassedSteps(prevSteps => [...prevSteps, 4])
        setErrors({})
      }
    } catch (error) {
      toast.dismiss("submitProgress")
      handleError(error)
    }
  }

  const handleError = error => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          toast.error(
            "არასწორი მოაცემები. გთხოვთ შეამოწმოთ შეყვანილი ინფორმაცია"
          )
          break
        case 401:
          toast.error("გთხოვთ გაიაროთ ავტორიზაცია")
          break
        case 422:
          const validationErrors = error.response.data.errors
          Object.keys(validationErrors).forEach(key => {
            toast.error(validationErrors[key][0])
          })
          break
        case 500:
          toast.error("სერვერის შეცდომა. გთხოვთ სცადოთ მოგვიანებით")
          break
        default:
          toast.error("დაფიქსირდა შეცდომა. გთხოვთ სცადოთ მოგვიანებით")
      }
    } else if (error.request) {
      toast.error("კავშირის შეცდომა. გთხოვთ შეამოწმოთ ინტერნეტ კავშირი")
    } else {
      toast.error("დაფიქსირდა შეცდომა. გთხოვთ სცადოთ მოგვიანებით")
    }
  }

  const toggleTab = tab => {
    if (activeTab !== tab) {
      if (tab === 4 && activeTab === 3) {
        handleSubmit()
      } else {
        const modifiedSteps = [...passedSteps, tab]
        if (tab >= 1 && tab <= 4) {
          setActiveTab(tab)
          setPassedSteps(modifiedSteps)
        }
      }
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
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
          theme="colored"
        />
        <Container fluid>
          <Breadcrumbs
            title="ხელშეკრულებები"
            breadcrumbItem="ხელშეკრულების მოთხოვნა"
          />

          <Card className="shadow-lg border-0 rounded-lg mt-5">
            <CardBody>
              <div className="progress-steps mb-4">
                {[
                  { label: "ძირითადი ინფორმაცია", icon: "bx-user" },
                  { label: "ფინანსური დეტალები", icon: "bx-money" },
                  { label: "დამატებითი ინფორმაცია", icon: "bx-file" },
                ].map((step, index) => (
                  <div
                    key={index}
                    className={classnames("step", {
                      active: activeTab === index + 1,
                      completed: passedSteps.includes(index + 1),
                      disabled: !passedSteps.includes(index + 1),
                    })}
                    onClick={() =>
                      passedSteps.includes(index + 1) && setActiveTab(index + 1)
                    }
                  >
                    <div className="step-number">
                      <i className={`bx ${step.icon}`}></i>
                    </div>
                    <div className="step-label">{step.label}</div>
                  </div>
                ))}
              </div>

              <div className="form-content">
                <TabContent activeTab={activeTab}>
                  <TabPane tabId={1}>
                    <Form>
                      <Row>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="contragent_name">
                              კონტრაგენტის სრული დასახელება
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.contragent_name,
                              })}
                              id="contragent_name"
                              value={formData.contragent_name}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ კონტრაგენტის სრული დასახელება..."
                            />
                            {errors.contragent_name && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.contragent_name}
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="contragent_id">
                              კონტრაგენტის საიდენტიფიკაციო კოდი/პირადი ნომერი
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.contragent_id,
                              })}
                              id="contragent_id"
                              value={formData.contragent_id}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ საიდენტიფიკაციო კოდი..."
                            />
                            {errors.contragent_id && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.contragent_id}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="contragent_address">
                              კონტრაგენტის მისამართი
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.contragent_address,
                              })}
                              id="contragent_address"
                              value={formData.contragent_address}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ მისამართი..."
                            />
                            {errors.contragent_address && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.contragent_address}
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="contragent_phone_number">
                              კონტრაგენტის ტელეფონის ნომერი
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.contragent_phone_number,
                              })}
                              id="contragent_phone_number"
                              value={formData.contragent_phone_number}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ ტელეფონის ნომერი..."
                            />
                            {errors.contragent_phone_number && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.contragent_phone_number}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="contragent_email">
                              კონტრაგენტის ელ.ფოსტა
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.contragent_email,
                              })}
                              id="contragent_email"
                              value={formData.contragent_email}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ ელ.ფოსტა..."
                            />
                            {errors.contragent_email && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.contragent_email}
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="contragent_director">
                              კონტრაგენტის დირექტორი
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.contragent_director,
                              })}
                              id="contragent_director"
                              value={formData.contragent_director}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ დირექტორის სახელი..."
                            />
                            {errors.contragent_director && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.contragent_director}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </TabPane>
                  <TabPane tabId={2}>
                    <Form>
                      <Row>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="conscription_term">
                              კონსიგნაციის ვადა
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.conscription_term,
                              })}
                              id="conscription_term"
                              value={formData.conscription_term}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ კონსიგნაციის ვადა..."
                            />
                            {errors.conscription_term && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.conscription_term}
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="product_delivery_address">
                              პროდუქციის მიწოდების ადგილი
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.product_delivery_address,
                              })}
                              id="product_delivery_address"
                              value={formData.product_delivery_address}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ პროდუქტის ღიწოდების ადგილი..."
                            />
                            {errors.product_delivery_address && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.product_delivery_address}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="product_cost">
                              პროდუქციის ღირებულება
                            </Label>
                            <Input
                              type="number"
                              className={classnames("form-control", {
                                "is-invalid": errors.product_cost,
                              })}
                              id="product_cost"
                              value={formData.product_cost}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ პროდუქტის ღირებულება..."
                            />
                            {errors.product_cost && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.product_cost}
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="product_payment_term">
                              ღირებულების გადახდის ვადა
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.product_payment_term,
                              })}
                              id="product_payment_term"
                              value={formData.product_payment_term}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ გადახდის ვადა..."
                            />
                            {errors.product_payment_term && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.product_payment_term}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="bank_account">ანგარიშის ნომერი</Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.bank_account,
                              })}
                              id="bank_account"
                              value={formData.bank_account}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ საბანკო რეკვიზიტები..."
                            />
                            {errors.bank_account && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.bank_account}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </TabPane>
                  <TabPane tabId={3}>
                    <Form>
                      <Row>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="buyer_name">"მყიდველის" სახელი</Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.buyer_name,
                              })}
                              id="buyer_name"
                              value={formData.buyer_name}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ პყიდველის სახელი..."
                            />
                            {errors.buyer_name && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.buyer_name}
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="buyer_surname">"მყიდველის" გვარი</Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.buyer_surname,
                              })}
                              id="buyer_surname"
                              value={formData.buyer_surname}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ პყიდველის გვარი..."
                            />
                            {errors.buyer_surname && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.buyer_surname}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="buyer_signature">
                              "მყიდველის" ხელმოწერა
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.buyer_signature,
                              })}
                              id="buyer_signature"
                              value={formData.buyer_signature}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ ხყიდველის ხელმოწერა..."
                            />
                            {errors.buyer_signature && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.buyer_signature}
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="director_name">დირექტორის სახელი</Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.director_name,
                              })}
                              id="director_name"
                              value={formData.director_name}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ დირექტორის სახელი..."
                            />
                            {errors.director_name && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.director_name}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="director_surname">
                              დირექტორის გვარი
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.director_surname,
                              })}
                              id="director_surname"
                              value={formData.director_surname}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ დირექტორის გვარი..."
                            />
                            {errors.director_surname && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.director_surname}
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="director_signature">
                              დირექტორის ხელმოწერა
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.director_signature,
                              })}
                              id="director_signature"
                              value={formData.director_signature}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ ხირექტორის ხელმოწერა..."
                            />
                            {errors.director_signature && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.director_signature}
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="contragent_power_of_attorney">
                              მინდობილი პირი
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid":
                                  errors.contragent_power_of_attorney,
                              })}
                              id="contragent_power_of_attorney"
                              value={formData.contragent_power_of_attorney}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ მინდობილი პირი..."
                            />
                            {errors.contragent_power_of_attorney && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.contragent_power_of_attorney}
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="contragent_power_of_attorney_phone_number">
                              მინდობილი პირის ნომერი
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid":
                                  errors.contragent_power_of_attorney_phone_number,
                              })}
                              id="contragent_power_of_attorney_phone_number"
                              value={
                                formData.contragent_power_of_attorney_phone_number
                              }
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ მინდობილი პირის ნომერი..."
                            />
                            {errors.contragent_power_of_attorney_phone_number && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {
                                  errors.contragent_power_of_attorney_phone_number
                                }
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </TabPane>
                  <TabPane tabId={4}>
                    <div className="row justify-content-center">
                      <Col lg="6">
                        <div className="text-center">
                          <div className="mb-4">
                            <i className="mdi mdi-check-circle-outline text-success display-4" />
                          </div>
                          <div>
                            <h5>შეკვეთა წარმატებით დასრულდა!</h5>
                            <p className="text-muted">
                              თქვენი შეკვეთა წარმატებით შესრულდა.
                            </p>
                          </div>
                        </div>
                      </Col>
                    </div>
                  </TabPane>
                </TabContent>
              </div>

              <div className="form-navigation mt-4">
                <button
                  className="btn btn-secondary"
                  onClick={() => toggleTab(activeTab - 1)}
                  disabled={activeTab === 1}
                >
                  <i className="bx bx-chevron-left"></i>
                  წინა გვერდი
                </button>

                {activeTab === 3 ? (
                  <button className="btn btn-success" onClick={handleSubmit}>
                    დასრულება
                    <i className="bx bx-check-circle ms-1"></i>
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => toggleTab(activeTab + 1)}
                    disabled={activeTab === 4}
                  >
                    შემდეგი გვერდი
                    <i className="bx bx-chevron-right ms-1"></i>
                  </button>
                )}
              </div>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default LawyerPage
