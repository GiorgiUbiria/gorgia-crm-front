import React, { useEffect, useState } from "react";
import { Table, Row, Col, Card, CardBody } from "reactstrap";

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getCurrentUserPurchases } from "services/purchase";

const UserPurchases = () => {
  // Meta title
  document.title = "შიდა შესყიდვები | Gorgia LLC";

  const [purchases, setPurchases] = useState([]);

  const fetchPurchases = async () => {
    try {
      const response = await getCurrentUserPurchases(); // Fetch user purchases
      setPurchases(response.data.internal_purchases); // Assuming 'internal_purchases' is the key holding the purchases
    } catch (err) {
      console.error("Error fetching purchases:", err);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  // Determine the row class based on the purchase status
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

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="შიდა შესყიდვები" breadcrumbItem="ჩემი შესყიდვები" />
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <div className="table-responsive">
                    <Table className="table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>შესყიდვის მიზანი</th>
                          <th>შესყიდვის დეპარტამენტი</th>
                          <th>ვადა</th>
                          <th>სტატუსი</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchases.map((purchase, index) => (
                          <tr key={purchase.id} className={getRowClass(purchase.status)}>
                            <th scope="row">{index + 1}</th>
                            <td>{purchase.objective}</td>
                            <td>{purchase.department_name || 'Unknown'}</td> {/* Assuming department_name exists */}
                            <td>{purchase.deadline}</td>
                            <td>
                              {purchase.status === "rejected" ? "უარყოფილია" :
                               purchase.status === "approved" ? "დადასტურებულია" : "მოლოდინში"}
                            </td>
                          </tr>
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

export default UserPurchases;
