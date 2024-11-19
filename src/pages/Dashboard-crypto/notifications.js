import { notificationsData } from "common/data";
import React from "react";
import { Col, Card, CardBody } from "reactstrap";

//Simple bar
import SimpleBar from "simplebar-react";

const Notifications = () => {
  return (
    <React.Fragment>
      <Col xl="4">
        <Card>
          <CardBody>
            <h4 className="card-title mb-4">Notifications</h4>
            <SimpleBar style={{ maxHeight: "390px" }}>
              <ul className="list-group">
                {(notificationsData || []).map((item, index) => (
                  <li className="list-group-item border-0" key={index}>
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar-xs">
                          <span className="avatar-title rounded-circle bg-light">
                            <img src={item.avatar} alt="" height="18" />
                          </span>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="font-size-14">{item.title}</h5>
                        <p className="text-muted">{item.description}</p>

                        <div className="float-end">
                          <p className="text-muted mb-0">
                            <i className="mdi mdi-account me-1" /> {item.author}
                          </p>
                        </div>
                        <p className="text-muted mb-0">{item.date}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </SimpleBar>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default Notifications;
