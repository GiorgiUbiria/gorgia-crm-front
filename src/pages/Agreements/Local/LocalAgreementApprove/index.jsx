import React, { useEffect, useState, useMemo } from "react"
import { Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from "reactstrap"
import Button from "@mui/material/Button"
import {
  getDepartmentAgreements,
  updateAgreementStatus,
} from "services/localAgreement"
import MuiTable from "../../../../components/Mui/MuiTable"
import { ToastContainer } from "react-toastify"
import { expandedRows } from "./expandedRows"

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

const LocalAgreementApprove = () => {
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
        created_at: new Date(agreement.created_at).toLocaleDateString(),
        accepted_at: agreement.accepted_at
          ? new Date(agreement.accepted_at).toLocaleString()
          : "-",
        rejected_at: agreement.rejected_at
          ? new Date(agreement.rejected_at).toLocaleString()
          : "-",
        updated_at: new Date(agreement.updated_at).toLocaleString(),
        executor_firm_name: agreement.executor_firm_name,
        requested_by: agreement.user.name + " " + agreement.user.sur_name,
        expanded: {
          executor_factual_address: agreement.executor_factual_address,
          executor_firm_name: agreement.executor_firm_name,
          executor_id_number: agreement.executor_id_number,
          executor_home_address: agreement.executor_home_address,
          executor_full_name: agreement.executor_full_name,
          executor_position: agreement.executor_position,
          executor_bank_account: agreement.executor_bank_account,
          executor_bank_name: agreement.executor_bank_name,
          agreement_automatic_renewal:
            agreement.agreement_automatic_renewal === 1 ? "კი" : "არა",
          exclusivity: agreement.exclusivity === 1 ? "კი" : "არა",
          agreement_active_term: agreement.agreement_active_term,
          exclusive_placement: agreement.exclusive_placement,
          executor_bank_swift: agreement.executor_bank_swift,
          director_full_name: agreement.director_full_name,
          director_id_number: agreement.director_id_number,
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
        Header: "მოითხოვა",
        accessor: "requested_by",
        disableSortBy: true,
      },
      {
        Header: "შემსრულებელი ფირმის დასახელება",
        accessor: "executor_firm_name",
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

  return (
    <>
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MuiTable
          columns={columns}
          data={transformedAgreements}
          initialPageSize={10}
          pageSizeOptions={[5, 10, 15, 20]}
          enableSearch={true}
          searchableFields={["executor_firm_name", "requested_by"]}
          filterOptions={filterOptions}
          onRowClick={() => {}}
          renderRowDetails={expandedRows}
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

      <ToastContainer />
    </>
  )
}

export default LocalAgreementApprove
