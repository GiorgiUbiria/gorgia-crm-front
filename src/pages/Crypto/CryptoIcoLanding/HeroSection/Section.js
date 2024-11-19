import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";

//Import Countdown
import Countdown from "react-countdown";

const Section = () => {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <span>You are good to go!</span>;
    } else {
      return (
        <>
          <div className="counter-number ico-countdown">
            <div id="days" className="coming-box">
              {days}
              <span>Days</span>
            </div>
            <div id="hours" className="coming-box">
              {hours}
              <span>Hours</span>
            </div>
            <div id="mins" className="coming-box">
              {minutes}
              <span>Hours</span>
            </div>
            <div id="secs" className="coming-box">
              {seconds}
              <span>Seconds</span>
            </div>
            <div id="end" className="h1"></div>
          </div>
        </>
      );
    }
  };

  return (
    <React.Fragment>
      <section className="section hero-section bg-ico-hero" id="home">
        <div className="bg-overlay bg-primary"></div>
        <Container>
          <Row className="align-items-center">
            <Col lg={5}>
              <div className="text-white-50">
                <h1 className="text-white fw-semibold mb-3 hero-title">Gorgia LLC - Ico Landing for a cryptocurrency business</h1>
                <p className="font-size-14">It will be as simple as occidental in fact to an English person, it will seem like simplified as a skeptical Cambridge</p>

                <div className="d-flex flex-wrap gap-2 mt-4">
                  <Link to="#" className="btn btn-success">Get Whitepaper</Link>
                  <Link to="#" className="btn btn-light">How it work</Link>
                </div>
              </div>
            </Col>
            <Col lg={5} md={8} sm={10} className="ms-lg-auto">
              <Card className="overflow-hidden mb-0 mt-5 mt-lg-0">
                <CardHeader className="text-center">
                  <h5 className="mb-0">ICO Countdown time</h5>
                </CardHeader>
                <CardBody>
                  <div className="text-center">

                    <h5>Time left to Ico :</h5>
                    <div className="mt-4">
                      <div className="counter-number ico-countdown"></div>
                      <Countdown date="2025/10/31" renderer={renderer} />
                    </div>

                    <div className="mt-4">
                      <button type="button" className="btn btn-success w-md">Get Token</button>
                    </div>

                    <div className="mt-5">
                      <h4 className="fw-semibold">1 ETH = 2235 SKT</h4>
                      <div className="clearfix mt-4">
                        <h5 className="float-end font-size-14">5234.43</h5>
                      </div>
                      <div className="progress p-1 progress-xl softcap-progress">
                        <div className="progress-bar bg-info" role="progressbar" style={{ width: "15%" }} aria-valuenow="15" aria-valuemin="0" aria-valuemax="100">
                          <div className="progress-label">15 %</div>
                        </div>
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: "30%" }} aria-valuenow="30" aria-valuemin="0" aria-valuemax="100">
                          <div className="progress-label">30 %</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
};

export default Section;
