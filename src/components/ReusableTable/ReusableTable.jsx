import React, { useState, useEffect } from "react"
import {
  Table,
  Button,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap"
import PropTypes from "prop-types"
import styles from "./ReusableTable.module.scss"

const statusMap = {
  in_progress: {
    label: "განხილვაში",
    icon: "bx-time",
    color: "#FFA500",
  },
  approved: {
    label: "დამტკიცებული",
    icon: "bx-check-circle",
    color: "#28a745",
  },
  rejected: {
    label: "უარყოფილი",
    icon: "bx-x-circle",
    color: "#dc3545",
  },
}

const ReusableTable = ({
  documents,
  columns,
  onUpdateStatus,
  filterStatus,
  itemsPerPageOptions = [5, 10, 15, 20],
  showActions = true,
}) => {
  const [expandedRows, setExpandedRows] = useState([])
  const [modal, setModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [salary, setSalary] = useState("")
  const [salaryText, setSalaryText] = useState("")
  const [isRejection, setIsRejection] = useState(false)
  const [comment, setComment] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[1])
  const [sortDirection, setSortDirection] = useState("desc")

  const toggleRow = index => {
    const isRowExpanded = expandedRows.includes(index)
    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter(rowIndex => rowIndex !== index))
    } else {
      setExpandedRows([...expandedRows, index])
    }
  }

  const handleUpdateStatus = (documentId, status, event) => {
    event.stopPropagation()
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

    onUpdateStatus(documentId, status)
  }

  const handleSave = () => {
    if (isRejection) {
      onUpdateStatus(selectedDocument.id, "rejected", { comment })
    } else {
      onUpdateStatus(selectedDocument.id, "approved", {
        salary,
        salary_text: salaryText,
      })
    }

    setModal(false)
    setSalary("")
    setSalaryText("")
    setComment("")
  }

  const sortDocuments = docs => {
    return [...docs].sort((a, b) => {
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB
    })
  }

  const filteredDocuments = filterStatus
    ? documents.filter(document => filterStatus.includes(document.status))
    : documents

  const sortedDocuments = sortDocuments(filteredDocuments)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
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
    <div className={styles.hrApprovalCard}>
      <div className={styles.hrTableModern}>
        <div className={`${styles.tableControls} mb-3`}>
          <div className="d-flex align-items-center">
            <span className="me-2">თითო გვერდზე:</span>
            <Input
              type="select"
              className="form-select w-auto"
              value={itemsPerPage}
              onChange={e => handleItemsPerPageChange(Number(e.target.value))}
            >
              {itemsPerPageOptions.map(value => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Input>
          </div>
        </div>

        <Table className={`table-modern ${styles.tableModern}`}>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.accessor}
                  style={column.sortable ? { cursor: "pointer" } : {}}
                  onClick={
                    column.sortable
                      ? () =>
                          setSortDirection(prev =>
                            prev === "desc" ? "asc" : "desc"
                          )
                      : undefined
                  }
                >
                  {column.header}
                  {column.sortable && (
                    <i
                      className={`bx bx-sort-${
                        sortDirection === "desc" ? "down" : "up"
                      }`}
                    />
                  )}
                </th>
              ))}
              {showActions && <th>ვიზირება</th>}
            </tr>
          </thead>
          <tbody>
            {currentDocuments.map((document, rowIndex) => (
              <React.Fragment key={document.id}>
                <tr
                  onClick={() => toggleRow(rowIndex)}
                  className={`status-${document.status}`}
                >
                  {columns.map(column => (
                    <td key={column.accessor}>
                      {column.render
                        ? column.render(document, rowIndex)
                        : column.accessor
                            .split(".")
                            .reduce((obj, key) => obj?.[key], document)}
                    </td>
                  ))}
                  {showActions && (
                    <td>
                      {document.status === "in_progress" && (
                        <div className="d-flex gap-2">
                          <button
                            className={`${styles.btnAction} ${styles.btnApprove}`}
                            onClick={e =>
                              handleUpdateStatus(document.id, "approved", e)
                            }
                          >
                            <i className="bx bx-check-double me-2"></i>
                            დადასტურება
                          </button>
                          <button
                            className={`${styles.btnAction} ${styles.btnReject}`}
                            onClick={e =>
                              handleUpdateStatus(document.id, "rejected", e)
                            }
                          >
                            <i className="bx bx-block me-2"></i>
                            უარყოფა
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
                {expandedRows.includes(rowIndex) && (
                  <tr>
                    <td colSpan="6">
                      <div className={styles.expandedContent}>
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
                                  <span className="value">
                                    {document.user.position}
                                  </span>
                                </li>
                                <li>
                                  <span className="label">პირადი ნომერი:</span>
                                  <span className="value">
                                    {document.user.id}
                                  </span>
                                </li>
                                <li>
                                  <span className="label">მისამართი:</span>
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
                                  <span className="label">ხელფასი:</span>
                                  <span className="value">
                                    {document.salary || "არ არის მითითებული"}
                                  </span>
                                </li>
                                <li>
                                  <span className="label">კომენტარი:</span>
                                  <span className="value">
                                    {document.comment || "არ არის მითითებული"}
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
                currentPage === Math.ceil(sortedDocuments.length / itemsPerPage)
              }
            >
              <i className="bx bx-chevron-right"></i>
            </Button>
          </div>
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
    </div>
  )
}

ReusableTable.propTypes = {
  documents: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      render: PropTypes.func,
    })
  ).isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
  filterStatus: PropTypes.array,
  itemsPerPageOptions: PropTypes.array,
  showActions: PropTypes.bool,
}

export default ReusableTable
