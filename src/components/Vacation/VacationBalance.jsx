import React from "react"
import { Card, CardBody, Row, Col, Progress } from "reactstrap"
import { Tooltip } from "@mui/material"

const VacationBalance = ({ balance }) => {
  if (!balance) return null

  const {
    total_days,
    remaining_days,
    used_days,
    used_days_this_year,
    vacation_year,
    pending_requests,
    approved_future_requests,
  } = balance

  const usagePercentage = (used_days_this_year / total_days) * 100

  return (
    <Card className="mb-4">
      <CardBody>
        <h5 className="mb-3 text-lg font-semibold">შვებულების ბალანსი</h5>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted">წლიური გამოყენება</small>
            <small className="text-muted">{usagePercentage.toFixed(1)}%</small>
          </div>
          <Progress
            value={usagePercentage}
            color={usagePercentage > 75 ? "warning" : "success"}
            className="progress-sm"
          />
        </div>

        <Row>
          <Col sm={6} md={3}>
            <div className="text-center mb-3">
              <Tooltip title="წლიური ანაზღაურებადი შვებულების ლიმიტი" arrow>
                <div>
                  <h6 className="text-muted mb-1">სრული ლიმიტი</h6>
                  <h4 className="font-size-18">{total_days} დღე</h4>
                </div>
              </Tooltip>
            </div>
          </Col>
          <Col sm={6} md={3}>
            <div className="text-center mb-3">
              <Tooltip title="მიმდინარე წელს გამოყენებული დღეები" arrow>
                <div>
                  <h6 className="text-muted mb-1">გამოყენებული</h6>
                  <h4 className="font-size-18 text-warning">
                    {used_days_this_year} დღე
                  </h4>
                  <small className="text-muted">სულ: {used_days} დღე</small>
                </div>
              </Tooltip>
            </div>
          </Col>
          <Col sm={6} md={3}>
            <div className="text-center mb-3">
              <Tooltip title="დარჩენილი ანაზღაურებადი შვებულების დღეები" arrow>
                <div>
                  <h6 className="text-muted mb-1">დარჩენილი</h6>
                  <h4 className="font-size-18 text-success">
                    {remaining_days} დღე
                  </h4>
                  {(pending_requests > 0 || approved_future_requests > 0) && (
                    <div className="d-flex justify-content-center gap-2">
                      {pending_requests > 0 && (
                        <small className="text-warning">
                          <i className="bx bx-time-five me-1"></i>
                          მოლოდინში: {pending_requests}
                        </small>
                      )}
                      {approved_future_requests > 0 && (
                        <small className="text-info">
                          <i className="bx bx-calendar-check me-1"></i>
                          დამტკიცებული: {approved_future_requests}
                        </small>
                      )}
                    </div>
                  )}
                </div>
              </Tooltip>
            </div>
          </Col>
          <Col sm={6} md={3}>
            <div className="text-center mb-3">
              <Tooltip title="მიმდინარე საანგარიშო წელი" arrow>
                <div>
                  <h6 className="text-muted mb-1">წელი</h6>
                  <h4 className="font-size-18">{vacation_year}</h4>
                </div>
              </Tooltip>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default VacationBalance
