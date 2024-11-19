import React from "react"
import { Container } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"
import JobData from "./JobData"

const JobGrid = () => {
  document.title = "Jobs Grid | Gorgia LLC"

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Jobs" breadcrumbItem="Jobs Grid" />
          <JobData />
        </Container>
      </div>
    </React.Fragment>
  )
}

export default JobGrid
