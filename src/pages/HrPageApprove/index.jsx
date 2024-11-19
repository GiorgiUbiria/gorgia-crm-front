import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import { getHrDocuments, updateHrDocumentStatus } from "services/hrDocument";

const HrPageApprove = ({ filterStatus }) => {
  document.title = "ვიზირება | Gorgia LLC";

  const [expandedRows, setExpandedRows] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [salary, setSalary] = useState("");
  const [salaryText, setSalaryText] = useState("");
  const [isRejection, setIsRejection] = useState(false);
  const [comment, setComment] = useState("");

  const toggleRow = (index) => {
    const isRowExpanded = expandedRows.includes(index);
    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter((rowIndex) => rowIndex !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await getHrDocuments();
      setDocuments(response.data);
    } catch (err) {
      console.error("Error fetching HR documents:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpdateStatus = async (documentId, status, event) => {
    event.stopPropagation();
    try {
      const document = documents.find((doc) => doc.id === documentId);
      setSelectedDocument(document);
  
      if (status === "approved") {
        // Check if the document name is 'უხელფასო ცნობა'
        if (document.name === "უხელფასო ცნობა") {
          // Directly update the status without showing the modal for salary
          const response = await updateHrDocumentStatus(documentId, "approved");
          setDocuments((prevDocuments) =>
            prevDocuments.map((doc) =>
              doc.id === documentId ? { ...doc, status: "approved" } : doc
            )
          );
          
          // Check if PDF path is present and generate the PDF
          if (response.status === 200 && response.data.pdf_path) {
            printPdf(response.data.pdf_path);
          }
          return; // Skip the modal and exit the function
        }
  
        // If not 'უხელფასო ცნობა', show modal to enter salary details
        setIsRejection(false);
        setModal(true);
      } else if (status === "rejected") {
        setIsRejection(true);
        setModal(true);
      } else {
        const response = await updateHrDocumentStatus(documentId, status);
        setDocuments((prevDocuments) =>
          prevDocuments.map((document) =>
            document.id === documentId ? { ...document, status } : document
          )
        );
  
        if (status === "approved" && response.status === 200 && response.data.pdf_path) {
          printPdf(response.data.pdf_path);
        }
      }
    } catch (err) {
      console.error("Error updating document status:", err);
    }
  };
  
  

  const handleSave = async () => {
    try {
      if (isRejection) {
        await updateHrDocumentStatus(selectedDocument.id, "rejected", {
          comment,
        });
        setDocuments((prevDocuments) =>
          prevDocuments.map((document) =>
            document.id === selectedDocument.id
              ? { ...document, status: "rejected", comment }
              : document
          )
        );
      } else {
        const response = await updateHrDocumentStatus(selectedDocument.id, "approved", {
          salary,
          salary_text: salaryText,
        });
        setDocuments((prevDocuments) =>
          prevDocuments.map((document) =>
            document.id === selectedDocument.id
              ? {
                  ...document,
                  status: "approved",
                  salary,
                  salary_text: salaryText,
                }
              : document
          )
        );

        console.log("response", response);
        if (response.data.pdf_path) {
          printPdf(response.data.pdf_path);
        }
      }

      setModal(false);
      setSalary("");
      setSalaryText("");
      setComment("");
    } catch (err) {
      console.error("Error saving document:", err);
    }
  };

  const printPdf = (filePath) => {
    const newWindow = window.open(filePath);
    if (newWindow) {
      newWindow.focus();
      newWindow.print();
    }
  };

  const filteredDocuments = filterStatus
    ? documents.filter((document) => filterStatus.includes(document.status))
    : documents;

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          <Card>
            <CardBody>
              <div className="table-responsive">
                <Table className="table mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>მომთხოვნი პირი</th>
                      <th>მოთხოვნილი ფორმის სტილი</th>
                      <th>სამსახურის დაწყების თარიღი</th>
                      <th>ვიზირება</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((document, index) => (
                      <React.Fragment key={document.id}>
                        <tr
                          className={
                            document.status === "rejected"
                              ? "table-danger"
                              : document.status === "approved"
                              ? "table-success"
                              : "table-warning"
                          }
                          onClick={() => toggleRow(index)}
                          style={{ cursor: "pointer" }}
                        >
                          <th scope="row">{index + 1}</th>
                          <td>{document.user.name}</td>
                          <td>{document.name}</td>
                          <td>
                            {new Date(document.created_at).toLocaleDateString()}
                          </td>
                          <td>
                            {document.status === "rejected" ? (
                              <Button
                                color="danger"
                                disabled
                                onClick={(e) =>
                                  handleUpdateStatus(
                                    document.id,
                                    "rejected",
                                    e
                                  )
                                }
                              >
                                უარყოფილია
                              </Button>
                            ) : document.status === "approved" ? (
                              <Button
                                color="success"
                                disabled
                                onClick={(e) =>
                                  handleUpdateStatus(
                                    document.id,
                                    "approved",
                                    e
                                  )
                                }
                              >
                                დადასტურებულია
                              </Button>
                            ) : (
                              <>
                                <Button
                                  type="button"
                                  color="success"
                                  style={{ marginRight: "10px" }}
                                  onClick={(e) =>
                                    handleUpdateStatus(
                                      document.id,
                                      "approved",
                                      e
                                    )
                                  }
                                >
                                  დადასტურება
                                </Button>
                                <Button
                                  type="button"
                                  color="danger"
                                  onClick={(e) =>
                                    handleUpdateStatus(
                                      document.id,
                                      "rejected",
                                      e
                                    )
                                  }
                                >
                                  უარყოფა
                                </Button>
                              </>
                            )}
                          </td>
                        </tr>
                        {expandedRows.includes(index) && (
                          <tr>
                            <td colSpan="5">
                              <div className="p-3">
                                <p>დეტალური ინფორმაცია</p>
                                <ul>
                                  <li>
                                    მიმდინარე პოზიცია: {document.user.position}
                                  </li>
                                  <li>
                                    საიდენტიფიკაციო კოდი ან პირადი ნომერი:{" "}
                                    {document.user.id}
                                  </li>
                                  <li>
                                    იურიდიული მისამართი / ფაქტიური მისამართი:{" "}
                                    {document.user.location}
                                  </li>
                                  <li>
                                    ხელფასი:{" "}
                                    {document?.salary}
                                  </li>
                                  <li>
                                    კომენტარი:{" "}
                                    {document?.comment}
                                  </li>
                                </ul>
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

      <Modal isOpen={modal} toggle={() => setModal(false)}>
        <ModalHeader toggle={() => setModal(false)}>
          {isRejection
            ? "გთხოვთ შეიყვანოთ უარის კომენტარი"
            : "შესაყვანი ხელფასი და ხელფასის ტექსტი"}
        </ModalHeader>
        <ModalBody>
          {isRejection ? (
            <Input
              type="textarea"
              placeholder="შეიყვანეთ უარის კომენტარი"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          ) : (
            <>
              <Input
                type="text"
                placeholder="შეიყვანეთ ხელფასი"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
              <Input
                type="text"
                placeholder="შეიყვანეთ ხელფასის ტექსტი"
                value={salaryText}
                onChange={(e) => setSalaryText(e.target.value)}
                className="mt-3"
              />
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSave}>
            შენახვა
          </Button>
          <Button color="secondary" onClick={() => setModal(false)}>
            დახურვა
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default HrPageApprove;
