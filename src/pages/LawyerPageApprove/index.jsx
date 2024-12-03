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
        Header: "კონტრაგენტის დასახელება/სახელი და გვარი",
        accessor: "contragent.name",
      },
      {
        Header: "პირადი ნომერი/საიდენტიფიკაციო კოდი",
        accessor: "contragent.id",
      },
      {
        Header: "მისამართი",
        accessor: "contragent.address",
      },
      {
        Header: "ტელეფონის ნომერი",
        accessor: "contragent.phone",
      },
      {
        Header: "ელ.ფოსტა",
        accessor: "contragent.email",
      },
      {
        Header: "დირექტორის სახელი და გვარი",
        accessor: "director.name",
      },
      {
        Header: "დირექტორის ტელეფონის ნომერი",
        accessor: "director.phone",
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
        price: agreement.product_cost,
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
    if (!row) {
      return null
    }

    return (
      <div className="p-3">
        <div className="mb-3">
          <Row>
            <Col md={6}>
              <div className="mb-2">
                <strong>გადახდის განსხვავებული პირობები: </strong>
                {row.expanded.different_terms ? "კი" : "არა"}
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-2">
                <strong>
                  ხელშეკრულების გაფორმების ინიციატორი და შესრულებაზე
                  პასუხისმგებელი პირი:{" "}
                </strong>
                {row.expanded.contract_initiator}
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <div className="mb-2">
                <strong>ხელშეკრულების ვადა: </strong>
                {row.expanded.conscription_term}
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-2">
                <strong>პროდუქციის მიწოდების მისამართი: </strong>
                {row.expanded.product_delivery_address}
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <div className="mb-2">
                <strong>პროდუქციის გადახდის ვადა: </strong>
                {row.expanded.product_payment_term}
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-2">
                <strong>საბანკო ანგარიში: </strong>
                {row.expanded.bank_account}
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
                    searchableFields={["contragent.name"]}
                    filterOptions={filterOptions}
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
