import React from 'react';
import { Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { recentAddedJobsData } from 'common/data';
import { Link } from 'react-router-dom';

// //Import Scrollbar
import SimpleBar from "simplebar-react";

const AddedJobs = () => {
    return (
        <React.Fragment>
            <Col lg={4}>
                <Card>
                    <CardBody>
                        <h4 className="card-title mb-4">Recent Added Jobs</h4>
                        <SimpleBar style={{ maxHeight: "376px" }}>
                            <div className="vstack gap-4">
                                {(recentAddedJobsData || [])?.map((job, index) => (
                                    <div className="d-flex" key={index}>
                                        <img src={job.logo} alt="" height="40" className="rounded" />
                                        <div className="ms-2 flex-grow-1">
                                            <h6 className="mb-1 font-size-15">
                                                <Link to="/job-details" className="text-body">{job.jobTitle}</Link>
                                            </h6>
                                            <p className="text-muted mb-0">{job.company} - <b>{job.postedTime}</b> {job.postedText}</p>
                                        </div>
                                        <UncontrolledDropdown>
                                            <DropdownToggle className="btn btn-light" type="button" id={`dropdownMenuButton${index}`}>
                                                <i className="bx bx-dots-vertical-rounded"></i>
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu" aria-labelledby={`dropdownMenuButton${index}`}>
                                                <DropdownItem tag="a" href="/job-details">View Details</DropdownItem>
                                                <DropdownItem href="#!">Apply Now</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                ))}
                            </div>
                        </SimpleBar>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
}

export default AddedJobs;