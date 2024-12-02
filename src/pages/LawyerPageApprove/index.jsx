import React, { useEffect, useState, useMemo } from "react"
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
} from "services/agreement"
import MuiTable from "../../components/Mui/MuiTable"

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

const LawyerPageApprove = () => {
  document.title = "ხელშეკრულებების ვიზირება | Gorgia LLC"
  const [agreements, setAgreements] = useState([])
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null,
    agreementId: null,
  })
  const [isProcessing, setIsProcessing] = useState(false)

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
    await handleUpdateStatus(agreementId, type)
    handleModalClose()
  }

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "კონტრაგენტის სახელი",
        accessor: "contragent.name",
      },
      {
        Header: "კონტრაგენტის მისამართი",
        accessor: "contragent.address",
      },
      {
        Header: "კონტრაგენტის ნომერი",
        accessor: "contragent.phone",
      },
      {
        Header: "კონტრაგენტის ელ-ფოსტა",
        accessor: "contragent.email",
      },
      {
        Header: "მყიდველი",
        accessor: "buyer",
      },
      {
        Header: "დირექტორი",
        accessor: "contragent.director",
      },
      {
        Header: "პროდუქციის ღირებულება",
        accessor: "price",
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
        created_at: agreement.created_at,
        name: agreement.contragent_name || "N/A",
        price: agreement.product_cost,
        payment_terms: agreement.product_payment_term,
        buyer: agreement.buyer_name + " " + agreement.buyer_surname,
        file_path: "/storage/app/templates/agreement_template_1.docx",
        contragent: {
          name: agreement.contragent_name,
          address: agreement.contragent_address,
          phone: agreement.contragent_phone_number,
          email: agreement.contragent_email,
          director: agreement.contragent_director,
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
                    searchableFields={["contragent.name"]}
                    filterOptions={filterOptions}
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
            "დარწმუნებული ხართ, რომ გსურთ ამ მოქმედების შესრულება?"
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="error"
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

export default LawyerPageApprove
