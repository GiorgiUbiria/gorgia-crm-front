import React, { useState, useCallback } from "react"
import { Form, Input, Label, Row, Col, TabContent, TabPane } from "reactstrap"
import classnames from "classnames"
import { toast } from "react-toastify"
import { createAgreement } from "services/agreement"
import "./index.module.css"

const StandardAgreementForm = ({ onSuccess }) => {
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
    product_delivery_address: "",
    bank_account: "",
    file_path: "",
    status: "pending",
    payment_different_terms: false,
    advance_payment_percentage: "",
    remaining_payment_percentage: "",
    contract_initiator_name: "",
    products: [
      {
        product_name: "",
        product_price: "",
        specification: "",
        product_quantity: "",
      },
    ],
    product_payment_term: 1,
  })

  const calculateProductCost = useCallback(products => {
    return products.reduce((total, product) => {
      const price = parseFloat(product.product_price) || 0
      const quantity = parseInt(product.product_quantity) || 0
      return total + price * quantity
    }, 0)
  }, [])

  const handleInputChange = e => {
    const { id, value, type, checked } = e.target
    setFormData(prevData => {
      const newData = { ...prevData }

      if (id === "payment_different_terms") {
        newData[id] = checked
        if (!checked) {
          newData.advance_payment_percentage = ""
          newData.remaining_payment_percentage = ""
        }
      } else if (id === "advance_payment_percentage") {
        const numValue = parseFloat(value) || 0
        newData[id] = value
        if (numValue >= 0 && numValue <= 100) {
          newData.remaining_payment_percentage = (100 - numValue).toFixed(2)
        }
      } else if (id === "remaining_payment_percentage") {
        const numValue = parseFloat(value) || 0
        newData[id] = value
        if (numValue >= 0 && numValue <= 100) {
          newData.advance_payment_percentage = (100 - numValue).toFixed(2)
        }
      } else {
        newData[id] = type === "checkbox" ? checked : value
      }

      return newData
    })
    validateField(id, type === "checkbox" ? checked : value)
  }

  const validateField = (field, value) => {
    let errorMsg = ""

    switch (field) {
      case "contragent_name":
        if (!value && value !== 0) errorMsg = "ველი აუცილებელია"
        break
      case "contragent_address":
        if (!value && value !== 0) errorMsg = "ველი აუცილებელია"
        break
      case "contragent_email":
        if (!value && value !== 0) errorMsg = "ველი აუცილებელია"
        break
      case "contragent_director_name":
        if (!value && value !== 0) errorMsg = "ველი აუცილებელია"
        break
      case "product_delivery_address":
        if (!value && value !== 0) errorMsg = "ველი აუცილებელია"
        break
      case "bank_account":
        if (!value && value !== 0) errorMsg = "ველი აუცილებელია"
        break
      case "contragent_id":
        if (!value && value !== 0) errorMsg = "ველი აუცილებელია"
        else if (value.length < 9 || value.length > 11)
          errorMsg = "უნდა შედგებოდეს 9-დან 11 სიმბოლომდე"
        break
      case "contract_initiator_name":
        if (!value && value !== 0) errorMsg = "ველი აუცილებელია"
        break
      case "contragent_phone_number":
        if (!value && value !== 0) errorMsg = "ველი აუცილებელია"
        else if (value.length > 20) errorMsg = "მაქსიმალური სიგრძეა 20 სიმბოლო"
        break
      case "contragent_director_phone_number":
        if (!value && value !== 0) errorMsg = "ველი აუცილებელია"
        else if (value.length > 20) errorMsg = "მაქსიმალური სიგრძეა 20 სიმბოლო"
        break
      case "conscription_term":
        if (!value && value !== 0) errorMsg = "ველი აუცილებელია"
        else if (isNaN(value) || Number(value) < 1)
          errorMsg = "უნდა იყოს დადებითი მთელი რიცხვი"
        break
      case "advance_payment_percentage":
        if (formData.payment_different_terms && !value && value !== 0)
          errorMsg = "ველი აუცილებელია"
        else if (
          value &&
          (isNaN(value) || Number(value) < 0 || Number(value) > 100)
        )
          errorMsg = "უნდა იყოს 0-დან 100-მდე"
        break
      case "remaining_payment_percentage":
        if (formData.payment_different_terms && !value && value !== 0)
          errorMsg = "ველი აუცილებელია"
        else if (
          value &&
          (isNaN(value) || Number(value) < 0 || Number(value) > 100)
        )
          errorMsg = "უნდა იყოს 0-დან 100-მდე"
        break
      case "products":
        if (!Array.isArray(value)) {
          errorMsg = "პროდუქტები უნდა იყოს მასივი"
        } else if (value.length === 0) {
          errorMsg = "მინიმუმ ერთი პროდუქტი აუცილებელია"
        } else {
          const invalidProduct = value.find(
            product =>
              !product.product_name?.trim() ||
              !product.product_price ||
              isNaN(product.product_price) ||
              Number(product.product_price) <= 0 ||
              !product.specification?.trim() ||
              !product.product_quantity ||
              isNaN(product.product_quantity) ||
              Number(product.product_quantity) < 1
          )
          if (invalidProduct) {
            errorMsg =
              "ყველა პროდუქტს უნდა ჰქონდეს სახელი, დადებითი ღირებულება, სპეციფიკაცია და რაოდენობა"
          }
        }
        break
      case "file_path":
        // Optional field, no validation needed
        break
      case "status":
        // System-managed field, no validation needed
        break
      case "payment_different_terms":
        // Boolean field, no validation needed
        break
      case "product_payment_term":
        if (!formData.payment_different_terms && !value && value !== 0)
          errorMsg = "ველი აუცილებელია"
        else if (value && (isNaN(value) || Number(value) < 0))
          errorMsg = "არ უნდა იყოს 0-ზე ნაკლები"
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

    if (formData.payment_different_terms) {
      const advancePercent = Number(formData.advance_payment_percentage)
      const remainingPercent = Number(formData.remaining_payment_percentage)

      if (Math.abs(advancePercent + remainingPercent - 100) > 0.01) {
        toast.error("გადახდის პროცენტების ჯამი უნდა იყოს 100")
        return
      }
    }

    toast.info("მიმდინარეობს დამუშავება...", {
      autoClose: false,
      toastId: "submitProgress",
    })

    try {
      const dataToSend = {
        contragent_name: formData.contragent_name,
        contragent_id: formData.contragent_id,
        contragent_address: formData.contragent_address,
        contragent_phone_number: formData.contragent_phone_number,
        contragent_email: formData.contragent_email,
        contragent_director_name: formData.contragent_director_name,
        contragent_director_phone_number:
          formData.contragent_director_phone_number,
        conscription_term: parseInt(formData.conscription_term),
        product_delivery_address: formData.product_delivery_address,
        bank_account: formData.bank_account,
        file_path: formData.file_path || null,
        payment_different_terms: formData.payment_different_terms ? 1 : 0,
        contract_initiator_name: formData.contract_initiator_name,
        product_cost: calculateProductCost(formData.products),
        product_payment_term: parseInt(formData.product_payment_term),
        products: formData.products.map(product => ({
          product_name: product.product_name,
          product_price: parseFloat(product.product_price),
          specification: product.specification,
          product_quantity: parseInt(product.product_quantity),
        })),
      }

      if (formData.payment_different_terms) {
        dataToSend.advance_payment_percentage = parseFloat(
          formData.advance_payment_percentage
        )
        dataToSend.remaining_payment_percentage = parseFloat(
          formData.remaining_payment_percentage
        )
      }

      const response = await createAgreement(dataToSend)
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
          product_delivery_address: "",
          bank_account: "",
          file_path: "",
          status: "pending",
          payment_different_terms: false,
          advance_payment_percentage: "",
          remaining_payment_percentage: "",
          contract_initiator_name: "",
          products: [
            {
              product_name: "",
              product_price: "",
              specification: "",
              product_quantity: "",
            },
          ],
          product_payment_term: "",
        })
        setActiveTab(4)
        setPassedSteps(prevSteps => [...prevSteps, 4])
        setErrors({})
        onSuccess?.()
      }
    } catch (error) {
      console.error("Form submission error:", error)
      toast.dismiss("submitProgress")
      handleError(error)
    }
  }

  const handleError = error => {
    const validationErrors = error.response?.data?.errors

    if (error.response) {
      switch (error.response.status) {
        case 400:
          toast.error("არასწორი მოაცემებ. გთხოვთ შამოწმოთ შეყვანილი ინფორმაცია")
          break
        case 401:
          toast.error("გთხოვთ გაიაროთ ავტორიზაცია")
          break
        case 422:
          if (validationErrors) {
            Object.keys(validationErrors).forEach(key => {
              toast.error(validationErrors[key][0])
            })
          }
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

  const hasStepFields = {
    1: [
      "contragent_name",
      "contragent_id",
      "contragent_address",
      "contragent_phone_number",
      "contragent_email",
      "bank_account",
    ],
    2: [
      "contragent_director_name",
      "contragent_director_phone_number",
      "conscription_term",
      "product_delivery_address",
      "product_payment_term",
      "payment_different_terms",
      ...(formData.payment_different_terms
        ? ["advance_payment_percentage", "remaining_payment_percentage"]
        : []),
    ],
    3: ["contract_initiator_name", "products"],
  }

  const hasStepErrors = stepNumber => {
    const stepFields = hasStepFields[stepNumber]
    const hasErrors = stepFields?.some(field => errors[field])
    return hasErrors
  }

  const hasStepData = stepNumber => {
    const stepFields = hasStepFields[stepNumber]
    const hasData = stepFields?.some(field => {
      if (field === "products") {
        const hasValidProducts = formData.products.some(
          product => product.product_name && product.product_price
        )
        return hasValidProducts
      }
      return formData[field]
    })
    return hasData
  }

  const handleAddProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [
        ...prev.products,
        {
          product_name: "",
          product_price: "",
          specification: "",
          product_quantity: "",
        },
      ],
    }))
  }

  const handleRemoveProduct = index => {
    if (formData.products.length > 1) {
      setFormData(prev => ({
        ...prev,
        products: prev.products.filter((_, i) => i !== index),
      }))
    }
  }

  const handleProductChange = (index, field, value) => {
    const newProducts = [...formData.products]
    newProducts[index] = {
      ...newProducts[index],
      [field]: value,
    }
    setFormData(prev => ({
      ...prev,
      products: newProducts,
    }))
    validateField("products", newProducts)
  }

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
                    პროდუქციის მიწოდების ვადა (დღეებში)
                  </Label>
                  <Input
                    type="number"
                    className={classnames("form-control", {
                      "is-invalid": errors.conscription_term,
                    })}
                    id="conscription_term"
                    value={formData.conscription_term}
                    onChange={handleInputChange}
                    placeholder="ჩაწერეთ პროდუქციის მიწოდების ვადა..."
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
              <Col lg="12">
                <div className="mb-3 form-check">
                  <Input
                    type="checkbox"
                    className="form-check-input"
                    id="payment_different_terms"
                    checked={formData.payment_different_terms}
                    onChange={handleInputChange}
                  />
                  <Label
                    className="form-check-label"
                    for="payment_different_terms"
                  >
                    გადახდის განსხვავებული პირობები
                  </Label>
                </div>
              </Col>
            </Row>
            {formData.payment_different_terms && (
              <Row>
                <Col lg="6">
                  <div className="mb-3">
                    <Label for="advance_payment_percentage">
                      ავანსის პროცენტი (%)
                    </Label>
                    <Input
                      type="number"
                      className={classnames("form-control", {
                        "is-invalid": errors.advance_payment_percentage,
                      })}
                      id="advance_payment_percentage"
                      value={formData.advance_payment_percentage}
                      onChange={handleInputChange}
                      placeholder="შეიყვანეთ ავანსის პროცენტი..."
                      min="0"
                      max="100"
                      step="0.01"
                    />
                    {errors.advance_payment_percentage && (
                      <div className="form-error">
                        <i className="bx bx-error-circle"></i>
                        {errors.advance_payment_percentage}
                      </div>
                    )}
                  </div>
                </Col>
                <Col lg="6">
                  <div className="mb-3">
                    <Label for="remaining_payment_percentage">
                      დარჩენილი თანხის პროცენტი (%)
                    </Label>
                    <Input
                      type="number"
                      className={classnames("form-control", {
                        "is-invalid": errors.remaining_payment_percentage,
                      })}
                      id="remaining_payment_percentage"
                      value={formData.remaining_payment_percentage}
                      onChange={handleInputChange}
                      placeholder="შეიყვანეთ დარჩენილი თანხის პროცენტი..."
                      min="0"
                      max="100"
                      step="0.01"
                    />
                    {errors.remaining_payment_percentage && (
                      <div className="form-error">
                        <i className="bx bx-error-circle"></i>
                        {errors.remaining_payment_percentage}
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            )}
            {!formData.payment_different_terms && (
              <Row>
                <Col lg="6">
                  <div className="mb-3">
                    <Label for="product_payment_term">
                      გადახდის ვადა (დღეებში)
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
                      min="1"
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
            )}
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
            </Row>

            <Row className="mb-3">
              <Col lg="12">
                <Label>დანართი 1 - პროდუქტები</Label>
                {formData.products.map((product, index) => (
                  <Row key={index} className="mb-2">
                    <Col lg="3">
                      <Input
                        type="text"
                        placeholder="პროდუქტის დასახელება"
                        value={product.product_name}
                        onChange={e =>
                          handleProductChange(
                            index,
                            "product_name",
                            e.target.value
                          )
                        }
                      />
                    </Col>
                    <Col lg="3">
                      <Input
                        type="number"
                        placeholder="ფასი"
                        value={product.product_price}
                        onChange={e =>
                          handleProductChange(
                            index,
                            "product_price",
                            e.target.value
                          )
                        }
                        step="0.01"
                        min="0"
                      />
                    </Col>
                    <Col lg="2">
                      <Input
                        type="text"
                        placeholder="სპეციფიკაცია"
                        value={product.specification}
                        onChange={e =>
                          handleProductChange(
                            index,
                            "specification",
                            e.target.value
                          )
                        }
                      />
                    </Col>
                    <Col lg="2">
                      <Input
                        type="number"
                        placeholder="რაოდენობა"
                        value={product.product_quantity}
                        onChange={e =>
                          handleProductChange(
                            index,
                            "product_quantity",
                            e.target.value
                          )
                        }
                        min="1"
                        step="1"
                      />
                    </Col>
                    <Col lg="2">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleRemoveProduct(index)}
                        disabled={formData.products.length === 1}
                      >
                        <i className="bx bx-trash"></i>
                      </button>
                    </Col>
                  </Row>
                ))}
                {errors.products && (
                  <div className="form-error mt-2">
                    <i className="bx bx-error-circle"></i>
                    {errors.products}
                  </div>
                )}
                <button
                  type="button"
                  className="btn btn-primary mt-2"
                  onClick={handleAddProduct}
                >
                  <i className="bx bx-plus"></i> პროდუქტის დამატება
                </button>
              </Col>
              <Col lg="12" className="mt-3">
                <div className="alert alert-info">
                  <strong>პროდუქციის ჯამური ღირებულება:</strong>{" "}
                  {calculateProductCost(formData.products).toFixed(2)} ₾
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

export default StandardAgreementForm
