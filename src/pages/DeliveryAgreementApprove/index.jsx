import React, { useEffect, useState, useMemo, useCallback } from "react"
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  Spinner,
} from "reactstrap"
import Button from "@mui/material/Button"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import {
  getDepartmentAgreements as getDeliveryDepartmentAgreements,
  updateAgreementStatus as updateDeliveryAgreementStatus,
} from "services/deliveryAgreement"
import {
  BsBank,
  BsCalendar,
  BsCreditCard,
  BsMap,
  BsPerson,
  BsVoicemail,
} from "react-icons/bs"
import MuiTable from "../../components/Mui/MuiTable"
import { toast, ToastContainer } from "react-toastify"

const statusMap = {
  pending: {
    label: "განხილვაში",
    icon: "bx-time",
    color: "#FFA500",
  },
  approved: {
    label: "დამტკიცებული",
    icon: "bx-check-circle",
    color: "#28a745",
  },
  rejected: {
    label: "უარყოფილი",
    icon: "bx-x-circle",
    color: "#dc3545",
  },
}

const STATUS_MAPPING = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
}

const DeliveryAgreementApprove = () => {
  document.title = "ხელშეკრულებების ვიზირება | Gorgia LLC"
  const [agreements, setAgreements] = useState([])
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null,
    agreementId: null,
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [rejectionComment, setRejectionComment] = useState("")

  const fetchAgreements = async () => {
    try {
      const response = await getDeliveryDepartmentAgreements()
      console.log(response.data.data)
      setAgreements(response.data.data)
    } catch (err) {
      console.error("Error fetching agreements:", err)
    }
  }

  useEffect(() => {
    fetchAgreements()
  }, [])

  const handleUpdateStatus = async (
    agreementId,
    status,
    additionalData,
    rejectionReason
  ) => {
    if (status === "approved") {
      setIsProcessing(true)
    }

    try {
      const response = await updateDeliveryAgreementStatus(
        agreementId,
        status,
        {
          rejection_reason: rejectionReason,
        }
      )

      setAgreements(prevAgreements =>
        prevAgreements.map(agreement =>
          agreement.id === agreementId ? { ...agreement, status } : agreement
        )
      )

      if (status === "approved" && response.data.file_path) {
        const filePath = response.data.file_path
        const newWindow = window.open(filePath)
        newWindow.focus()
        newWindow.print()
      }
    } catch (err) {
      console.error("Error updating agreement status:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleModalOpen = (type, agreementId) => {
    setConfirmModal({
      isOpen: true,
      type,
      agreementId,
    })
  }

  const handleModalClose = () => {
    setConfirmModal({
      isOpen: false,
      type: null,
      agreementId: null,
    })
  }

  const handleConfirmAction = async () => {
    const { type, agreementId } = confirmModal
    if (type === "rejected" && !rejectionComment.trim()) {
      alert("გთხოვთ მიუთითოთ უარყოფის მიზეზი")
      return
    }
    await handleUpdateStatus(agreementId, type, null, rejectionComment)
    setRejectionComment("")
    handleModalClose()
  }

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "მოითხოვა",
        accessor: "requested_by",
        disableSortBy: true,
      },
      {
        Header: "იურიდიული პირის დასახელება",
        accessor: "jursdictional_unit.name",
        disableSortBy: true,
      },
      {
        Header: "ხელშეკრულების ტიპი",
        accessor: "agreement_type",
        disableSortBy: true,
      },
      {
        Header: "მოთხოვნის თარიღი",
        accessor: "created_at",
      },
      {
        Header: "დადასტურების თარიღი",
        accessor: "updated_at",
      },
      {
        Header: "სტატუსი",
        accessor: "status",
        disableSortBy: true,
        Cell: ({ value }) => {
          const status = statusMap[value] || {
            label: "უცნობი",
            icon: "bx-question-mark",
            color: "#757575",
          }

          return (
            <span
              style={{
                padding: "6px 12px",
                borderRadius: "4px",
                display: "inline-flex",
                alignItems: "center",
                fontSize: "0.875rem",
                fontWeight: 500,
                backgroundColor:
                  value === "pending"
                    ? "#fff3e0"
                    : value === "rejected"
                    ? "#ffebee"
                    : value === "approved"
                    ? "#e8f5e9"
                    : "#f5f5f5",
                color:
                  value === "pending"
                    ? "#e65100"
                    : value === "rejected"
                    ? "#c62828"
                    : value === "approved"
                    ? "#2e7d32"
                    : "#757575",
              }}
            >
              <i className={`bx ${status.icon} me-2`}></i>
              {status.label}
            </span>
          )
        },
      },
      {
        Header: "მოქმედებები",
        accessor: "actions",
        disableSortBy: true,
        Cell: ({ row }) =>
          row.original.status === "pending" ? (
            <div className="d-flex gap-2">
              <Button
                onClick={() => handleModalOpen("approved", row.original.id)}
                color="success"
                variant="contained"
              >
                დამტკიცება
              </Button>
              <Button
                onClick={() => handleModalOpen("rejected", row.original.id)}
                color="error"
                variant="contained"
              >
                უარყოფა
              </Button>
            </div>
          ) : null,
      },
    ],
    []
  )

  const transformedAgreements = useMemo(() => {
    return agreements.map(agreement => {
      return {
        id: agreement.id,
        status: STATUS_MAPPING[agreement.status] || agreement.status,
        requested_by: agreement.user.name + " " + agreement.user.sur_name,
        created_at: new Date(agreement.created_at).toLocaleDateString(),
        updated_at: new Date(agreement.updated_at).toLocaleString(),
        jursdictional_unit: {
          name: agreement.jursdictional_name,
          id: agreement.jursdictional_id_number,
          address: agreement.jursdictional_address,
        },
        agreement_type: agreement.agreement_type,
        expanded: {
          jursdictional_unit: {
            name: agreement.jursdictional_name,
            id: agreement.jursdictional_id_number,
            address: agreement.jursdictional_address,
          },
          action_act: agreement.action_act,
          rejection_reason: agreement.rejection_reason || null,
          requested_by: agreement.user.name + " " + agreement.user.sur_name,
          agreement_type: agreement.agreement_type,
          cost: agreement.sum_cost,
          cost_type: agreement.sum_cost_type,
          director: {
            name: agreement.director_full_name,
            id: agreement.director_id_number,
          },
        },
      }
    })
  }, [agreements])

  const filterOptions = [
    {
      field: "status",
      label: "სტატუსი",
      valueLabels: {
        approved: "დამტკიცებული",
        rejected: "უარყოფილი",
        pending: "განხილვაში",
      },
    },
  ]

  const renderRowDetails = useCallback(row => {
    if (!row) return null

    return (
      <div className="p-4 bg-light rounded">
        {/* Rejection reason banner */}
        {row.expanded.rejection_reason && (
          <div className="alert alert-danger d-flex align-items-center mb-4">
            <i className="bx bx-error-circle me-2 fs-5"></i>
            <div>
              <strong>უარყოფის მიზეზი:</strong> {row.expanded.rejection_reason}
            </div>
          </div>
        )}

        {/* Requester info */}
        <div className="d-flex align-items-center mb-4 gap-2 text-muted">
          <BsPerson className="fs-3 text-primary" />
          <strong>მოითხოვა:</strong>
          <span className="ms-2">{row.expanded.requested_by}</span>
        </div>

        {/* Agreement details */}
        <div className="border rounded p-4 bg-white mb-4">
          <Row className="g-4">
            {/* Jurisdictional Unit */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCalendar className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">იურიდიული პირი</div>
                  <div className="fw-medium">
                    {row.jursdictional_unit.name} ({row.jursdictional_unit.id})
                  </div>
                </div>
              </div>
            </Col>

            {/* Address */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsMap className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">მისამართი</div>
                  <div className="fw-medium">
                    {row.jursdictional_unit.address}
                  </div>
                </div>
              </div>
            </Col>

            {/* Agreement Type */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCreditCard className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">ხელშეკრულების ტიპი</div>
                  <div className="fw-medium">{row.agreement_type}</div>
                </div>
              </div>
            </Col>

            {/* Cost */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsVoicemail className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">ღირებულება</div>
                  <div className="fw-medium">
                    {row.expanded.cost} {row.expanded.cost_type}
                  </div>
                </div>
              </div>
            </Col>

            {/* Director */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsPerson className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">დირექტორი</div>
                  <div className="fw-medium">
                    {row.expanded.director.name} ({row.expanded.director.id})
                  </div>
                </div>
              </div>
            </Col>

            {/* Action Act */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <i className="bx bx-notepad fs-7 text-primary"></i>
                <div>
                  <div className="text-muted small">მოქმედების აქტი</div>
                  <div className="fw-medium">{row.expanded.action_act}</div>
                </div>
              </div>
            </Col>

            {/* Created Date */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsBank className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">შექმნის თარიღი</div>
                  <div className="fw-medium">{row.created_at}</div>
                </div>
              </div>
            </Col>

            {/* Price */}
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
        </div>
      </div>
    )
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs
                title="ხელშეკრულებები"
                breadcrumbItem="ხელშეკრულებების ვიზირება"
              />
            </Col>
          </Row>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <MuiTable
                    columns={columns}
                    data={transformedAgreements}
                    initialPageSize={10}
                    pageSizeOptions={[5, 10, 15, 20]}
                    enableSearch={true}
                    searchableFields={[
                      "jursdictional_unit.name",
                      "requested_by",
                    ]}
                    filterOptions={filterOptions}
                    renderRowDetails={renderRowDetails}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <ToastContainer />
        </div>
      </div>

      <Modal isOpen={confirmModal.isOpen} toggle={handleModalClose}>
        <ModalHeader toggle={handleModalClose}>
          {confirmModal.type === "approved" ? "დამტკიცება" : "უარყოფა"}
        </ModalHeader>
        <ModalBody>
          {isProcessing ? (
            <div className="text-center">
              <Spinner color="primary" />
              <p className="mt-2">
                გთხოვთ დაელოდოთ, მიმდინარეობს დამუშავება...
              </p>
            </div>
          ) : (
            <>
              <p>დარწმუნებული ხართ, რომ გსურთ ამ მოქმედების შესრულება?</p>
              {confirmModal.type === "rejected" && (
                <div className="mt-3">
                  <label htmlFor="rejection_reason" className="form-label">
                    უარყოფის მიზეზი *
                  </label>
                  <textarea
                    id="rejection_reason"
                    className="form-control"
                    value={rejectionComment}
                    onChange={e => setRejectionComment(e.target.value)}
                    rows="3"
                    required
                  />
                </div>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color={confirmModal.type === "rejected" ? "secondary" : "error"}
            onClick={handleModalClose}
            disabled={isProcessing}
          >
            გაუქმება
          </Button>
          <Button
            color={confirmModal.type === "approved" ? "success" : "error"}
            onClick={handleConfirmAction}
            disabled={isProcessing}
          >
            დადასტურება
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  )
}

export default DeliveryAgreementApprove
