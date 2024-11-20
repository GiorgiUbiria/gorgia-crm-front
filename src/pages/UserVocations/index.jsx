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

      console.log(response);
      
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
          <Row className="mb-3">
            <Col xl={{ size: 4, offset: 8 }}>
              <Input
                type="search"
                placeholder="ძებნა მიზეზის მიხედვით..."
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
                  <CardTitle className="h4">შვებულებების გვერდი</CardTitle>
                  <CardSubtitle className="card-title-desc">
                    ქვემოთ მოცემულია თქვენი შვებულებების ისტორია
                  </CardSubtitle>
                  <div className="table-responsive">
                    <Table className="table mb-0">
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
                        {filteredVocations?.map((vocation, index) => (
                          <React.Fragment key={vocation.id}>
                            <tr 
                              className={`${getRowClass(vocation.status)} cursor-pointer`}
                              onClick={() => toggleRow(index)}
                              style={{ cursor: 'pointer' }}
                            >
                              <th scope="row">{index + 1}</th>
                              <td>{vocation.start_date}</td>
                              <td>{vocation.end_date}</td>
                              <td>{vocation.reason}</td>
                              <td>
                                {vocation.status === "rejected" ? "უარყოფილია" :
                                 vocation.status === "approved" ? "დადასტურებულია" : "მოლოდინში"}
                              </td>
                            </tr>
                            {expandedRows.includes(index) && (
                              <tr>
                                <td colSpan="5">
                                  <div className="p-4">
                                    <h5 className="mb-3">დეტალური ინფორმაცია</h5>
                                    <Row>
                                      <Col md={6}>
                                        <div className="mb-3">
                                          <h6 className="mb-2">შვებულების დეტალები:</h6>
                                          <ul className="list-unstyled">
                                            <li><strong>შვებულების ტიპი:</strong> {
                                              vocation.type_of_vocations === 'paid' ? 'ანაზღაურებადი' :
                                              vocation.type_of_vocations === 'unpaid' ? 'ანაზღაურების გარეშე' :
                                              vocation.type_of_vocations === 'maternity' ? 'დეკრეტული' :
                                              vocation.type_of_vocations === 'administrative' ? 'ადმინისტრაციული' : 'არ არის მითითებული'
                                            }</li>
                                            <li><strong>დაწყების თარიღი:</strong> {vocation.start_date}</li>
                                            <li><strong>დასრულების თარიღი:</strong> {vocation.end_date}</li>
                                            <li><strong>მიზეზი:</strong> {vocation.reason}</li>
                                          </ul>
                                        </div>
                                      </Col>
                                      <Col md={6}>
                                        <div className="mb-3">
                                          <h6 className="mb-2">დასვენების დღეები:</h6>
                                          <ul className="list-unstyled">
                                            {vocation.monday === 'yes' && <li>ორშაბათი</li>}
                                            {vocation.tuesday === 'yes' && <li>სამშაბათი</li>}
                                            {vocation.wednesday === 'yes' && <li>ოთხშაბათი</li>}
                                            {vocation.thursday === 'yes' && <li>ხუთშაბათი</li>}
                                            {vocation.friday === 'yes' && <li>პარასკევი</li>}
                                            {vocation.saturday === 'yes' && <li>შაბათი</li>}
                                            {vocation.sunday === 'yes' && <li>კვირა</li>}
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
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default UserVocation;
