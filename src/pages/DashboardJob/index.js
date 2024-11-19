import React from 'react';
import { Container, Row } from 'reactstrap';

//Import Components
import ActivityFeed from './ActivityFeed';
import AddedJobs from './AddedJobs';
import CandidateSection from './CandidateSection';
import ChartSection from './ChartSection';
import JobVacancy from './JobVacancy';
import ReceivedTime from './ReceivedTime';
import Section from './Section';
import StatisticsApplications from './StatisticsApplications';

const DashboardJob = () => {

    document.title = "Job Dashboard | Gorgia LLC"
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>

                    <Section />

                    <ChartSection />
                    <Row>
                        <StatisticsApplications />
                        <CandidateSection />
                    </Row>

                    <Row>
                        <JobVacancy />
                    </Row>

                    <Row>
                        <ReceivedTime />
                        <ActivityFeed />
                        <AddedJobs />
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default DashboardJob;