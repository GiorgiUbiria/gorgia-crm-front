import React, { useEffect, useState } from "react";
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
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getTripList, updateTripStatus } from "services/trip"; // Importing updateTripStatus

const TripPageApprove = ({ filterStatus }) => {
  document.title = "მივლინებების ვიზირება | Georgia LLC"; // Page title

  const [expandedRows, setExpandedRows] = useState([]); // To handle expanded rows
  const [trips, setTrips] = useState([]); // To store the fetched trip requests
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectionModal, setRejectionModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [rejectionComment, setRejectionComment] = useState("");

  // Toggle row expansion to show detailed trip info
  const toggleRow = (index) => {
    const isRowExpanded = expandedRows.includes(index);
    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter((rowIndex) => rowIndex !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  // Fetch trip requests from the backend
  const fetchTrips = async () => {
    try {
      const response = await getTripList();
      setTrips(response.data.business);
    } catch (err) {
      console.error("Error fetching trip requests:", err);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Handle status update (approve/reject)
  const handleUpdateStatus = async (tripId, status) => {
    try {
      if (status === "rejected") {
        setSelectedTrip(tripId);
        setRejectionModal(true);
        return;
      }

      await updateTripStatus(tripId, status);
      setTrips(prevTrips =>
        prevTrips.map(trip =>
          trip.id === tripId ? { ...trip, status } : trip
        )
      );
    } catch (err) {
      console.error("Error updating trip status:", err);
    }
  };

  // Add this new handler
  const handleRejectionSubmit = async () => {
    try {
      await updateTripStatus(selectedTrip, "rejected", rejectionComment);
      setTrips(prevTrips =>
        prevTrips.map(trip =>
          trip.id === selectedTrip ? 
          { ...trip, status: "rejected", comment: rejectionComment } : 
          trip
        )
      );
      setRejectionModal(false);
      setRejectionComment("");
      setSelectedTrip(null);
    } catch (err) {
      console.error("Error rejecting trip:", err);
    }
  };

  // Filter trips based on filterStatus prop
  const filteredTrips = trips
    .filter(trip => 
      `${trip.subtitle_user_name} ${trip.subtitle_user_sur_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter(trip => 
      filterStatus ? filterStatus.includes(trip.status) : true
    );

  // Add rejection info to expanded row
  const expandedRowContent = (trip) => (
    <tr>
      <td colSpan="7">
        <div className="p-3">
          <p>დეტალური ინფორმაცია</p>
          <ul>
            <li>მიზანი: {trip.purpose_of_trip}</li>
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
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs title="მივლინებები" breadcrumbItem="ვიზირება" />
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
                  <CardTitle className="h4">მივლინებების ვიზირების გვერდი</CardTitle>
                  <CardSubtitle className="card-title-desc">
                    ქვემოთ მოცემულია მიმდინარე მივლინების მოთხოვნები
                  </CardSubtitle>

                  <div className="table-responsive">
                    <Table className="table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>მომთხოვნი პირი</th>
                          <th>მივლინების ადგილი</th>
                          <th>დაწყების თარიღი</th>
                          <th>დასრულების თარიღი</th>
                          <th>სტატუსი</th>
                          <th>ვიზირება</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTrips.map((trip, index) => (
                          <React.Fragment key={trip.id}>
                            <tr
                              className={
                                trip.status === "rejected"
                                  ? "table-danger"
                                  : trip.status === "approved"
                                  ? "table-success"
                                  : "table-warning"
                              }
                              onClick={() => toggleRow(index)}
                              style={{ cursor: "pointer" }}
                            >
                              <th scope="row">{index + 1}</th>
                              <td>
                                {trip.subtitle_user_name} {trip.subtitle_user_sur_name}
                              </td>
                              <td>{trip.place_of_trip}</td>
                              <td>
                                {new Date(trip.start_date).toLocaleDateString()}
                              </td>
                              <td>
                                {new Date(trip.end_date).toLocaleDateString()}
                              </td>
                              <td>{trip.status}</td>
                              <td>
                                {trip.status === "rejected" ? (
                                  <Button color="danger" disabled>
                                    <i className="bx bx-block font-size-10 align-right me-2"></i>{" "}
                                    უარყოფილია
                                  </Button>
                                ) : trip.status === "approved" ? (
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
                                        handleUpdateStatus(trip.id, "approved")
                                      }
                                    >
                                      <i className="bx bx-check-double font-size-10 align-left me-2"></i>{" "}
                                      დადასტურება
                                    </Button>
                                    <Button
                                      type="button"
                                      color="danger"
                                      onClick={() =>
                                        handleUpdateStatus(trip.id, "rejected")
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
                              expandedRowContent(trip)
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
      
      {/* Add Modal at the end */}
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
  );
};

export default TripPageApprove;
