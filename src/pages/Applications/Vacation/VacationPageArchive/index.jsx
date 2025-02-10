import React, { useMemo, useState } from "react"
import {
  Row,
  Col,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "reactstrap"
import MuiTable from "components/Mui/MuiTable"
import {
  useVacations,
  useDepartmentVacations,
  useUpdateOneCStatus,
} from "../../../../queries/vacation"
import useAuth from "hooks/useAuth"

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
  auto_approved: {
    label: "ავტომატურად დამტკიცებული",
    icon: "bx-check-double",
    color: "#28a745",
  },
  cancelled: {
    label: "გაუქმებული",
    icon: "bx-x",
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

const TYPE_MAPPING = {
  paid_leave: "paid_leave",
  unpaid_leave: "unpaid_leave",
  administrative_leave: "administrative_leave",
  maternity_leave: "maternity_leave",
}

const ExpandedRowContent = ({ rowData }) => {
  const updateOneCStatusMutation = useUpdateOneCStatus()
  const [modalOpen, setModalOpen] = useState(false)
  const [comment, setComment] = useState("")

  if (!rowData) return null

  const {
    start_date,
    end_date,
    requested_for,
    status,
    expanded: {
      holiday_days,
      substitute: { substitute_name, substitute_position },
      review: { reviewed_by, reviewed_at, rejection_reason },
      one_c_status: { stored_in_one_c, one_c_comment },
    },
  } = rowData

  const handleModalSubmit = () => {
    try {
      updateOneCStatusMutation.mutate({
        id: rowData.id,
        data: {
          stored_in_one_c: true,
          one_c_comment:
            comment ||
            `Stored in 1C on ${new Date().toISOString().split("T")[0]}`,
        },
      })
      setModalOpen(false)
      setComment("")
    } catch (error) {
      console.error("Error updating 1C status:", error)
    }
  }

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

        <Col md={12}>
          <div className="border rounded p-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="d-flex align-items-center">
                <i className="bx bx-data me-2 text-primary"></i>
                <h6 className="mb-0" style={{ fontSize: "0.9375rem" }}>
                  1C სტატუსი
                </h6>
              </div>
            </div>
            <div className="d-flex flex-column gap-1">
              <small
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.8125rem",
                  color:
                    status === "pending"
                      ? "#757575"
                      : stored_in_one_c
                      ? "#28a745"
                      : "#dc3545",
                }}
              >
                <i
                  className={`bx ${
                    status === "pending"
                      ? "bx-time"
                      : stored_in_one_c
                      ? "bx-check"
                      : "bx-x"
                  } me-1`}
                ></i>
                {status === "pending"
                  ? "ჯერ-ჯერობით არ არის დამტკიცებული"
                  : stored_in_one_c
                  ? "გადატანილია"
                  : "არ არის გადატანილი"}
              </small>
              {one_c_comment && (
                <small
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.8125rem",
                  }}
                >
                  <i className="bx bx-comment-detail me-1"></i>
                  {one_c_comment}
                </small>
              )}
            </div>
          </div>
        </Col>
      </Row>

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
        <ModalHeader toggle={() => setModalOpen(false)}>
          1C-ში გადატანის კომენტარი
        </ModalHeader>
        <ModalBody>
          <Input
            type="textarea"
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="შეიყვანეთ კომენტარი (არასავალდებულო)"
            rows={4}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            გაუქმება
          </Button>
          <Button color="primary" onClick={handleModalSubmit}>
            შენახვა
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

const VacationPageArchive = () => {
  document.title = "შვებულებების არქივი | Gorgia LLC"

  const { isAdmin, isDepartmentHead, isHrMember, isDepartmentHeadAssistant } =
    useAuth()
  const updateOneCStatusMutation = useUpdateOneCStatus()

  const isHrAssistant = isDepartmentHeadAssistant() || isHrMember()

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedVacation, setSelectedVacation] = useState(null)
  const [comment, setComment] = useState("")

  const handleOneCStatusUpdate = React.useCallback(
    async (id, currentStatus) => {
      if (!currentStatus) {
        setSelectedVacation({ id, currentStatus })
        setModalOpen(true)
        return
      }

      try {
        updateOneCStatusMutation.mutate({
          id,
          data: {
            stored_in_one_c: !currentStatus,
            one_c_comment: "",
          },
        })
      } catch (error) {
        console.error("Error updating 1C status:", error)
      }
    },
    [updateOneCStatusMutation]
  )

  const handleModalSubmit = () => {
    if (!selectedVacation) return

    try {
      updateOneCStatusMutation.mutate({
        id: selectedVacation.id,
        data: {
          stored_in_one_c: !selectedVacation.currentStatus,
          one_c_comment:
            comment ||
            `Stored in 1C on ${new Date().toISOString().split("T")[0]}`,
        },
      })
      setModalOpen(false)
      setSelectedVacation(null)
      setComment("")
    } catch (error) {
      console.error("Error updating 1C status:", error)
    }
  }

  const {
    data: departmentVacationData,
    isLoading: departmentVacationsLoading,
  } = useDepartmentVacations({
    enabled:
      (isDepartmentHead() || isDepartmentHeadAssistant()) &&
      !isAdmin() &&
      !isHrMember(),
  })
  const { data: vacationsData, isLoading: vacationsLoading } = useVacations({
    enabled: isAdmin() || isHrMember(),
  })

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
        Cell: ({ value }) => {
          const statusInfo = statusMap[value] || {
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
                    : value === "rejected" || value === "cancelled"
                    ? "#ffebee"
                    : value === "approved" || value === "auto_approved"
                    ? "#e8f5e9"
                    : "#f5f5f5",
                color: statusInfo.color,
              }}
            >
              <i className={`bx ${statusInfo.icon} me-2`}></i>
              {statusInfo.label}
            </span>
          )
        },
      },
      {
        Header: "1C სტატუსი",
        accessor: "one_c_status",
        Cell: ({ row }) => {
          const { status } = row.original
          const stored_in_one_c =
            row.original.expanded.one_c_status.stored_in_one_c
          const isApproved = status === "approved" || status === "auto_approved"

          if (!isHrAssistant || (!isApproved && status !== "pending")) {
            return (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  color: stored_in_one_c ? "#28a745" : "#dc3545",
                  fontSize: "0.8125rem",
                }}
              >
                <i
                  className={`bx ${stored_in_one_c ? "bx-check" : "bx-x"} me-1`}
                ></i>
                {status === "pending"
                  ? "ჯერ-ჯერობით არ არის დამტკიცებული"
                  : stored_in_one_c
                  ? "გადატანილია"
                  : "არ არის გადატანილი"}
              </span>
            )
          }

          if (stored_in_one_c) {
            return (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  color: "#28a745",
                  fontSize: "0.8125rem",
                }}
              >
                <i className="bx bx-check me-1"></i>
                გადატანილია
              </span>
            )
          }

          return (
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() =>
                handleOneCStatusUpdate(row.original.id, stored_in_one_c)
              }
              disabled={updateOneCStatusMutation.isLoading}
              style={{ fontSize: "0.8125rem" }}
            >
              {updateOneCStatusMutation.isLoading &&
              row.original.id === updateOneCStatusMutation.variables?.id ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <i className="bx bx-upload me-1"></i>
                  გადატანა 1C-ში
                </>
              )}
            </button>
          )
        },
      },
    ],
    [
      handleOneCStatusUpdate,
      isHrAssistant,
      updateOneCStatusMutation.isLoading,
      updateOneCStatusMutation.variables?.id,
    ]
  )
  const transformedVacations = useMemo(() => {
    if (!departmentVacationData?.data?.data && !vacationsData?.data?.data)
      return []
    const vacations =
      isAdmin() || isHrMember()
        ? vacationsData?.data?.data
        : departmentVacationData?.data?.data

    if (!vacations) return []
    return vacations.map(vacation => ({
      id: vacation.id,
      status: vacation.is_auto_approved ? "auto_approved" : vacation.status,
      start_date: vacation.start_date
        ? new Date(vacation.start_date).toLocaleDateString("ka-GE")
        : "-",
      end_date: vacation.end_date
        ? new Date(vacation.end_date).toLocaleDateString("ka-GE")
        : "-",
      duration: (vacation.duration_days ?? 0).toString() + " დღე",
      type: vacation.type
        ? TYPE_MAPPING[vacation.type] || vacation.type
        : "უცნობი",
      requested_by: vacation.user
        ? `${vacation.user?.name || ""} ${
            vacation.user?.sur_name || ""
          }`.trim() || "უცნობი"
        : "უცნობი",
      requested_at: vacation.created_at
        ? new Date(vacation.created_at).toLocaleDateString("ka-GE")
        : "-",
      requested_for: `${vacation.employee_name || ""} | ${
        vacation.position || ""
      } | ${vacation.department || ""}`,
      auto_approved: vacation.is_auto_approved || false,
      auto_approved_at: vacation.auto_approved_at
        ? new Date(vacation.auto_approved_at).toLocaleDateString("ka-GE")
        : null,
      time_until_auto_approval: vacation.time_until_auto_approval,
      expanded: {
        holiday_days: {
          is_monday: vacation.is_monday || null,
          is_tuesday: vacation.is_tuesday || null,
          is_wednesday: vacation.is_wednesday || null,
          is_thursday: vacation.is_thursday || null,
          is_friday: vacation.is_friday || null,
          is_saturday: vacation.is_saturday || null,
          is_sunday: vacation.is_sunday || null,
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
        cancellation: {
          cancellation_reason: vacation.cancellation_reason || "",
          cancelled_at: vacation.cancelled_at
            ? new Date(vacation.cancelled_at).toLocaleDateString("ka-GE")
            : "",
        },
        one_c_status: {
          stored_in_one_c: vacation.stored_in_one_c || false,
          one_c_comment: vacation.one_c_comment || "",
        },
      },
    }))
  }, [departmentVacationData, vacationsData, isAdmin, isHrMember])

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
        paid_leave: "ანაზღაურებადი",
        unpaid_leave: "არანაზღაურებადი",
        administrative_leave: "ადმინისტრაციული",
        maternity_leave: "დეკრეტული",
      },
    },
  ]

  const expandedRow = row => <ExpandedRowContent rowData={row} />

  if (vacationsLoading && departmentVacationsLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
      </div>
    )
  }

  return (
    <>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="p-4 sm:p-6">
          <MuiTable
            data={transformedVacations}
            columns={columns}
            filterOptions={filterOptions}
            enableSearch={true}
            searchableFields={["requested_by", "requested_for"]}
            initialPageSize={10}
            renderRowDetails={expandedRow}
          />
        </div>
      </div>

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
        <ModalHeader toggle={() => setModalOpen(false)}>
          1C-ში გადატანის კომენტარი
        </ModalHeader>
        <ModalBody>
          <Input
            type="textarea"
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="შეიყვანეთ კომენტარი (არასავალდებულო)"
            rows={4}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            გაუქმება
          </Button>
          <Button color="primary" onClick={handleModalSubmit}>
            შენახვა
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default VacationPageArchive
