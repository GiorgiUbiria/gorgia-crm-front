import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Nav, NavItem, NavLink } from 'reactstrap';
import { StatisticsApplicationsChart } from './JobCharts';

import { getStatisticData } from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from "reselect";

const StatisticsApplications = () => {
    const [duration, setDuration] = useState('year');

    const dispatch = useDispatch();
    const changeDuration = (duration) => {
        setDuration(duration)
        dispatch(getStatisticData(duration))
    };

    useEffect(() => {
        dispatch(getStatisticData(duration))
    }, [dispatch])

    const DashboardJobProperties = createSelector(
        (state) => state.DashboardJob,
        (dashboardJob) => ({
            statistic_data: dashboardJob.statistic_data
        })
    );

    const {
        statistic_data
    } = useSelector(DashboardJobProperties);

    return (
        <React.Fragment>
            <Col lg={8}>
                <Card>
                    <CardBody>
                        <div className="d-sm-flex flex-wrap">
                            <h4 className="card-title mb-4">Statistics Applications</h4>
                            <div className="ms-auto">
                                <Nav pills>
                                    <NavItem>
                                        <NavLink className={duration === 'week' ? 'active' : ''} href="#" onClick={() => changeDuration('week')}>Week</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className={duration === 'month' ? 'active' : ''} href="#" onClick={() => changeDuration('month')}>Month</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className={duration === 'year' ? 'active' : ''} href="#" onClick={() => changeDuration('year')}>Year</NavLink>
                                    </NavItem>
                                </Nav>
                            </div>
                        </div>
                        <StatisticsApplicationsChart seriesData={statistic_data} dataColors='["--bs-primary", "--bs-success", "--bs-warning", "--bs-info"]' dir="ltr" />
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default StatisticsApplications;