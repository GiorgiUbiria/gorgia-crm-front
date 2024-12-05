import React, { useState } from "react"
import {
  Form,
  Input,
  Label,
  Row,
  Col,
  TabContent,
  TabPane,
} from "reactstrap"
import classnames from "classnames"
import { toast } from "react-toastify"
import { createAgreement } from "services/agreement"
import "./index.module.css"

const MarketingAgreementForm = ({ onSuccess }) => {
  const [activeTab, setActiveTab] = useState(1)
  const [passedSteps, setPassedSteps] = useState([1])
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    contragent_name: "",
    contragent_id: "",
    contragent_address: "",
    contragent_phone_number: "",
    contragent_email: "",
    contragent_director_name: "",
    contragent_director_phone_number: "",
    conscription_term: "",
    product_cost: "",
    product_payment_term: "",
    product_delivery_address: "",
    bank_account: "",
    file_path: "",
    status: "pending",
    payment_different_terms: false,
    contract_initiator_name: "",
  })

  const handleInputChange = e => {
    const { id, value, type, checked } = e.target
    setFormData(prevData => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }))
    validateField(id, type === "checkbox" ? checked : value)
  }

  const validateField = (field, value) => {
    let errorMsg = ""

    switch (field) {
      case "contragent_name":
      case "contragent_id":
      case "contragent_address":
      case "contragent_email":
      case "contragent_director_name":
      case "product_delivery_address":
      case "bank_account":
      case "contract_initiator_name":
        if (!value && value !== 0) errorMsg = "This field is required"
        break
      case "contragent_phone_number":
      case "contragent_director_phone_number":
        if (!value && value !== 0) errorMsg = "This field is required"
        else if (value.length > 20) errorMsg = "Maximum length is 20 characters"
        break
      case "conscription_term":
      case "product_payment_term":
        if (!value && value !== 0) errorMsg = "This field is required"
        else if (isNaN(value) || Number(value) < 1)
          errorMsg = "Must be a positive integer"
        break
      case "product_cost":
        if (!value && value !== 0) errorMsg = "This field is required"
        else if (isNaN(value) || Number(value) < 0)
          errorMsg = "Must be a non-negative number"
        break
      case "payment_different_terms":
        break
      default:
        console.warn(`No validation rule for field: ${field}`)
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

    const allowedFields = [
      "contragent_name",
      "contragent_id",
      "contragent_address",
      "contragent_phone_number",
      "contragent_email",
      "contragent_director_name",
      "contragent_director_phone_number",
      "conscription_term",
      "product_cost",
      "product_payment_term",
      "product_delivery_address",
      "bank_account",
      "file_path",
      "payment_different_terms",
      "contract_initiator_name",
    ]

    allowedFields.forEach(key => {
      if (key === "payment_different_terms") {
        formDataToSend.append(key, formData[key] ? 1 : 0)
      } else if (
        formData[key] !== "" &&
        formData[key] !== null &&
        formData[key] !== undefined
      ) {
        if (key === "conscription_term" || key === "product_payment_term") {
          formDataToSend.append(key, parseInt(formData[key]))
        } else if (key === "product_cost") {
          formDataToSend.append(key, parseFloat(formData[key]).toFixed(2))
        } else {
          formDataToSend.append(key, formData[key])
        }
      }
    })

    formDataToSend.append("status", "pending")

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
          contragent_director_name: "",
          contragent_director_phone_number: "",
          conscription_term: "",
          product_cost: "",
          product_payment_term: "",
          product_delivery_address: "",
          bank_account: "",
          file_path: "",
          status: "pending",
          payment_different_terms: false,
          contract_initiator_name: "",
        })
        setActiveTab(4)
        setPassedSteps(prevSteps => [...prevSteps, 4])
        setErrors({})
        onSuccess?.()
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
          toast.error("არასწორი მოაცემებ. გთხოვთ შამოწმოთ შეყვანილი ინფორმაცია")
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

  const hasStepErrors = (stepNumber) => {
    const stepFields = {
      1: ['contragent_name', 'contragent_id', 'contragent_address', 'contragent_phone_number', 'contragent_email', 'bank_account'],
      2: ['contragent_director_name', 'contragent_director_phone_number', 'conscription_term', 'product_delivery_address', 'product_cost', 'product_payment_term'],
      3: ['contract_initiator_name']
    };

    return stepFields[stepNumber]?.some(field => errors[field]);
  };

  const hasStepData = (stepNumber) => {
    const stepFields = {
      1: ['contragent_name', 'contragent_id', 'contragent_address', 'contragent_phone_number', 'contragent_email', 'bank_account'],
      2: ['contragent_director_name', 'contragent_director_phone_number', 'conscription_term', 'product_delivery_address', 'product_cost', 'product_payment_term'],
      3: ['contract_initiator_name']
    };

    return stepFields[stepNumber]?.some(field => formData[field]);
  };

  return (
    <div className="form-content">
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
              completed: passedSteps.includes(index + 1) && !hasStepErrors(index + 1),
              'has-error': hasStepErrors(index + 1),
              disabled: !passedSteps.includes(index + 1) && !hasStepData(index + 1),
            })}
            onClick={() =>
              passedSteps.includes(index + 1) && toggleTab(index + 1)
            }
          >
            <div className="step-number">
              <i className={`bx ${step.icon}`}></i>
            </div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>

      <TabContent activeTab={activeTab}>
        <TabPane tabId={1}>
          <Form>
            <Row>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="contragent_name">
                    კონტრაგენტის სრული დასახელება/სახელი და გვარი
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
                    საიდენტიფიკაციო კოდი/პირადი ნომერი
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
                    იურიდიული მისამართი/ფაქტიური მისამართი
                  </Label>
                  <Input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.contragent_address,
                    })}
                    id="contragent_address"
                    value={formData.contragent_address}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ იურიდიული/ფაქტიური მისამართი..."
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
                  <Label for="contragent_phone_number">ტელეფონის ნომერი</Label>
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
                  <Label for="contragent_email">ელ.ფოსტა</Label>
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

        <TabPane tabId={2}>
          <Form>
            <Row>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="contragent_director_name">
                    დირექტორის სახელი და გვარი
                  </Label>
                  <Input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.contragent_director_name,
                    })}
                    id="contragent_director_name"
                    value={formData.contragent_director_name}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ დირექტორის სახელი..."
                  />
                  {errors.contragent_director_name && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.contragent_director_name}
                    </div>
                  )}
                </div>
              </Col>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="contragent_director_phone_number">
                    დირექტორის ტელეფონის ნომერი
                  </Label>
                  <Input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.contragent_director_phone_number,
                    })}
                    id="contragent_director_phone_number"
                    value={formData.contragent_director_phone_number}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ დირექტორის ტელეფონის ნომერი..."
                  />
                  {errors.contragent_director_phone_number && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.contragent_director_phone_number}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="conscription_term">
                    კონსიგნაციის ვადა (დღეებში)
                  </Label>
                  <Input
                    type="number"
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
                    placeholder="ჩაწერეთ პროდუქტის მიწოდების ადგილი..."
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
                  <Label for="product_cost">პროდუქციის ღირებულება</Label>
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
                    ღირებულების გადახდის ვადა (დღეებში)
                  </Label>
                  <Input
                    type="number"
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
          </Form>
        </TabPane>

        <TabPane tabId={3}>
          <Form>
            <Row>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="contract_initiator_name">
                    ხელშეკრულების გაფორმებაზე პასუხისმგებელი პირი
                  </Label>
                  <Input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.contract_initiator_name,
                    })}
                    id="contract_initiator_name"
                    value={formData.contract_initiator_name}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ ხელშეკრულების გაფორმებაზე პასუხისმგებელი პირი..."
                  />
                  {errors.contract_initiator_name && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.contract_initiator_name}
                    </div>
                  )}
                </div>
              </Col>
              <Col lg="6">
                <div className="mb-3 form-check">
                  <Label for="payment_different_terms">
                    გადახდის განსხვავებული პირობები
                  </Label>
                  <Input
                    type="checkbox"
                    className={classnames("form-check-input", {
                      "is-invalid": errors.payment_different_terms,
                    })}
                    id="payment_different_terms"
                    checked={formData.payment_different_terms}
                    onChange={handleInputChange}
                  />
                  {errors.payment_different_terms && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.payment_different_terms}
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
                  <h5>შეკვეთა წარმატები�� დასრულდა!</h5>
                  <p className="text-muted">
                    თქვენი შეკვეთა წარმატებით შესრულდა.
                  </p>
                </div>
              </div>
            </Col>
          </div>
        </TabPane>
      </TabContent>

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
    </div>
  )
}

export default MarketingAgreementForm
