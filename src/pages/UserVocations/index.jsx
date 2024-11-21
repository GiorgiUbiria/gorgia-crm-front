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

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getCurrentUserVocations } from "services/vacation";
import "./UserVocations.scss" // Create this new file for styles

const UserVocation = () => {
  // Meta title
  document.title = "შვებულებები | Gorgia LLC";

  const [vocations, setVocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState([]);

  // Fetch the current user's vocations from the API
  const fetchVocations = async () => {
    try {
      const response = await getCurrentUserVocations();
      setVocations(response.data.data); // Assuming 'vocations' is the key holding the vocations
    } catch (err) {
      console.error("Error fetching vocations:", err);
    }
  };

  useEffect(() => {
    fetchVocations();
  }, []);

  // Determine the row class based on the vocation status
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

  console.log(vocations);


  const filteredVocations = vocations.filter(vocation =>
    vocation.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRow = (index) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter((i) => i !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs title="შვებულებები" breadcrumbItem="ჩემი შვებულებები" />
            </Col>
          </Row>
          
          <Card className="vacation-history-card">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <CardTitle className="h4 mb-1">შვებულებების ისტორია</CardTitle>
                  <CardSubtitle className="text-muted">
                    თქვენი შვებულებების სრული ისტორია
                  </CardSubtitle>
                </div>
                <div className="search-box">
                  <div className="position-relative">
                    <Input
                      type="text"
                      className="form-control modern-search"
                      placeholder="ძებნა მიზეზის მიხედვით..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="bx bx-search-alt search-icon"></i>
                  </div>
                </div>
              </div>

              <div className="vacation-table-modern">
                <div className="table-responsive">
                  <Table className="table-modern mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>დაწყების თარიღი</th>
                        <th>დასრულების თარიღი</th>
                        <th>მიზეზი</th>
                        <th>სტატუსი</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVocations.map((vocation, index) => (
                        <React.Fragment key={vocation.id}>
                          <tr
                            onClick={() => toggleRow(index)}
                            className={`vacation-row status-${vocation.status}`}
                          >
                            <td className="index-column">{index + 1}</td>
                            <td>
                              <div className="date-wrapper">
                                <i className="bx bx-calendar me-2"></i>
                                {vocation.start_date}
                              </div>
                            </td>
                            <td>
                              <div className="date-wrapper">
                                <i className="bx bx-calendar-check me-2"></i>
                                {vocation.end_date}
                              </div>
                            </td>
                            <td>
                              <div className="reason-wrapper">
                                <i className="bx bx-note me-2"></i>
                                {vocation.reason}
                              </div>
                            </td>
                            <td>
                              <span className={`status-badge status-${vocation.status}`}>
                                <i className={`bx ${
                                  vocation.status === "rejected"
                                    ? "bx-x-circle"
                                    : vocation.status === "approved"
                                    ? "bx-check-circle"
                                    : "bx-time"
                                } me-2`}></i>
                                {vocation.status === "rejected"
                                  ? "უარყოფილია"
                                  : vocation.status === "approved"
                                  ? "დადასტურებულია"
                                  : "მოლოდინში"}
                              </span>
                            </td>
                          </tr>
                          {expandedRows.includes(index) && (
                            <tr className="expanded-row">
                              <td colSpan="5">
                                <div className="expanded-content">
                                  <h5 className="mb-3">
                                    <i className="bx bx-info-circle me-2"></i>
                                    დეტალური ინფორმაცია
                                  </h5>
                                  <Row>
                                    <Col md={6}>
                                      <div className="info-section">
                                        <h6 className="info-title">
                                          <i className="bx bx-detail me-2"></i>
                                          შვებულების დეტალები
                                        </h6>
                                        <ul className="info-list">
                                          <li>
                                            <span className="label">შვებულების ტიპი:</span>
                                            <span className="value">
                                              {vocation.type_of_vocations === 'paid' ? 'ანაზღაურებადი' :
                                                vocation.type_of_vocations === 'unpaid' ? 'ანაზღაურების გარეშე' :
                                                  vocation.type_of_vocations === 'maternity' ? 'დეკრეტული' :
                                                    vocation.type_of_vocations === 'administrative' ? 'ადმინისტრაციული' : 'არ არის მითითებული'}
                                            </span>
                                          </li>
                                          <li>
                                            <span className="label">დაწყების თარიღი:</span>
                                            <span className="value">{vocation.start_date}</span>
                                          </li>
                                          <li>
                                            <span className="label">დასრულების თარიღი:</span>
                                            <span className="value">{vocation.end_date}</span>
                                          </li>
                                          <li>
                                            <span className="label">მიზეზი:</span>
                                            <span className="value">{vocation.reason}</span>
                                          </li>
                                        </ul>
                                      </div>
                                    </Col>
                                    <Col md={6}>
                                      <div className="info-section">
                                        <h6 className="info-title">
                                          <i className="bx bx-calendar-week me-2"></i>
                                          დასვენების დღეები
                                        </h6>
                                        <div className="days-grid">
                                          {vocation.monday === 'yes' && <span className="day-badge">ორშაბათი</span>}
                                          {vocation.tuesday === 'yes' && <span className="day-badge">სამშაბათი</span>}
                                          {vocation.wednesday === 'yes' && <span className="day-badge">ოთხშაბათი</span>}
                                          {vocation.thursday === 'yes' && <span className="day-badge">ხუთშაბათი</span>}
                                          {vocation.friday === 'yes' && <span className="day-badge">პარასკევი</span>}
                                          {vocation.saturday === 'yes' && <span className="day-badge">შაბათი</span>}
                                          {vocation.sunday === 'yes' && <span className="day-badge">კვირა</span>}
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>
                                  {vocation.status === "rejected" && vocation.comment && (
                                    <div className="rejection-section mt-3">
                                      <h6 className="info-title text-danger">
                                        <i className="bx bx-message-square-x me-2"></i>
                                        უარყოფის მიზეზი
                                      </h6>
                                      <div className="rejection-content">
                                        <p>{vocation.comment}</p>
                                        <div className="reviewer-info">
                                          <small>
                                            <i className="bx bx-user me-2"></i>
                                            უარყო: {vocation.reviewed_by?.name} {vocation.reviewed_by?.sur_name}
                                          </small>
                                          {vocation.reviewed_at && (
                                            <small className="ms-3">
                                              <i className="bx bx-time-five me-2"></i>
                                              {new Date(vocation.reviewed_at).toLocaleString('ka-GE')}
                                            </small>
                                          )}
                                        </div>
                                      </div>
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
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default UserVocation;
