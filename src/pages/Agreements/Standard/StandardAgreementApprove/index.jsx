import React, { useEffect, useState, useMemo, useCallback } from "react"
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap"
import Button from "@mui/material/Button"
import {
  getDepartmentAgreements,
  updateAgreementStatus,
} from "services/agreement"
import {
  BsBank,
  BsCalendar,
  BsCreditCard,
  BsMap,
  BsPerson,
  BsVoicemail,
} from "react-icons/bs"
import MuiTable from "../../../../components/Mui/MuiTable"

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

const StandardAgreementApprove = () => {
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
      setAgreements(response.data.data)
    } catch (err) {
      console.error("Error fetching agreements:", err)
    }
  }

  useEffect(() => {
    fetchAgreements()
  }, [])

  const handleUpdateStatus = async (agreementId, status, additionalData) => {
    if (status === "approved") {
      setIsProcessing(true)
    }

    try {
      const response = await updateAgreementStatus(
        agreementId,
        status,
        additionalData
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
      fetchAgreements()
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
    await handleUpdateStatus(agreementId, type, {
      rejection_reason: type === "rejected" ? rejectionComment : null,
    })
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
        Header: "კონტრაგენტის დასახელება",
        accessor: "contragent.name",
        disableSortBy: true,
      },
      {
        Header: "ხელშეკრულების ინიციატორი",
        accessor: "contract_initiator",
        disableSortBy: true,
      },
      {
        Header: "მოთხოვნის თარიღი",
        accessor: "created_at",
      },
      {
        Header: "სტატუსის ცვლილების თარიღი",
        accessor: row => {
          switch (row.status) {
            case "approved":
              return row.accepted_at
            case "rejected":
              return row.rejected_at
            default:
              return "-"
          }
        },
        id: "status_date",
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
        created_at: new Date(agreement.created_at).toLocaleDateString(),
        updated_at: new Date(agreement.updated_at).toLocaleString(),
        accepted_at: agreement.accepted_at
          ? new Date(agreement.accepted_at).toLocaleString()
          : "-",
        rejected_at: agreement.rejected_at
          ? new Date(agreement.rejected_at).toLocaleString()
          : "-",
        requested_by: agreement.user.name + " " + agreement.user.sur_name,
        contract_initiator: agreement.contract_initiator_name,
        contragent: {
          name: agreement.contragent_name,
          id: agreement.contragent_id,
          address: agreement.contragent_address,
          phone: agreement.contragent_phone_number,
          email: agreement.contragent_email,
        },
        director: {
          name: agreement.contragent_director_name,
          phone: agreement.contragent_director_phone_number,
        },
        expanded: {
          different_terms: agreement.payment_different_terms,
          contract_initiator: agreement.contract_initiator_name,
          conscription_term: agreement.conscription_term,
          product_delivery_address: agreement.product_delivery_address,
          product_payment_term: agreement.product_payment_term,
          bank_account: agreement.bank_account,
          rejection_reason: agreement.rejection_reason || null,
          price: agreement.product_cost,
          status: STATUS_MAPPING[agreement.status] || agreement.status,
          created_at: new Date(agreement.created_at).toLocaleDateString(),
          updated_at: new Date(agreement.updated_at).toLocaleString(),
          requested_by: agreement.user.name + " " + agreement.user.sur_name,
          contragent: {
            name: agreement.contragent_name,
            id: agreement.contragent_id,
            address: agreement.contragent_address,
            phone: agreement.contragent_phone_number,
            email: agreement.contragent_email,
          },
          director: {
            name: agreement.contragent_director_name,
            phone: agreement.contragent_director_phone_number,
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
                <BsCreditCard className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">
                    გადახდის განსხვავებული პირობები
                  </div>
                  <div className="fw-medium">
                    {row.expanded.different_terms ? "კი" : "არა"}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsVoicemail className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">
                    ხელშეკრულების ინიციატორი
                  </div>
                  <div className="fw-medium">
                    {row.expanded.contract_initiator}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCalendar className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">ხელშეკრულების ვადა</div>
                  <div className="fw-medium">
                    {row.expanded.conscription_term}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsMap className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">მიწოდების მისამართი</div>
                  <div className="fw-medium">
                    {row.expanded.product_delivery_address}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCalendar className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">გადახდის ვადა</div>
                  <div className="fw-medium">
                    {row.expanded.product_payment_term}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsBank className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">საბანკო ანგარიში</div>
                  <div className="fw-medium">{row.expanded.bank_account}</div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <i className="bx bx-dollar fs-7 text-primary"></i>
                <div>
                  <div className="text-muted small">ფასი</div>
                  <div className="fw-medium">{row.expanded.price} ₾</div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <i className="bx bx-building fs-7 text-primary"></i>
                <div>
                  <div className="text-muted small">კონტრაგენტის მისამართი</div>
                  <div className="fw-medium">
                    {row.expanded.contragent.address}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <i className="bx bx-phone fs-7 text-primary"></i>
                <div>
                  <div className="text-muted small">კონტრაგენტის ტელეფონი</div>
                  <div className="fw-medium">
                    {row.expanded.contragent.phone}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <i className="bx bx-envelope fs-7 text-primary"></i>
                <div>
                  <div className="text-muted small">კონტრაგენტის ელფოსტა</div>
                  <div className="fw-medium">
                    {row.expanded.contragent.email}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <i className="bx bx-user fs-7 text-primary"></i>
                <div>
                  <div className="text-muted small">დირექტორის სახელი</div>
                  <div className="fw-medium">{row.expanded.director.name}</div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <i className="bx bx-phone-call fs-7 text-primary"></i>
                <div>
                  <div className="text-muted small">დირექტორის ტელეფონი</div>
                  <div className="fw-medium">{row.expanded.director.phone}</div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }, [])

  return (
    <>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MuiTable
          columns={columns}
          data={transformedAgreements}
          initialPageSize={10}
          pageSizeOptions={[5, 10, 15, 20]}
          enableSearch={true}
          searchableFields={["contragent.name", "requested_by"]}
          filterOptions={filterOptions}
          renderRowDetails={renderRowDetails}
        />
        
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
    </>
  )
}

export default StandardAgreementApprove
