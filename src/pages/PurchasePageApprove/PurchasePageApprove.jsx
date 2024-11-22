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

const PurchasePageApprove = ({ filterStatus }) => {
  document.title = "შესყიდვების ვიზირება | Gorgia LLC"

  const [expandedRows, setExpandedRows] = useState([])
  const [purchases, setPurchases] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: 'start_date',
    direction: 'desc'
  });
  const [rejectionModal, setRejectionModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [rejectionComment, setRejectionComment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

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
        setSelectedPurchase(purchaseId);
        setRejectionModal(true);
        return;
      }

      const response = await updatePurchaseStatus(purchaseId, status);
      if (response.data.success) {
        setPurchases(prevPurchases =>
          prevPurchases.map(purchase =>
            purchase.id === purchaseId ? { ...purchase, status } : purchase
          )
        );
      }
    } catch (err) {
      console.error("Error updating purchase status:", err);
    }
  };

  const handleRejectionSubmit = async () => {
    try {
      const response = await updatePurchaseStatus(selectedPurchase, "rejected", rejectionComment);
      if (response.data.success) {
        setPurchases(prevPurchases =>
          prevPurchases.map(purchase =>
            purchase.id === selectedPurchase ? { ...purchase, status: "rejected" } : purchase
          )
        );
        setRejectionModal(false);
        setRejectionComment("");
        setSelectedPurchase(null);
      }
    } catch (err) {
      console.error("Error rejecting purchase:", err);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  useEffect(() => {
    if (purchases.length > 0) {
      const sortedPurchases = [...purchases].sort((a, b) => {
        const dateA = new Date(sortConfig.key === 'start_date' ? a.start_date : a.deadline);
        const dateB = new Date(sortConfig.key === 'start_date' ? b.start_date : b.deadline);
        return sortConfig.direction === 'asc'
          ? dateA - dateB
          : dateB - dateA;
      });
      setPurchases(sortedPurchases);
    }
  }, [sortConfig]);

  const filteredPurchases = purchases
    .filter(purchase =>
      purchase.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(purchase =>
      filterStatus ? filterStatus.includes(purchase.status) : true
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPurchases.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs title="შესყიდვები" breadcrumbItem="ვიზირება" />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xl={{ size: 4, offset: 8 }}>
              <Input
                type="search"
                placeholder="ძებნა თანამშრომლის მიხედვით..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bsSize="sm"
              />
            </Col>
          </Row>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">შესყიდვების ვიზირების გვერდი</CardTitle>
                  <CardSubtitle className="card-title-desc">
                    ქვემოთ მოცემულია შესყიდვის მოთხოვნები
                  </CardSubtitle>
                  <div className="purchase-table-modern">
                    <div className="table-container">
                      <Table className="table-modern mb-0">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>მომთხოვნი პირი</th>
                            <th>შესყიდვის ობიექტი</th>
                            <th onClick={() => handleSort('start_date')}>
                              <div className="d-flex align-items-center">
                                დაწყების თარიღი
                                {sortConfig.key === 'start_date' && (
                                  <span className="sort-icon">
                                    {sortConfig.direction === 'desc' ? '▼' : '▲'}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th onClick={() => handleSort('deadline')}>
                              <div className="d-flex align-items-center">
                                დასრულების თარიღი
                                {sortConfig.key === 'deadline' && (
                                  <span className="sort-icon">
                                    {sortConfig.direction === 'desc' ? '▼' : '▲'}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th>სტატუსი</th>
                            <th>ვიზირება</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((purchase, index) => (
                            <React.Fragment key={purchase.id}>
                              <tr onClick={() => toggleRow(index)}>
                                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div className="avatar-wrapper">
                                      <span className="avatar-initial">
                                        {purchase.user?.name?.charAt(0) || "?"}
                                      </span>
                                    </div>
                                    <span className="user-name">{purchase.user.name}</span>
                                  </div>
                                </td>
                                <td>{purchase.objective}</td>
                                <td>
                                  <div className="date-wrapper">
                                    <i className="bx bx-calendar me-2"></i>
                                    {new Date(purchase.start_date).toLocaleDateString()}
                                  </div>
                                </td>
                                <td>
                                  <div className="date-wrapper">
                                    <i className="bx bx-calendar-check me-2"></i>
                                    {new Date(purchase.deadline).toLocaleDateString()}
                                  </div>
                                </td>
                                <td>
                                  <span className={`status-badge status-${purchase.status}`}>
                                    <i className={`bx ${
                                      purchase.status === "rejected"
                                        ? "bx-x-circle"
                                        : purchase.status === "approved"
                                        ? "bx-check-circle"
                                        : "bx-time"
                                    } me-2`}></i>
                                    {purchase.status}
                                  </span>
                                </td>
                                <td>
                                  {purchase.status === "rejected" ? (
                                    <button className="btn-action btn-rejected" disabled>
                                      <i className="bx bx-block me-2"></i>
                                      უარყოფილია
                                    </button>
                                  ) : purchase.status === "approved" ? (
                                    <button className="btn-action btn-approved" disabled>
                                      <i className="bx bx-check-double me-2"></i>
                                      დადასტურებულია
                                    </button>
                                  ) : (
                                    <div className="d-flex gap-2">
                                      <button
                                        className="btn-action btn-approve"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUpdateStatus(purchase.id, "approved");
                                        }}
                                      >
                                        <i className="bx bx-check-double me-2"></i>
                                        დადასტურება
                                      </button>
                                      <button
                                        className="btn-action btn-reject"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUpdateStatus(purchase.id, "rejected");
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
                                  <td colSpan="7">
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
                                                <span className="value">{purchase.user.position}</span>
                                              </li>
                                              <li>
                                                <span className="label">ID:</span>
                                                <span className="value">{purchase.user.id}</span>
                                              </li>
                                            </ul>
                                          </div>
                                        </Col>
                                        <Col md={6}>
                                          <div className="info-section">
                                            <h6 className="info-title">
                                              <i className="bx bx-package"></i>
                                              შესყიდვის დეტალები
                                            </h6>
                                            <ul className="info-list">
                                              <li>
                                                <span className="label">მისამართი:</span>
                                                <span className="value">{purchase.delivery_address}</span>
                                              </li>
                                              <li>
                                                <span className="label">სულ დღეები:</span>
                                                <span className="value">{purchase.total_days}</span>
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
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    <Pagination>
                      <PaginationItem disabled={currentPage === 1}>
                        <PaginationLink previous onClick={() => paginate(currentPage - 1)} href="#" />
                      </PaginationItem>
                      {totalPages <= 5 ? (
                        [...Array(totalPages)].map((_, index) => (
                          <PaginationItem key={index + 1} active={currentPage === index + 1}>
                            <PaginationLink onClick={() => paginate(index + 1)} href="#">
                              {index + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))
                      ) : (
                        <>
                          {[...Array(totalPages)].map((_, index) => {
                            const pageNumber = index + 1;
                            if (
                              pageNumber === 1 ||
                              pageNumber === totalPages ||
                              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                            ) {
                              return (
                                <PaginationItem key={pageNumber} active={currentPage === pageNumber}>
                                  <PaginationLink onClick={() => paginate(pageNumber)} href="#">
                                    {pageNumber}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                              return (
                                <PaginationItem key={pageNumber}>
                                  <PaginationLink disabled href="#">
                                    ...
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            }
                            return null;
                          })}
                        </>
                      )}
                      <PaginationItem disabled={currentPage === totalPages}>
                        <PaginationLink next onClick={() => paginate(currentPage + 1)} href="#" />
                      </PaginationItem>
                    </Pagination>
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
              <Label for="rejectionComment">გთხოვთ მიუთითოთ უარყოფის მიზეზი</Label>
              <Input
                type="textarea"
                name="rejectionComment"
                id="rejectionComment"
                value={rejectionComment}
                onChange={(e) => setRejectionComment(e.target.value)}
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
