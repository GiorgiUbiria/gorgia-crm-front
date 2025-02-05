import React, { useState, useMemo } from "react"
import { Row, Col, Button, Spinner } from "reactstrap"
import MuiTable from "components/Mui/MuiTable"
import VacationBalance from "components/Vacation/VacationBalance"
import CancellationModal from "components/Vacation/CancellationModal"
import { Tooltip } from "@mui/material"
import {
  useUserVacations,
  useVacationBalance,
  useCancelVacation,
} from "../../../../queries/vacation"

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
  cancelled: {
    label: "გაუქმებული",
    icon: "bx-x-circle",
    color: "#6c757d",
  },
  auto_approved: {
    label: "ავტომატურად დამტკიცებული",
    icon: "bx-check-double",
    color: "#28a745",
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

  const reviewerName =
    reviewed_by && typeof reviewed_by === "object"
      ? `${reviewed_by.name || ""} ${reviewed_by.sur_name || ""}`.trim() || "-"
      : reviewed_by || "-"

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
            {reviewerName !== "-" && (
              <small style={{ display: "flex", alignItems: "center" }}>
                <i className="bx bx-user me-1"></i>
                {reviewerName} - {reviewed_at}
              </small>
            )}
            {rejection_reason && rejection_reason !== "-" && (
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

const UserVocation = () => {
  document.title = "შვებულებები | Gorgia LLC"

  const { data: vacationsData, isLoading: vacationsLoading } =
    useUserVacations()
  const { data: vacationBalance, isLoading: balanceLoading } =
    useVacationBalance()
  const { mutate: cancelVacation } = useCancelVacation()

  const [selectedVacation, setSelectedVacation] = useState(null)
  const [showCancellationModal, setShowCancellationModal] = useState(false)

  const handleCancelRequest = vacation => {
    setSelectedVacation(vacation)
    setShowCancellationModal(true)
  }

  const onCancellationSuccess = () => {
    setShowCancellationModal(false)
    setSelectedVacation(null)
  }

  const handleCancellation = (vacationId, cancellationReason) => {
    cancelVacation(
      { id: vacationId, data: { cancellation_reason: cancellationReason } },
      {
        onSuccess: () => {
          onCancellationSuccess()
        },
        onError: error => {
          console.error("Cancellation failed:", error)
        },
      }
    )
  }

  const canCancel = vacation => {
    if (!vacation) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const startDate = new Date(vacation.start_date)
    startDate.setHours(0, 0, 0, 0)

    return (
      (vacation.status === "pending" ||
        vacation.status === "approved" ||
        vacation.status === "auto_approved") &&
      startDate >= today
    )
  }

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
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
        Cell: ({ value, row }) => (
          <div>
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
                    : value === "approved" || value === "auto_approved"
                    ? "#e8f5e9"
                    : value === "cancelled"
                    ? "#f5f5f5"
                    : "#f5f5f5",
                color: statusMap[value]?.color || "#757575",
              }}
            >
              <i className={`bx ${statusMap[value]?.icon} me-2`}></i>
              {statusMap[value]?.label}
            </span>
            {row.original.auto_approved && (
              <div className="mt-1">
                <small className="text-muted">
                  <i className="bx bx-time-five me-1"></i>
                  ავტომატურად დამტკიცდა {row.original.auto_approved_at}
                </small>
              </div>
            )}
            {value === "pending" && row.original.time_until_auto_approval && (
              <Tooltip title="დრო ავტომატურ დამტკიცებამდე" arrow>
                <div className="mt-1">
                  <small className="text-warning">
                    <i className="bx bx-time-five me-1"></i>
                    {row.original.time_until_auto_approval}
                  </small>
                </div>
              </Tooltip>
            )}
          </div>
        ),
      },
      {
        Header: "მოქმედებები",
        accessor: "actions",
        disableSortBy: true,
        Cell: ({ row }) => {
          const vacation = row.original
          return canCancel(vacation) ? (
            <Button
              color="danger"
              size="sm"
              outline
              onClick={() => handleCancelRequest(vacation)}
            >
              <i className="bx bx-x-circle me-1"></i>
              გაუქმება
            </Button>
          ) : null
        },
      },
    ],
    []
  )

  const transformedVacations = useMemo(() => {
    if (!vacationsData?.data?.data) return []

    return vacationsData.data.data.map(vacation => ({
      ...vacation,
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
      auto_approved: vacation.is_auto_approved,
      auto_approved_at: vacation.auto_approved_at
        ? new Date(vacation.auto_approved_at).toLocaleDateString("ka-GE")
        : null,
      time_until_auto_approval: vacation.time_until_auto_approval,
      cancellation_reason: vacation.cancellation_reason,
      cancelled_at: vacation.cancelled_at
        ? new Date(vacation.cancelled_at).toLocaleDateString("ka-GE")
        : null,
      requested_for: `${vacation.employee_name || ""} | ${
        vacation.position || ""
      } | ${vacation.department || ""}`,
      expanded: {
        holiday_days: vacation.holiday_days || {},
        substitute: {
          substitute_name: vacation.substitute_name || "-",
          substitute_position: vacation.substitute_position || "-",
        },
        review: {
          reviewed_by: vacation.reviewed_by || "-",
          reviewed_at: vacation.reviewed_at
            ? new Date(vacation.reviewed_at).toLocaleDateString("ka-GE")
            : "-",
          rejection_reason: vacation.rejection_reason || "-",
        },
        cancellation: {
          cancellation_reason: vacation.cancellation_reason || "",
          cancelled_at: vacation.cancelled_at
            ? new Date(vacation.cancelled_at).toLocaleDateString("ka-GE")
            : "",
        },
      },
    }))
  }, [vacationsData])

  const filterOptions = [
    {
      field: "status",
      label: "სტატუსი",
      valueLabels: {
        approved: "დამტკიცებული",
        auto_approved: "ავტომატურად დამტკიცებული",
        rejected: "უარყოფილი",
        pending: "განხილვაში",
        cancelled: "გაუქმებული",
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

  if (vacationsLoading || balanceLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
      </div>
    )
  }

  console.log(transformedVacations)

  return (
    <>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="p-4 sm:p-6">
          {vacationBalance && (
            <VacationBalance balance={vacationBalance.data} />
          )}

          <MuiTable
            data={transformedVacations}
            columns={columns}
            filterOptions={filterOptions}
            enableSearch={true}
            searchableFields={["type", "status"]}
            initialPageSize={10}
            renderRowDetails={row => <ExpandedRowContent rowData={row} />}
          />
        </div>
      </div>

      {showCancellationModal && selectedVacation && (
        <CancellationModal
          isOpen={showCancellationModal}
          toggle={() => {
            setShowCancellationModal(false)
            setSelectedVacation(null)
          }}
          vacationId={selectedVacation.id}
          onSuccess={handleCancellation}
        />
      )}
    </>
  )
}

export default UserVocation
