import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";
import { activityDataDashboard } from "common/data";

const ActivityComp = () => {
  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <CardTitle className="mb-5">Activity</CardTitle>
          <ul className="verti-timeline list-unstyled">
            {
              (activityDataDashboard || [])?.map((item, index) => (
                <li className={`event-list ${item.active && "active"}`} key={index}>
                  <div className="event-timeline-dot">
                    <i className={`font-size-18 bx ${item.active ? "bxs-right-arrow-circle bx-fade-right" : "bx-right-arrow-circle"}`} />
                  </div>
                  <div className="flex-shrink-0 d-flex">
                    <div className="me-3">
                      <h5 className="font-size-14">
                        {item.date}
                        <i className="bx bx-right-arrow-alt font-size-16 text-primary align-middle ms-2" />
                      </h5>
                    </div>
                    <div className="flex-grow-1">
                      <div>{item.activity}</div>
                    </div>
                  </div>
                </li>
              ))
            }
          </ul>
          <div className="text-center mt-4">
            <Link to="#" className="btn btn-primary waves-effect waves-light btn-sm">
              View More <i className="mdi mdi-arrow-right ms-1" />
            </Link>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default ActivityComp;