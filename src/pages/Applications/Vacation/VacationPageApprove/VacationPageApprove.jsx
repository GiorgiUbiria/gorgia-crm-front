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
  ModalFooter,
} from "reactstrap"
import Breadcrumbs from "../../../../components/Common/Breadcrumb"
import { getVacations } from "../../../../services/admin/vacation"
import { updateVacationStatus } from "../../../../services/vacation"
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

const typeMap = {
  paid: {
    label: "ანაზღაურებადი",
    color: "#28a745",
  },
  unpaid: {
    label: "არანაზღაურებადი",
    color: "#dc3545",
  },
  administrative: {
    label: "ადმინისტრაციული",
    color: "#FFA500",
  },
  maternity: {
    label: "დეკრეტული",
    color: "#757575",
  },
  unknown: {
    label: "უცნობი",
    color: "#757575",
  },
}

const STATUS_MAPPING = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
}

const TYPE_MAPPING = {
  paid: "paid",
  unpaid: "unpaid",
  administrative: "administrative",
  maternity: "maternity",
  unknown: "unknown",
}

const ExpandedRowContent = ({ rowData }) => {
  if (!rowData) return null

  return (
    <div className="p-4 bg-light rounded">
      {rowData.expandedRow.comment && (
        <div className="alert alert-danger d-flex align-items-center mb-4">
          <i className="bx bx-error-circle me-2 fs-5"></i>
          <div>
            <strong>კომენტარი:</strong> {rowData.expandedRow.comment}
          </div>
        </div>
      )}

      <div className="border rounded p-4 bg-white mb-4">
        <Row className="g-4">
          <Col md={12}>
            <h6 className="mb-3">დასვენების დღეები:</h6>
            <div className="d-flex flex-wrap gap-3">
              {[
                { day: "ორშაბათი", value: rowData.expandedRow.monday },
                { day: "სამშაბათი", value: rowData.expandedRow.tuesday },
                { day: "ოთხშაბათი", value: rowData.expandedRow.wednesday },
                { day: "ხუთშაბათი", value: rowData.expandedRow.thursday },
                { day: "პარასკევი", value: rowData.expandedRow.friday },
                { day: "შაბათი", value: rowData.expandedRow.saturday },
                { day: "კვირა", value: rowData.expandedRow.sunday },
              ].map((item, index) => (
                <div key={index} className="d-flex align-items-center gap-2">
                  <i
                    className={`bx ${
                      item.value === "yes"
                        ? "bx-check text-success"
                        : "bx-x text-danger"
                    }`}
                  ></i>
                  <span>{item.day}</span>
                </div>
              ))}
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex flex-column gap-2">
              <div>
                <strong>დეპარტამენტის დასტური:</strong>{" "}
                <span
                  className={`badge bg-${
                    rowData.expandedRow.department_approval === "pending"
                      ? "warning"
                      : rowData.expandedRow.department_approval === "approved"
                      ? "success"
                      : "danger"
                  }`}
                >
                  {rowData.expandedRow.department_approval}
                </span>
              </div>
              <div>
                <strong>HR-ის დასტური:</strong>{" "}
                <span
                  className={`badge bg-${
                    rowData.expandedRow.hr_approval === "pending"
                      ? "warning"
                      : rowData.expandedRow.hr_approval === "approved"
                      ? "success"
                      : "danger"
                  }`}
                >
                  {rowData.expandedRow.hr_approval}
                </span>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex flex-column gap-2">
              <div>
                <strong>შექმნის თარიღი:</strong>{" "}
                {new Date(rowData.expandedRow.created_at).toLocaleDateString()}
              </div>
              {rowData.expandedRow.reviewed_at && (
                <div>
                  <strong>განხილვის თარიღი:</strong>{" "}
                  {new Date(
                    rowData.expandedRow.reviewed_at
                  ).toLocaleDateString()}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

const calculateDuration = (startDate, endDate, restDays) => {
  if (!startDate || !endDate) return 0

  const start = new Date(startDate)
  const end = new Date(endDate)
  let totalDays = 0

  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay()
    const dayMap = {
      0: "sunday",
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    }

    const currentDay = dayMap[dayOfWeek]
    if (restDays[currentDay] !== "yes") {
      totalDays++
    }
  }

  return Math.max(1, totalDays)
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
      setVacations(response.data.vocations)
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
        Header: "მოითხოვა",
        accessor: "requested_by",
        disableSortBy: true,
      },
      {
        Header: "შვებულების ტიპი",
        accessor: "type_of_vacations",
        disableSortBy: true,
        Cell: ({ value }) => {
          const typeInfo = typeMap[value] || { label: value, color: "#757575" }
          return <span style={{ color: typeInfo.color }}>{typeInfo.label}</span>
        },
      },
      {
        Header: "დაწყების თარიღი",
        accessor: "start_date",
        sortType: "basic",
        Cell: ({ value }) => (
          <div className="date-wrapper">
            <i className="bx bx-calendar me-2"></i>
            {new Date(value).toLocaleDateString()}
          </div>
        ),
      },
      {
        Header: "დასრულების თარიღი",
        accessor: "end_date",
        sortType: "basic",
        Cell: ({ value }) => (
          <div className="date-wrapper">
            <i className="bx bx-calendar me-2"></i>
            {new Date(value).toLocaleDateString()}
          </div>
        ),
      },
      {
        Header: "დღეების რაოდენობა",
        accessor: "duration",
        Cell: ({ value }) => (
          <div className="text-center">
            {value} {value === 1 ? "დღე" : "დღე"}
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
        Header: "შეამოწმა",
        accessor: "reviewed_by",
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

  const transformedVacations = vacations.map(vacation => ({
    id: vacation.id,
    status: STATUS_MAPPING[vacation.status] || vacation.status,
    start_date: vacation.start_date,
    end_date: vacation.end_date,
    requested_by:
      vacation.user?.name + " " + vacation.user?.sur_name ||
      "არ არის მითითებული",
    reviewed_by:
      vacation.reviewed_by?.name + " " + vacation.reviewed_by?.sur_name ||
      "არ არის მითითებული",
    comment: vacation.comment,
    type_of_vacations: vacation.type_of_vocations
      ? TYPE_MAPPING[vacation.type_of_vocations] || vacation.type_of_vocations
      : "უცნობი",
    expandedRow: {
      comment: vacation.comment,
      monday: vacation.monday,
      tuesday: vacation.tuesday,
      wednesday: vacation.wednesday,
      thursday: vacation.thursday,
      friday: vacation.friday,
      saturday: vacation.saturday,
      sunday: vacation.sunday,
      department_approval: vacation.department_approval,
      hr_approval: vacation.hr_approval,
      created_at: vacation.created_at,
      reviewed_at: vacation.reviewed_at,
    },
    duration: calculateDuration(vacation.start_date, vacation.end_date, {
      monday: vacation.monday,
      tuesday: vacation.tuesday,
      wednesday: vacation.wednesday,
      thursday: vacation.thursday,
      friday: vacation.friday,
      saturday: vacation.saturday,
      sunday: vacation.sunday,
    }),
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
      field: "type_of_vacations",
      label: "შვებულების ტიპი",
      valueLabels: {
        paid: "გადახდილი",
        unpaid: "გადაუხდელი",
        administrative: "ადმინისტრაციული",
        maternity: "დეკრეტული",
        unknown: "უცნობი",
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
              searchableFields={["requested_by", "reviewed_by"]}
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
        <ModalBody>
          დარწმუნებული ხართ, რომ გსურთ შესყიდვის მოთხოვნის დამტკიცება?
        </ModalBody>
        <ModalFooter>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmAction}
          >
            დადასტურება
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setConfirmModal(false)}
          >
            გაუქმება
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={rejectionModal} toggle={() => setRejectionModal(false)}>
        <ModalHeader toggle={() => setRejectionModal(false)}>
          უარყოფის მიზეზი
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="rejectionComment">
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
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="contained"
            color="error"
            onClick={handleRejectionSubmit}
            disabled={!rejectionComment.trim()}
          >
            უარყოფა
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setRejectionModal(false)}
          >
            გაუქმება
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  )
}

export default VacationPageApprove
