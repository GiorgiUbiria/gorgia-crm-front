import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardBody, Col, Button } from "reactstrap"
import { startTask, finishTask } from "services/tasks"

import { fetchUser } from "services/user"

const Overview = ({ task }) => {
  const [isTaskStarted, setIsTaskStarted] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [user, setUser] = useState({})

  useEffect(() => {
    if (task && task.status === "In Progress") {
      setIsTaskStarted(true)
      setStartTime(new Date(task.start_time))
    }
  }, [task])

  const handleApplyNowClick = async () => {
    try {
      await startTask(task.id)
      setIsTaskStarted(true)
      setStartTime(new Date())
    } catch (error) {
      console.error("Error starting task:", error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchUser()
      setUser(response.data)
    }

    fetchData()
  }, [])

  const handleFinishTaskClick = async () => {
    if (isTaskStarted) {
      const finishTime = new Date()
      setEndTime(finishTime)

      const timeDiff = (finishTime - startTime) / 1000 / 60 
      setElapsedTime(timeDiff)

      try {
        await finishTask(task.id)
        alert(`Task finished! Elapsed time: ${timeDiff.toFixed(2)} minutes.`)
      } catch (error) {
        console.error("Error finishing task:", error)
      } finally {
        setIsTaskStarted(false)
      }
    }
  }

  return (
    <React.Fragment>
      <Col xl={3}>
        <Card>
          <CardBody>
            <h5 className="fw-semibold">Overview</h5>

            <div className="table-responsive">
              <table className="table">
                <tbody>
                  <tr>
                    <th scope="col">პრიორიტეტი</th>
                    <td scope="col">{task?.priority || "N/A"}</td>
                  </tr>
                  <tr>
                    <th scope="row">სტატუსი:</th>
                    <td>{task?.status || "N/A"}</td>
                  </tr>
                  <tr>
                    <th scope="row">ბილეთი გახსნილია</th>
                    <td>{task?.start_time || "N/A"}</td>
                  </tr>
                  <tr>
                    <th scope="row">ბილეთი განახლებულია</th>
                    <td>
                      <span className="badge badge-soft-success">
                        {task?.end_time || "N/A"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="hstack gap-2">
              {!isTaskStarted ? (
                <Button
                  className="btn btn-soft-primary w-100"
                  onClick={handleApplyNowClick}
                >
                  Start Task
                </Button>
              ) : (
                <Button
                  className="btn btn-soft-success w-100"
                  onClick={handleFinishTaskClick}
                >
                  Finish Task
                </Button>
              )}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="text-center">
              <img
                src={user?.profile_picture}
                alt=""
                height="50"
                className="mx-auto d-block"
              />
              <h5 className="mt-3 mb-1">GORGIA</h5>
              <p className="text-muted mb-0">Since July 2017</p>
            </div>

            <ul className="list-unstyled mt-4">
              <li>
                <div className="d-flex">
                  <i className="bx bx-phone text-primary fs-4"></i>
                  <div className="ms-3">
                    <h6 className="fs-14 mb-2">Phone</h6>
                    <p className="text-muted fs-14 mb-0">
                      {user?.mobile_number}
                    </p>
                  </div>
                </div>
              </li>
              <li className="mt-3">
                <div className="d-flex">
                  <i className="bx bx-mail-send text-primary fs-4"></i>
                  <div className="ms-3">
                    <h6 className="fs-14 mb-2">Email</h6>
                    <p className="text-muted fs-14 mb-0">{user?.email}</p>
                  </div>
                </div>
              </li>
              <li className="mt-3">
                <div className="d-flex">
                  <i className="bx bx-map text-primary fs-4"></i>
                  <div className="ms-3">
                    <h6 className="fs-14 mb-2">Location</h6>
                    <p className="text-muted fs-14 mb-0">{user?.location}</p>
                  </div>
                </div>
              </li>
            </ul>
            <div className="mt-4">
              <Link
                to="#"
                className="btn btn-soft-primary btn-hover w-100 rounded"
              >
                <i className="mdi mdi-eye"></i> View Profile
              </Link>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  )
}

export default Overview
