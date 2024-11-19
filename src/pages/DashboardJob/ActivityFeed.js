import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col } from 'reactstrap';

// //Import Scrollbar
import SimpleBar from "simplebar-react";
import { activityFeedData } from 'common/data';

const ActivityFeed = () => {
    return (
        <React.Fragment>
            <Col lg={4}>
                <Card>
                    <CardBody>
                        <h4 className="card-title mb-4">Activity Feed</h4>
                        <SimpleBar style={{ maxHeight: "376px" }}>
                            <ul className="verti-timeline list-unstyled">
                                {(activityFeedData || [])?.map((event, index) => (
                                    <li key={index} className="event-list">
                                        <div className="event-timeline-dot">
                                            <i className="bx bx-right-arrow-circle font-size-18"></i>
                                        </div>
                                        <div className="d-flex">
                                            <div className="flex-shrink-0 me-3">
                                                {event.type === "application" && <img src={event.img} alt="" className="avatar-xs rounded-circle" />}
                                                {event.type === "subscription" &&
                                                    <div className="avatar-xs">
                                                        <div className="avatar-title bg-primary-subtle text-primary rounded-circle">
                                                            <i className='bx bx-revision font-size-14'></i>
                                                        </div>
                                                    </div>
                                                }
                                                {event.type === "accountCreation" && <div className="avatar-xs">
                                                    <div className="avatar-title bg-primary-subtle text-primary bg-soft rounded-circle">
                                                        JA
                                                    </div>
                                                </div>}
                                            </div>
                                            <div className="flex-grow-1">
                                                <div>
                                                    {event.type === "application" && (
                                                        <>
                                                            <b>{event.name}</b> {event.action} <b>{event.jobTitle}</b>
                                                        </>
                                                    )}
                                                    {event.type === "subscription" && (
                                                        <>
                                                            {event.message} <a href={event.actionLink}>Renew Now</a>
                                                        </>
                                                    )}
                                                    {event.type === "accountCreation" && (
                                                        <>
                                                            <b>{event.name}</b> {event.action} <b>{event.accountType}</b>.
                                                        </>
                                                    )}
                                                    <p className="mb-0 text-muted">{event.timestamp}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="text-center mt-4"><Link to="#" className="btn btn-primary waves-effect waves-light btn-sm">View More <i className="mdi mdi-arrow-right ms-1"></i></Link></div>
                        </SimpleBar>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment >
    );
}

export default ActivityFeed;