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
                          <tr key={vocation.id} className={getRowClass(vocation.status)}>
                            <th scope="row">{index + 1}</th>
                            <td>{vocation.start_date}</td>
                            <td>{vocation.end_date}</td>
                            <td>{vocation.reason}</td>
                            <td>
                              {vocation.status === "rejected" ? "უარყოფილია" :
                               vocation.status === "approved" ? "დადასტურებულია" : "მოლოდინში"}
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

export default UserVocation;
