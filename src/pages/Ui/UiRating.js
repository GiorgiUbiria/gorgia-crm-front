import React, { useState } from "react";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Row, Col, Card, CardBody, Container } from "reactstrap";


import { Rating } from "react-simple-star-rating";

const UiRating = () => {

  //meta title
  document.title = "Rating | Gorgia LLC";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="UI Elements" breadcrumbItem="Rating" />

          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <Row>
                    <Col xl="3" md="4" sm="6">
                      <div className="p-4 text-center">
                        <h5 className="font-16 m-b-15">Basic Rater</h5>
                        <Rating size={25} />
                      </div>
                    </Col>

                    <Col xl="3" md="4" sm="6">
                      <div className="p-4 text-center">
                        <h5 className="font-16 m-b-15">Initial Value</h5>
                        <Rating
                          size={25}
                          initialValue={3}
                          transition
                          onClick={function noRefCheck() { }}
                        />
                      </div>
                    </Col>

                    <Col xl="3" md="4" sm="6">
                      <div className="p-4 text-center">
                        <h5 className="font-16 m-b-15">
                          Color Range
                        </h5>
                        <Rating
                          size={25}
                          fillColorArray={[
                            '#f14f45',
                            '#f16c45',
                            '#f18845',
                            '#f1b345',
                            '#f1d045'
                          ]}
                          transition
                          onClick={function noRefCheck() { }}
                        />
                      </div>
                    </Col>

                    <Col xl="3" md="4" sm="6">
                      <div className="p-4 text-center">
                        <h5 className="font-16 m-b-15">
                          With Tooltip
                        </h5>
                        <Rating
                          size={25}
                          showTooltip
                          onClick={function noRefCheck() { }}
                        />
                      </div>
                    </Col>

                    <Col xl="3" md="4" sm="6">
                      <div className="p-4 text-center">
                        <h5 className="font-16 m-b-15">Custom Tooltip</h5>
                        <Rating
                          size={25}
                          showTooltip
                          tooltipArray={[
                            'Terrible',
                            'Bad',
                            'Average',
                            'Great',
                            'Prefect'
                          ]}
                          onClick={function noRefCheck() { }}
                        />
                      </div>
                    </Col>

                    <Col xl="3" md="4" sm="6">
                      <div className="p-4 text-center">
                        <h5 className="font-16 m-b-15">Read Only Mode</h5>
                        <Rating
                          size={25}
                          initialValue={2}
                          readonly
                          onClick={function noRefCheck() { }}
                        />
                      </div>
                    </Col>

                    <Col xl="3" md="4" sm="6">
                      <div className="p-4 text-center">
                        <h5 className="font-16 m-b-15">Fraction Rate</h5>
                        <Rating
                          size={25}
                          allowFraction
                          showTooltip
                          tooltipArray={[
                            'Terrible',
                            'Terrible+',
                            'Bad',
                            'Bad+',
                            'Average',
                            'Average+',
                            'Great',
                            'Great+',
                            'Awesome',
                            'Awesome+'
                          ]}
                          transition
                          onClick={function noRefCheck() { }}
                        />
                      </div>
                    </Col>

                    <Col xl="3" md="4" sm="6">
                      <div className="p-4 text-center">
                        <h5 className="font-16 m-b-15">
                          Disable Hover
                        </h5>
                        <Rating size={25} onClick={function noRefCheck() { }} />
                      </div>
                    </Col>

                    <Col xl="3" md="4" sm="6">
                      <div className="p-4 text-center">
                        <h5 className="font-16 m-b-15">
                          Disable Fill Hover
                        </h5>
                        <Rating
                          disableFillHover
                          size={25}
                          onClick={function noRefCheck() { }}
                        />
                      </div>
                    </Col>

                    <Col xl="3" md="4" sm="6">
                      <div className="p-4 text-center">
                        <h5 className="font-16 m-b-15">
                          RTL Support
                        </h5>
                        <Rating
                          size={25}
                          onClick={function noRefCheck() { }}
                          rtl
                          showTooltip
                          titleSeparator="من"
                          tooltipArray={[
                            'Very bad',
                            'bad',
                            'medium',
                            'amazing',
                            'Prominent'
                          ]}
                          tooltipDefaultText="Evaluation"
                        />

                      </div>
                    </Col>

                    <Col xl="3" md="4" sm="6">
                      <div className="p-4 text-center">
                        <h5 className="font-16 m-b-15">On Pointer Enter</h5>
                        <Rating
                          size={25}
                          onClick={function noRefCheck() { }}
                          onPointerEnter={function noRefCheck() { }}
                        />
                      </div>
                    </Col>

                    <Col xl="3" md="4" sm="6">
                      <div className="p-4 text-center">
                        <h5 className="font-16 m-b-15">On Pointer Leave</h5>
                        <Rating
                          size={25}
                          onClick={function noRefCheck() { }}
                          onPointerLeave={function noRefCheck() { }}
                        />
                      </div>
                    </Col>

                    <Col xl="3" md="4" sm="6">
                      <div className="p-4 text-center">
                        <h5 className="font-16 m-b-15">On Pointer Move</h5>
                        <Rating
                          size={25}
                          onClick={function noRefCheck() { }}
                          onPointerMove={function noRefCheck() { }}
                        />
                      </div>
                    </Col>

                  </Row>{" "}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default UiRating;
