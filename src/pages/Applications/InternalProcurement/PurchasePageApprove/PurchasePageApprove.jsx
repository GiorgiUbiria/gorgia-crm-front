import React, { useEffect, useState, useMemo } from "react"
import {
  Row,
  Col,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
} from "reactstrap"
import {
  BiQuestionMark,
  BiCheck,
  BiX,
  BiXCircle,
  BiArrowBack,
} from "react-icons/bi"
import Breadcrumbs from "../../../../components/Common/Breadcrumb"
import {
  getPurchaseList,
  updatePurchaseStatus,
} from "../../../../services/purchase"
import MuiTable from "../../../../components/Mui/MuiTable"
import Button from "@mui/material/Button"

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

const ExpandedRowContent = ({ rowData }) => {
  const details = [
    { label: "მიწოდების ვადა", value: rowData.deadline },
    { label: "მოკლე ვადის მიზეზი", value: rowData.short_period_reason },
    { label: "მარაგის მიზანი", value: rowData.stock_purpose },
    { label: "მარკა/მოდელი", value: rowData.brand_model },
    { label: "ალტერნატივა", value: rowData.alternative },
    {
      label: "კონკურენტული ფასი",
      value: rowData.competitive_price || "არ არის მითითებული",
    },
    {
      label: "იგეგმება თუ არა მომდევნო თვეში",
      value: rowData.planned_next_month,
    },
    { label: "თანხის ანაზღაურება", value: rowData.who_pay_amount },
    {
      label: "პასუხისმგებელი თანამშრომელი",
      value: rowData.name_surname_of_employee,
    },
  ]

  return (
    <div className="p-3 bg-light rounded">
      {rowData.comment && (
        <div className="mb-3">
          <span className="fw-bold text-danger">უარყოფის მიზეზი: </span>
          <p className="mb-0">{rowData.comment}</p>
        </div>
      )}
      <div className="row g-2">
        {details.map((detail, index) => (
          <div key={index} className="col-md-6">
            <span className="fw-bold">{detail.label}: </span>
            <span>{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const PurchasePageApprove = () => {
  document.title = "შიდა შესყიდვების ვიზირება | Gorgia LLC"

  const [purchases, setPurchases] = useState([])
  const [rejectionModal, setRejectionModal] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState(null)
  const [rejectionComment, setRejectionComment] = useState("")
  const [confirmModal, setConfirmModal] = useState(false)
  const [actionType, setActionType] = useState(null)

  const fetchPurchases = async () => {
    try {
      const response = await getPurchaseList(true)
      console.log(response.data)
      setPurchases(response.data.internal_purchases)
    } catch (err) {
      console.error("Error fetching purchase requests:", err)
    }
  }

  useEffect(() => {
    fetchPurchases()
  }, [])

  const handleModalOpen = (action, purchaseId) => {
    setSelectedPurchase(purchaseId)
    setActionType(action)
    if (action === "rejected") {
      setRejectionModal(true)
    } else {
      setConfirmModal(true)
    }
  }

  const handleConfirmAction = async () => {
    try {
      const response = await updatePurchaseStatus(selectedPurchase, actionType)
      if (response.data.success) {
        setPurchases(prevPurchases =>
          prevPurchases.map(purchase =>
            purchase.id === selectedPurchase
              ? { ...purchase, status: actionType }
              : purchase
          )
        )
        setConfirmModal(false)
        setSelectedPurchase(null)
        setActionType(null)
      }
    } catch (err) {
      console.error("Error updating purchase status:", err)
    }
  }

  const handleRejectionSubmit = async () => {
    try {
      const response = await updatePurchaseStatus(
        selectedPurchase,
        "rejected",
        rejectionComment
      )
      if (response.data.success) {
        setPurchases(prevPurchases =>
          prevPurchases.map(purchase =>
            purchase.id === selectedPurchase
              ? { ...purchase, status: "rejected" }
              : purchase
          )
        )
        setRejectionModal(false)
        setRejectionComment("")
        setSelectedPurchase(null)
      }
    } catch (err) {
      console.error("Error rejecting purchase:", err)
    }
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
        Header: "თარიღი",
        accessor: "created_at",
        sortType: "basic",
        Cell: ({ value }) => (
          <div className="date-wrapper">
            <i className="bx bx-calendar me-2"></i>
            {new Date(value).toLocaleDateString()}
          </div>
        ),
      },
      {
        Header: "სტატუსი",
        accessor: "status",
        disableSortBy: true,
        Cell: ({ value }) => (
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
            <i className={`bx ${statusMap[value].icon} me-2`}></i>
            {statusMap[value].label}
          </span>
        ),
      },
      {
        Header: "მიზანი",
        accessor: "objective",
        disableSortBy: true,
      },
      {
        Header: "მიზეზი",
        accessor: "reason",
        disableSortBy: true,
      },
      {
        Header: "დეპარტამენტი",
        accessor: "department",
        disableSortBy: true,
      },
      {
        Header: "მიღებული მისამართი",
        accessor: "delivery_address",
        disableSortBy: true,
      },
      {
        Header: "შემმოწმებული",
        accessor: "reviewer",
        disableSortBy: true,
      },
      {
        Header: "მოქმედებები",
        accessor: "actions",
        disableSortBy: true,
        Cell: ({ row }) =>
          row.original.status === "pending" && (
            <div className="d-flex gap-2">
              <div className="d-flex align-items-center">
                <Button
                  onClick={() => handleModalOpen("approved", row.original.id)}
                  color="success"
                  variant="contained"
                >
                  დამტკიცება
                </Button>
              </div>
              <div className="d-flex align-items-center">
                <Button
                  onClick={() => handleModalOpen("rejected", row.original.id)}
                  color="error"
                  variant="contained"
                >
                  უარყოფა
                </Button>
              </div>
            </div>
          ),
      },
    ],
    []
  )

  const transformedPurchases = purchases.map(purchase => ({
    id: purchase.id,
    requested_by: purchase.user?.name + " " + purchase.user?.sur_name || "არ არის მითითებული",
    status: STATUS_MAPPING[purchase.status] || purchase.status,
    created_at: purchase.created_at,
    user: {
      name: purchase.performer_name,
      id: purchase.id_code_or_personal_number,
      position: purchase.service_description,
      location: purchase.legal_or_actual_address,
    },
    objective: purchase.objective,
    reason: purchase.reason,
    department: purchase.department?.name || "N/A",
    delivery_address: purchase.delivery_address,
    reviewer: purchase.reviewed_by
      ? `${purchase.reviewed_by.name || ""} ${
          purchase.reviewed_by.sur_name || ""
        }`
      : "N/A",
    comment: purchase.comment,
    deadline: purchase.deadline,
    short_period_reason: purchase.short_period_reason,
    requested_procurement_object_exceed:
      purchase.requested_procurement_object_exceed,
    stock_purpose: purchase.stock_purpose,
    brand_model: purchase.brand_model,
    alternative: purchase.alternative,
    competitive_price: purchase.competitive_price,
    planned_next_month: purchase.planned_next_month,
    who_pay_amount: purchase.who_pay_amount,
    name_surname_of_employee: purchase.name_surname_of_employee,
    reviewed_at: purchase.reviewed_at,
    reviewed_by: purchase.reviewed_by,
  }))

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

  const expandedRow = row => <ExpandedRowContent rowData={row} />

  return (
    <React.Fragment>
      <div className="page-content mb-4">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs
                title="განცხადებები"
                breadcrumbItem="შიდა შესყიდვების ვიზირება"
              />
            </Col>
          </Row>
          <Row>
            <MuiTable
              data={transformedPurchases}
              columns={columns}
              filterOptions={filterOptions}
              enableSearch={true}
              searchableFields={["reviewer", "department"]}
              initialPageSize={10}
              renderRowDetails={expandedRow}
            />
          </Row>
        </div>
      </div>
      <Modal isOpen={confirmModal} toggle={() => setConfirmModal(false)}>
        <ModalHeader toggle={() => setConfirmModal(false)}>
          დაადასტურეთ მოქმედება
        </ModalHeader>
        <ModalBody className="text-center">
          <BiQuestionMark className="text-warning" size={48} />
          <p className="mb-4">
            დარწმუნებული ხართ, რომ გსურთ შესყიდვის მოთხოვნის დამტკიცება?
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmAction}
              startIcon={<BiCheck />}
            >
              დადასტურება
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setConfirmModal(false)}
              startIcon={<BiX />}
            >
              გაუქმება
            </Button>
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={rejectionModal} toggle={() => setRejectionModal(false)}>
        <ModalHeader toggle={() => setRejectionModal(false)}>
          <BiXCircle className="text-danger me-2" size={24} />
          უარყოფის მიზეზი
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="rejectionComment" className="fw-bold mb-2">
                გთხოვთ მიუთითოთ უარყოფის მიზეზი
              </Label>
              <Input
                type="textarea"
                name="rejectionComment"
                id="rejectionComment"
                value={rejectionComment}
                onChange={e => setRejectionComment(e.target.value)}
                rows="4"
                required
                className="mb-3"
                placeholder="შეიყვანეთ უარყოფის დეტალური მიზეზი..."
              />
            </FormGroup>
          </Form>
          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="contained"
              color="error"
              onClick={handleRejectionSubmit}
              disabled={!rejectionComment.trim()}
              startIcon={<BiXCircle />}
            >
              უარყოფა
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setRejectionModal(false)}
              startIcon={<BiArrowBack />}
            >
              გაუქმება
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default PurchasePageApprove
