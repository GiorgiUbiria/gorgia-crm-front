import React, { useState } from "react"
import { Form, Input, Label, Row, Col, TabContent, TabPane } from "reactstrap"
import classnames from "classnames"
import { toast } from "react-toastify"
import { createAgreement } from "services/marketingAgreement"
import "./index.module.css"

const MarketingAgreementForm = ({ onSuccess }) => {
  const [activeTab, setActiveTab] = useState(1)
  const [passedSteps, setPassedSteps] = useState([1])
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    executor_firm_name: "",
    executor_id_number: "",
    executor_home_address: "",
    executor_factual_address: "",
    executor_full_name: "",
    executor_position: "",
    executor_bank_account: "",
    executor_bank_name: "",
    executor_bank_swift: "",
    director_full_name: "",
    director_id_number: "",
    marketing_service_type: "",
    marketing_service_start_date: "",
    marketing_service_end_date: "",
    service_cost: "",
    service_payment_details: "",
    service_active_term: "",
    file_path: "",
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
      case "executor_firm_name":
        if (!value) errorMsg = "ველი აუცილებელია"
        else if (value.length > 255)
          errorMsg = "მაქსიმალური სიგრძეა 255 სიმბოლო"
        break
      case "executor_home_address":
        if (!value) errorMsg = "ველი აუცილებელია"
        else if (value.length > 255)
          errorMsg = "მაქსიმალური სიგრძეა 255 სიმბოლო"
        break
      case "executor_factual_address":
        if (!value) errorMsg = "ველი აუცილებელია"
        else if (value.length > 255)
          errorMsg = "მაქსიმალური სიგრძეა 255 სიმბოლო"
        break
      case "executor_full_name":
        if (!value) errorMsg = "ველი აუცილებელია"
        else if (value.length > 255)
          errorMsg = "მაქსიმალური სიგრძეა 255 სიმბოლო"
        break
      case "executor_position":
        if (!value) errorMsg = "ველი აუცილებელია"
        else if (value.length > 255)
          errorMsg = "მაქსიმალური სიგრძეა 255 სიმბოლო"
        break
      case "executor_bank_account":
        if (!value) errorMsg = "ველი აუცილებელია"
        else if (value.length > 255)
          errorMsg = "მაქსიმალური სიგრძეა 255 სიმბოლო"
        break
      case "executor_bank_name":
        if (!value) errorMsg = "ველი აუცილებელია"
        else if (value.length > 255)
          errorMsg = "მაქსიმალური სიგრძეა 255 სიმბოლო"
        break
      case "marketing_service_type":
        if (!value) errorMsg = "ველი აუცილებელია"
        break
      case "service_payment_details":
        if (!value) errorMsg = "ველი აუცილებელია"
        else if (value.length > 255)
          errorMsg = "მაქსიმალური სიგრძეა 255 სიმბოლო"
        break
      case "executor_id_number":
        if (!value) errorMsg = "ველი აუ შეიძლება იყოს ცარიელი"
        else if (value.length < 9 || value.length > 11)
          errorMsg = "უნდა შედგებოდეს 9-დან 11 სიმბოლომდე"
        break
      case "director_id_number":
        if (!value) errorMsg = "ველი არ შეიძლება იყოს ცარიელი"
        else if (value.length < 9 || value.length > 11)
          errorMsg = "უნდა შედგებოდეს 9-დან 11 სიმბოლომდე"
        break
      case "executor_bank_swift":
        if (!value) errorMsg = "ველი აუცილებელია"
        else if (value.length !== 8) errorMsg = "სვიტის ნომერი არასწორია"
        break
      case "marketing_service_start_date":
        if (!value) errorMsg = "ველი აუცილებელია"
        break
      case "marketing_service_end_date":
        if (!value) errorMsg = "ველი აუცილებელია"
        else if (
          formData.marketing_service_start_date &&
          value <= formData.marketing_service_start_date
        ) {
          errorMsg = "დასრულების თარიღი უნდა იყოს დაწყების თარიღის შემდეგ"
        }
        break
      case "service_cost":
        if (!value) errorMsg = "ველი აუცილებელია"
        else if (isNaN(value) || Number(value) < 0)
          errorMsg = "მნიშვნელობა უნდა იყოს დადებითი რიცხვი"
        else if (!/^\d+(\.\d{0,2})?$/.test(value))
          errorMsg =
            "მნიშვნელობა უნდა იყოს დადებითი რიცხვი და მაქსიმალური სამი სახის ნულები"
        break
      case "service_active_term":
        if (!value) errorMsg = "ველი აუცილებელია"
        else if (new Date(value) <= new Date())
          errorMsg = "მნიშვნელობა უნდა იყოს მომავალი თარიღი"
        break
      default:
        console.warn(`ველს არ გააჩნია ვალიდაციის წესი: ${field}`)
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

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        if (key === "marketing_service_term") {
          formDataToSend.append(key, parseInt(value))
        } else if (key === "service_cost") {
          formDataToSend.append(key, parseFloat(value).toFixed(2))
        } else {
          formDataToSend.append(key, value)
        }
      }
    })

    try {
      const response = await createAgreement(formDataToSend)
      toast.dismiss("submitProgress")

      if (response) {
        toast.success("ხელშეკრულება წარმატებით შეიქმნა")
        setFormData({
          executor_firm_name: "",
          executor_id_number: "",
          executor_home_address: "",
          executor_factual_address: "",
          executor_full_name: "",
          executor_position: "",
          executor_bank_account: "",
          executor_bank_name: "",
          executor_bank_swift: "",
          director_full_name: "",
          director_id_number: "",
          marketing_service_type: "",
          marketing_service_start_date: "",
          marketing_service_end_date: "",
          service_cost: "",
          service_payment_details: "",
          service_active_term: "",
          file_path: "",
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
        case 422: {
          const validationErrors = error.response.data.errors
          Object.keys(validationErrors).forEach(key => {
            toast.error(validationErrors[key][0])
          })
          break
        }
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

  const hasStepErrors = stepNumber => {
    const stepFields = {
      1: [
        "executor_firm_name",
        "executor_id_number",
        "executor_home_address",
        "executor_factual_address",
        "executor_full_name",
        "executor_position",
      ],
      2: [
        "executor_bank_account",
        "executor_bank_name",
        "executor_bank_swift",
        "director_full_name",
        "director_id_number",
      ],
      3: [
        "marketing_service_type",
        "marketing_service_start_date",
        "marketing_service_end_date",
        "service_cost",
        "service_payment_details",
        "service_active_term",
      ],
    }

    return stepFields[stepNumber]?.some(field => errors[field])
  }

  const hasStepData = stepNumber => {
    const stepFields = {
      1: [
        "executor_firm_name",
        "executor_id_number",
        "executor_home_address",
        "executor_factual_address",
        "executor_full_name",
        "executor_position",
      ],
      2: [
        "executor_bank_account",
        "executor_bank_name",
        "executor_bank_swift",
        "director_full_name",
        "director_id_number",
      ],
      3: [
        "marketing_service_type",
        "marketing_service_start_date",
        "marketing_service_end_date",
        "service_cost",
        "service_payment_details",
        "service_active_term",
      ],
    }

    return stepFields[stepNumber]?.some(field => formData[field])
  }

  return (
    <div className="form-content">
      <div className="progress-steps mb-4">
        {[
          { label: "შემსრულებლის ინფორმაცია", icon: "bx-user" },
          { label: "საბანკო დეტალები", icon: "bx-money" },
          { label: "სერვისის დეტალები", icon: "bx-file" },
        ].map((step, index) => (
          <div
            key={index}
            className={classnames("step", {
              active: activeTab === index + 1,
              completed:
                passedSteps.includes(index + 1) && !hasStepErrors(index + 1),
              "has-error": hasStepErrors(index + 1),
              disabled:
                !passedSteps.includes(index + 1) && !hasStepData(index + 1),
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
                  <Label for="executor_firm_name">
                    სახელწოდება (საფირმო)/სახელი, გვარი
                  </Label>
                  <Input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.executor_firm_name,
                    })}
                    id="executor_firm_name"
                    value={formData.executor_firm_name}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ ფირმის დასახელება..."
                  />
                  {errors.executor_firm_name && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.executor_firm_name}
                    </div>
                  )}
                </div>
              </Col>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="executor_id_number">
                    საიდენტიფიკაციო კოდი/პირადი ნომერი
                  </Label>
                  <Input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.executor_id_number,
                    })}
                    id="executor_id_number"
                    value={formData.executor_id_number}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ 11-ნიშნა საიდენტიფიკაციო ნომერი..."
                    maxLength={11}
                  />
                  {errors.executor_id_number && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.executor_id_number}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="executor_home_address">
                    იურიდიული/საცხოვრებელი მისამართი
                  </Label>
                  <Input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.executor_home_address,
                    })}
                    id="executor_home_address"
                    value={formData.executor_home_address}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ იურიდიული მისამართი..."
                  />
                  {errors.executor_home_address && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.executor_home_address}
                    </div>
                  )}
                </div>
              </Col>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="executor_factual_address">
                    საკორესპონდენციო (ფაქტობრივი) მისამართი
                  </Label>
                  <Input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.executor_factual_address,
                    })}
                    id="executor_factual_address"
                    value={formData.executor_factual_address}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ ფაქტიური მისამართი..."
                  />
                  {errors.executor_factual_address && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.executor_factual_address}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="executor_full_name">
                    წარმომადგენლის (ხელმომწერი პირი) სახელი და გვარი
                  </Label>
                  <Input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.executor_full_name,
                    })}
                    id="executor_full_name"
                    value={formData.executor_full_name}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ სახელი და გვარი..."
                  />
                  {errors.executor_full_name && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.executor_full_name}
                    </div>
                  )}
                </div>
              </Col>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="executor_position">
                    წარმომადგენლის (ხელმომწერი პირი) თანამდებობა
                  </Label>
                  <Input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.executor_position,
                    })}
                    id="executor_position"
                    value={formData.executor_position}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ თანამდებობა..."
                  />
                  {errors.executor_position && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.executor_position}
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
                  <Label for="executor_bank_account">ანგარიშის ნომერი</Label>
                  <Input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.executor_bank_account,
                    })}
                    id="executor_bank_account"
                    value={formData.executor_bank_account}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ საბანკო ანგარიშის ნომერი..."
                  />
                  {errors.executor_bank_account && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.executor_bank_account}
                    </div>
                  )}
                </div>
              </Col>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="executor_bank_name">ბანკის დასახელება</Label>
                  <Input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.executor_bank_name,
                    })}
                    id="executor_bank_name"
                    value={formData.executor_bank_name}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ ბანკის დასახელება..."
                  />
                  {errors.executor_bank_name && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.executor_bank_name}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="executor_bank_swift">ბანკის კოდი</Label>
                  <Input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.executor_bank_swift,
                    })}
                    id="executor_bank_swift"
                    value={formData.executor_bank_swift}
                    onChange={handleInputChange}
                    placeholder="მაგ. BAGAGE22"
                    maxLength={8}
                  />
                  {errors.executor_bank_swift && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.executor_bank_swift}
                    </div>
                  )}
                </div>
              </Col>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="director_full_name">
                    დირექტორის სახელი და გვარი
                  </Label>
                  <Input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.director_full_name,
                    })}
                    id="director_full_name"
                    value={formData.director_full_name}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ დირექტორის სახელი და გვარი..."
                  />
                  {errors.director_full_name && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.director_full_name}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="director_id_number">
                    დირექტორის პირადი ნომერი
                  </Label>
                  <Input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.director_id_number,
                    })}
                    id="director_id_number"
                    value={formData.director_id_number}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ 11-ნიშნა პირადი ნომერი..."
                    maxLength={11}
                  />
                  {errors.director_id_number && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.director_id_number}
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
                  <Label for="marketing_service_type">
                    მარკეტინგული მომსახურების სახეობა
                  </Label>
                  <Input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.marketing_service_type,
                    })}
                    id="marketing_service_type"
                    value={formData.marketing_service_type}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ მომსახურების ტიპი..."
                  />
                  {errors.marketing_service_type && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.marketing_service_type}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg="12">
                <Row>
                  <Col lg="6">
                    <div className="mb-3">
                      <Label for="marketing_service_start_date">
                        მარკეტინგული მომსახურების დაწყების თარიღი
                      </Label>
                      <Input
                        type="date"
                        className={classnames("form-control", {
                          "is-invalid": errors.marketing_service_start_date,
                        })}
                        id="marketing_service_start_date"
                        value={formData.marketing_service_start_date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      {errors.marketing_service_start_date && (
                        <div className="form-error">
                          <i className="bx bx-error-circle"></i>
                          {errors.marketing_service_start_date}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col lg="6">
                    <div className="mb-3">
                      <Label for="marketing_service_end_date">
                        მარკეტინგული მომსახურების დასრულების თარიღი
                      </Label>
                      <Input
                        type="date"
                        className={classnames("form-control", {
                          "is-invalid": errors.marketing_service_end_date,
                        })}
                        id="marketing_service_end_date"
                        value={formData.marketing_service_end_date}
                        onChange={handleInputChange}
                        min={
                          formData.marketing_service_start_date ||
                          new Date().toISOString().split("T")[0]
                        }
                      />
                      {errors.marketing_service_end_date && (
                        <div className="form-error">
                          <i className="bx bx-error-circle"></i>
                          {errors.marketing_service_end_date}
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="service_cost">ხელშეკრულების ფასი</Label>
                  <Input
                    type="number"
                    className={classnames("form-control", {
                      "is-invalid": errors.service_cost,
                    })}
                    id="service_cost"
                    value={formData.service_cost}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ მომსახურების ღირებულება..."
                    step="0.01"
                    min="0"
                  />
                  {errors.service_cost && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.service_cost}
                    </div>
                  )}
                </div>
              </Col>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="service_payment_details">გადახდის პირობები</Label>
                  <Input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.service_payment_details,
                    })}
                    id="service_payment_details"
                    value={formData.service_payment_details}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ გადახდის დეტალები..."
                  />
                  {errors.service_payment_details && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.service_payment_details}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="service_active_term">
                    ხელშეკრულების მოქმედების ვადა
                  </Label>
                  <Input
                    type="date"
                    className={classnames("form-control", {
                      "is-invalid": errors.service_active_term,
                    })}
                    id="service_active_term"
                    value={formData.service_active_term}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {errors.service_active_term && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.service_active_term}
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
