import React, { useState } from "react";
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
} from "reactstrap";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Breadcrumbs from "../../components/Common/Breadcrumb";
import { createAgreement } from "services/agreement";

const LawyerPage = () => {
  document.title = "ხელშეკრულების მოთხოვნის ფორმა - Georgia LLC";

  const [activeTab, setactiveTab] = useState(1);
  const [passedSteps, setPassedSteps] = useState([1]);
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    user_id: "",
    performer_name: "",
    id_code_or_personal_number: "",
    legal_or_actual_address: "",
    bank_account_details: "",
    representative_name: "",
    contact_info: "",
    contract_start_period: new Date().toISOString().split('T')[0],
    service_description: "",
    service_price: "",
    payment_terms: "",
    service_location: "",
    contract_duration: "",
    contract_responsible_person: "",
    limit_type: "",
    limit_amount: "",
    consignment_term: "",
    place_time_of_delivery: "",
    product_cost: "",
    payment_term: "",
    means_of_securing_obligation: "",
    notary_agreement: false,
    file_path: null,
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

    validateField(id, value);
  };

  const validateField = (field, value) => {
    let errorMsg = "";

    try {
      switch (field) {
        case "performer_name":
          if (!value) errorMsg = "შემსრულებლის სრული დასახელება აუცილებელია";
          break;
        case "id_code_or_personal_number":
          if (!value) errorMsg = "საიდენტიფიკაციო კოდი ან პირადი ნომერი აუცილებელია";
          else if (!/^\d{9,11}$/.test(value)) errorMsg = "არასწორი ფორმატი. უნდა შეიცავდეს 9-11 ციფრს";
          break;
        case "legal_or_actual_address":
          if (!value) errorMsg = "იურიდიული მისამართი / ფაქტიური მისამართი აუცილებელია";
          break;
        case "bank_account_details":
          if (!value) errorMsg = "საბანკო რეკვიზიტები აუცილებელია";
          break;
        case "contact_info":
          if (!value) errorMsg = "საკონტაქტო ინფორმაცია (ტელეფონი, ელ.ფოსტა) აუცილებელია";
          break;
        case "contract_start_period":
          if (!value) errorMsg = "ხელშეკრულების მოქმედების ვადის ათვლის პერიოდი აუცილებელია";
          break;
        case "service_description":
          if (!value) errorMsg = "მომსახურების საგანი აუცილებელია";
          break;
        case "service_price":
          if (!value || isNaN(value)) errorMsg = "მომსახურების ფასი უნდა იყოს ციფრი";
          break;
        case "payment_terms":
          if (!value) errorMsg = "გადახდის პირობები/გადახდის განსხვავებული პირობები აუცილელია";
          break;
        case "service_location":
          if (!value) errorMsg = "მომსახურების გაწევის ადგილი აუცილებელია";
          break;
        case "contract_duration":
          if (!value) errorMsg = "ხელშეკრულების მოქმედების ვადა აუცილებელია";
          break;
        case "contract_responsible_person":
          if (!value) errorMsg = "ხელშეკრულების გაფორმების ინიციატორი და შესრულებაზე პასუხისმგებელი პირი აუცილებელია";
          break;
        case "file_path":
          if (!value && !selectedFile) errorMsg = "ფაილის ატვირთვა აუცილებელია";
          else if (selectedFile && selectedFile.size > 5 * 1024 * 1024) errorMsg = "ფაილის ზომა არ უნდა აღემატებოდეს 5MB-ს";
          break;
        default:
          break;
      }

      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: errorMsg
      }));

      return !errorMsg;
    } catch (error) {
      console.error(`Validation error for field ${field}:`, error);
      toast.error("შეცდომა ველის ვალიდაციისას");
      return false;
    }
  };

  const validateForm = () => {
    try {
      const newErrors = {};
      let isValid = true;

      Object.keys(formData).forEach((field) => {
        if (!validateField(field, formData[field])) {
          isValid = false;
        }
      });

      if (!isValid) {
        toast.error("გთხოვთ შეავსოთ ყველა სავალდებულო ველი");
      }

      return isValid;
    } catch (error) {
      console.error("Form validation error:", error);
      toast.error("შეცდომა ფორმის ვალიდაციისას");
      return false;
    }
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      toast.info("მიმდინარეობს დამუშავება...", {
        autoClose: false,
        toastId: "submitProgress"
      });

      const formDataToSend = new FormData();

      // Append all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'file_path' && selectedFile) {
          formDataToSend.append('file_path', selectedFile);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await createAgreement(formDataToSend);

      toast.dismiss("submitProgress");

      if (response) {
        toast.success("ხელშეკრულება წარმატებით შეიქმნა");

        setFormData({
          user_id: "",
          performer_name: "",
          id_code_or_personal_number: "",
          legal_or_actual_address: "",
          bank_account_details: "",
          representative_name: "",
          contact_info: "",
          contract_start_period: new Date().toISOString().split('T')[0],
          service_description: "",
          service_price: "",
          payment_terms: "",
          service_location: "",
          contract_duration: "",
          contract_responsible_person: "",
          limit_type: "",
          limit_amount: "",
          consignment_term: "",
          place_time_of_delivery: "",
          product_cost: "",
          payment_term: "",
          means_of_securing_obligation: "",
          notary_agreement: false,
          file_path: null,
        });
        setSelectedFile(null);
        setactiveTab(4);
        setPassedSteps((prevSteps) => [...prevSteps, 4]);
        setErrors({});
      }
    } catch (error) {
      toast.dismiss("submitProgress");

      console.error("Error creating agreement:", error);

      if (error.response) {
        // Handle specific API error responses
        switch (error.response.status) {
          case 400:
            toast.error("არასწორი მონაცემები. გთხოვთ შეამოწმოთ შეყვანილი ინფორმაცია");
            break;
          case 401:
            toast.error("გთხოვთ გაიაროთ ავტორიზაცია");
            break;
          case 413:
            toast.error("ფაილის ზომა ძალიან დიდია");
            break;
          case 422:
            // Handle validation errors from backend
            const validationErrors = error.response.data.errors;
            Object.keys(validationErrors).forEach(key => {
              toast.error(validationErrors[key][0]);
            });
            break;
          case 500:
            toast.error("სერვერის შეცდომა. გთხოვთ სცადოთ მოგვიანებით");
            break;
          default:
            toast.error("დაფიქსირდა შეცდომა. გთხოვთ სცადოთ მოგვიანებით");
        }
      } else if (error.request) {
        // Handle network errors
        toast.error("კავშირის შეცდომა. გთხოვთ შეამოწმოთ ინტერნეტ კავშირი");
      } else {
        toast.error("დაფიქსირდა შეცდომა. გთხოვთ სცადოთ მოგვიანებით");
      }
    }
  };

  function toggleTab(tab) {
    if (activeTab !== tab) {
      if (tab === 4 && activeTab === 3) {
        handleSubmit();
      } else {
        var modifiedSteps = [...passedSteps, tab];
        if (tab >= 1 && tab <= 4) {
          setactiveTab(tab);
          setPassedSteps(modifiedSteps);
        }
      }
    }
  }

  const handleFileChange = (e) => {
    try {
      const file = e.target.files[0];

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel'];
      if (file && !allowedTypes.includes(file.type)) {
        toast.error("არასწორი ფაილის ფორმატი. დასაშვებია მხოლოდ PDF, DOC, DOCX, XLSX ფაილები");
        return;
      }

      // Validate file size (5MB limit)
      if (file && file.size > 5 * 1024 * 1024) {
        toast.error("ფაილის ზომა არ უნდა აღემატებოდეს 5MB-ს");
        return;
      }

      setSelectedFile(file);
      setFormData(prevData => ({
        ...prevData,
        file_path: file
      }));

      // Clear any existing file errors
      setErrors(prevErrors => ({
        ...prevErrors,
        file_path: ""
      }));
    } catch (error) {
      console.error("File handling error:", error);
      toast.error("შეცდომა ფაილის დამუშავებისას");
    }
  };

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
        <Container fluid={true}>
          <Breadcrumbs
            title="იურიდიული დეპარტამენტი"
            breadcrumbItem="ხელშეკრულების მოთხოვნის ფორმა"
          />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="wizard clearfix">
                    <div className="steps clearfix">
                      <ul>
                        <NavItem
                          className={classnames({ current: activeTab === 1 })}
                        >
                          <NavLink
                            className={classnames({ current: activeTab === 1 })}
                            onClick={() => {
                              setactiveTab(1);
                            }}
                            disabled={!(passedSteps || []).includes(1)}
                          >
                            <span className="number">1.</span> ინფორმაცია 1
                          </NavLink>
                        </NavItem>
                        <NavItem
                          className={classnames({ current: activeTab === 2 })}
                        >
                          <NavLink
                            className={classnames({ active: activeTab === 2 })}
                            onClick={() => {
                              setactiveTab(2);
                            }}
                            disabled={!(passedSteps || []).includes(2)}
                          >
                            <span className="number">2.</span> ინფორმაცია 2
                          </NavLink>
                        </NavItem>
                        <NavItem
                          className={classnames({ current: activeTab === 3 })}
                        >
                          <NavLink
                            className={classnames({ active: activeTab === 3 })}
                            onClick={() => {
                              setactiveTab(3);
                            }}
                            disabled={!(passedSteps || []).includes(3)}
                          >
                            <span className="number">3.</span> დამატებითი ინფორმაცია
                          </NavLink>
                        </NavItem>
                      </ul>
                    </div>
                    <div className="content clearfix">
                      <TabContent activeTab={activeTab} className="body">
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
                                    className="form-control"
                                    id="performer_name"
                                    value={formData.performer_name}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ კონტრაგენტის სრული დასახელება..."
                                  />
                                  {errors.performer_name && (
                                    <div className="text-danger mt-1">{errors.performer_name}</div>
                                  )}
                                </div>
                              </Col>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="id_code_or_personal_number">
                                    საიდ���ნტიფიკაციო კოდი ან პირადი ნომერი
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="id_code_or_personal_number"
                                    value={formData.id_code_or_personal_number}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ საიდენტიფიკაციო კოდი ან პირადი ნომერი..."
                                  />
                                  {errors.id_code_or_personal_number && (
                                    <div className="text-danger mt-1">
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
                                    იურიდიული მისა���ართი / ფაქტიური მისამართი
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="legal_or_actual_address"
                                    value={formData.legal_or_actual_address}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ იურიდიული ან ფაქტიური მისამართი..."
                                  />
                                  {errors.legal_or_actual_address && (
                                    <div className="text-danger mt-1">
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
                                    className="form-control"
                                    id="contact_info"
                                    value={formData.contact_info}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ საკონტაქტო ინფორმაცია..."
                                  />
                                  {errors.contact_info && (
                                    <div className="text-danger mt-1">
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
                                    className="form-control"
                                    id="representative_name"
                                    value={formData.representative_name}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ დირექტორის ან წარმომადგენლის სახელი..."
                                  />
                                  {errors.representative_name && (
                                    <div className="text-danger mt-1">
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
                                  <Label for="consignment_term">კონსიგნაციის ვადა</Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="consignment_term"
                                    value={formData.consignment_term}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ კონსიგნაციის ვადა..."
                                  />
                                  {errors.consignment_term && (
                                    <div className="text-danger mt-1">
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
                                    className="form-control"
                                    id="place_time_of_delivery"
                                    value={formData.place_time_of_delivery}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ მიწოდების ადგილი და დრო..."
                                  />
                                  {errors.place_time_of_delivery && (
                                    <div className="text-danger mt-1">
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
                                    className="form-control"
                                    id="product_cost"
                                    value={formData.product_cost}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ პროდუქტის ღირებულება..."
                                  />
                                  {errors.product_cost && (
                                    <div className="text-danger mt-1">
                                      {errors.product_cost}
                                    </div>
                                  )}
                                </div>
                              </Col>

                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="payment_term">
                                    გადახდის ვადა
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="payment_term"
                                    value={formData.payment_term}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ გადახდის ვადა..."
                                  />
                                  {errors.payment_term && (
                                    <div className="text-danger mt-1">
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
                                    className="form-control"
                                    id="bank_account_details"
                                    value={formData.bank_account_details}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ საბანკო რეკვიზიტები..."
                                  />
                                  {errors.bank_account_details && (
                                    <div className="text-danger mt-1">
                                      {errors.bank_account_details}
                                    </div>
                                  )}
                                </div>
                              </Col>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="file_path">დოკუმენტის ატვირთვა</Label>
                                  <div className="custom-file">
                                    <Input
                                      type="file"
                                      className={`custom-file-input ${errors.file_path ? 'is-invalid' : ''}`}
                                      id="file_path"
                                      onChange={handleFileChange}
                                      accept=".pdf,.doc,.docx,.xlsx"
                                    />
                                    {selectedFile && (
                                      <div className="mt-2">
                                        არჩეული ფაილი: {selectedFile.name}
                                      </div>
                                    )}
                                    {errors.file_path && (
                                      <div className="invalid-feedback">
                                        {errors.file_path}
                                      </div>
                                    )}
                                  </div>
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
                                    className="form-control"
                                    id="means_of_securing_obligation"
                                    value={formData.means_of_securing_obligation}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ ვალდებულების უზრუნველყოფის საშუალება..."
                                  />
                                  {errors.means_of_securing_obligation && (
                                    <div className="text-danger mt-1">
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
                                    className="form-control"
                                    id="initiator_name_signature"
                                    value={formData.initiator_name_signature}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ ინიციატორის სახელი და გვარი..."
                                  />
                                  {errors.initiator_name_signature && (
                                    <div className="text-danger mt-1">
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
                                    className="form-control"
                                    id="manager_name_signature"
                                    value={formData.manager_name_signature}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ ხელმძღვანელის სახელი და გვარი..."
                                  />
                                  {errors.manager_name_signature && (
                                    <div className="text-danger mt-1">
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
                    <div className="actions clearfix">
                      <ul>
                        <li
                          className={
                            activeTab === 1 ? "previous disabled" : "previous"
                          }
                        >
                          <Link
                            to="#"
                            onClick={() => {
                              toggleTab(activeTab - 1);
                            }}
                          >
                            წინა გვერდი
                          </Link>
                        </li>
                        <li
                          className={activeTab === 4 ? "next disabled" : "next"}
                        >
                          <Link
                            to="#"
                            onClick={() => {
                              toggleTab(activeTab + 1);
                            }}
                          >
                            შემდეგი გვერდი
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default LawyerPage;