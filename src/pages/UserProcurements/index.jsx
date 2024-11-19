import React, { useEffect, useState } from "react";
import {
  Table,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Input,
} from "reactstrap";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getPurchaseList } from "services/purchase";

const UserProcurement = () => {
  document.title = "შესყიდვები | Gorgia LLC";

  const [procurements, setProcurements] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProcurements = async () => {
    try {
      const response = await getPurchaseList();
      setProcurements(response.data.internal_purchases);
    } catch (err) {
      console.error("Error fetching purchases:", err);
    }
  };

  useEffect(() => {
    fetchProcurements();
  }, []);

  const toggleRow = (index) => {
    const isRowExpanded = expandedRows.includes(index);
    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter((rowIndex) => rowIndex !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  const getRowClass = (status) => {
    switch (status) {
      case "rejected":
        return "table-danger";
      case "approved":
        return "table-success";
      case "pending":
        return "table-warning";
      default:
        return "";
    }
  };

  const filteredProcurements = procurements.filter((procurement) =>
    `${procurement.user.name} ${procurement.user.sur_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs title="შესყიდვები" breadcrumbItem="ჩემი შესყიდვები" />
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
                  <CardTitle className="h4">შესყიდვების გვერდი</CardTitle>
                  <CardSubtitle className="card-title-desc">
                    ქვემოთ მოცემულია თქვენი შესყიდვების ისტორია
                  </CardSubtitle>
                  <div className="table-responsive">
                    <Table className="table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>სახელი</th>
                          <th>გვარი</th>
                          <th>დეპარტამენტი</th>
                          <th>პოზიცია</th>
                          <th>შესყიდვის ტიპი</th>
                          <th>თარიღი</th>
                          <th>მომწოდებელი</th>
                          <th>სტატუსი</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProcurements?.map((procurement, index) => (
                          <React.Fragment key={procurement.id}>
                            <tr
                              className={getRowClass(procurement.status)}
                              onClick={() => toggleRow(index)}
                              style={{ cursor: "pointer" }}
                            >
                              <th scope="row">{index + 1}</th>
                              <td>{procurement.user.name}</td>
                              <td>{procurement.user.sur_name}</td>
                              <td>{procurement.department_id}</td>
                              <td>{procurement.user.position}</td>
                              <td>{procurement.type}</td>
                              <td>{procurement.created_at}</td>
                              <td>{procurement.supplier}</td>
                              <td>
                                {procurement.status === "rejected"
                                  ? "უარყოფილია"
                                  : procurement.status === "approved"
                                  ? "დადასტურებულია"
                                  : "მოლოდინში"}
                              </td>
                            </tr>
                            {expandedRows.includes(index) && (
                              <tr>
                                <td colSpan="5">
                                  <div className="p-3">
                                    <p>დეტალური ინფორმაცია</p>
                                    <ul>
                                      <li>აღწერა: {procurement.description}</li>
                                      <li>რაოდენობა: {procurement.quantity}</li>
                                      <li>ერთეულის ფასი: {procurement.unit_price}₾</li>
                                      <li>ჯამური ღირებულება: {procurement.total_price}₾</li>
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
  );
};

export default UserProcurement; 