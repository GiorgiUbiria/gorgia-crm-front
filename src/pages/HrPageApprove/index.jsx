import React, { useEffect, useState } from "react"
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
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { getHrDocuments, updateHrDocumentStatus } from "services/hrDocument"
import "./HrPageApprove.scss"

const statusMap = {
  in_progress: {
    label: "განხილვაში",
    icon: "bx-time",
    color: "#FFA500", // orange
  },
  approved: {
    label: "დამტკიცებული",
    icon: "bx-check-circle",
    color: "#28a745", // green
  },
  rejected: {
    label: "უარყოფილი",
    icon: "bx-x-circle",
    color: "#dc3545", // red
  },
}

const HrPageApprove = ({ filterStatus }) => {
  document.title = "ვიზირება | Gorgia LLC"

  const [expandedRows, setExpandedRows] = useState([])
  const [documents, setDocuments] = useState([])
  const [modal, setModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [salary, setSalary] = useState("")
  const [salaryText, setSalaryText] = useState("")
  const [isRejection, setIsRejection] = useState(false)
  const [comment, setComment] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortDirection, setSortDirection] = useState("desc")

  const toggleRow = index => {
    const isRowExpanded = expandedRows.includes(index)
    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter(rowIndex => rowIndex !== index))
    } else {
      setExpandedRows([...expandedRows, index])
    }
  }

  const fetchDocuments = async () => {
    try {
      const response = await getHrDocuments()
      setDocuments(response.data)
    } catch (err) {
      console.error("Error fetching HR documents:", err)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleUpdateStatus = async (documentId, status, event) => {
    event.stopPropagation()
    try {
      const document = documents.find(doc => doc.id === documentId)
      setSelectedDocument(document)

      if (status === "approved") {
        setIsRejection(false)
        if (document.name !== "უხელფასო ცნობა") {
          setModal(true)
          return
        }
      } else if (status === "rejected") {
        setIsRejection(true)
        setModal(true)
        return
      }

      const response = await updateHrDocumentStatus(documentId, status)
      setDocuments(prevDocuments =>
        prevDocuments.map(doc =>
          doc.id === documentId ? { ...doc, status } : doc
        )
      )

      if (response.status === 200 && response.data.pdf_path) {
        printPdf(response.data.pdf_path)
      }
    } catch (err) {
      console.error("Error updating document status:", err)
    }
  }

  const handleSave = async () => {
    try {
      if (isRejection) {
        await updateHrDocumentStatus(selectedDocument.id, "rejected", {
          comment,
        })
        setDocuments(prevDocuments =>
          prevDocuments.map(document =>
            document.id === selectedDocument.id
              ? { ...document, status: "rejected", comment }
              : document
          )
        )
      } else {
        const response = await updateHrDocumentStatus(
          selectedDocument.id,
          "approved",
          {
            salary,
            salary_text: salaryText,
          }
        )
        setDocuments(prevDocuments =>
          prevDocuments.map(document =>
            document.id === selectedDocument.id
              ? {
                  ...document,
                  status: "approved",
                  salary,
                  salary_text: salaryText,
                }
              : document
          )
        )

        console.log("response", response)
        if (response.data.pdf_path) {
          printPdf(response.data.pdf_path)
        }
      }

      setModal(false)
      setSalary("")
      setSalaryText("")
      setComment("")
    } catch (err) {
      console.error("Error saving document:", err)
    }
  }

  const printPdf = filePath => {
    const newWindow = window.open(filePath)
    if (newWindow) {
      newWindow.focus()
      newWindow.print()
    }
  }

  const filteredDocuments = filterStatus
    ? documents.filter(document => filterStatus.includes(document.status))
    : documents

  const sortDocuments = docs => {
    return [...docs].sort((a, b) => {
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB
    })
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const sortedDocuments = sortDocuments(filteredDocuments)
  const currentDocuments = sortedDocuments.slice(
    indexOfFirstItem,
    indexOfLastItem
  )

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }

  const handleItemsPerPageChange = value => {
    setItemsPerPage(value)
    setCurrentPage(1) // Reset to first page when changing items per page
  }

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
                  onChange={e => setSearchTerm(e.target.value)}
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
                <div className="table-controls mb-3">
                  <div className="d-flex align-items-center">
                    <span className="me-2">თითო გვერდზე:</span>
                    <Input
                      type="select"
                      className="form-select w-auto"
                      value={itemsPerPage}
                      onChange={e =>
                        handleItemsPerPageChange(Number(e.target.value))
                      }
                    >
                      {[5, 10, 15, 20].map(value => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </Input>
                  </div>
                </div>

                <Table className="table-modern">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>მომთხოვნი პირი</th>
                      <th>მოთხოვნილი ფორმის სტილი</th>
                      <th
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setSortDirection(prev =>
                            prev === "desc" ? "asc" : "desc"
                          )
                        }
                      >
                        თარიღი{" "}
                        <i
                          className={`bx bx-sort-${
                            sortDirection === "desc" ? "down" : "up"
                          }`}
                        ></i>
                      </th>
                      <th>სტატუსი</th>
                      <th>ვიზირება</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentDocuments.map((document, index) => (
                      <React.Fragment key={document.id}>
                        <tr
                          onClick={() => toggleRow(index)}
                          className={`status-${document.status}`}
                        >
                          <td>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-wrapper">
                                <span className="avatar-initial">
                                  {document.user?.name?.charAt(0) || "?"}
                                </span>
                              </div>
                              <span className="user-name">
                                {document.user.name}
                              </span>
                            </div>
                          </td>
                          <td>{document.name}</td>
                          <td>
                            <div className="date-wrapper">
                              <i className="bx bx-calendar me-2"></i>
                              {new Date(
                                document.created_at
                              ).toLocaleDateString()}
                            </div>
                          </td>
                          <td>
                            <span
                              className={`status-badge status-${document.status}`}
                            >
                              <i
                                className={`bx ${
                                  statusMap[document.status].icon
                                } me-2`}
                              ></i>
                              {statusMap[document.status].label}
                            </span>
                          </td>
                          <td>
                            {document.status === "in_progress" && (
                              <div className="d-flex gap-2">
                                <button
                                  className="btn-action btn-approve"
                                  onClick={e =>
                                    handleUpdateStatus(
                                      document.id,
                                      "approved",
                                      e
                                    )
                                  }
                                >
                                  <i className="bx bx-check-double me-2"></i>
                                  დადასტურება
                                </button>
                                <button
                                  className="btn-action btn-reject"
                                  onClick={e =>
                                    handleUpdateStatus(
                                      document.id,
                                      "rejected",
                                      e
                                    )
                                  }
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
                                          <span className="label">
                                            პოზიცია:
                                          </span>
                                          <span className="value">
                                            {document.user.position}
                                          </span>
                                        </li>
                                        <li>
                                          <span className="label">
                                            პირადი ნომერი:
                                          </span>
                                          <span className="value">
                                            {document.user.id}
                                          </span>
                                        </li>
                                        <li>
                                          <span className="label">
                                            მისამართი:
                                          </span>
                                          <span className="value">
                                            {document.user.location}
                                          </span>
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
                                          <span className="label">
                                            ხელფასი:
                                          </span>
                                          <span className="value">
                                            {document.salary ||
                                              "არ არის მითითებული"}
                                          </span>
                                        </li>
                                        <li>
                                          <span className="label">
                                            კომენტარი:
                                          </span>
                                          <span className="value">
                                            {document.comment ||
                                              "არ არის მითითებული"}
                                          </span>
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

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="pagination-info">
                    ნაჩვენებია {indexOfFirstItem + 1}-
                    {Math.min(indexOfLastItem, sortedDocuments.length)} /{" "}
                    {sortedDocuments.length}
                  </div>
                  <div className="pagination-controls">
                    <Button
                      color="light"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="me-2"
                    >
                      <i className="bx bx-chevron-left"></i>
                    </Button>
                    {Array.from({
                      length: Math.ceil(sortedDocuments.length / itemsPerPage),
                    }).map((_, index) => (
                      <Button
                        key={index + 1}
                        color={currentPage === index + 1 ? "primary" : "light"}
                        onClick={() => handlePageChange(index + 1)}
                        className="me-2"
                      >
                        {index + 1}
                      </Button>
                    ))}
                    <Button
                      color="light"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={
                        currentPage ===
                        Math.ceil(sortedDocuments.length / itemsPerPage)
                      }
                    >
                      <i className="bx bx-chevron-right"></i>
                    </Button>
                  </div>
                </div>
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
              onChange={e => setComment(e.target.value)}
            />
          ) : (
            <>
              <Input
                type="text"
                placeholder="შეიყვანეთ ხელფასი"
                value={salary}
                onChange={e => setSalary(e.target.value)}
              />
              <Input
                type="text"
                placeholder="შეიყვანეთ ხელფასის ტექსტი"
                value={salaryText}
                onChange={e => setSalaryText(e.target.value)}
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
  )
}

export default HrPageApprove
