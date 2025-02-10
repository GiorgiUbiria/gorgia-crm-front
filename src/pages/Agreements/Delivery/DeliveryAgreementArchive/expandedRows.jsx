import React from "react"
import { Row, Col } from "reactstrap"
import {
  BsBank,
  BsCalendar,
  BsCreditCard,
  BsMap,
  BsPerson,
  BsVoicemail,
} from "react-icons/bs"
import { downloadAgreement as downloadDeliveryAgreementService } from "services/deliveryAgreement"

const handleDownload = async agreementId => {
  try {
    await downloadDeliveryAgreementService(agreementId)
  } catch (error) {
    console.error("Download failed:", error)
  }
}

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
              <BsCalendar className="fs-7 text-primary" />
              <div>
                <div className="text-muted small">იურიდიული პირი</div>
                <div className="fw-medium">
                  {row.expanded.jursdictional_unit.name} (
                  {row.expanded.jursdictional_unit.id})
                </div>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsMap className="fs-7 text-primary" />
              <div>
                <div className="text-muted small">მისამართი</div>
                <div className="fw-medium">
                  {row.expanded.jursdictional_unit.address}
                </div>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsCreditCard className="fs-7 text-primary" />
              <div>
                <div className="text-muted small">ხელშეკრულების ტიპი</div>
                <div className="fw-medium">{row.expanded.agreement_type}</div>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsVoicemail className="fs-7 text-primary" />
              <div>
                <div className="text-muted small">ღირებულება</div>
                <div className="fw-medium">
                  {row.expanded.cost}, {row.expanded.cost_type}
                </div>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsCalendar className="fs-7 text-primary" />
              <div>
                <div className="text-muted small">დირექტორი</div>
                <div className="fw-medium">
                  {row.expanded.director.name} ({row.expanded.director.id})
                </div>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsBank className="fs-7 text-primary" />
              <div>
                <div className="text-muted small">შექმნის თარიღი</div>
                <div className="fw-medium">
                  {new Date(row.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <i className="bx bx-notepad fs-7 text-primary"></i>
              <div>
                <div className="text-muted small">მოქმედების აქტი</div>
                <div className="fw-medium">{row.expanded.action_act}</div>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <i className="bx bx-dollar fs-7 text-primary"></i>
              <div>
                <div className="text-muted small">ფასი</div>
                <div className="fw-medium">{row.expanded.cost} ₾</div>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={12}>
            {row.status === "approved" && (
              <button
                className="btn btn-primary"
                onClick={() => handleDownload(row.id)}
              >
                <i className="bx bx-download me-2"></i>
                ხელშეკრულების ჩამოტვირთვა
              </button>
            )}
          </Col>
        </Row>
      </div>
    </div>
  )
}
