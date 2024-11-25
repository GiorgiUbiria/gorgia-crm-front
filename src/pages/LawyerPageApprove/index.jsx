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
  Input,
} from "reactstrap"

import Breadcrumbs from "../../components/Common/Breadcrumb"
import {
  getDepartmentAgreements,
  updateAgreementStatus,
} from "services/agreement"

const statusMap = {
  pending: {
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

const LawyerPageApprove = ({ filterStatus }) => {
  document.title = "ვიზირება | Gorgia LLC"

  const [expandedRows, setExpandedRows] = useState([])
  const [agreements, setAgreements] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [sortDirection, setSortDirection] = useState("desc")

  const toggleRow = index => {
    const isRowExpanded = expandedRows.includes(index)
    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter(rowIndex => rowIndex !== index))
    } else {
      setExpandedRows([...expandedRows, index])
    }
  }

  const handleItemsPerPageChange = newItemsPerPage => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }

  const fetchAgreements = async () => {
    try {
      const response = await getDepartmentAgreements()
      console.log(
        "Agreement statuses:",
        response.data.data.map(a => a.status)
      )
      setAgreements(response.data.data)
    } catch (err) {
      console.error("Error fetching agreements:", err)
    }
  }

  useEffect(() => {
    fetchAgreements()
  }, [])

  const handleUpdateStatus = async (agreementId, status) => {
    try {
      const response = await updateAgreementStatus(agreementId, status)

      setAgreements(prevAgreements =>
        prevAgreements.map(agreement =>
          agreement.id === agreementId ? { ...agreement, status } : agreement
        )
      )

      if (status === "approved" && response.data.file_path) {
        const filePath = response.data.file_path
        printPdf(filePath)
      }
    } catch (err) {
      console.error("Error updating agreement status:", err)
    }
  }

  const printPdf = filePath => {
    const newWindow = window.open(filePath)
    newWindow.focus()
    newWindow.print()
  }

  const filteredAgreements = agreements
    .filter(agreement =>
      agreement.performer_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(agreement =>
      filterStatus ? filterStatus.includes(agreement.status) : true
    )

  const sortAgreements = agreements => {
    return [...agreements].sort((a, b) => {
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB
    })
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const sortedAgreements = sortAgreements(filteredAgreements)
  const currentAgreements = sortedAgreements.slice(
    indexOfFirstItem,
    indexOfLastItem
  )

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs title="ხელშეკრულებები" breadcrumbItem="ვიზირება" />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xl={{ size: 4, offset: 8 }}>
              <Input
                type="search"
                placeholder="ძებნა შემსრულებლის მიხედვით..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                bsSize="sm"
              />
            </Col>
          </Row>
          <Row>
            <Col xl={12}>
              <Card className="hr-approval-card">
                <CardBody>
                  <CardTitle className="h4">ხელშეკრულებების ვიზირება</CardTitle>
                  <CardSubtitle className="mb-4">
                    ვიზირების დადასტურების გვერდი ქვევით ნაჩვენებია მხოლოდ
                    მიმდინარე მოთხოვნილი ვიზირებები
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
                          <th>შემსრულებელი</th>
                          <th>მომსახურების აღწერა</th>
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
                        {currentAgreements.map((agreement, index) => (
                          <React.Fragment key={agreement.id}>
                            <tr
                              onClick={() => toggleRow(index)}
                              className={`status-${agreement.status}`}
                            >
                              <td>
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar-wrapper">
                                    <span className="avatar-initial">
                                      {agreement.performer_name?.charAt(0) ||
                                        "?"}
                                    </span>
                                  </div>
                                  <span className="user-name">
                                    {agreement.performer_name}
                                  </span>
                                </div>
                              </td>
                              <td>{agreement.service_description}</td>
                              <td>
                                <div className="date-wrapper">
                                  <i className="bx bx-calendar me-2"></i>
                                  {new Date(
                                    agreement.created_at
                                  ).toLocaleDateString()}
                                </div>
                              </td>
                              <td>
                                <span
                                  className={`status-badge status-${agreement.status}`}
                                >
                                  <i
                                    className={`bx ${
                                      statusMap[agreement.status]?.icon ||
                                      "bx-question-mark"
                                    } me-2`}
                                  ></i>
                                  {statusMap[agreement.status]?.label ||
                                    "Unknown Status"}
                                </span>
                              </td>
                              <td>
                                {agreement.status === "pending" && (
                                  <div className="d-flex gap-2">
                                    <button
                                      className="btn-action btn-approve"
                                      onClick={e => {
                                        e.stopPropagation()
                                        handleUpdateStatus(
                                          agreement.id,
                                          "approved"
                                        )
                                      }}
                                    >
                                      <i className="bx bx-check-double me-2"></i>
                                      დადასტურება
                                    </button>
                                    <button
                                      className="btn-action btn-reject"
                                      onClick={e => {
                                        e.stopPropagation()
                                        handleUpdateStatus(
                                          agreement.id,
                                          "rejected"
                                        )
                                      }}
                                    >
                                      <i className="bx bx-block me-2"></i>
                                      უარყოფა
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                            {/* Expanded row content */}
                            {expandedRows.includes(index) && (
                              <tr>
                                <td colSpan="6">
                                  <div className="expanded-content">
                                    <Row>
                                      <Col md={6}>
                                        <div className="info-section">
                                          <h6 className="info-title">
                                            <i className="bx bx-user"></i>
                                            შემსრულებლის ინფორმაცია
                                          </h6>
                                          <ul className="info-list">
                                            <li>
                                              <span className="label">
                                                სრული დასახელება:
                                              </span>
                                              <span className="value">
                                                {agreement.performer_name}
                                              </span>
                                            </li>
                                            <li>
                                              <span className="label">
                                                საიდენტიფიკაციო კოდი:
                                              </span>
                                              <span className="value">
                                                {
                                                  agreement.id_code_or_personal_number
                                                }
                                              </span>
                                            </li>
                                            <li>
                                              <span className="label">
                                                მისამართი:
                                              </span>
                                              <span className="value">
                                                {
                                                  agreement.legal_or_actual_address
                                                }
                                              </span>
                                            </li>
                                          </ul>
                                        </div>
                                      </Col>
                                      <Col md={6}>
                                        <div className="info-section">
                                          <h6 className="info-title">
                                            <i className="bx bx-file"></i>
                                            ხელშეკრულების დეტალები
                                          </h6>
                                          <ul className="info-list">
                                            <li>
                                              <span className="label">
                                                საბანკო რეკვიზიტები:
                                              </span>
                                              <span className="value">
                                                {agreement.bank_account_details}
                                              </span>
                                            </li>
                                            <li>
                                              <span className="label">
                                                მომსახურების ფასი:
                                              </span>
                                              <span className="value">
                                                {agreement.service_price}
                                              </span>
                                            </li>
                                            <li>
                                              <span className="label">
                                                გადახდის პირობები:
                                              </span>
                                              <span className="value">
                                                {agreement.payment_terms}
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
                        {Math.min(indexOfLastItem, sortedAgreements.length)} /{" "}
                        {sortedAgreements.length}
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
                          length: Math.ceil(
                            sortedAgreements.length / itemsPerPage
                          ),
                        }).map((_, index) => (
                          <Button
                            key={index + 1}
                            color={
                              currentPage === index + 1 ? "primary" : "light"
                            }
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
                            Math.ceil(sortedAgreements.length / itemsPerPage)
                          }
                          className="me-2"
                        >
                          <i className="bx bx-chevron-right"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default LawyerPageApprove
