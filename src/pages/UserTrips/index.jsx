import React, { useEffect, useState } from "react";
import { Table, Row, Col, Card, CardBody } from "reactstrap";

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getCurrentUserTrips } from "services/admin/business";


const UserTrip = () => {
  document.title = "მოგზაურობები | Gorgia LLC";

  const [trips, setTrips] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]); // State to track expanded rows

  // Fetch the current user's trips from the API
  const fetchTrips = async () => {
    try {
      const response = await getCurrentUserTrips(); // Fetch user trips
      setTrips(response.data.data); // Assuming 'trips' is the key holding the trips
    } catch (err) {
      console.error("Error fetching trips:", err);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Toggle row expansion to show detailed trip info
  const toggleRow = (index) => {
    const isRowExpanded = expandedRows.includes(index);
    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter((rowIndex) => rowIndex !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  // Determine the row class based on the trip status
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


  console.log(trips);
  
  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="მოგზაურობები" breadcrumbItem="ჩემი მოგზაურობები" />
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
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
                        {trips?.map((trip, index) => (
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
                                <td colSpan="4">
                                  <div className="p-3">
                                    <p>დეტალური ინფორმაცია</p>
                                    <ul>
                                      <li>მიზანი: {trip.objective}</li>
                                      <li>სრული ხარჯი: {trip.total_expense}₾</li>
                                      <li>ტრანსპორტის ხარჯი: {trip.expense_transport}₾</li>
                                      <li>საცხოვრებელი: {trip.expense_living}₾</li>
                                      <li>კვების ხარჯი: {trip.expense_meal}₾</li>
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

export default UserTrip;
