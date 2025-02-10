import React from "react"
import { Card, CardBody, Col, Container, Row, Badge, Button } from "reactstrap"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useVacancyRequest } from "../../queries/vacancyRequests"

const VacancyRequestDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: request, isLoading } = useVacancyRequest(id)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!request) {
    return <div>Vacancy request not found</div>
  }

  const getStatusBadge = status => {
    const statusColors = {
      pending: "warning",
      approved: "success",
      rejected: "danger",
    }
    return <Badge color={statusColors[status] || "secondary"}>{status}</Badge>
  }

  const renderSection = (title, content) => (
    <div className="mb-4">
      <h5 className="font-size-15">{title}</h5>
      <p className="text-muted">{content || "N/A"}</p>
    </div>
  )

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title">ვაკანსიის მოთხოვნის დეტალები</h4>
                  <div>
                    <Button
                      color="secondary"
                      className="me-2"
                      onClick={() => navigate(-1)}
                    >
                      უკან
                    </Button>
                    {request.status === "pending" && (
                      <Link
                        to={`/vacancy-requests/${id}/edit`}
                        className="btn btn-primary"
                      >
                        რედაქტირება
                      </Link>
                    )}
                  </div>
                </div>

                <Row>
                  <Col md={6}>
                    <Card>
                      <CardBody>
                        <h5 className="card-title mb-4">ზოგადი ინფორმაცია</h5>
                        {renderSection(
                          "პოზიციის დასახელება",
                          request.position_title
                        )}
                        {renderSection(
                          "ვაკანსიების რაოდენობა",
                          request.number_of_vacancies
                        )}
                        {renderSection(
                          "მომთხოვნის სახელი",
                          request.requester_name
                        )}
                        {renderSection(
                          "მომთხოვნის პოზიცია",
                          request.requester_position
                        )}
                        {renderSection("მდებარეობა", request.location)}
                        {renderSection("დეპარტამენტი", request.department)}
                        {renderSection(
                          "შექმნის თარიღი",
                          new Date(request.submission_date).toLocaleDateString()
                        )}
                        {renderSection(
                          "სტატუსი",
                          getStatusBadge(request.status)
                        )}
                      </CardBody>
                    </Card>
                  </Col>

                  <Col md={6}>
                    <Card>
                      <CardBody>
                        <h5 className="card-title mb-4">დეტალური ინფორმაცია</h5>
                        {renderSection(
                          "ახალი პოზიციაა?",
                          request.is_new_position ? "დიახ" : "არა"
                        )}
                        {renderSection(
                          "ვაკანსიის მიზეზი",
                          request.vacancy_reason
                        )}
                        {request.vacancy_reason === "other" &&
                          renderSection(
                            "სხვა მიზეზი",
                            request.vacancy_reason_other
                          )}
                        {request.is_new_position &&
                          renderSection(
                            "ახალი პოზიციის დასაბუთება",
                            request.new_position_justification
                          )}
                        {renderSection(
                          "ტრენინგის აღწერა",
                          request.training_description
                        )}
                      </CardBody>
                    </Card>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col md={6}>
                    <Card>
                      <CardBody>
                        <h5 className="card-title mb-4">შევსების ოფციები</h5>
                        {renderSection(
                          "შიდა გადაყვანა",
                          request.internal_transfer ? "დიახ" : "არა"
                        )}
                        {renderSection(
                          "გარე დაქირავება",
                          request.external_recruitment ? "დიახ" : "არა"
                        )}
                        {renderSection(
                          "სასურველი დაწყების თარიღი",
                          new Date(request.desired_start_date).toLocaleDateString()
                        )}
                      </CardBody>
                    </Card>
                  </Col>

                  <Col md={6}>
                    <Card>
                      <CardBody>
                        <h5 className="card-title mb-4">სამუშაო პირობები</h5>
                        {renderSection(
                          "საცდელი პერიოდის ხელფასის დიაპაზონი",
                          request.trial_period_salary_range
                        )}
                        {renderSection(
                          "საცდელი პერიოდის შემდეგ ხელფასის დიაპაზონი",
                          request.post_trial_salary_range
                        )}
                        {renderSection(
                          "კონტრაქტის ხანგრძლივობა",
                          request.contract_duration
                        )}
                        {renderSection("კონტრაქტის ტიპი", request.contract_type)}
                        {renderSection("სამუშაო განრიგი", request.work_schedule)}
                        {request.work_schedule === "other" &&
                          renderSection(
                            "სხვა სამუშაო განრიგი",
                            request.work_schedule_other
                          )}
                        {renderSection("სამუშაო საათები", request.working_hours)}
                      </CardBody>
                    </Card>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col md={12}>
                    <Card>
                      <CardBody>
                        <h5 className="card-title mb-4">
                          საჭირო კვებობები
                        </h5>
                        {renderSection(
                          "განათლების პირობები",
                          request.education_requirements
                        )}
                        {renderSection(
                          "სამუშაო გამოცდები",
                          request.work_experience
                        )}
                        {renderSection(
                          "საჭირო ცოდნა",
                          request.required_knowledge
                        )}
                        {renderSection(
                          "საჭირო საკუთარი უნარები",
                          request.required_skills
                        )}
                        {renderSection(
                          "მთავარი პოზიციები",
                          request.main_responsibilities
                        )}
                      </CardBody>
                    </Card>
                  </Col>
                </Row>

                {request.status === "rejected" && (
                  <Row className="mt-4">
                    <Col md={12}>
                      <Card>
                        <CardBody>
                          <h5 className="card-title mb-4">უარყოფის დეტალები</h5>
                          {renderSection(
                            "უარყოფის მიზეზი",
                            request.rejection_reason
                          )}
                          {renderSection(
                            "უარყოფის თარიღი",
                            new Date(request.rejected_at).toLocaleString()
                          )}
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                )}

                {request.status === "approved" && (
                  <Row className="mt-4">
                    <Col md={12}>
                      <Card>
                        <CardBody>
                          <h5 className="card-title mb-4">დამტკიცების დეტალები</h5>
                          {renderSection(
                            "დამტკიცების თარიღი",
                            new Date(request.approved_at).toLocaleString()
                          )}
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default VacancyRequestDetails
