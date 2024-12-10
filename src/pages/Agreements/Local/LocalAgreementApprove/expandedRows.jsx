import React from "react"
import { Row, Col } from "reactstrap"
import { BsBank, BsCalendar, BsMap, BsPerson } from "react-icons/bs"

export const expandedRows = row => {
  if (!row) return null

  return (
    <div className="p-4 bg-light rounded">
      {row.expanded.rejection_reason && (
        <div className="alert alert-danger d-flex align-items-center mb-4">
          <i className="bx bx-error-circle me-2 fs-5"></i>
          <div>
            <strong>უარყოფის მიზეზი:</strong> {row.expanded.rejection_reason}
          </div>
        </div>
      )}
      <div className="d-flex align-items-center mb-4 gap-2 text-muted">
        <BsPerson className="fs-3 text-primary" />
        <strong>მოითხოვა:</strong>
        <span className="ms-2">{row.expanded.requested_by}</span>
      </div>

      <div className="border rounded p-4 bg-white mb-4">
        <Row className="g-4">
          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsMap className="fs-7 text-primary" />
              <div>
                <div className="text-muted small">ფაქტობრივი მისამართი</div>
                <div className="fw-medium">
                  {row.expanded.executor_factual_address}
                </div>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsMap className="fs-7 text-primary" />
              <div>
                <div className="text-muted small">საცხოვრებელი მისამართი</div>
                <div className="fw-medium">
                  {row.expanded.executor_home_address}
                </div>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsPerson className="fs-7 text-primary" />
              <div>
                <div className="text-muted small">
                  შემსრულებელი ფირმის დასახელება
                </div>
                <div className="fw-medium">
                  {row.expanded.executor_firm_name}
                </div>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsPerson className="fs-7 text-primary" />
              <div>
                <div className="text-muted small">
                  შემსრულებელი ფირმის საიდენტიფიკაციო ნომერი
                </div>
                <div className="fw-medium">
                  {row.expanded.executor_id_number}
                </div>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsPerson className="fs-7 text-primary" />
              <div>
                <div className="text-muted small">
                  შემსრულებლის სრული სახელი
                </div>
                <div className="fw-medium">
                  {row.expanded.executor_full_name}
                </div>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsPerson className="fs-7 text-primary" />
              <div>
                <div className="text-muted small">შემსრულებლის პოზიცია</div>
                <div className="fw-medium">
                  {row.expanded.executor_position}
                </div>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsBank className="fs-7 text-primary" />
              <div>
                <div className="text-muted small">საბანკო ანგარიში</div>
                <div className="fw-medium">
                  {row.expanded.executor_bank_account}
                </div>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsBank className="fs-7 text-primary" />
              <div>
                <div className="text-muted small">ბანკის დასახელება</div>
                <div className="fw-medium">
                  {row.expanded.executor_bank_name}
                </div>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsBank className="fs-7 text-primary" />
              <div>
                <div className="text-muted small">ბანკის კოდი</div>
                <div className="fw-medium">
                  {row.expanded.executor_bank_swift}
                </div>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsCalendar className="fs-7 text-primary" />
              <div>
                <div className="text-muted small">ავტომატური განახლება</div>
                <div className="fw-medium">
                  {row.expanded.agreement_automatic_renewal}
                </div>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsMap className="fs-7 text-primary" />
              <div>
                <div className="text-muted small">ექსკლუზიურობა</div>
                <div className="fw-medium">{row.expanded.exclusivity}</div>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsCalendar className="fs-7 text-primary" />
              <div>
                <div className="text-muted small">
                  ხელშეკრულების აქტიური ვადა
                </div>
                <div className="fw-medium">
                  {row.expanded.agreement_active_term}
                </div>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsMap className="fs-7 text-primary" />
              <div>
                <div className="text-muted small">
                  ექსკლუზივის ადგილმდებარეობა
                </div>
                <div className="fw-medium">
                  {row.expanded.exclusive_placement}
                </div>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsPerson className="fs-7 text-primary" />
              <div>
                <div className="text-muted small">დირექტორის ინფორმაცია</div>
                <div className="fw-medium">
                  {row.expanded.director_full_name} (
                  {row.expanded.director_id_number})
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}
