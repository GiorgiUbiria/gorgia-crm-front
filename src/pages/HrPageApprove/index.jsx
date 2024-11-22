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
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getHrDocuments, updateHrDocumentStatus } from "services/hrDocument";
import "./HrPageApprove.scss";

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
  const [searchTerm, setSearchTerm] = useState("");

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
      <div className="page-content">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs title="HR" breadcrumbItem="დოკუმენტების ვიზირება" />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xl={{ size: 4, offset: 8 }}>
              <div className="search-box">
                <Input
                  type="search"
                  className="form-control modern-search"
                  placeholder="ძებნა თანამშრომლის მიხედვით..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="bx bx-search-alt search-icon"></i>
              </div>
            </Col>
          </Row>

          <Card className="hr-approval-card">
            <CardBody>
              <CardTitle className="h4">HR დოკუმენტების ვიზირება</CardTitle>
              <CardSubtitle className="mb-4">
                თანამშრომლების მიერ მოთხოვნილი დოკუმენტების სია
              </CardSubtitle>

              <div className="hr-table-modern">
                <Table className="table-modern">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>მომთხოვნი პირი</th>
                      <th>მოთხოვნილი ფორმის სტილი</th>
                      <th>სარიღი</th>
                      <th>სტატუსი</th>
                      <th>ვიზირება</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((document, index) => (
                      <React.Fragment key={document.id}>
                        <tr 
                          onClick={() => toggleRow(index)}
                          className={`status-${document.status}`}
                        >
                          <td>{index + 1}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-wrapper">
                                <span className="avatar-initial">
                                  {document.user?.name?.charAt(0) || "?"}
                                </span>
                              </div>
                              <span className="user-name">{document.user.name}</span>
                            </div>
                          </td>
                          <td>{document.name}</td>
                          <td>
                            <div className="date-wrapper">
                              <i className="bx bx-calendar me-2"></i>
                              {new Date(document.created_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge status-${document.status}`}>
                              <i className={`bx ${
                                document.status === "rejected"
                                  ? "bx-x-circle"
                                  : document.status === "approved"
                                  ? "bx-check-circle"
                                  : "bx-time"
                              } me-2`}></i>
                              {document.status}
                            </span>
                          </td>
                          <td>
                            {document.status === "pending" && (
                              <div className="d-flex">
                                <button
                                  className="btn-action btn-approve"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatus(document.id, "approved", e);
                                  }}
                                >
                                  <i className="bx bx-check-double me-2"></i>
                                  დადასტურება
                                </button>
                                <button
                                  className="btn-action btn-reject"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatus(document.id, "rejected", e);
                                  }}
                                >
                                  <i className="bx bx-block me-2"></i>
                                  უარყოფა
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                        {expandedRows.includes(index) && (
                          <tr>
                            <td colSpan="6">
                              <div className="expanded-content">
                                <Row>
                                  <Col md={6}>
                                    <div className="info-section">
                                      <h6 className="info-title">
                                        <i className="bx bx-user"></i>
                                        თანამშრომლის ინფორმაცია
                                      </h6>
                                      <ul className="info-list">
                                        <li>
                                          <span className="label">პოზიცია:</span>
                                          <span className="value">{document.user.position}</span>
                                        </li>
                                        <li>
                                          <span className="label">პირადი ნომერი:</span>
                                          <span className="value">{document.user.id}</span>
                                        </li>
                                        <li>
                                          <span className="label">მისამართი:</span>
                                          <span className="value">{document.user.location}</span>
                                        </li>
                                      </ul>
                                    </div>
                                  </Col>
                                  <Col md={6}>
                                    <div className="info-section">
                                      <h6 className="info-title">
                                        <i className="bx bx-file"></i>
                                        დოკუმენტის დეტალები
                                      </h6>
                                      <ul className="info-list">
                                        <li>
                                          <span className="label">ხელფასი:</span>
                                          <span className="value">{document.salary || "არ არის მითითებული"}</span>
                                        </li>
                                        <li>
                                          <span className="label">კომენტარი:</span>
                                          <span className="value">{document.comment || "არ არის მითითებული"}</span>
                                        </li>
                                      </ul>
                                    </div>
                                  </Col>
                                </Row>
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
        </div>
      </div>

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
