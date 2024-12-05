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
  getDepartmentAgreements,
  updateAgreementStatus,
  downloadAgreement,
} from "services/marketingAgreement"
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

const handleDownload = async agreementId => {
  try {
    await downloadAgreement(agreementId)
    toast.success("ხელშეკრულება წარმატებით ჩამოიტვირთა")
  } catch (error) {
    console.error("Download failed:", error)
    toast.error(error.message || "ფაილი არ არის ხელმისაწვდომი ჩამოსატვირთად")
  }
}

const MarketingAgreementApprove = () => {
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
      const response = await getDepartmentAgreements()
      console.log(response)
      setAgreements(response.data.data)
    } catch (err) {
      console.error("Error fetching agreements:", err)
    }
  }

  useEffect(() => {
    fetchAgreements()
  }, [])

  const handleUpdateStatus = async (agreementId, status, rejectionReason) => {
    if (status === "approved") {
      setIsProcessing(true)
    }

    try {
      const response = await updateAgreementStatus(agreementId, status, {
        rejection_reason: rejectionReason,
      })

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
    await handleUpdateStatus(agreementId, type, rejectionComment)
    setRejectionComment("")
    handleModalClose()
  }

  const transformedAgreements = useMemo(() => {
    return agreements.map(agreement => {
      return {
        id: agreement.id,
        status: STATUS_MAPPING[agreement.status] || agreement.status,
        created_at: agreement.created_at,
        executor_firm_name: agreement.executor_firm_name,
        executor_id_number: agreement.executor_id_number,
        executor_home_address: agreement.executor_home_address,
        executor_full_name: agreement.executor_full_name,
        executor_position: agreement.executor_position,
        executor_bank_account: agreement.executor_bank_account,
        executor_bank_name: agreement.executor_bank_name,
        marketing_service_type: agreement.marketing_service_type,
        marketing_service_term: agreement.marketing_service_term,
        service_cost: agreement.service_cost,
        expanded: {
          executor_factual_address: agreement.executor_factual_address,
          executor_bank_swift: agreement.executor_bank_swift,
          director_full_name: agreement.director_full_name,
          director_id_number: agreement.director_id_number,
          service_payment_details: agreement.service_payment_details,
          service_active_term: agreement.service_active_term,
          rejection_reason: agreement.rejection_reason || null,
          requested_by: agreement.user.name + " " + agreement.user.sur_name,
        },
      }
    })
  }, [agreements])

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "სახელწოდება (საფირმო)/სახელი, გვარი",
        accessor: "executor_firm_name",
      },
      {
        Header: "საიდენტიფიკაციო ნოდი/პირადი ნომერი",
        accessor: "executor_id_number",
      },
      {
        Header: "იურიდიული/საცხოვრებელი მისამართი",
        accessor: "executor_home_address",
      },
      {
        Header: "შარმომადგენლის (ხელმომწერი პირი) სახელი, გვარი",
        accessor: "executor_full_name",
      },
      {
        Header: "თანამდებობა",
        accessor: "executor_position",
      },
      {
        Header: "საბანკო ანგარიში",
        accessor: "executor_bank_account",
      },
      {
        Header: "ბანკის დასახელება",
        accessor: "executor_bank_name",
      },
      {
        Header: "მარკეტინგული მომსახურების სახეობა",
        accessor: "marketing_service_type",
      },
      {
        Header: "მარკეტინგული მომსახურების ვადა",
        accessor: "marketing_service_term",
        Cell: ({ value }) => `${value} დღე`,
      },
      {
        Header: "ხელშეკრულების ფასი",
        accessor: "service_cost",
        Cell: ({ value }) => (
          <div>
            {value
              ? new Intl.NumberFormat("ka-GE", {
                  style: "currency",
                  currency: "GEL",
                }).format(value)
              : "N/A"}
          </div>
        ),
      },
      {
        Header: "სტატუსი",
        accessor: "status",
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
          row.original.status === "pending" && (
            <div className="d-flex gap-2">
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => handleModalOpen("approved", row.original.id)}
              >
                დამტკიცება
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleModalOpen("rejected", row.original.id)}
              >
                უარყოფა
              </Button>
            </div>
          ),
      },
    ],
    []
  )

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
            {/* Factual Address */}
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

            {/* Bank Swift */}
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

            {/* Director Info */}
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

            {/* Payment Details */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCreditCard className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">გადახდის პირობები</div>
                  <div className="fw-medium">
                    {row.expanded.service_payment_details}
                  </div>
                </div>
              </div>
            </Col>

            {/* Service Active Term */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCalendar className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">
                    ხელშეკრულების მოქმედების ვადა
                  </div>
                  <div className="fw-medium">
                    {row.expanded.service_active_term}
                  </div>
                </div>
              </div>
            </Col>

            {/* Created Date */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCalendar className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">შექმნის თარიღი</div>
                  <div className="fw-medium">{row.created_at}</div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Download button for approved agreements */}
        {row.status === "approved" && (
          <button
            className="btn btn-primary"
            onClick={() => handleDownload(row.id)}
          >
            <i className="bx bx-download me-2"></i>
            ხელშეკრულების ჩამოტვირთვა
          </button>
        )}
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
                      "executor_firm_name",
                      "executor_full_name",
                    ]}
                    filterOptions={filterOptions}
                    onRowClick={() => {}}
                    renderRowDetails={renderRowDetails}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
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

      <ToastContainer />
    </React.Fragment>
  )
}

export default MarketingAgreementApprove