import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row, Label, Input, Form, Collapse, FormFeedback } from 'reactstrap';
import { Link } from 'react-router-dom';

// format number
import { PatternFormat } from "react-number-format";

// flatpickr
import "flatpickr/dist/themes/material_blue.css";
import FlatPickr from "react-flatpickr";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { experienceData, jobType, jobsGridData } from 'common/data';
import Spinners from 'components/Common/Spinner';
import Paginations from 'components/Common/Pagination';

const JobData = () => {
    const [modal, setModal] = useState(false);
    const [isLoading, setLoading] = useState(true)
    const [selectDate, setSelectDate] = useState();
    const dateChange = (date) => {
        setSelectDate(date);
    };
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    // pagination
    const [jobData, setJobData] = useState()
    const [currentPage, setCurrentPage] = useState(1);
    const perPageData = 8;
    const indexOfLast = currentPage * perPageData;
    const indexOfFirst = indexOfLast - perPageData;
    const currentdata = useMemo(() => jobsGridData?.slice(indexOfFirst, indexOfLast), [jobsGridData, indexOfFirst, indexOfLast])

    useEffect(() => {
        setJobData(currentdata);
    }, [currentdata]);

    // validation
    const validation = useFormik({
        initialValues: {
            fullnameInput: '',
            emailInput: '',
            phoneNumberInput: '',
            uploadResume: '',
            messageInput: '',
        },
        validationSchema: Yup.object({
            fullnameInput: Yup.string().required("Please Enter Your Name"),
            emailInput: Yup.string().required("Please Enter Your Email"),
            phoneNumberInput: Yup.string().required("Please Enter Your Number"),
            uploadResume: Yup.string().required("Add Your Resume"),
            messageInput: Yup.string().required("Please Enter Your Message"),
        }),
        onSubmit: (values) => {
            setModal();
            validation.resetForm();
        }
    });

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <Card className="job-filter">
                        <CardBody>
                            <Form>
                                <Row className="g-3">
                                    <Col xxl={4} lg={4}>
                                        <div className="position-relative">
                                            <Input type="text" className="form-control" id="searchJob" placeholder="Search your job" />
                                        </div>
                                    </Col>

                                    <Col xxl={2} lg={4}>
                                        <div className="position-relative">
                                            <Input type="text" className="form-control" id="locationInput" placeholder="San Francisco, LA" />
                                        </div>
                                    </Col>

                                    <Col xxl={2} lg={4}>
                                        <div className="position-relative">
                                            <Input type="text" className="form-control" id="jobCategories" placeholder="Job Categories" />
                                        </div>
                                    </Col>

                                    <Col xxl={2} lg={6}>
                                        <div className="position-relative">
                                            <div id="datepicker1">
                                                <FlatPickr
                                                    className="form-control"
                                                    placeholder="Select time"
                                                    options={{
                                                        dateFormat: "d M,Y"
                                                    }}
                                                    selected={selectDate}
                                                    onChange={dateChange}
                                                />
                                            </div>
                                        </div>
                                    </Col>

                                    <Col xxl={2} lg={6}>
                                        <div className="position-relative h-100 hstack gap-3">
                                            <button type="button" className="btn btn-primary h-100 w-100"><i className="bx bx-search-alt align-middle"></i> Find Jobs</button>
                                            <a href="#" onClick={toggle} className="btn btn-secondary h-100 w-100">
                                                <i className="bx bx-filter-alt align-middle"></i> Advance</a>
                                        </div>
                                    </Col>

                                    <Collapse isOpen={isOpen} id="collapseExample">
                                        <div>
                                            <Row className="g-3">
                                                <Col xxl={4} lg={6}>
                                                    <div>
                                                        <Label htmlFor="experience" className="form-label fw-semibold">Experience</Label>
                                                    </div>
                                                    {
                                                        (experienceData || []).map((item, index) => (
                                                            <div className="form-check form-check-inline" key={index}>
                                                                <Input className="form-check-input" type="checkbox" id={`inlineCheckbox${item.id}`} value={item.value} />
                                                                <Label className="form-check-label" htmlFor={`inlineCheckbox${item.id}`}>{item.label}</Label>
                                                            </div>
                                                        ))
                                                    }
                                                </Col>
                                                <Col xxl={4} lg={6}>
                                                    <div>
                                                        <Label htmlFor="jobType" className="form-label fw-semibold">Job Type</Label>
                                                    </div>
                                                    {
                                                        (jobType || []).map((item, index) => (
                                                            <div className="form-check form-check-inline" key={index}>
                                                                <Input type="checkbox" id={`inlineCheckbox${item.id}`} value={item.value} />
                                                                <Label className="form-check-label" htmlFor={`inlineCheckbox${item.id}`}>{item.label}</Label>
                                                            </div>
                                                        ))
                                                    }
                                                </Col>
                                                <Col xxl={4} lg={4}>
                                                    <div className="position-relative">
                                                        <Label htmlFor="qualificationInput" className="fw-semibold">Qualification</Label>
                                                        <Input type="text" id="qualificationInput" autoComplete="off" placeholder="Qualification" />
                                                        <i className="ri-government-line filter-icon"></i>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Collapse>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            {
                isLoading ? <Spinners setLoading={setLoading} />
                    :
                    <>
                        <Row>
                            {(jobData || []).map((item, key) => (
                                <Col xl={3} md={6} key={key}>
                                    <Card>
                                        <CardBody>
                                            <div className="favorite-icon">
                                                <Link to="#"><i className="uil uil-heart-alt fs-18"></i></Link>
                                            </div>
                                            <img src={item.img} alt="" height="50" className="mb-3" />
                                            <h5 className="fs-17 mb-2">
                                                <Link to="/job-details" className="text-dark">{item.title}</Link> <small className="text-muted fw-normal">(0-2 Yrs Exp.)</small></h5>
                                            <ul className="list-inline mb-0">
                                                <li className="list-inline-item">
                                                    <p className="text-muted fs-14 mb-1">Gorgia LLC Technology Pvt.Ltd</p>
                                                </li>{" "}
                                                <li className="list-inline-item">
                                                    <p className="text-muted fs-14 mb-0"><i className="mdi mdi-map-marker"></i> {item.location}</p>
                                                </li>
                                                <li className="list-inline-item">
                                                    <p className="text-muted fs-14 mb-0"><i className="uil uil-wallet"></i> $250 - $800 / month</p>
                                                </li>
                                            </ul>
                                            <div className="mt-3 hstack gap-2">
                                                <span className="badge rounded-1 badge-soft-success">Full Time</span>
                                                <span className="badge rounded-1 badge-soft-warning">Urgent</span>
                                                <span className="badge rounded-1 badge-soft-info">Private</span>
                                            </div>
                                            <div className="mt-4 hstack gap-2">
                                                <Link to="/job-details" className="btn btn-soft-success w-100">View Profile</Link>
                                                <Link to="#applyJobs" onClick={() => setModal(true)} className="btn btn-soft-primary w-100">Apply Now</Link>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        <Paginations
                            perPageData={perPageData}
                            data={jobsGridData}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            isShowingPageLength={true}
                            paginationDiv="col-sm-12 col-md-7"
                            paginationClass="pagination justify-content-end pagination-rounded"
                        />
                    </>
            }


            {/* Modal */}
            <Modal
                isOpen={modal}
                toggle={() => {
                    setModal();
                }}
                id="applyJobs"
            >
                <div className="modal-content">
                    <ModalHeader toggle={() => setModal()} id="applyJobsLabel" className="modal-header">
                        Apply For This Job
                    </ModalHeader>
                    <ModalBody>
                        <Form onSubmit={validation.handleSubmit} autoComplete='off'>
                            <Row>
                                <Col lg={12}>
                                    <div className="mb-3">
                                        <Label htmlFor="fullnameInput">Full Name</Label>
                                        <Input type="text" id="fullnameInput" name="fullnameInput" placeholder="Enter your name" value={validation.values.fullnameInput} onChange={validation.handleChange} />
                                        {
                                            validation.touched.fullnameInput && validation.errors.fullnameInput ?
                                                <FormFeedback type="invalid" className='d-block'>{validation.errors.fullnameInput}</FormFeedback>
                                                : null
                                        }
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className="mb-3">
                                        <Label htmlFor="emailInput">Email</Label>
                                        <Input type="email" id="emailInput" name="emailInput" placeholder="Enter your email" value={validation.values.emailInput} onChange={validation.handleChange} />
                                        {
                                            validation.touched.emailInput && validation.errors.emailInput ?
                                                <FormFeedback type="invalid" className='d-block'>{validation.errors.emailInput}</FormFeedback>
                                                : null
                                        }
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className="mb-3">
                                        <Label htmlFor="phoneNumberInput">Phone Number</Label>
                                        <PatternFormat className="form-control" name="phoneNumberInput" placeholder="Enter your number" value={validation.values.phoneNumberInput || ""} onChange={validation.handleChange} format="###-###-####" />

                                        {
                                            validation.touched.phoneNumberInput && validation.errors.phoneNumberInput ?
                                                <FormFeedback type="invalid" className='d-block'>{validation.errors.phoneNumberInput}</FormFeedback>
                                                : null
                                        }
                                    </div>
                                </Col>
                                <Col lg={12}>
                                    <div className="mb-3">
                                        <Label htmlFor="uploadResume">Upload Resume</Label>
                                        <Input type="file" id="uploadResume" nae='uploadResume' placeholder="Upload resume" value={validation.values.uploadResume} onChange={validation.handleChange} />
                                        {
                                            validation.touched.uploadResume && validation.errors.uploadResume ?
                                                <FormFeedback type="invalid" className='d-block'>{validation.errors.uploadResume}</FormFeedback>
                                                : null
                                        }
                                    </div>
                                </Col>
                                <Col lg={12}>
                                    <div className="mb-4">
                                        <Label htmlFor="messageInput">Message</Label>
                                        <textarea className="form-control" id="messageInput" name="messageInput" rows="3" placeholder="Enter your message" value={validation.values.messageInput} onChange={validation.handleChange}></textarea>
                                        {
                                            validation.touched.messageInput && validation.errors.messageInput ?
                                                <FormFeedback type="invalid" className='d-block'>{validation.errors.messageInput}</FormFeedback>
                                                : null
                                        }
                                    </div>
                                </Col>
                                <Col lg={12}>
                                    <div className="text-end">
                                        <button type='submit' className="btn btn-success me-1">Send Application <i className="bx bx-send align-middle"></i></button>
                                        <button className="btn btn-outline-secondary" onClick={() => setModal()}>Cancel</button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </ModalBody>
                </div>
            </Modal>
        </React.Fragment>
    );
};

export default JobData;