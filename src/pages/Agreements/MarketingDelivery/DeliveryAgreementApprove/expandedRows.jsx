import React from "react"
import { Row, Col } from "reactstrap"
import {
  BsBank,
  BsCalendar,
  BsCreditCard,
  BsMap,
  BsPerson,
  BsVoicemail,
  BsFileEarmarkText,
  BsCashCoin,
  BsPersonBadge,
} from "react-icons/bs"

export const expandedRows = row => {
  if (!row) return null

  return (
    <div className="p-4 bg-light dark:!bg-gray-800 rounded">
      {row.expanded.rejection_reason && (
        <div className="alert alert-danger d-flex align-items-center mb-4 dark:!bg-red-900 dark:!text-gray-200">
          <i className="bx bx-error-circle me-2 fs-5"></i>
          <div>
            <strong>უარყოფის მიზეზი:</strong> {row.expanded.rejection_reason}
          </div>
        </div>
      )}

      <div className="d-flex align-items-center mb-4 gap-2 text-muted dark:!text-gray-300">
        <BsPerson className="fs-3 text-primary dark:!text-blue-400" />
        <strong>მოითხოვა:</strong>
        <span className="ms-2">{row.expanded.requested_by}</span>
      </div>

      <div className="border rounded p-4 bg-white dark:!bg-gray-700 dark:!border-gray-600 mb-4">
        <Row className="g-4">
          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsCalendar className="fs-7 text-primary dark:!text-blue-400" />
              <div>
                <div className="text-muted small dark:!text-gray-400">იურიდიული პირი</div>
                <div className="fw-medium dark:!text-gray-200">
                  {row.jursdictional_unit.name} ({row.jursdictional_unit.id})
                </div>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsMap className="fs-7 text-primary dark:!text-blue-400" />
              <div>
                <div className="text-muted small dark:!text-gray-400">მისამართი</div>
                <div className="fw-medium dark:!text-gray-200">
                  {row.jursdictional_unit.address}
                </div>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsCreditCard className="fs-7 text-primary dark:!text-blue-400" />
              <div>
                <div className="text-muted small dark:!text-gray-400">ხელშეკრულების ტიპი</div>
                <div className="fw-medium dark:!text-gray-200">{row.agreement_type}</div>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsVoicemail className="fs-7 text-primary dark:!text-blue-400" />
              <div>
                <div className="text-muted small dark:!text-gray-400">ღირებულება</div>
                <div className="fw-medium dark:!text-gray-200">
                  {row.expanded.cost} {row.expanded.cost_type}
                </div>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsPerson className="fs-7 text-primary dark:!text-blue-400" />
              <div>
                <div className="text-muted small dark:!text-gray-400">დირექტორი</div>
                <div className="fw-medium dark:!text-gray-200">
                  {row.expanded.director.name} ({row.expanded.director.id})
                </div>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsFileEarmarkText className="fs-7 text-primary dark:!text-blue-400" />
              <div>
                <div className="text-muted small dark:!text-gray-400">მოქმედების აქტი</div>
                <div className="fw-medium dark:!text-gray-200">{row.expanded.action_act}</div>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsBank className="fs-7 text-primary dark:!text-blue-400" />
              <div>
                <div className="text-muted small dark:!text-gray-400">შექმნის თარიღი</div>
                <div className="fw-medium dark:!text-gray-200">{row.created_at}</div>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsCashCoin className="fs-7 text-primary dark:!text-blue-400" />
              <div>
                <div className="text-muted small dark:!text-gray-400">ფასი</div>
                <div className="fw-medium dark:!text-gray-200">{row.expanded.cost} ₾</div>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsBank className="fs-7 text-primary dark:!text-blue-400" />
              <div>
                <div className="text-muted small dark:!text-gray-400">საბანკო რეკვიზიტები</div>
                <div className="fw-medium dark:!text-gray-200">{row.expanded.bank_account_number}</div>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <BsPersonBadge className="fs-7 text-primary dark:!text-blue-400" />
              <div>
                <div className="text-muted small dark:!text-gray-400"> მიღება-ჩაბარების აქტის დამზადების ინიციატორის უშუალო ხელმძღვანელი: (სახელი/გვარი) </div>
                <div className="fw-medium dark:!text-gray-200">{row.expanded.responsible_person.name}</div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}
