import React, { useState } from "react"
import { Form, Input, Label, Row, Col, TabContent, TabPane } from "reactstrap"
import classnames from "classnames"
import { toast } from "react-toastify"
import { createAgreement as createDeliveryAgreement } from "services/deliveryAgreement"

const DeliveryAgreementForm = ({ onSuccess }) => {
  const [activeTab, setActiveTab] = useState(1)
  const [passedSteps, setPassedSteps] = useState([1])
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    jursdictional_name: "",
    jursdictional_address: "",
    jursdictional_id_number: "",
    agreement_date_of_issue: "",
    agreement_type: "",
    action_act: "",
    sum_cost: "",
    sum_cost_type: "",
    file_path: "",
    director_full_name: "",
    director_id_number: "",
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
      case "jursdictional_name":
      case "jursdictional_address":
      case "agreement_type":
      case "action_act":
      case "sum_cost_type":
      case "director_full_name":
        if (!value) errorMsg = "ველი არ შეიძლება იყოს ცარიელი"
        else if (value.length > 255)
          errorMsg = "მაქსიმალური სიგრძეა 255 სი���ბოლო"
        break
      case "jursdictional_id_number":
      case "director_id_number":
        if (!value) errorMsg = "ველი არ შეიძლება იყოს ცარიელი"
        else if (value.length !== 11)
          errorMsg = "უნდა შედგებოდეს 11 სიმბოლოსგან"
        break
      case "agreement_date_of_issue":
        if (!value) errorMsg = "ველი არ შეიძლება იყოს ცარიელი"
        else {
          const date = new Date(value)
          if (isNaN(date.getTime())) errorMsg = "უნდა იყოს ვალიდური თარიღი"
        }
        break
      case "sum_cost":
        if (!value) errorMsg = "ველი არ შეიძლება იყოს ცარიელი"
        else if (isNaN(value) || Number(value) < 0)
          errorMsg = "უნდა იყოს ნლზე მეტი რიცხვი"
        else {
          const decimalPlaces = value.toString().split(".")[1]?.length || 0
          if (decimalPlaces > 2)
            errorMsg = "უნდა შედგებოდეს მაქსიმუმ 2 ათწილადი"
        }
        break
      case "file_path":
        if (value && value.length > 255)
          errorMsg = "მაქსიმალური სიგრძეა 255 სიმბოლო"
        break
      default:
        console.warn(`ველს არ გააჩნია ვალიდაცია: ${field}`)
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
      if (
        formData[key] !== "" &&
        formData[key] !== null &&
        formData[key] !== undefined
      ) {
        if (key === "sum_cost") {
          formDataToSend.append(key, parseFloat(formData[key]).toFixed(2))
        } else {
          formDataToSend.append(key, formData[key])
        }
      }
    })

    formDataToSend.append("status", "pending")

    try {
      const response = await createDeliveryAgreement(formDataToSend)
      toast.dismiss("submitProgress")

      if (response) {
        toast.success("მიღება-ჩაბარების აქტი წარმატებით შეიქმნა")
        setFormData({
          jursdictional_name: "",
          jursdictional_address: "",
          jursdictional_id_number: "",
          agreement_date_of_issue: "",
          agreement_type: "",
          action_act: "",
          sum_cost: "",
          sum_cost_type: "",
          file_path: "",
          director_full_name: "",
          director_id_number: "",
        })
        setActiveTab(3)
        setPassedSteps(prevSteps => [...prevSteps, 3])
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
        case 422:
          {
            const validationErrors = error.response.data.errors;
            Object.keys(validationErrors).forEach(key => {
              toast.error(validationErrors[key][0])
            });
          }
          break
        case 500:
          console.log(error.response)
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
      if (tab === 3 && activeTab === 2) {
        handleSubmit()
      } else {
        const modifiedSteps = [...passedSteps, tab]
        if (tab >= 1 && tab <= 3) {
          setActiveTab(tab)
          setPassedSteps(modifiedSteps)
        }
      }
    }
  }

  return (
    <div className="form-content">
      <div className="progress-steps mb-4">
        {[
          { label: "იურიდიული ინფორმაცია", icon: "bx-building" },
          { label: "ხელშეკრულების დეტალები", icon: "bx-file" },
        ].map((step, index) => (
          <div
            key={index}
            className={classnames("step", {
              active: activeTab === index + 1,
              completed: passedSteps.includes(index + 1),
              disabled: !passedSteps.includes(index + 1),
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
                  <Label for="jursdictional_name">იურიდიული დასახელება</Label>
                  <Input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.jursdictional_name,
                    })}
                    id="jursdictional_name"
                    value={formData.jursdictional_name}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ იურიდიული დასახელება..."
                  />
                  {errors.jursdictional_name && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.jursdictional_name}
                    </div>
                  )}
                </div>
              </Col>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="jursdictional_address">
                    იურიდიული მიამართი/ფაქტიური მისამართი
                  </Label>
                  <Input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.jursdictional_address,
                    })}
                    id="jursdictional_address"
                    value={formData.jursdictional_address}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ იურიდიული/ფაქტიური მისამართი..."
                  />
                  {errors.jursdictional_address && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.jursdictional_address}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="jursdictional_id_number">
                    საიდენტიფიკაციო კოდი/პირადი ნომერი
                  </Label>
                  <Input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.jursdictional_id_number,
                    })}
                    id="jursdictional_id_number"
                    value={formData.jursdictional_id_number}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ საიდენტიფიკაციო კოდი/პირადი ნომერი..."
                    maxLength={11}
                  />
                  {errors.jursdictional_id_number && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.jursdictional_id_number}
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
                    placeholder="ჩაწერეთ დირექტორის ტირადი ნომერი..."
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

        <TabPane tabId={2}>
          <Form>
            <Row>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="agreement_date_of_issue">
                    ხელშეკრულების გაფორმების თარიღი
                  </Label>
                  <Input
                    type="date"
                    className={classnames("form-control", {
                      "is-invalid": errors.agreement_date_of_issue,
                    })}
                    id="agreement_date_of_issue"
                    value={formData.agreement_date_of_issue}
                    onChange={handleInputChange}
                  />
                  {errors.agreement_date_of_issue && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.agreement_date_of_issue}
                    </div>
                  )}
                </div>
              </Col>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="agreement_type">ხელშეკრულების ტიპი</Label>
                  <Input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.agreement_type,
                    })}
                    id="agreement_type"
                    value={formData.agreement_type}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ ხელშეკრულების ტიპი..."
                  />
                  {errors.agreement_type && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.agreement_type}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="action_act">
                    მიღება-ჩაბარების აქტით გათვალისწინებული ქმედება
                  </Label>
                  <Input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": errors.action_act,
                    })}
                    id="action_act"
                    value={formData.action_act}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ მოქმედების აქტი..."
                  />
                  {errors.action_act && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.action_act}
                    </div>
                  )}
                </div>
              </Col>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="sum_cost">
                    შესრულებული სამუშაოს ჯამური ღირებულება
                  </Label>
                  <Input
                    type="number"
                    className={classnames("form-control", {
                      "is-invalid": errors.sum_cost,
                    })}
                    id="sum_cost"
                    value={formData.sum_cost}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ თანხის ოდენობა..."
                    step="0.01"
                  />
                  {errors.sum_cost && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.sum_cost}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg="6">
                <div className="mb-3">
                  <Label for="sum_cost_type">ღირებულების შამადგენლობა</Label>
                  <Input
                    type="select"
                    className={classnames("form-control", {
                      "is-invalid": errors.sum_cost_type,
                    })}
                    id="sum_cost_type"
                    value={formData.sum_cost_type}
                    onChange={handleInputChange}
                  >
                    <option value="">
                      აირჩიეთ ღირებულების შამადგენლობა...
                    </option>
                    <option value="დღგ-ს ჩათვლით">დღგ-ს ჩათვლით</option>
                    <option value="დღგ-ს გარეშე">დღგ-ს გარეშე</option>
                    <option value="ყველანაირი გადასახადის ჩათვლით">
                      ყველანაირი გადასახადის ჩათვლით
                    </option>
                    <option value="ყველანაირი გადასახადის გარეშე">
                      ყველანაირი გადასახადის გარეშე
                    </option>
                  </Input>
                  {errors.sum_cost_type && (
                    <div className="form-error">
                      <i className="bx bx-error-circle"></i>
                      {errors.sum_cost_type}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Form>
        </TabPane>

        <TabPane tabId={3}>
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

        {activeTab === 2 ? (
          <button className="btn btn-success" onClick={handleSubmit}>
            დასრულება
            <i className="bx bx-check-circle ms-1"></i>
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => toggleTab(activeTab + 1)}
            disabled={activeTab === 3}
          >
            შემდეგი გვერდი
            <i className="bx bx-chevron-right ms-1"></i>
          </button>
        )}
      </div>
    </div>
  )
}

export default DeliveryAgreementForm
