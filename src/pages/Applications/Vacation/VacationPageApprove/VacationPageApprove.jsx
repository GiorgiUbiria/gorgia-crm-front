import React, { useEffect, useState, useMemo } from "react"
import {
  Row,
  Col,
  Input,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap"
import Breadcrumbs from "../../../../components/Common/Breadcrumb"
import { getVacations } from "../../../../services/admin/vacation"
import { updateVacationStatus } from "../../../../services/vacation"
import MuiTable from "../../../../components/Mui/MuiTable"
import Button from "@mui/material/Button"
import {
  BiCheck,
  BiX,
  BiQuestionMark,
  BiXCircle,
  BiArrowBack,
} from "react-icons/bi"

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

const typeMap = {
  paid_leave: {
    label: "ანაზღაურებადი",
    color: "#28a745",
  },
  unpaid_leave: {
    label: "არანაზღაურებადი",
    color: "#dc3545",
  },
  administrative_leave: {
    label: "ადმინისტრაციული",
    color: "#FFA500",
  },
  maternity_leave: {
    label: "დეკრეტული",
    color: "#757575",
  },
}

const STATUS_MAPPING = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
}

const TYPE_MAPPING = {
  paid_leave: "paid_leave",
  unpaid_leave: "unpaid_leave",
  administrative_leave: "administrative_leave",
  maternity_leave: "maternity_leave",
}

const ExpandedRowContent = ({ rowData }) => {
  if (!rowData) return null

  const {
    start_date,
    end_date,
    requested_for,
    expanded: {
      holiday_days,
      substitute: { substitute_name, substitute_position },
      review: { reviewed_by, reviewed_at, rejection_reason },
    },
  } = rowData

  const dayMapGe = {
    is_monday: "ორშაბათი",
    is_tuesday: "სამშაბათი",
    is_wednesday: "ოთხშაბათი",
    is_thursday: "ხუთშაბათი",
    is_friday: "პარასკევი",
    is_saturday: "შაბათი",
    is_sunday: "კვირა",
  }

  const selectedDays = Object.entries(holiday_days)
    .filter(([, value]) => value === "yes")
    .map(([dayKey]) => dayMapGe[dayKey] || dayKey)

  return (
    <div className="p-3 bg-white rounded">
      <Row className="g-3">
        <Col md={6}>
          <div className="border rounded p-3 mb-3">
            <div className="d-flex align-items-center mb-2">
              <i className="bx bx-calendar me-2 text-primary"></i>
              <h6 className="mb-0">შვებულების დეტალები</h6>
            </div>
            <div className="d-flex gap-3">
              <small style={{ display: "flex", alignItems: "center" }}>
                <i className="bx bx-calendar me-1"></i>
                {start_date} - {end_date}
              </small>
              <small style={{ display: "flex", alignItems: "center" }}>
                <i className="bx bx-user me-1"></i>
                {requested_for}
              </small>
            </div>
          </div>

          <div className="border rounded p-3">
            <div className="d-flex align-items-center mb-2">
              <i className="bx bx-calendar-check me-2 text-primary"></i>
              <h6 className="mb-0">შვებულების დღეები</h6>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {selectedDays.map((day, index) => (
                <div
                  key={index}
                  className="bg-light rounded p-2"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <i className="bx bx-calendar-event me-1"></i>
                  <small>{day}</small>
                </div>
              ))}
            </div>
          </div>
        </Col>

        <Col md={6}>
          <div className="border rounded p-3 mb-3">
            <div className="d-flex align-items-center mb-2">
              <i className="bx bx-user-pin me-2 text-primary"></i>
              <h6 className="mb-0">შემცვლელი</h6>
            </div>
            <div className="d-flex flex-column gap-1">
              <small style={{ display: "flex", alignItems: "center" }}>
                <i className="bx bx-user me-1"></i>
                {substitute_name}
              </small>
              <small style={{ display: "flex", alignItems: "center" }}>
                <i className="bx bx-briefcase me-1"></i>
                {substitute_position}
              </small>
            </div>
          </div>

          <div className="border rounded p-3">
            <div className="d-flex align-items-center mb-2">
              <i className="bx bx-check-circle me-2 text-primary"></i>
              <h6 className="mb-0">განხილვა</h6>
            </div>
            {reviewed_by && (
              <small style={{ display: "flex", alignItems: "center" }}>
                <i className="bx bx-user me-1"></i>
                {reviewed_by} - {reviewed_at}
              </small>
            )}
            {rejection_reason && (
              <small
                className="d-block text-danger mt-1"
                style={{
                  color: "#dc3545",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <i className="bx bx-x-circle me-1"></i>
                {rejection_reason}
              </small>
            )}
          </div>
        </Col>
      </Row>
    </div>
  )
}

const VacationPageApprove = () => {
  document.title = "შვებულების ვიზირება | Gorgia LLC"

  const [vacations, setVacations] = useState([])
  const [rejectionModal, setRejectionModal] = useState(false)
  const [selectedVacation, setSelectedVacation] = useState(null)
  const [rejectionComment, setRejectionComment] = useState("")
  const [confirmModal, setConfirmModal] = useState(false)
  const [actionType, setActionType] = useState(null)

  const fetchVacations = async () => {
    try {
      const response = await getVacations()
      console.log(response)
      setVacations(response.data.data)
    } catch (err) {
      console.error("Error fetching vacation requests:", err)
    }
  }

  useEffect(() => {
    fetchVacations()
  }, [])

  const handleModalOpen = (action, vacationId) => {
    setSelectedVacation(vacationId)
    setActionType(action)
    if (action === "rejected") {
      setRejectionModal(true)
    } else {
      setConfirmModal(true)
    }
  }

  const handleConfirmAction = async () => {
    try {
      const response = await updateVacationStatus(selectedVacation, actionType)
      if (response.status === 200) {
        setVacations(prevVacations =>
          prevVacations.map(vacation =>
            vacation.id === selectedVacation
              ? { ...vacation, status: actionType }
              : vacation
          )
        )
        setConfirmModal(false)
        setSelectedVacation(null)
        setActionType(null)
      }
    } catch (err) {
      console.error("Error updating vacation status:", err)
    }
  }

  const handleRejectionSubmit = async () => {
    try {
      const response = await updateVacationStatus(
        selectedVacation,
        "rejected",
        rejectionComment
      )
      if (response.status === 200) {
        setVacations(prevVacations =>
          prevVacations.map(vacation =>
            vacation.id === selectedVacation
              ? { ...vacation, status: "rejected" }
              : vacation
          )
        )
        setRejectionModal(false)
        setRejectionComment("")
        setSelectedVacation(null)
      }
    } catch (err) {
      console.error("Error rejecting vacation:", err)
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "მომთხოვნი პირი",
        accessor: "requested_by",
      },
      {
        Header: "თანამშრომლის სახელი/გვარი",
        accessor: "requested_for",
      },
      {
        Header: "მოთხოვნის თარიღი",
        accessor: "requested_at",
      },
      {
        Header: "დაწყების თარიღი",
        accessor: "start_date",
      },
      {
        Header: "დასრულების თარიღი",
        accessor: "end_date",
      },
      {
        Header: "ხანგრძლივობა",
        accessor: "duration",
      },
      {
        Header: "შვებულების ტიპი",
        accessor: "type",
        Cell: ({ value }) => {
          const typeInfo = typeMap[value] || { label: value, color: "#757575" }
          return <span style={{ color: typeInfo.color }}>{typeInfo.label}</span>
        },
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

  const transformedVacations = vacations.map(vacation => ({
    id: vacation.id,
    status: STATUS_MAPPING[vacation.status] || vacation.status,
    start_date: new Date(vacation.start_date).toLocaleDateString("ka-GE"),
    end_date: new Date(vacation.end_date).toLocaleDateString("ka-GE"),
    duration: vacation.duration.toString() + " დღე",
    type: vacation.type
      ? TYPE_MAPPING[vacation.type] || vacation.type
      : "უცნობი",
    requested_by: vacation.user
      ? `${vacation.user?.name || ""} ${vacation.user?.sur_name || ""}`
      : "უცნობი",
    requested_at: new Date(vacation.created_at).toLocaleDateString("ka-GE"),
    requested_for: `${vacation.employee_name || ""} | ${
      vacation.position || ""
    } | ${vacation.department || ""}`,
    expanded: {
      holiday_days: {
        is_monday: vacation.is_monday,
        is_tuesday: vacation.is_tuesday,
        is_wednesday: vacation.is_wednesday,
        is_thursday: vacation.is_thursday,
        is_friday: vacation.is_friday,
        is_saturday: vacation.is_saturday,
        is_sunday: vacation.is_sunday,
      },
      substitute: {
        substitute_name: vacation.substitute_name || "უცნობია",
        substitute_position: vacation.substitute_position || "უცნობია",
      },
      review: {
        reviewed_by: vacation.reviewed_by
          ? `${vacation.reviewed_by?.name || ""} ${
              vacation.reviewed_by?.sur_name || ""
            }`
          : "ჯერ არ არის განხილული",
        reviewed_at: vacation?.reviewed_at
          ? new Date(vacation.reviewed_at).toLocaleDateString("ka-GE")
          : "-",
        rejection_reason: vacation.rejection_reason || "",
      },
    },
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
    {
      field: "type",
      label: "შვებულების ტიპი",
      valueLabels: {
        paid_leave: "გადახდილი",
        unpaid_leave: "გადაუხდელი",
        administrative_leave: "ადმინისტრაციული",
        maternity_leave: "დეკრეტული",
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
                breadcrumbItem="შვებულებების ვიზირება"
              />
            </Col>
          </Row>
          <Row>
            <MuiTable
              data={transformedVacations}
              columns={columns}
              filterOptions={filterOptions}
              enableSearch={true}
              searchableFields={["requested_by", "requested_for"]}
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
            დარწმუნებული ხართ, რომ გსურთ შვებულების მოთხოვნის დამტკიცება?
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

export default VacationPageApprove
