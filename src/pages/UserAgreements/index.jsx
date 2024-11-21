import React, { useEffect, useState } from "react";
import { Table, Button, Row, Col, Card, CardBody, Input } from "reactstrap";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getUserAgreemnets } from "services/agreement";

const UserAgreements = () => {
  document.title = "ხელშეკრულებები | Gorgia LLC";

  const [agreements, setAgreements] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAgreements = async () => {
    try {
      const response = await getUserAgreemnets();
      setAgreements(response.data.data);
    } catch (err) {
      console.error("Error fetching agreements:", err);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, []);

  const toggleRow = (index) => {
    const isRowExpanded = expandedRows.includes(index);
    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter((rowIndex) => rowIndex !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  const downloadDocument = (fileUrl) => {
    const newWindow = window.open(fileUrl, '_blank');

    newWindow.focus();
    newWindow.print();
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

  const filteredAgreements = agreements.filter(agreement =>
    agreement.performer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(agreements);

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs title="ხელშეკრულებები" breadcrumbItem="ჩემი ხელშეკრულებები" />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xl={{ size: 4, offset: 8 }}>
              <Input
                type="search"
                placeholder="ძებნა შემსრულებლის მიხედვით..."
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
                  <div className="table-responsive">
                    <Table className="table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>შემსრულებელი</th>
                          <th>მომსახურების აღწერა</th>
                          <th>ხელშეკრულების ვადა</th>
                          <th>სტატუსი</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAgreements.map((agreement, index) => (
                          <React.Fragment key={agreement.id}>
                            <tr
                              className={getRowClass(agreement.status)}
                              onClick={() => toggleRow(index)}
                              style={{ cursor: "pointer" }}
                            >
                              <th scope="row">{index + 1}</th>
                              <td>{agreement.performer_name}</td>
                              <td>{agreement.service_description}</td>
                              <td>{agreement.contract_duration} დღე</td>
                              <td>
                                {agreement.status === "rejected"
                                  ? "უარყოფილია"
                                  : agreement.status === "approved"
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
                                      <li>შემსრულებლის სრული დასახელება: {agreement.performer_name}</li>
                                      <li>საიდენტიფიკაციო კოდი ან პირადი ნომერი: {agreement.id_code_or_personal_number}</li>
                                      <li>იურიდიული მისამართი / ფაქტიური მისამართი: {agreement.legal_or_actual_address}</li>
                                      <li>საკონტაქტო ინფორმაცია: {agreement.contact_info}</li>
                                      <li>ხელშეკრულების დასაწყისი: {agreement.contract_start_period}</li>
                                      <li>მომსახურების ფასი: {agreement.service_price}</li>
                                    </ul>
                                    {agreement.status === "approved" && (
                                      <Button
                                        color="primary"
                                        onClick={() =>
                                          downloadDocument(`${process.env.REACT_APP_BASE_URL}/${agreement.file_path}`)
                                        }
                                      >
                                        ხელშეკრულების ჩამოტვირთვა
                                      </Button>
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

export default UserAgreements;