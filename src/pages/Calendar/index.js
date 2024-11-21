import React from 'react';
import { Container, Row, Col } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import MeetingCalendar from '../FullCalendar/MeetingCalendar';

export default function Calendar() {
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Calendar" breadcrumbItem="Meetings" />
        <Row>
          <Col xs={12}>
            <MeetingCalendar />
          </Col>
        </Row>
      </Container>
    </div>
  );
}