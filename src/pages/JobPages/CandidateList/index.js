import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Row, Collapse, Label, Input } from 'reactstrap';

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import List from './List';

import "flatpickr/dist/themes/material_blue.css";
import FlatPickr from "react-flatpickr";

// selector
import Select from "react-select";
import { experienceData, jobListCandidate, jobType } from 'common/data';
import Spinners from 'components/Common/Spinner';
import { handleSearchData } from 'components/Common/searchFile';

const CandidateList = () => {
    document.title = "Candidate List | Gorgia LLC";

    const [listData, setListData] = useState();
    const [isLoading, setLoading] = useState(true)

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const [selectDate, setSelectDate] = useState();
    const dateChange = (date) => {
        setSelectDate(date)
    };

    useEffect(() => setListData(jobListCandidate), [jobListCandidate])

    // search
    const hanldeSearchJob = (value) => {
        let search = value;
        handleSearchData({ setState: setListData, data: jobListCandidate, item: search })
    }

    const options = [
        { value: "Freelance", label: "Freelance" },
        { value: "Full Time", label: "Full Time" },
        { value: "Part Time", label: "Part Time" },
        { value: "Internship", label: "Internship" },
    ]

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {/* Render Breadcrumbs */}
                    <Breadcrumbs title="Jobs" breadcrumbItem="Candidate List" />

                    <Row>
                        <Col lg={12}>
                            <Card className="job-filter">
                                <CardBody>
                                    <form action="#">
                                        <Row className="g-3">
                                            <Col xxl={4} lg={4}>
                                                <div className="position-relative">
                                                    <Input type="text" id="searchJob" autoComplete="off" placeholder="Search your candidate" onChange={(e) => hanldeSearchJob(e.target.value)} />
                                                </div>
                                            </Col>

                                            <Col xxl={2} lg={4}>
                                                <div className="position-relative">
                                                    <Input type="text" id="locationInput" autoComplete="off" placeholder="San Francisco, LA" onChange={(e) => hanldeSearchJob(e.target.value)} />
                                                </div>
                                            </Col>

                                            <Col xxl={2} lg={4}>
                                                <div className="position-relative">
                                                    <Select
                                                        className="select2"
                                                        onChange={(e) => {
                                                            hanldeSearchJob(e.value);
                                                        }} options={options} />
                                                </div>
                                            </Col>

                                            <Col xxl={2} lg={6}>
                                                <div className="position-relative">
                                                    <div id="datepicker1">
                                                        <FlatPickr
                                                            className="form-control"
                                                            name="joiningDate"
                                                            placeholder="Select date"
                                                            options={{
                                                                dateFormat: "d M, Y"
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
                                                    <a href="#!" onClick={toggle} className="btn btn-secondary h-100 w-100">
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
                                                                <Label htmlFor="qualificationInput" className="form-label fw-semibold">Qualification</Label>
                                                                <Input type="text" className="form-control" id="qualificationInput" autoComplete="off" placeholder="Qualification" />
                                                                <i className="ri-government-line filter-icon"></i>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Collapse>
                                        </Row>
                                    </form>
                                </CardBody>
                            </Card>
                        </Col>

                    </Row>
                    {
                        isLoading ? <Spinners setLoading={setLoading} /> :
                            <List listData={listData} />
                    }
                </Container>
            </div>
        </React.Fragment>
    );
}

export default CandidateList;