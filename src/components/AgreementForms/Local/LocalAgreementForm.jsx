import React, { useState } from "react"
import { Form, Input, Label, Row, Col, TabContent, TabPane } from "reactstrap"
import classnames from "classnames"
import { toast } from "react-toastify"
import { createAgreement } from "services/localAgreement"
import "./index.module.css"

const LocalAgreementForm = ({ onSuccess }) => {
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
    file_path: "",
    agreement_automatic_renewal: false,
    exclusivity: false,
    exclusive_placement: "",
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

    if (value === undefined) return true

    switch (field) {
      case "executor_firm_name":
      case "executor_home_address":
      case "executor_factual_address":
      case "executor_full_name":
      case "executor_position":
      case "executor_bank_account":
      case "executor_bank_name":
      case "director_full_name":
        if (!value?.trim()) errorMsg = "This field is required"
        else if (value.length > 255)
          errorMsg = "Maximum length is 255 characters"
        break
      case "exclusive_placement":
        if (formData.exclusivity && !value?.trim())
          errorMsg = "This field is required"
        else if (value?.length > 255)
          errorMsg = "Maximum length is 255 characters"
        break
      case "executor_id_number":
      case "director_id_number":
        if (!value) errorMsg = "This field is required"
        else if (value.length !== 11) errorMsg = "Must be exactly 11 characters"
        break
      case "executor_bank_swift":
        if (!value) errorMsg = "This field is required"
        else if (value.length !== 8) errorMsg = "Must be exactly 8 characters"
        break
      case "agreement_active_term":
        if (!value) errorMsg = "This field is required"
        else if (new Date(value) <= new Date())
          errorMsg = "Must be a future date"
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
      if (field === "exclusive_placement" && !formData.exclusivity) {
        return
      }
      if (field === "file_path") {
        return
      }
      if (field === "agreement_automatic_renewal" || field === "exclusivity") {
        return
      }
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
      if (key === "exclusive_placement") {
        formDataToSend.append(
          key,
          formData.exclusivity ? value : "არ არის მითითებული"
        )
        return
      }

      if (value !== "" && value !== null && value !== undefined) {
        if (key === "agreement_automatic_renewal" || key === "exclusivity") {
          formDataToSend.append(key, value === true ? "1" : "0")
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
          file_path: "",
          agreement_active_term: "",
          agreement_automatic_renewal: false,
          exclusivity: false,
          exclusive_placement: "",
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
          toast.error(
            "არასწორი მოაცემები. გთხოვთ შამოწმოთ შეყვანილი ინფორმაცია"
          )
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
        "agreement_active_term",
        "exclusivity",
        "exclusive_placement",
        "agreement_automatic_renewal",
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
        "agreement_active_term",
        "exclusivity",
        "exclusive_placement",
        "agreement_automatic_renewal",
      ],
    }

    return stepFields[stepNumber]?.some(field => formData[field])
  }

  return (
    <div className="form-content">
      <div className="progress-steps mb-4">
        {[
          { label: "ძემსრულებლის ინფორმაცია", icon: "bx-user" },
          { label: "საბანკო დეტალები", icon: "bx-money" },
          { label: "სელშეკრულების დეტალბი", icon: "bx-file" },
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
                    შემსრულებელი ფირმის დასახელება
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
                  <Label for="executor_id_number">საიდენტიფიკაციო ნომერი</Label>
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
                  <Label for="executor_home_address">იურიდიული მისამართი</Label>
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
                    ფაქტიური მისამართი
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
                    შემსრლებლის სახელი და გვარი
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
                    შემსრულებლის თანამდებობა
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
                  <Label for="executor_bank_account">
                    საბანკო ანგარიშის ნომერი
                  </Label>
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
                  <Label for="agreement_active_term">
                    ხელშეკრულების აქტიური ვადა
                  </Label>
                  <Input
                    type="date"
                    className={classnames("form-control", {
                      "is-invalid": errors.agreement_active_term,
                    })}
                    id="agreement_active_term"
                    value={formData.agreement_active_term}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {errors.agreement_active_term && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.agreement_active_term}
                    </div>
                  )}
                </div>
              </Col>
              <Col lg="6">
                <div className="mb-3">
                  <div className="form-check mb-3">
                    <Input
                      type="checkbox"
                      className="form-check-input"
                      id="agreement_automatic_renewal"
                      checked={formData.agreement_automatic_renewal}
                      onChange={e =>
                        handleInputChange({
                          target: {
                            id: "agreement_automatic_renewal",
                            value: e.target.checked,
                          },
                        })
                      }
                    />
                    <Label
                      className="form-check-label"
                      for="agreement_automatic_renewal"
                    >
                      ავტომატური განახლება
                    </Label>
                  </div>
                  <div className="form-check">
                    <Input
                      type="checkbox"
                      className="form-check-input"
                      id="exclusivity"
                      checked={formData.exclusivity}
                      onChange={e =>
                        handleInputChange({
                          target: {
                            id: "exclusivity",
                            value: e.target.checked,
                          },
                        })
                      }
                    />
                    <Label className="form-check-label" for="exclusivity">
                      ექსკლუზიურობა
                    </Label>
                  </div>
                </div>
              </Col>
            </Row>
            {formData.exclusivity && (
              <Row>
                <Col lg="12">
                  <div className="mb-3">
                    <Label for="exclusive_placement">
                      ექსკლუზიური განთავსების დეტალები
                    </Label>
                    <Input
                      type="text"
                      className={classnames("form-control", {
                        "is-invalid": errors.exclusive_placement,
                      })}
                      id="exclusive_placement"
                      value={formData.exclusive_placement}
                      onChange={handleInputChange}
                      placeholder="���აწერეთ ექსკლუზიური განთავსების დეტალები..."
                    />
                    {errors.exclusive_placement && (
                      <div className="form-error">
                        <i className="bx bx-error-circle"></i>
                        {errors.exclusive_placement}
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            )}
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

export default LocalAgreementForm
