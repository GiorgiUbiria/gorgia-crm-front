// import React, { useState } from "react";
// import {
//   Card,
//   CardBody,
//   Col,
//   Container,
//   Form,
//   Input,
//   Label,
//   NavItem,
//   NavLink,
//   Row,
//   TabContent,
//   TabPane,
// } from "reactstrap";
// import classnames from "classnames";
// import { Link } from "react-router-dom";

// // Import Breadcrumb
// import Breadcrumbs from "../../components/Common/Breadcrumb";
// import { createAgreement } from "services/agreement";

// const LawyerPage = () => {
//   // Meta title
//   document.title = "ხელშეკრულების მოთხოვნის ფორმა - Georgia LLC";

//   const [activeTab, setactiveTab] = useState(1);
//   const [passedSteps, setPassedSteps] = useState([1]);
//   const [errors, setErrors] = useState({}); // State for validation errors

//   // State for form inputs
//   const [formData, setFormData] = useState({
//     user_id: "",
//     performer_name: "",
//     id_code_or_personal_number: "",
//     legal_or_actual_address: "",
//     bank_account_details: "",
//     representative_name: "",
//     contact_info: "",
//     contract_start_period: new Date().toISOString().split('T')[0],
//     service_description: "",
//     service_price: "",
//     payment_terms: "",
//     service_location: "",
//     contract_duration: "",
//     contract_responsible_person: "",
//     limit_type: "", // New field
//     limit_amount: "", // New field
//     consignment_term: "", // New field
//     place_time_of_delivery: "", // New field
//     product_cost: "", // New field
//     payment_term: "", // New field
//     means_of_securing_obligation: "", // New field
//     notary_agreement: false, // New field (boolean)
//   });

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [id]: value,
//     }));

//     validateField(id, value);
//   };

//   const validateField = (field, value) => {
//     let errorMsg = "";

//     switch (field) {
//       case "performer_name":
//         if (!value) errorMsg = "შემსრულებლის სრული დასახელება აუცილებელია";
//         break;
//       case "id_code_or_personal_number":
//         if (!value) errorMsg = "საიდენტიფიკაციო კოდი ან პირადი ნომერი აუცილებელია";
//         break;
//       case "legal_or_actual_address":
//         if (!value) errorMsg = "იურიდიული მისამართი / ფაქტიური მისამართი აუცილებელია";
//         break;
//       case "bank_account_details":
//         if (!value) errorMsg = "საბანკო რეკვიზიტები აუცილებელია";
//         break;
//       case "contact_info":
//         if (!value) errorMsg = "საკონტაქტო ინფორმაცია (ტელ, ელ-ფოსტა) აუცილებელია";
//         break;
//       case "contract_start_period":
//         if (!value) errorMsg = "ხელშეკრულების მოქმედების ვადის ათვლის პერიოდი აუცილებელია";
//         break;
//       case "service_description":
//         if (!value) errorMsg = "მომსახურების საგანი აუცილებელია";
//         break;
//       case "service_price":
//         if (!value || isNaN(value)) errorMsg = "მომსახურების ფასი უნდა იყოს ციფრი";
//         break;
//       case "payment_terms":
//         if (!value) errorMsg = "გადახდის პირობები/გადახდის განსხვავებული პირობები აუცილებელია";
//         break;
//       case "service_location":
//         if (!value) errorMsg = "მომსახურების გაწევის ადგილი აუცილებელია";
//         break;
//       case "contract_duration":
//         if (!value) errorMsg = "ხელშეკრულების მოქმედების ვადა აუცილებელია";
//         break;
//       case "contract_responsible_person":
//         if (!value) errorMsg = "ხელშეკრულების გაფორმების ინიციატორი და შესრულებაზე პასუხისმგებელი პირი აუცილებელია";
//         break;
//       default:
//         break;
//     }

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [field]: errorMsg,
//     }));
//   };

//   // Function to validate all form data before submission
//   const validateForm = () => {
//     const newErrors = {};

//     Object.keys(formData).forEach((field) => {
//       validateField(field, formData[field]);
//     });

//     return Object.keys(newErrors).length === 0;
//   };

//   // Function to handle form submission
//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     try {
//       const response = await createAgreement(formData);

//       setFormData({
//         user_id: "",
//         performer_name: "",
//         id_code_or_personal_number: "",
//         legal_or_actual_address: "",
//         bank_account_details: "",
//         representative_name: "",
//         contact_info: "",
//         contract_start_period: new Date().toISOString().split('T')[0],
//         service_description: "",
//         service_price: "",
//         payment_terms: "",
//         service_location: "",
//         contract_duration: "",
//         contract_responsible_person: "",
//         limit_type: "", 
//         limit_amount: "", 
//         consignment_term: "", 
//         place_time_of_delivery: "", 
//         product_cost: "", 
//         payment_term: "", 
//         means_of_securing_obligation: "", 
//         notary_agreement: false, 
//       });

//       setactiveTab(4);
//       setPassedSteps((prevSteps) => [...prevSteps, 4]);
//       setErrors({}); 
//     } catch (error) {
//       console.error("Error creating agreement:", error);
//       alert("Error creating agreement. Please try again.");
//     }
//   };

//   // Modified toggleTab function
//   function toggleTab(tab) {
//     if (activeTab !== tab) {
//       if (tab === 4 && activeTab === 3) {
//         handleSubmit();
//       } else {
//         var modifiedSteps = [...passedSteps, tab];
//         if (tab >= 1 && tab <= 3) {
//           setactiveTab(tab);
//           setPassedSteps(modifiedSteps);
//         }
//       }
//     }
//   }

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid={true}>
//           <Breadcrumbs
//             title="იურიდიული დეპარტამენტი"
//             breadcrumbItem="ხელშეკრულების მოთხოვნის ფორმა"
//           />

//           <Row>
//             <Col lg="12">
//               <Card>
//                 <CardBody>
//                   <div className="wizard clearfix">
//                     <div className="steps clearfix">
//                       <ul>
//                         <NavItem
//                           className={classnames({ current: activeTab === 1 })}
//                         >
//                           <NavLink
//                             className={classnames({ current: activeTab === 1 })}
//                             onClick={() => {
//                               setactiveTab(1);
//                             }}
//                             disabled={!(passedSteps || []).includes(1)}
//                           >
//                             <span className="number">1.</span> ინფორმაცია
//                           </NavLink>
//                         </NavItem>
//                         <NavItem
//                           className={classnames({ current: activeTab === 2 })}
//                         >
//                           <NavLink
//                             className={classnames({ active: activeTab === 2 })}
//                             onClick={() => {
//                               setactiveTab(2);
//                             }}
//                             disabled={!(passedSteps || []).includes(2)}
//                           >
//                             <span className="number">2.</span> ხელშეკრულების საგანი და პირობები
//                           </NavLink>
//                         </NavItem>
//                         <NavItem
//                           className={classnames({ current: activeTab === 3 })}
//                         >
//                           <NavLink
//                             className={classnames({ active: activeTab === 3 })}
//                             onClick={() => {
//                               setactiveTab(3);
//                             }}
//                             disabled={!(passedSteps || []).includes(3)}
//                           >
//                             <span className="number">3.</span> დამატებითი პირობები
//                           </NavLink>
//                         </NavItem>
//                       </ul>
//                     </div>
//                     <div className="content clearfix">
//                       <TabContent activeTab={activeTab} className="body">
//                         {/* First Tab */}
//                         <TabPane tabId={1}>
//                           <Form>
//                             <Row>
//                               <Col lg="6">
//                                 <div className="mb-3">
//                                   <Label for="performer_name">
//                                     კონტრაგენტის სრული დასახელება
//                                   </Label>
//                                   <Input
//                                     type="text"
//                                     className="form-control"
//                                     id="performer_name"
//                                     value={formData.performer_name}
//                                     onChange={handleInputChange}
//                                     placeholder="ჩაწერეთ კონტრაგენტის სრული დასახელება..."
//                                   />
//                                   {errors.performer_name && (
//                                     <div className="text-danger mt-1">{errors.performer_name}</div>
//                                   )}
//                                 </div>
//                               </Col>
//                               <Col lg="6">
//                                 <div className="mb-3">
//                                   <Label for="id_code_or_personal_number">
//                                     საიდენტიფიკაციო კოდი ან პირადი ნომერი
//                                   </Label>
//                                   <Input
//                                     type="text"
//                                     className="form-control"
//                                     id="id_code_or_personal_number"
//                                     value={formData.id_code_or_personal_number}
//                                     onChange={handleInputChange}
//                                     placeholder="ჩაწერეთ საიდენტიფიკაციო კოდი ან პირადი ნომერი..."
//                                   />
//                                                                     {errors.id_code_or_personal_number && (
//                                     <div className="text-danger mt-1">
//                                       {errors.id_code_or_personal_number}
//                                     </div>
//                                   )}
//                                 </div>
//                               </Col>
//                             </Row>

//                             <Row>
//                               <Col lg="6">
//                                 <div className="mb-3">
//                                   <Label for="legal_or_actual_address">
//                                     იურიდიული მისამართი / ფაქტიური მისამართი
//                                   </Label>
//                                   <Input
//                                     type="text"
//                                     className="form-control"
//                                     id="legal_or_actual_address"
//                                     value={formData.legal_or_actual_address}
//                                     onChange={handleInputChange}
//                                     placeholder="ჩაწერეთ იურიდიული ან ფაქტიური მისამართი..."
//                                   />
//                                   {errors.legal_or_actual_address && (
//                                     <div className="text-danger mt-1">
//                                       {errors.legal_or_actual_address}
//                                     </div>
//                                   )}
//                                 </div>
//                               </Col>

//                               <Col lg="6">
//                                 <div className="mb-3">
//                                   <Label for="bank_account_details">
//                                     საბანკო რეკვიზიტები
//                                   </Label>
//                                   <Input
//                                     type="text"
//                                     className="form-control"
//                                     id="bank_account_details"
//                                     value={formData.bank_account_details}
//                                     onChange={handleInputChange}
//                                     placeholder="ჩაწერეთ საბანკო რეკვიზიტები..."
//                                   />
//                                   {errors.bank_account_details && (
//                                     <div className="text-danger mt-1">
//                                       {errors.bank_account_details}
//                                     </div>
//                                   )}
//                                 </div>
//                               </Col>
//                             </Row>

//                             <Row>
//                               <Col lg="6">
//                                 <div className="mb-3">
//                                   <Label for="representative_name">
//                                     დირექტორი ან წარმომადგენელი
//                                   </Label>
//                                   <Input
//                                     type="text"
//                                     className="form-control"
//                                     id="representative_name"
//                                     value={formData.representative_name}
//                                     onChange={handleInputChange}
//                                     placeholder="ჩაწერეთ დირექტორის ან წარმომადგენლის სახელი..."
//                                   />
//                                   {errors.representative_name && (
//                                     <div className="text-danger mt-1">
//                                       {errors.representative_name}
//                                     </div>
//                                   )}
//                                 </div>
//                               </Col>

//                               <Col lg="6">
//                                 <div className="mb-3">
//                                   <Label for="contact_info">
//                                     საკონტაქტო ინფორმაცია (ტელეფონი, ელ.ფოსტა)
//                                   </Label>
//                                   <Input
//                                     type="text"
//                                     className="form-control"
//                                     id="contact_info"
//                                     value={formData.contact_info}
//                                     onChange={handleInputChange}
//                                     placeholder="ჩაწერეთ საკონტაქტო ინფორმაცია..."
//                                   />
//                                   {errors.contact_info && (
//                                     <div className="text-danger mt-1">
//                                       {errors.contact_info}
//                                     </div>
//                                   )}
//                                 </div>
//                               </Col>
//                             </Row>

//                             <Row>
//                               <Col lg="12">
//                                 <div className="mb-3">
//                                   <Label for="contract_start_period">
//                                     ხელშეკრულების მოქმედების ვადა
//                                   </Label>
//                                   <Input
//                                     type="date"
//                                     id="contract_start_period"
//                                     className="form-control"
//                                     value={formData.contract_start_period}
//                                     onChange={handleInputChange}
//                                   />
//                                   {errors.contract_start_period && (
//                                     <div className="text-danger mt-1">
//                                       {errors.contract_start_period}
//                                     </div>
//                                   )}
//                                 </div>
//                               </Col>
//                             </Row>
//                           </Form>
//                         </TabPane>

//                         {/* Second Tab for Service Details */}
//                         <TabPane tabId={2}>
//                           <Form>
//                             <Row>
//                               <Col lg="6">
//                                 <div className="mb-3">
//                                   <Label for="service_description">
//                                     მომსახურების საგანი
//                                   </Label>
//                                   <Input
//                                     type="text"
//                                     className="form-control"
//                                     id="service_description"
//                                     value={formData.service_description}
//                                     onChange={handleInputChange}
//                                     placeholder="ჩაწერეთ მომსახურების საგანი..."
//                                   />
//                                   {errors.service_description && (
//                                     <div className="text-danger mt-1">
//                                       {errors.service_description}
//                                     </div>
//                                   )}
//                                 </div>
//                               </Col>

//                               <Col lg="6">
//                                 <div className="mb-3">
//                                   <Label for="service_price">
//                                     მომსახურების ფასი
//                                   </Label>
//                                   <Input
//                                     type="number"
//                                     className="form-control"
//                                     id="service_price"
//                                     value={formData.service_price}
//                                     onChange={handleInputChange}
//                                     placeholder="ჩაწერეთ მომსახურების ფასი..."
//                                   />
//                                   {errors.service_price && (
//                                     <div className="text-danger mt-1">
//                                       {errors.service_price}
//                                     </div>
//                                   )}
//                                 </div>
//                               </Col>
//                             </Row>

//                             <Row>
//                               <Col lg="6">
//                                 <div className="mb-3">
//                                   <Label for="payment_terms">
//                                     გადახდის პირობები
//                                   </Label>
//                                   <Input
//                                     type="text"
//                                     className="form-control"
//                                     id="payment_terms"
//                                     value={formData.payment_terms}
//                                     onChange={handleInputChange}
//                                     placeholder="ჩაწერეთ გადახდის პირობები..."
//                                   />
//                                   {errors.payment_terms && (
//                                     <div className="text-danger mt-1">
//                                       {errors.payment_terms}
//                                     </div>
//                                   )}
//                                 </div>
//                               </Col>

//                               <Col lg="6">
//                                 <div className="mb-3">
//                                   <Label for="service_location">
//                                     მომსახურების გაწევის ადგილი
//                                   </Label>
//                                   <Input
//                                     type="text"
//                                     className="form-control"
//                                     id="service_location"
//                                     value={formData.service_location}
//                                     onChange={handleInputChange}
//                                     placeholder="ჩაწერეთ მომსახურების გაწევის ადგილი..."
//                                   />
//                                   {errors.service_location && (
//                                     <div className="text-danger mt-1">
//                                       {errors.service_location}
//                                     </div>
//                                   )}
//                                 </div>
//                               </Col>
//                             </Row>

//                             <Row>
//                               <Col lg="6">
//                                 <div className="mb-3">
//                                   <Label for="contract_duration">
//                                     ხელშეკრულების მოქმედების ვადა
//                                   </Label>
//                                   <Input
//                                     type="date"
//                                     className="form-control"
//                                     id="contract_duration"
//                                     value={formData.contract_duration}
//                                     onChange={handleInputChange}
//                                   />
//                                   {errors.contract_duration && (
//                                     <div className="text-danger mt-1">
//                                       {errors.contract_duration}
//                                     </div>
//                                   )}
//                                 </div>
//                               </Col>

//                               <Col lg="6">
//                                 <div className="mb-3">
//                                   <Label for="contract_responsible_person">
//                                     ხელშეკრულების პასუხისმგებელი პირი
//                                   </Label>
//                                   <Input
//                                     type="text"
//                                     className="form-control"
//                                     id="contract_responsible_person"
//                                     value={formData.contract_responsible_person}
//                                     onChange={handleInputChange}
//                                     placeholder="ჩაწერეთ პასუხისმგებელი პირი..."
//                                   />
//                                   {errors.contract_responsible_person && (
//                                     <div className="text-danger mt-1">
//                                       {errors.contract_responsible_person}
//                                     </div>
//                                   )}
//                                 </div>
//                               </Col>
//                             </Row>
//                           </Form>
//                         </TabPane>

//                         {/* Third Tab for Additional Conditions */}
//                         <TabPane tabId={3}>
//                           <Form>
//                             <Row>
//                               <Col lg="6">
//                                 <div className="mb-3">
//                                   <Label for="limit_type">ლიმიტის ტიპი</Label>
//                                   <Input
//                                     type="text"
//                                     className="form-control"
//                                     id="limit_type"
//                                     value={formData.limit_type}
//                                     onChange={handleInputChange}
//                                     placeholder="ჩაწერეთ ლიმიტის ტიპი..."
//                                   />
//                                   {errors.limit_type && (
//                                     <div className="text-danger mt-1">
//                                       {errors.limit_type}
//                                     </div>
//                                   )}
//                                 </div>
//                               </Col>

//                               <Col lg="6">
//                                 <div className="mb-3">
//                                   <Label for="limit_amount">ლიმიტის თანხა</Label>
//                                   <Input
//                                     type="number"
//                                     className="form-control"
//                                     id="limit_amount"
//                                     value={formData.limit_amount}
//                                     onChange={handleInputChange}
//                                     placeholder="ჩაწერეთ ლიმიტის თანხა..."
//                                   />
//                                   {errors.limit_amount && (
//                                     <div className="text-danger mt-1">
//                                       {errors.limit_amount}
//                                     </div>
//                                   )}
//                                 </div>
//                               </Col>
//                             </Row>

//                             <Row>
//                               <Col lg="6">
//                                 <div className="mb-3">
//                                   <Label for="consignment_term">კონსიგნაციის ვადა</Label>
//                                   <Input
//                                     type="text"
//                                     className="form-control"
//                                     id="consignment_term"
//                                     value={formData.consignment_term}
//                                     onChange={handleInputChange}
//                                     placeholder="ჩაწერეთ კონსიგნაციის ვადა..."
//                                   />
//                                   {errors.consignment_term && (
//                                     <div className="text-danger mt-1">
//                                       {errors.consignment_term}
//                                       </div>
//                                   )}
//                                 </div>
//                               </Col>

//                               <Col lg="6">
//                                 <div className="mb-3">
//                                   <Label for="place_time_of_delivery">
//                                     მიწოდების ადგილი/დრო
//                                   </Label>
//                                   <Input
//                                     type="text"
//                                     className="form-control"
//                                     id="place_time_of_delivery"
//                                     value={formData.place_time_of_delivery}
//                                     onChange={handleInputChange}
//                                     placeholder="ჩაწერეთ მიწოდების ადგილი და დრო..."
//                                   />
//                                   {errors.place_time_of_delivery && (
//                                     <div className="text-danger mt-1">
//                                       {errors.place_time_of_delivery}
//                                     </div>
//                                   )}
//                                 </div>
//                               </Col>
//                             </Row>

//                             <Row>
//                               <Col lg="6">
//                                 <div className="mb-3">
//                                   <Label for="product_cost">
//                                     პროდუქტის ღირებულება
//                                   </Label>
//                                   <Input
//                                     type="number"
//                                     className="form-control"
//                                     id="product_cost"
//                                     value={formData.product_cost}
//                                     onChange={handleInputChange}
//                                     placeholder="ჩაწერეთ პროდუქტის ღირებულება..."
//                                   />
//                                   {errors.product_cost && (
//                                     <div className="text-danger mt-1">
//                                       {errors.product_cost}
//                                     </div>
//                                   )}
//                                 </div>
//                               </Col>

//                               <Col lg="6">
//                                 <div className="mb-3">
//                                   <Label for="payment_term">
//                                     გადახდის ვადა
//                                   </Label>
//                                   <Input
//                                     type="text"
//                                     className="form-control"
//                                     id="payment_term"
//                                     value={formData.payment_term}
//                                     onChange={handleInputChange}
//                                     placeholder="ჩაწერეთ გადახდის ვადა..."
//                                   />
//                                   {errors.payment_term && (
//                                     <div className="text-danger mt-1">
//                                       {errors.payment_term}
//                                     </div>
//                                   )}
//                                 </div>
//                               </Col>
//                             </Row>

//                             <Row>
//                               <Col lg="6">
//                                 <div className="mb-3">
//                                   <Label for="means_of_securing_obligation">
//                                     ვალდებულების უზრუნველყოფის საშუალება
//                                   </Label>
//                                   <Input
//                                     type="text"
//                                     className="form-control"
//                                     id="means_of_securing_obligation"
//                                     value={formData.means_of_securing_obligation}
//                                     onChange={handleInputChange}
//                                     placeholder="ჩაწერეთ ვალდებულების უზრუნველყოფის საშუალება..."
//                                   />
//                                   {errors.means_of_securing_obligation && (
//                                     <div className="text-danger mt-1">
//                                       {errors.means_of_securing_obligation}
//                                     </div>
//                                   )}
//                                 </div>
//                               </Col>

//                               <Col lg="6">
//                                 <div className="mb-3">
//                                   <Label for="notary_agreement">
//                                     ნოტარიული ხელშეკრულება
//                                   </Label>
//                                   <Input
//                                     type="checkbox"
//                                     className="form-check-input"
//                                     id="notary_agreement"
//                                     checked={formData.notary_agreement}
//                                     onChange={(e) =>
//                                       setFormData((prevData) => ({
//                                         ...prevData,
//                                         notary_agreement: e.target.checked,
//                                       }))
//                                     }
//                                   />
//                                 </div>
//                               </Col>
//                             </Row>

                            
//                           </Form>
//                         </TabPane>
//                         <TabPane tabId={4}>
//                           <div className="row justify-content-center">
//                             <Col lg="6">
//                               <div className="text-center">
//                                 <div className="mb-4">
//                                   <i className="mdi mdi-check-circle-outline text-success display-4" />
//                                 </div>
//                                 <div>
//                                   <h5>Confirm Detail</h5>
//                                   <p className="text-muted">
//                                     თქვენი შეკვეთა წარმატებით შესრულდა.
//                                   </p>
//                                 </div>
//                               </div>
//                             </Col>
//                           </div>
//                         </TabPane>
//                         {/* <TabPane tabId={4}>
//                           <div className="text-center">
//                             <h4 className="text-success">შეკვეთა წარმატებით დასრულდა!</h4>
//                             <p>თქვენი შეკვეთა წარმატებით შესრულდა.</p>
//                             <Link to="/" className="btn btn-primary">მთავარი გვერდი</Link>
//                           </div>
//                         </TabPane> */}
//                       </TabContent>
//                     </div>

//                     <div className="actions clearfix">
//                       <ul>
//                         <li
//                           className={
//                             activeTab === 1 ? "previous disabled" : "previous"
//                           }
//                         >
//                           <Link
//                             to="#"
//                             onClick={() => {
//                               toggleTab(activeTab - 1);
//                             }}
//                           >
//                             წინა გვერდი
//                           </Link>
//                         </li>
//                         <li
//                           className={activeTab === 4 ? "next disabled" : "next"}
//                         >
//                           <Link
//                             to="#"
//                             onClick={() => {
//                               toggleTab(activeTab + 1);
//                             }}
//                           >
//                             შემდეგი გვერდი
//                           </Link>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </React.Fragment>
//   );
// };

// export default LawyerPage;



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

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { createAgreement } from "services/agreement";

const LawyerPage = () => {
  // Meta title
  document.title = "ხელშეკრულების მოთხოვნის ფორმა - Georgia LLC";

  const [activeTab, setactiveTab] = useState(1);
  const [passedSteps, setPassedSteps] = useState([1]);
  const [errors, setErrors] = useState({});

  // State for form inputs
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
    limit_type: "", // New field
    limit_amount: "", // New field
    consignment_term: "", // New field
    place_time_of_delivery: "", // New field
    product_cost: "", // New field
    payment_term: "", // New field
    means_of_securing_obligation: "", // New field
    notary_agreement: false, // New field (boolean)
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

    switch (field) {
      case "performer_name":
        if (!value) errorMsg = "შემსრულებლის სრული დასახელება აუცილებელია";
        break;
      case "id_code_or_personal_number":
        if (!value) errorMsg = "საიდენტიფიკაციო კოდი ან პირადი ნომერი აუცილებელია";
        break;
      case "legal_or_actual_address":
        if (!value) errorMsg = "იურიდიული მისამართი / ფაქტიური მისამართი აუცილებელია";
        break;
      case "bank_account_details":
        if (!value) errorMsg = "საბანკო რეკვიზიტები აუცილებელია";
        break;
      case "contact_info":
        if (!value) errorMsg = "საკონტაქტო ინფორმაცია (ტელ, ელ-ფოსტა) აუცილებელია";
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
        if (!value) errorMsg = "გადახდის პირობები/გადახდის განსხვავებული პირობები აუცილებელია";
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
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: errorMsg,
    }));
  };

  // Function to validate all form data before submission
  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field]);
    });

    return Object.keys(newErrors).length === 0;
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await createAgreement(formData);

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
        initiator_name_signature: "", 
        manager_name_signature: "", 
        notary_agreement: false, 
      });

      setactiveTab(4); 
      setPassedSteps((prevSteps) => [...prevSteps, 4]);
      setErrors({});
    } catch (error) {
      console.error("Error creating agreement:", error);
      alert("Error creating agreement. Please try again.");
    }
  };

  // Modified toggleTab function
  function toggleTab(tab) {
    if (activeTab !== tab) {
      if (tab === 4 && activeTab === 3) {
        handleSubmit(); // Validate and submit form on tab 3
      } else {
        var modifiedSteps = [...passedSteps, tab];
        if (tab >= 1 && tab <= 4) {
          setactiveTab(tab);
          setPassedSteps(modifiedSteps);
        }
      }
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
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
                        {/* First Tab */}
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
                                    საიდენტიფიკაციო კოდი ან პირადი ნომერი
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
                                    იურიდიული მისამართი / ფაქტიური მისამართი
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

                              {/* <Col lg="6">
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
                              </Col> */}
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

                        {/* Second Tab for Additional Conditions */}
                        <TabPane tabId={2}>
                          <Form>
                            <Row>
                              {/* <Col lg="6">
                                <div className="mb-3">
                                  <Label for="limit_type">ლიმიტის ტიპი</Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="limit_type"
                                    value={formData.limit_type}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ ლიმიტის ტიპი..."
                                  />
                                  {errors.limit_type && (
                                    <div className="text-danger mt-1">
                                      {errors.limit_type}
                                    </div>
                                  )}
                                </div>
                              </Col> */}

                              {/* <Col lg="6">
                                <div className="mb-3">
                                  <Label for="limit_amount">ლიმიტის თანხა</Label>
                                  <Input
                                    type="number"
                                    className="form-control"
                                    id="limit_amount"
                                    value={formData.limit_amount}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ ლიმიტის თანხა..."
                                  />
                                  {errors.limit_amount && (
                                    <div className="text-danger mt-1">
                                      {errors.limit_amount}
                                    </div>
                                  )}
                                </div>
                              </Col> */}
                            </Row>

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
                                    პროდუქტის ღირებულება
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
                           
                            </Row>

                            {/* Added bank_account_details, place_time_of_delivery, payment_term here */}
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

                              {/* <Col lg="6">
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
                              </Col> */}
{/* 
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
                              </Col> */}
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

                        {/* Success Page */}
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



