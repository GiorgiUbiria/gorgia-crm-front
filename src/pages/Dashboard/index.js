import React, { useEffect } from "react"
import { Container, Row, Col, Card, CardBody, Badge } from "reactstrap"
import { useDispatch } from "react-redux"
import { getChartsData as onGetChartsData } from "../../store/actions"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { withTranslation } from "react-i18next"
import { ToastContainer } from "react-toastify"

const Dashboard = () => {
  const dispatch = useDispatch()


  useEffect(() => {
    dispatch(onGetChartsData("yearly"))
  }, [dispatch])

  // Stats data
  const statsData = [
    {
      title: "აქტიური დავალებები",
      count: "125",
      icon: "bx bx-task",
      color: "primary",
    },
    {
      title: "დასრულებული დავალებები",
      count: "84",
      icon: "bx bx-check-circle",
      color: "success",
    },
    {
      title: "მიმდინარე პროექტები",
      count: "12",
      icon: "bx bx-trending-up",
      color: "info",
    },
    {
      title: "გადაუდებელი დავალებები",
      count: "5",
      icon: "bx bx-alarm",
      color: "danger",
    },
  ]

  // Recent tasks data
  const recentTasks = [
    {
      title: "პრინტერის პრობლემა",
      priority: "High",
      status: "Pending",
      assignee: "გიორგი მაისურაძე",
    },
    {
      title: "სერვერის განახლება",
      priority: "Medium",
      status: "In Progress",
      assignee: "ნინო კაპანაძე",
    },
    {
      title: "ქსელის მონიტორინგი",
      priority: "Low",
      status: "Completed",
      assignee: "დავით ბერიძე",
    },
  ]

  document.title = "მთავარი გვერდი | Gorgia LLC"

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="მთავარი" breadcrumbItem="დაფა" />

          {/* Stats Cards */}
          <Row>
            {statsData.map((stat, index) => (
              <Col xl={3} md={6} key={index}>
                <Card className="mini-stats-wid">
                  <CardBody>
                    <div className="d-flex">
                      <div className="flex-grow-1">
                        <h4 className="mb-0">{stat.count}</h4>
                        <p className="text-muted fw-medium mb-2">
                          {stat.title}
                        </p>
                      </div>
                      <div
                        className={`avatar-sm rounded-circle bg-${stat.color} align-self-center mini-stat-icon`}
                      >
                        <span className="avatar-title rounded-circle bg-${stat.color}">
                          <i className={`${stat.icon} font-size-24`}></i>
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Recent Tasks */}
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">ბოლო დავალებები</h4>
                  <div className="table-responsive">
                    <table className="table table-hover table-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">დავალება</th>
                          <th scope="col">პრიორიტეტი</th>
                          <th scope="col">სტატუსი</th>
                          <th scope="col">შემსრულებელი</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTasks.map((task, index) => (
                          <tr key={index}>
                            <td>{task.title}</td>
                            <td>
                              <Badge
                                className={`font-size-12 badge-soft-${
                                  task.priority === "High"
                                    ? "danger"
                                    : task.priority === "Medium"
                                    ? "warning"
                                    : "success"
                                }`}
                              >
                                {task.priority === "High"
                                  ? "მაღალი"
                                  : task.priority === "Medium"
                                  ? "საშუალო"
                                  : "დაბალი"}
                              </Badge>
                            </td>
                            <td>
                              <Badge
                                className={`font-size-12 badge-soft-${
                                  task.status === "Pending"
                                    ? "warning"
                                    : task.status === "In Progress"
                                    ? "info"
                                    : "success"
                                }`}
                              >
                                {task.status === "Pending"
                                  ? "მოლოდინში"
                                  : task.status === "In Progress"
                                  ? "მიმდინარე"
                                  : "დასრულებული"}
                              </Badge>
                            </td>
                            <td>{task.assignee}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default withTranslation()(Dashboard)
