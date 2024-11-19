import React from "react";
import { Table, Button,  Row, Col, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const ItHelpPage = () => {

  //meta title
  document.title = "ტექნიკური დახმარება | Gorgia LLC";

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="IT" breadcrumbItem=" დახმარება" />

          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">IT დახმარება </CardTitle>
                  <CardSubtitle className="card-title-desc d-flex justify-content-between align-items-center">
                  <div>
                  </div>
                  <div>
                
                  </div>
                </CardSubtitle>
                  <div className="table-responsive">
                    <Table className="table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>საკითხი</th>
                          <th>კატეგორია</th>
                          <th>გამომტანი პირი</th>
                          <th>პრიორიტეტი</th>
                          <th>სტატუსი</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>Mark</td>
                          <td>Otto</td>
                          <td>@mdo</td>
                          <td>@mdo</td>
                          <td>@mdo</td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>Jacob</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                          <td>@mdo</td>
                          <td>@mdo</td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td>Larry</td>
                          <td>the Bird</td>
                          <td>@twitter</td>
                          <td>@mdo</td>
                          <td>@mdo</td>
                        </tr>
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
  )
}

export default ItHelpPage;
