import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormFeedback,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { createHrDocument, getCurrentUserHrDocuments } from "services/hrDocument";
import { fetchUser, updateUser } from "services/user";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const HrPage = () => {
  document.title = "ვიზირება | Gorgia LLC";

  const [hrDocuments, setHrDocuments] = useState([]);
  const [modal, setModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);
  const [documentType, setDocumentType] = useState(""); 
  const dispatch = useDispatch();

  const reduxUser = useSelector((state) => state.user.user);
  const [currentUser, setCurrentUser] = useState(reduxUser);


  console.log(currentUser);
  

  useEffect(() => {
    setCurrentUser(reduxUser); 
  }, [reduxUser]);

  const fetchHrDocuments = async () => {
    try {
      const response = await getCurrentUserHrDocuments();
      setHrDocuments(response.data);
    } catch (err) {
      console.error("Error fetching HR documents:", err);
    }
  };

  useEffect(() => {
    fetchHrDocuments();
  }, []);

  const handleCreateDocument = async (type) => {
    setDocumentType(type);

    if (!currentUser?.id_number || !currentUser?.position || !currentUser?.working_start_date) {
      setModal(true);
      return;
    }

    if (type === "paid") {
      setModal(true);
      return;
    }

    try {
      const documentName = "უხელფასო ცნობა";

      const response = await createHrDocument({ name: documentName });
      setHrDocuments([...hrDocuments, response.data]);
    } catch (err) {
      console.error("Error creating HR document:", err);
    }
  };

  const handleUpdateUser = async (values) => {
    try {
      const updatedUser = {
        id_number: values.id_number || currentUser.id_number,
        position: values.position || currentUser.position,
        working_start_date: values.working_start_date || currentUser.working_start_date,
      };

      await updateUser(updatedUser);

      const updatedUserResponse = await fetchUser();
      dispatch({ type: "UPDATE_USER", payload: updatedUserResponse.data });
      setCurrentUser(updatedUserResponse.data);

      setModal(false);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleCreatePaidDocumentWithPurpose = async (values) => {
    try {
      const documentName = "ხელფასიანი ცნობა";
      const response = await createHrDocument({
        name: documentName,
        purpose: values.purpose,
      });

      setHrDocuments([...hrDocuments, response.data]);

      setModal(false);
    } catch (err) {
      console.error("Error creating paid HR document:", err);
    }
  };

  const getRowClass = (status) => {
    switch (status) {
      case "rejected":
        return "table-danger";
      case "approved":
        return "table-success";
      case "in_progress":
        return "table-warning";
      default:
        return "";
    }
  };

  const handleRowClick = (index) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter((id) => id !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    id_number: Yup.string().required("პირადი ნომერი აუცილებელია"),
    position: Yup.string().required("პოზიცია აუცილებელია"),
    working_start_date: Yup.date().required("სამსახურის დაწყების თარიღი აუცილებელია"),
    purpose: documentType === "paid" ? Yup.string().required("მიზანი აუცილებელია") : Yup.string(),
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="HR" breadcrumbItem="მოთხოვნილი ცნობები" />

          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">მოთხოვნილი ცნობები</CardTitle>
                  {currentUser && (
                    <div className="mb-4">
                      <strong>მომხმარებელი:</strong> {currentUser.name || "უცნობი"} (ID:{" "}
                      {currentUser.id_number || "უცნობი"}, პოზიცია: {currentUser.position || "უცნობი"})
                    </div>
                  )}
                  <CardSubtitle className="card-title-desc d-flex justify-content-between align-items-center">
                    <div>
                      ქვევით ნაჩვენებია უკვე დადასტურებული ან უარყოფილი მოთხოვნილი ცნობები
                    </div>
                    <div>
                      <Button
                        type="button"
                        color="primary"
                        className="me-1"
                        onClick={() => handleCreateDocument("paid")}
                      >
                        ხელფასიანი ცნობის მოთხოვნა
                      </Button>
                      <Button
                        type="button"
                        color="success"
                        onClick={() => handleCreateDocument("unpaid")}
                      >
                        უხელფასო ცნობის მოთხოვნა
                      </Button>
                    </div>
                  </CardSubtitle>

                  <div className="table-responsive">
                    <Table className="table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>მომთხოვნი პირი</th>
                          <th>ID ნომერი</th>
                          <th>სამსახურის დაწყების თარიღი</th>
                          <th>ცნობის მოთხოვნის თარიღი</th>
                          <th>მოთხოვნილი ცნობის ფორმა</th>
                          <th>ვიზირება</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hrDocuments.map((document, index) => (
                          <React.Fragment key={document.id}>
                            <tr
                              className={getRowClass(document.status)}
                              onClick={() => handleRowClick(index)}
                              style={{ cursor: "pointer" }}
                            >
                              <th scope="row">{index + 1}</th>
                              <td>{document.user?.name || "უცნობი"}</td>
                              <td>{document.user?.id_number || "უცნობი"}</td>
                              <td>
                                {document.user?.working_start_date
                                  ? new Date(document.user.working_start_date).toLocaleDateString("ka-GE")
                                  : "უცნობი"}
                              </td>
                              <td>
                                {document.created_at
                                  ? new Date(document.created_at).toLocaleDateString("ka-GE")
                                  : "უცნობი"}
                              </td>
                              <td>{document.name}</td>
                              <td>
                                {document.status === "rejected"
                                  ? "უარყოფილია"
                                  : document.status === "approved"
                                  ? "დადასტურებულია"
                                  : "მოლოდინში"}
                              </td>
                            </tr>

                            {expandedRows.includes(index) && (
                              <tr>
                                <td colSpan="7">
                                  <div className="p-3">
                                    <strong>კომენტარი:</strong>
                                    <p>{document.comment || "კომენტარი არ არის"}</p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      <Modal isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>
          {documentType === "paid" ? "მიზნის შეყვანა" : "მომხმარებლის განახლება"}
        </ModalHeader>
        <Formik
          initialValues={{
            id_number: currentUser?.id_number || "",
            position: currentUser?.position || "",
            working_start_date: currentUser?.working_start_date || "",
            purpose: "",
          }}
          validationSchema={validationSchema}
          onSubmit={documentType === "paid" ? handleCreatePaidDocumentWithPurpose : handleUpdateUser}
        >
          {({ values, handleChange, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <ModalBody>
                {!currentUser?.id_number && (
                  <>
                    <p>პირადი ნომრის განახლება:</p>
                    <Field
                      type="text"
                      name="id_number"
                      className="form-control"
                      placeholder="შეიყვანეთ ახალი პირადი ნომერი"
                    />
                    <ErrorMessage name="id_number" component={FormFeedback} />
                  </>
                )}

                {!currentUser?.position && (
                  <>
                    <p>პოზიციის განახლება:</p>
                    <Field
                      type="text"
                      name="position"
                      className="form-control"
                      placeholder="შეიყვანეთ ახალი პოზიცია"
                    />
                    <ErrorMessage name="position" component={FormFeedback} />
                  </>
                )}

                {!currentUser?.working_start_date && (
                  <>
                    <p>სამსახურის დაწყების თარიღი:</p>
                    <Field
                      type="date"
                      name="working_start_date"
                      className="form-control"
                      placeholder="შეიყვანეთ სამსახურის დაწყების თარიღი"
                    />
                    <ErrorMessage name="working_start_date" component={FormFeedback} />
                  </>
                )}

                {documentType === "paid" && currentUser?.id_number && currentUser?.position && currentUser?.working_start_date && (
                  <>
                    <p>მიზნის შეყვანა:</p>
                    <Field
                      type="text"
                      name="purpose"
                      className="form-control"
                      placeholder="შეიყვანეთ მიზანი"
                    />
                    <ErrorMessage name="purpose" component={FormFeedback} />
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" type="submit">
                  შენახვა
                </Button>
                <Button color="secondary" onClick={() => setModal(false)}>
                  დახურვა
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    </React.Fragment>
  );
};

export default HrPage;
