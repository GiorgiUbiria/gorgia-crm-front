import React, { useEffect, useState } from "react"
import { Container, Row } from "reactstrap"

import Breadcrumbs from "components/Common/Breadcrumb"
import Overview from "./Overview"
import DetailsSection from "./DetailsSection"
import { useParams } from "react-router-dom"
import { getTask } from "services/tasks"

const JobDetails = () => {
  document.title = "Job Details | Gorgia LLC"

  const { id } = useParams()
  const [task, setTask] = useState(null)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await getTask(id)
        if (response) {
          setTask(response)
        } else {
          console.error("Task not found or response format is incorrect")
        }
      } catch (error) {
        console.error("Error fetching task details:", error)
      }
    }

    fetchTask()
  }, [id])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Jobs" breadcrumbItem="IT მხარდაჭერა" />
          <Row>
            <Overview task={task} />
            {task ? (
              <DetailsSection task={task} />
            ) : (
              <div>Loading task details...</div>
            )}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default JobDetails
