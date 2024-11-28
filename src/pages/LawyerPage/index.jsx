import React, { useState } from "react"
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  Label,
  NavItem,
  NavLink,
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

  const [activeTab, setactiveTab] = useState(1)
  const [passedSteps, setPassedSteps] = useState([1])
  const [errors, setErrors] = useState({})
  const [selectedFile, setSelectedFile] = useState(null)
  const [type, setType] = useState("იურიდიული დეპარტამენტი")

  const [formData, setFormData] = useState({
    user_id: "",
    performer_name: "",
    id_code_or_personal_number: "",
    legal_or_actual_address: "",
    bank_account_details: "",
    representative_name: "",
    contact_info: "",
    contract_start_period: new Date().toISOString().split("T")[0],
    service_description: "",
    service_price: "",
    service_location: "",
    contract_duration: "",
    contract_responsible_person: "",
    created_at: "",
    updated_at: "",
    status: "",
    limit_type: "",
    limit_amount: "",
    consignment_term: "",
    place_time_of_delivery: "",
    product_cost: "",
    payment_term: "",
    means_of_securing_obligation: "",
    notary_agreement: false,
    initiator_name_signature: "",
    manager_name_signature: "",
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

    try {
      switch (field) {
        case "performer_name":
          if (!value) errorMsg = "შემსრულებლის სრული დასახელება აუცილებელია"
          break
        case "id_code_or_personal_number":
          if (!value)
            errorMsg = "საიდენტიფიკაციო კოდი ან პირადი ნომერი აუცილებელია"
          else if (!/^\d{9,11}$/.test(value))
            errorMsg = "არასწორი ფორმატი. უნდა შეიცავდეს 9-11 ციფრს"
          break
        case "legal_or_actual_address":
          if (!value)
            errorMsg = "იურიდიული მისამართი / ფაქტიური მისამართი აუცილებელია"
          break
        case "bank_account_details":
          if (!value) errorMsg = "საბანკო რეკვიზიტები აუცილებელია"
          break
        case "contact_info":
          if (!value)
            errorMsg = "საკონტაქტო ინფორმაცია (ტელეფონი, ელ.ფოსტა) აუცილებელია"
          break
        case "contract_start_period":
          if (!value)
            errorMsg =
              "ხელშეკრულების მოქმედების ვადის ათვლის პერიოდი აუცილებელია"
          break
        case "initiator_name_signature":
          if (!value) errorMsg = "ინიციატორის სახელი და გვარი აუცილებელია"
          break
        case "manager_name_signature":
          if (!value) errorMsg = "ხელმძღვანელის სახელი და გვარი აუცილებელია"
          break
        default:
          break
      }

      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: errorMsg,
      }))

      return !errorMsg
    } catch (error) {
      toast.error("შეცდომა ველის ვალიდაციისას")
      return false
    }
  }

  const validateForm = () => {
    try {
      let isValid = true
      console.log(formData)

      Object.keys(formData).forEach(field => {
        if (!validateField(field, formData[field])) {
          isValid = false
        }
      })

      if (!isValid) {
        console.log("Errors:", errors)
        toast.error("გთხოვთ შეავსოთ ყველა სავალდებულო ველი")
      }

      return isValid
    } catch (error) {
      toast.error("შეცდომა ფორმის ვალიდაციისას")
      return false
    }
  }

  const handleSubmit = async () => {
    try {
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

      const response = await createAgreement(formDataToSend)

      toast.dismiss("submitProgress")

      if (response) {
        toast.success("ხელშეკრულება წარმატებით შეიქმნა")

        setFormData({
          user_id: "",
          performer_name: "",
          id_code_or_personal_number: "",
          legal_or_actual_address: "",
          bank_account_details: "",
          representative_name: "",
          contact_info: "",
          contract_start_period: new Date().toISOString().split("T")[0],
          service_description: "",
          service_price: "",
          service_location: "",
          limit_type: "",
          limit_amount: "",
          consignment_term: "",
          place_time_of_delivery: "",
          product_cost: "",
          payment_term: "",
          means_of_securing_obligation: "",
          notary_agreement: false,
          initiator_name_signature: "",
          manager_name_signature: "",
        })
        setSelectedFile(null)
        setactiveTab(4)
        setPassedSteps(prevSteps => [...prevSteps, 4])
        setErrors({})
      }
    } catch (error) {
      toast.dismiss("submitProgress")

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
  }

  function toggleTab(tab) {
    if (activeTab !== tab) {
      if (tab === 4 && activeTab === 3) {
        handleSubmit()
      } else {
        var modifiedSteps = [...passedSteps, tab]
        if (tab >= 1 && tab <= 4) {
          setactiveTab(tab)
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

          <Card>
            <CardBody>
              <div className="progress-steps">
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
                      passedSteps.includes(index + 1) && setactiveTab(index + 1)
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
                            <Label for="performer_name">
                              კონტრაგენტის სრული დასახელება
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.performer_name,
                              })}
                              id="performer_name"
                              value={formData.performer_name}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ კონტრაგენტის სრული დასახელება..."
                            />
                            {errors.performer_name && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.performer_name}
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="id_code_or_personal_number">
                              საიდენტიფიკაციო კოდი ან პირადი ნომერი
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.id_code_or_personal_number,
                              })}
                              id="id_code_or_personal_number"
                              value={formData.id_code_or_personal_number}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ საიდენტიფიკაციო კოდი ან პირადი ნომერი..."
                            />
                            {errors.id_code_or_personal_number && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.id_code_or_personal_number}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="legal_or_actual_address">
                              იურიდიული მისამართი / ფაქტიური მისამართი
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.legal_or_actual_address,
                              })}
                              id="legal_or_actual_address"
                              value={formData.legal_or_actual_address}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ იურიდიული ან ფაქტიური მისამართი..."
                            />
                            {errors.legal_or_actual_address && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.legal_or_actual_address}
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="contact_info">
                              საკონტაქტო ინფორმაცია (ტელეფონი, ელ.ფოსტა)
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.contact_info,
                              })}
                              id="contact_info"
                              value={formData.contact_info}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ საკონტაქტო ინფორმაცია..."
                            />
                            {errors.contact_info && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.contact_info}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="representative_name">
                              დირექტორი ან წარმომადგენელი
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.representative_name,
                              })}
                              id="representative_name"
                              value={formData.representative_name}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ დირექტორის ან წარმომადგენლის სახელი..."
                            />
                            {errors.representative_name && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.representative_name}
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
                            <Label for="consignment_term">
                              კონსიგნაციის ვადა
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.consignment_term,
                              })}
                              id="consignment_term"
                              value={formData.consignment_term}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ კონსიგნაციის ვადა..."
                            />
                            {errors.consignment_term && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.consignment_term}
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="place_time_of_delivery">
                              მიწოდების ადგილი/დრო
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.place_time_of_delivery,
                              })}
                              id="place_time_of_delivery"
                              value={formData.place_time_of_delivery}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ მიწოდების ადგილი და დრო..."
                            />
                            {errors.place_time_of_delivery && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.place_time_of_delivery}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="product_cost">
                              პროდუქტის ღირბულება
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
                            <Label for="payment_term">გადახდის ვადა</Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.payment_term,
                              })}
                              id="payment_term"
                              value={formData.payment_term}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ გადახდის ვადა..."
                            />
                            {errors.payment_term && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.payment_term}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="bank_account_details">
                              საბანკო რეკვიზიტები
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.bank_account_details,
                              })}
                              id="bank_account_details"
                              value={formData.bank_account_details}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ საბანკო რეკვიზიტები..."
                            />
                            {errors.bank_account_details && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.bank_account_details}
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
                            <Label for="means_of_securing_obligation">
                              ვალდებულების უზრუნველყოფის საშუალება
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid":
                                  errors.means_of_securing_obligation,
                              })}
                              id="means_of_securing_obligation"
                              value={formData.means_of_securing_obligation}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ ვალდებულების უზრუნველყოფის საშუალება..."
                            />
                            {errors.means_of_securing_obligation && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.means_of_securing_obligation}
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="initiator_name_signature">
                              ხელშეკრულების ინიციატორის სახელი/ გვარი
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.initiator_name_signature,
                              })}
                              id="initiator_name_signature"
                              value={formData.initiator_name_signature}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ ინიციატორის სახელი და გვარი..."
                            />
                            {errors.initiator_name_signature && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.initiator_name_signature}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <div className="mb-3">
                            <Label for="manager_name_signature">
                              ხელშეკრულების ინიციატორის ხელმძღვანელი
                            </Label>
                            <Input
                              type="text"
                              className={classnames("form-control", {
                                "is-invalid": errors.manager_name_signature,
                              })}
                              id="manager_name_signature"
                              value={formData.manager_name_signature}
                              onChange={handleInputChange}
                              placeholder="ჩაწერეთ ხელმძღვანელის სახელი და გვარი..."
                            />
                            {errors.manager_name_signature && (
                              <div className="form-error">
                                <i className="bx bx-error-circle"></i>
                                {errors.manager_name_signature}
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

              {/* Navigation Buttons */}
              <div className="form-navigation">
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
