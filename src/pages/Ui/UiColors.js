import React from "react";

import { Col, Row, Container, Card, CardBody } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const UiColors = () => {
  //meta title
  document.title = "Colors | Gorgia LLC";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="UI Elements" breadcrumbItem="Colors" />

          <Row>
            <Col xl={3} md={6}>
              <Card>
                <CardBody className="text-center">
                  <div className="rounded overflow-hidden">
                    <div className="bg-primary p-4">
                      <h5 className="my-2 text-white">#556ee6</h5>
                    </div>
                    <div className="bg-primary bg-gradient p-4">
                      <h5 className="my-2 text-white">bg-gradient</h5>
                    </div>
                    <div className="bg-primary-subtle p-4">
                      <h5 className="my-2 text-primary">bg-primary-subtle</h5>
                    </div>
                  </div>
                  <h5 className="mb-0 mt-3 text-primary">Primary</h5>
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} md={6}>
              <Card>
                <CardBody className="text-center">
                  <div className="rounded overflow-hidden">
                    <div className="bg-success p-4">
                      <h5 className="my-2 text-white">#34c38f</h5>
                    </div>
                    <div className="bg-success bg-gradient p-4">
                      <h5 className="my-2 text-white">bg-gradient</h5>
                    </div>
                    <div className="bg-success-subtle p-4">
                      <h5 className="my-2 text-success">bg-success-subtle</h5>
                    </div>
                  </div>
                  <h5 className="mb-0 mt-3 text-success">Success</h5>
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} md={6}>
              <Card>
                <CardBody className="text-center">
                  <div className="rounded overflow-hidden">
                    <div className="bg-info p-4">
                      <h5 className="my-2 text-white">#50a5f1</h5>
                    </div>
                    <div className="bg-info bg-gradient p-4">
                      <h5 className="my-2 text-white">bg-gradient</h5>
                    </div>
                    <div className="bg-info-subtle p-4">
                      <h5 className="my-2 text-info">bg-info-subtle</h5>
                    </div>
                  </div>
                  <h5 className="mb-0 mt-3 text-info">Info</h5>
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} md={6}>
              <Card>
                <CardBody className="text-center">
                  <div className="rounded overflow-hidden">
                    <div className="bg-warning p-4">
                      <h5 className="my-2 text-white">#f1b44c</h5>
                    </div>
                    <div className="bg-warning bg-gradient p-4">
                      <h5 className="my-2 text-white">bg-gradient</h5>
                    </div>
                    <div className="bg-warning-subtle p-4">
                      <h5 className="my-2 text-warning">bg-warning-subtle</h5>
                    </div>
                  </div>
                  <h5 className="mb-0 mt-3 text-warning">Warning</h5>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={3} md={6}>
              <Card>
                <CardBody className="text-center">
                  <div className="rounded overflow-hidden">
                    <div className="bg-danger p-4">
                      <h5 className="my-2 text-white">#f46a6a</h5>
                    </div>
                    <div className="bg-danger bg-gradient p-4">
                      <h5 className="my-2 text-white">bg-gradient</h5>
                    </div>
                    <div className="bg-danger-subtle p-4">
                      <h5 className="my-2 text-danger">bg-danger-subtle</h5>
                    </div>
                  </div>
                  <h5 className="mb-0 mt-3 text-danger">Danger</h5>
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} md={6}>
              <Card>
                <CardBody className="text-center">
                  <div className="rounded overflow-hidden">
                    <div className="bg-dark p-4">
                      <h5 className="my-2 text-light">#343a40</h5>
                    </div>
                    <div className="bg-dark bg-gradient p-4">
                      <h5 className="my-2 text-light">bg-gradient</h5>
                    </div>
                    <div className="bg-dark-subtle p-4">
                      <h5 className="my-2 text-body">bg-dark-subtle</h5>
                    </div>
                  </div>
                  <h5 className="mb-0 mt-3 text-body">Dark</h5>
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} md={6}>
              <Card>
                <CardBody className="text-center">
                  <div className="rounded overflow-hidden">
                    <div className="bg-secondary p-4">
                      <h5 className="my-2 text-light">#74788d</h5>
                    </div>
                    <div className="bg-secondary bg-gradient p-4">
                      <h5 className="my-2 text-light">bg-gradient</h5>
                    </div>
                    <div className="bg-secondary-subtle p-4">
                      <h5 className="my-2 text-secondary">bg-secondary-subtle</h5>
                    </div>
                  </div>
                  <h5 className="mb-0 mt-3 text-muted">Secondary</h5>
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} md={6}>
              <Card>
                <CardBody className="text-center">
                  <div className="rounded overflow-hidden">

                    <div className="bg-primary opacity-75 p-4">
                      <h5 className="my-2 text-white">opacity-75</h5>
                    </div>
                    <div className="bg-primary opacity-50 p-4">
                      <h5 className="my-2 text-white">opacity-50</h5>
                    </div>
                    <div className="bg-primary opacity-25 p-4">
                      <h5 className="my-2 text-white">opacity-25</h5>
                    </div>
                  </div>
                  <h5 className="mb-0 mt-3 text-muted">Opacity</h5>
                </CardBody>
              </Card>
            </Col>

            <Col xl={3} md={6}>
              <Card>
                <CardBody className="text-center">
                  <div className="rounded overflow-hidden">

                    <div className="bg-primary bg-opacity-75 p-4">
                      <h5 className="my-2">bg-opacity-75</h5>
                    </div>
                    <div className="bg-primary bg-opacity-50 p-4">
                      <h5 className="my-2">bg-opacity-50</h5>
                    </div>
                    <div className="bg-primary bg-opacity-25 p-4">
                      <h5 className="my-2">bg-opacity-25</h5>
                    </div>
                    <div className="bg-primary bg-opacity-10 p-4">
                      <h5 className="my-2">bg-opacity-10</h5>
                    </div>
                  </div>
                  <h5 className="mb-0 mt-3 text-muted">bg Opacity</h5>
                </CardBody>
              </Card>
            </Col>

            <Col xl={3} md={6}>
              <Card>
                <CardBody className="text-center">
                  <div className="rounded overflow-hidden">

                    <div className="p-4">
                      <h5 className="my-2 text-primary text-opacity-75">text-opacity-75</h5>
                    </div>
                    <div className="p-4">
                      <h5 className="my-2 text-primary text-opacity-50">text-opacity-50</h5>
                    </div>
                    <div className="p-4">
                      <h5 className="my-2 text-primary text-opacity-25">text-opacity-25</h5>
                    </div>
                  </div>
                  <h5 className="mb-0 mt-3 text-muted">text Opacity</h5>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UiColors;
