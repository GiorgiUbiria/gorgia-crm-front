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
import { getCurrentUserTrips } from "services/admin/business";

const UserTrip = () => {
  document.title = "მოგზაურობები | Gorgia LLC";

  const [trips, setTrips] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTrips = async () => {
    try {
      const response = await getCurrentUserTrips();
      setTrips(response.data.data);
    } catch (err) {
      console.error("Error fetching trips:", err);
    }
  };

  useEffect(() => {
    fetchTrips();
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

  const filteredTrips = trips.filter((trip) =>
    `${trip.subtitle_user_name} ${trip.subtitle_user_sur_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs title="მოგზაურობები" breadcrumbItem="ჩემი მოგზაურობები" />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xl={{ size: 4, offset: 8 }}>
              <Input
                type="search"
                placeholder="ძებნა შემცვლელი პირის მიხედვით..."
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
                  <CardTitle className="h4">მოგზაურობების გვერდი</CardTitle>
                  <CardSubtitle className="card-title-desc">
                    ქვემოთ მოცემულია თქვენი მოგზაურობების ისტორია
                  </CardSubtitle>
                  <div className="table-responsive">
                    <Table className="table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>მივლინების ტიპი</th>
                          <th>დაწყების თარიღი</th>
                          <th>დასრულების თარიღი</th>
                          <th>შემცვლელი პირის სახელი/გვარი</th>
                          <th>სტატუსი</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTrips?.map((trip, index) => (
                          <React.Fragment key={trip.id}>
                            <tr
                              className={getRowClass(trip.status)}
                              onClick={() => toggleRow(index)}
                              style={{ cursor: "pointer" }}
                            >
                              <th scope="row">{index + 1}</th>
                              <td>
                                {trip.trip_type === "regional"
                                  ? "რეგიონალური"
                                  : trip.trip_type === "international"
                                  ? "საერთაშორისო"
                                  : "უცნობი"}
                              </td>
                              <td>{trip?.start_date}</td>
                              <td>{trip?.end_date}</td>
                              <td>{trip?.subtitle_user_name
                              } {trip?.subtitle_user_sur_name}</td>
                              <td>
                                {trip.status === "rejected"
                                  ? "უარყოფილია"
                                  : trip.status === "approved"
                                  ? "დადასტურებულია"
                                  : "მოლოდინში"}
                              </td>
                            </tr>
                            {expandedRows.includes(index) && (
                              <tr>
                                <td colSpan="6">
                                  <div className="p-3">
                                    <p>დეტალური ინფორმაცია</p>
                                    <ul>
                                      <li>მიზანი: {trip.objective}</li>
                                      <li>სრული ხარჯი: {trip.total_expense}₾</li>
                                      <li>ტრანსპორტის ხარჯი: {trip.expense_transport}₾</li>
                                      <li>საცხოვრებელი: {trip.expense_living}₾</li>
                                      <li>კვების ხარჯი: {trip.expense_meal}₾</li>
                                    </ul>
                                    {trip.status === "rejected" && trip.comment && (
                                      <div className="mt-3 p-3 bg-light rounded">
                                        <h6 className="mb-2 text-danger">უარყოფის მიზეზი:</h6>
                                        <p className="mb-1">{trip.comment}</p>
                                        <small className="text-muted">
                                          უარყო: {trip.reviewed_by?.name} {trip.reviewed_by?.sur_name}
                                          {trip.reviewed_at && (
                                            <span> - {new Date(trip.reviewed_at).toLocaleString('ka-GE')}</span>
                                          )}
                                        </small>
                                      </div>
                                    )}
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

export default UserTrip;
