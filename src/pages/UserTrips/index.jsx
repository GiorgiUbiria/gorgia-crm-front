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
import { getTripList } from "services/trip";
import "./UserTrips.scss";

const UserTrip = () => {
  document.title = "მოგზაურობები | Gorgia LLC";

  const [trips, setTrips] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTrips = async () => {
    try {
      const response = await getTripList();
      setTrips(response.data.business);
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

          <Card className="trip-history-card">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <CardTitle className="h4 mb-1">მოგზაურობების ისტორია</CardTitle>
                  <CardSubtitle className="text-muted">
                    თქვენი მოგზაურობების სრული ისტორია
                  </CardSubtitle>
                </div>
                <div className="search-box">
                  <Input
                    type="text"
                    className="form-control modern-search"
                    placeholder="ძებნა შემცვლელი პირის მიხედვით..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <i className="bx bx-search-alt search-icon"></i>
                </div>
              </div>

              <div className="trip-table-modern">
                <div className="table-responsive">
                  <Table className="table-modern mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>მივლინების ტიპი</th>
                        <th>დაწყების თარიღი</th>
                        <th>დასრულების თარიღი</th>
                        <th>შემცვლელი პირი</th>
                        <th>სტატუსი</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTrips.map((trip, index) => (
                        <React.Fragment key={trip.id}>
                          <tr
                            onClick={() => toggleRow(index)}
                            className={`trip-row status-${trip.status}`}
                          >
                            <td>{index + 1}</td>
                            <td>
                              <i className="bx bx-map-alt me-2"></i>
                              {trip.trip_type === "regional"
                                ? "რეგიონალური"
                                : "საერთაშორისო"}
                            </td>
                            <td>
                              <div className="date-wrapper">
                                <i className="bx bx-calendar me-2"></i>
                                {trip.start_date}
                              </div>
                            </td>
                            <td>
                              <div className="date-wrapper">
                                <i className="bx bx-calendar-check me-2"></i>
                                {trip.end_date}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar-wrapper">
                                  <span className="avatar-initial">
                                    {trip.subtitle_user_name?.charAt(0) || "?"}
                                  </span>
                                </div>
                                <span>{trip.subtitle_user_name} {trip.subtitle_user_sur_name}</span>
                              </div>
                            </td>
                            <td>
                              <span className={`status-badge status-${trip.status}`}>
                                <i className={`bx ${
                                  trip.status === "rejected"
                                    ? "bx-x-circle"
                                    : trip.status === "approved"
                                    ? "bx-check-circle"
                                    : "bx-time"
                                } me-2`}></i>
                                {trip.status === "rejected"
                                  ? "უარყოფილია"
                                  : trip.status === "approved"
                                  ? "დადასტურებულია"
                                  : "მოლოდინში"}
                              </span>
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
                                          <i className="bx bx-info-circle"></i>
                                          მივლინების დეტალები
                                        </h6>
                                        <ul className="info-list">
                                          <li><i className="bx bx-target-lock"></i>მიზანი: {trip.objective}</li>
                                          <li><i className="bx bx-money"></i>სრული ხარჯი: {trip.total_expense}₾</li>
                                          <li><i className="bx bx-car"></i>ტრანსპორტის ხარჯი: {trip.expense_transport}₾</li>
                                          <li><i className="bx bx-home"></i>საცხოვრებელი: {trip.expense_living}₾</li>
                                          <li><i className="bx bx-restaurant"></i>კვების ხარჯი: {trip.expense_meal}₾</li>
                                        </ul>
                                      </div>
                                    </Col>
                                    {trip.status === "rejected" && trip.comment && (
                                      <Col md={6}>
                                        <div className="info-section">
                                          <h6 className="info-title text-danger">
                                            <i className="bx bx-message-square-x"></i>
                                            უარყოფის მიზეზი
                                          </h6>
                                          <p>{trip.comment}</p>
                                          <small className="text-muted">
                                            <i className="bx bx-user me-1"></i>
                                            უარყო: {trip.reviewed_by?.name} {trip.reviewed_by?.sur_name}
                                            {trip.reviewed_at && (
                                              <span className="ms-2">
                                                <i className="bx bx-time-five me-1"></i>
                                                {new Date(trip.reviewed_at).toLocaleString('ka-GE')}
                                              </span>
                                            )}
                                          </small>
                                        </div>
                                      </Col>
                                    )}
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
            </CardBody>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default UserTrip;
