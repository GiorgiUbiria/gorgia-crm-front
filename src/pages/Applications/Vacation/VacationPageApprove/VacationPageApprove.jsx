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
}

const ExpandedRowContent = ({ rowData }) => {
  const details = [
    { label: "შვებულების ტიპი", value: rowData.type_of_vocations },
    { label: "მიზეზი", value: rowData.reason },
    { label: "ხანგრძლივობა", value: `${rowData.duration} დღე` },
    { label: "სამუშაო დღეები", value: [
      rowData.monday === "yes" && "ორშაბათი",
      rowData.tuesday === "yes" && "სამშაბათი",
      rowData.wednesday === "yes" && "ოთხშაბათი",
      rowData.thursday === "yes" && "ხუთშაბათი",
      rowData.friday === "yes" && "პარასკევი",
      rowData.saturday === "yes" && "შაბათი",
      rowData.sunday === "yes" && "კვირა",
    ].filter(Boolean).join(", ") },
    { label: "დეპარტამენტის დამტკიცება", value: rowData.department_approval },
    { label: "HR-ის დამტკიცება", value: rowData.hr_approval },
    { label: "დეპარტამენტის დამტკიცების თარიღი", value: rowData.department_approval_at },
    { label: "HR-ის დამტკიცების თარიღი", value: rowData.hr_approval_at },
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
            <span>{detail.value || "არ არის მითითებული"}</span>
          </div>
        ))}
      </div>
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
        Header: "სახელი",
        accessor: "user.name",
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
    start_date: vacation.start_date,
    end_date: vacation.end_date,
    // user: {
    //   name: vacation.user.name + " " + vacation.user.sur_name,
    // },
    comment: vacation.comment,
    type_of_vacations: vacation.type_of_vocations
      ? TYPE_MAPPING[vacation.type_of_vocations] || vacation.type_of_vocations
      : "უცნობი",
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
              searchableFields={["user.name", "user.id"]}
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
