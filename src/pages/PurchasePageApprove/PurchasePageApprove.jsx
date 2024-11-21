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
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { getPurchaseList, updatePurchaseStatus } from "services/purchase"

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
                  <div className="table-responsive">
                    <Table className="table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>მომთხოვნი პირი</th>
                          <th>შესყიდვის ობიექტი</th>
                          <th
                            onClick={() => handleSort('start_date')}
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              დაწყების თარიღი
                              {sortConfig.key === 'start_date' && (
                                <span style={{ marginLeft: '4px' }}>
                                  {sortConfig.direction === 'desc' ? '▼' : '▲'}
                                </span>
                              )}
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('deadline')}
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              დასრულების თარიღი
                              {sortConfig.key === 'deadline' && (
                                <span style={{ marginLeft: '4px' }}>
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
                        {filteredPurchases.map((purchase, index) => (
                          <React.Fragment key={purchase.id}>
                            <tr
                              className={
                                purchase.status === "rejected"
                                  ? "table-danger"
                                  : purchase.status === "approved"
                                    ? "table-success"
                                    : "table-warning"
                              }
                              onClick={() => toggleRow(index)}
                              style={{ cursor: "pointer" }}
                            >
                              <th scope="row">{index + 1}</th>
                              <td>{purchase.user.name}</td>
                              <td>{purchase.objective}</td>
                              <td>
                                {new Date(purchase.start_date).toLocaleDateString()}
                              </td>
                              <td>
                                {new Date(purchase.deadline).toLocaleDateString()}
                              </td>
                              <td>{purchase.status}</td>
                              <td>
                                {purchase.status === "rejected" ? (
                                  <Button color="danger" disabled>
                                    <i className="bx bx-block font-size-10 align-right me-2"></i>{" "}
                                    უარყოფილია
                                  </Button>
                                ) : purchase.status === "approved" ? (
                                  <Button color="success" disabled>
                                    <i className="bx bx-check-double font-size-10 align-left me-2"></i>{" "}
                                    დადასტურებულია
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      type="button"
                                      color="success"
                                      style={{ marginRight: "10px" }}
                                      onClick={() =>
                                        handleUpdateStatus(purchase.id, "approved")
                                      }
                                    >
                                      <i className="bx bx-check-double font-size-10 align-left me-2"></i>{" "}
                                      დადასტურება
                                    </Button>
                                    <Button
                                      type="button"
                                      color="danger"
                                      onClick={() =>
                                        handleUpdateStatus(purchase.id, "rejected")
                                      }
                                    >
                                      <i className="bx bx-block font-size-10 align-right me-2"></i>{" "}
                                      უარყოფა
                                    </Button>
                                  </>
                                )}
                              </td>
                            </tr>
                            {expandedRows.includes(index) && (
                              <tr>
                                <td colSpan="7">
                                  <div className="p-3">
                                    <p>დეტალური ინფორმაცია</p>
                                    <ul>
                                      <li>პოზიცია: {purchase.user.position}</li>
                                      <li>ID: {purchase.user.id}</li>
                                      <li>
                                        მისამართი: {purchase.delivery_address}
                                      </li>
                                      <li>სულ დღეები: {purchase.total_days}</li>
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
