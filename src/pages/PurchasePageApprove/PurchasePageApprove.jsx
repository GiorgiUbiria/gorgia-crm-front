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
import { getPurchaseList } from "services/purchase"

const PurchasePageApprove = ({ filterStatus }) => {
  document.title = "შესყიდვების ვიზირება | Gorgia LLC"

  const [expandedRows, setExpandedRows] = useState([])
  const [purchases, setPurchases] = useState([])
  const [searchTerm, setSearchTerm] = useState("");

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
      setPurchases(prevPurchases =>
        prevPurchases.map(purchase =>
          purchase.id === purchaseId ? { ...purchase, status } : purchase
        )
      )
    } catch (err) {
      console.error("Error updating purchase status:", err)
    }
  }

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
                          <th>დაწყების თარიღი</th>
                          <th>დასრულების თარიღი</th>
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
    </React.Fragment>
  )
}

export default PurchasePageApprove
