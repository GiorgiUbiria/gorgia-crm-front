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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { getPurchaseList, updatePurchaseStatus } from "services/purchase"
import "./PurchasePageApprove.scss"

const PURCHASE_STATUSES = {
  pending: {
    label: "მიმდინარე",
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

const PurchasePageApprove = ({ filterStatus }) => {
  document.title = "შესყიდვების ვიზირება | Gorgia LLC"

  const [expandedRows, setExpandedRows] = useState([])
  const [purchases, setPurchases] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({
    key: "start_date",
    direction: "desc",
  })
  const [rejectionModal, setRejectionModal] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState(null)
  const [rejectionComment, setRejectionComment] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(7)
  const [sortDirection, setSortDirection] = useState("desc")

  const toggleRow = index => {
    const isRowExpanded = expandedRows.includes(index)
    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter(rowIndex => rowIndex !== index))
    } else {
      setExpandedRows([...expandedRows, index])
    }
  }

  const fetchPurchases = async () => {
    try {
      const response = await getPurchaseList()
      setPurchases(response.data.internal_purchases)
    } catch (err) {
      console.error("Error fetching purchase requests:", err)
    }
  }

  useEffect(() => {
    fetchPurchases()
  }, [])

  const handleUpdateStatus = async (purchaseId, status) => {
    try {
      if (status === "rejected") {
        setSelectedPurchase(purchaseId)
        setRejectionModal(true)
        return
      }

      const response = await updatePurchaseStatus(purchaseId, status)
      if (response.data.success) {
        setPurchases(prevPurchases =>
          prevPurchases.map(purchase =>
            purchase.id === purchaseId ? { ...purchase, status } : purchase
          )
        )
      }
    } catch (err) {
      console.error("Error updating purchase status:", err)
    }
  }

  const handleRejectionSubmit = async () => {
    try {
      const response = await updatePurchaseStatus(
        selectedPurchase,
        "rejected",
        rejectionComment
      )
      if (response.data.success) {
        setPurchases(prevPurchases =>
          prevPurchases.map(purchase =>
            purchase.id === selectedPurchase
              ? { ...purchase, status: "rejected" }
              : purchase
          )
        )
        setRejectionModal(false)
        setRejectionComment("")
        setSelectedPurchase(null)
      }
    } catch (err) {
      console.error("Error rejecting purchase:", err)
    }
  }

  const handleSort = key => {
    setSortConfig(prevConfig => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }))
  }

  useEffect(() => {
    if (purchases.length > 0) {
      const sortedPurchases = [...purchases].sort((a, b) => {
        const dateA = new Date(
          sortConfig.key === "start_date" ? a.start_date : a.deadline
        )
        const dateB = new Date(
          sortConfig.key === "start_date" ? b.start_date : b.deadline
        )
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA
      })
      setPurchases(sortedPurchases)
    }
  }, [sortConfig])

  const sortPurchases = purchases => {
    return [...purchases].sort((a, b) => {
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB
    })
  }

  const filteredPurchases = purchases
    .filter(purchase =>
      purchase.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(purchase =>
      filterStatus ? filterStatus.includes(purchase.status) : true
    )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const sortedPurchases = sortPurchases(filteredPurchases)
  const currentPurchases = sortedPurchases.slice(
    indexOfFirstItem,
    indexOfLastItem
  )
  const totalPages = Math.ceil(sortedPurchases.length / itemsPerPage)

  const paginate = pageNumber => setCurrentPage(pageNumber)

  const handleItemsPerPageChange = value => {
    setItemsPerPage(value)
    setCurrentPage(1)
  }

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs title="შესყიდვები" breadcrumbitem="ვიზირება" />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xl={{ size: 4, offset: 8 }}>
              <Input
                type="search"
                placeholder="ძებნა თანამშრომლის მიხედვით..."
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
                  <CardTitle className="h4">შესყიდვების ვიზირება</CardTitle>
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
                          <th>მომთხოვნი პირი</th>
                          <th>შესყიდვის აღწერ</th>
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
                        {currentPurchases.map((purchase, index) => (
                          <React.Fragment key={purchase.id}>
                            <tr
                              className={`purchase-row status-${purchase.status}`}
                              onClick={() => toggleRow(index)}
                            >
                              <td>
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar-wrapper">
                                    <span className="avatar-initial">
                                      {purchase.requester_name?.charAt(0) ||
                                        "?"}
                                    </span>
                                  </div>
                                  <span className="user-name">
                                    {purchase.requester_name}
                                  </span>
                                </div>
                              </td>
                              <td>{purchase.description}</td>
                              <td>
                                {new Date(
                                  purchase.created_at
                                ).toLocaleDateString()}
                              </td>
                              <td>
                                <span
                                  className={`status-badge status-${purchase.status}`}
                                >
                                  <i
                                    className={`bx ${
                                      PURCHASE_STATUSES[purchase.status].icon
                                    } me-1`}
                                  ></i>
                                  {PURCHASE_STATUSES[purchase.status].label}
                                </span>
                              </td>
                              <td>
                                {purchase.status === "pending" && (
                                  <div className="d-flex gap-2">
                                    <Button
                                      color="success"
                                      size="sm"
                                      onClick={e => {
                                        e.stopPropagation()
                                        handleUpdateStatus(
                                          purchase.id,
                                          "approved"
                                        )
                                      }}
                                    >
                                      <i className="bx bx-check-double me-1"></i>
                                      დადასტურება
                                    </Button>
                                    <Button
                                      color="danger"
                                      size="sm"
                                      onClick={e => {
                                        e.stopPropagation()
                                        handleUpdateStatus(
                                          purchase.id,
                                          "rejected"
                                        )
                                      }}
                                    >
                                      <i className="bx bx-x me-1"></i>
                                      უარყოფა
                                    </Button>
                                  </div>
                                )}
                              </td>
                            </tr>
                            {expandedRows.includes(index) && (
                              <tr>
                                <td colSpan="6">
                                  <div className="expanded-content">
                                    <Row>
                                      <Col>
                                        <div className="info-section">
                                          <h6 className="info-title">
                                            <i className="bx bx-info-circle me-2"></i>
                                            დეტალრ ინფორმაცია
                                          </h6>
                                          <ul className="info-list">
                                            <li>
                                              <span className="label">
                                                რაოდენობა:
                                              </span>
                                              <span className="value">
                                                {purchase.quantity}
                                              </span>
                                            </li>
                                            <li>
                                              <span className="label">
                                                ფასი:
                                              </span>
                                              <span className="value">
                                                {purchase.price}₾
                                              </span>
                                            </li>
                                            {purchase.status === "rejected" &&
                                              purchase.comment && (
                                                <li>
                                                  <span className="label">
                                                    უარყოფის მიზეზი:
                                                  </span>
                                                  <span className="value">
                                                    {purchase.comment}
                                                  </span>
                                                </li>
                                              )}
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
                        {Math.min(indexOfLastItem, sortedPurchases.length)} /{" "}
                        {sortedPurchases.length}
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
                            sortedPurchases.length / itemsPerPage
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
                            Math.ceil(sortedPurchases.length / itemsPerPage)
                          }
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
      <Modal isOpen={rejectionModal} toggle={() => setRejectionModal(false)}>
        <ModalHeader toggle={() => setRejectionModal(false)}>
          უარყოფის მიზეზი
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="rejectionComment">
                გთხოვთ მიუთითოთ უარყოფის მიზეზი
              </Label>
              <Input
                type="textarea"
                name="rejectionComment"
                id="rejectionComment"
                value={rejectionComment}
                onChange={e => setRejectionComment(e.target.value)}
                rows="4"
                required
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onClick={handleRejectionSubmit}
            disabled={!rejectionComment.trim()}
          >
            უარყოფა
          </Button>
          <Button color="secondary" onClick={() => setRejectionModal(false)}>
            გაუქმება
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  )
}

export default PurchasePageApprove
