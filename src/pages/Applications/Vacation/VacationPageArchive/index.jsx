import React, { useEffect, useState, useMemo } from "react"
import { Row, Col } from "reactstrap"
import Breadcrumbs from "components/Common/Breadcrumb"
import { getVacations } from "services/admin/vacation"
import MuiTable from "components/Mui/MuiTable"

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

  const { holiday_days, substitute, review } = rowData.expanded

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
    <div className="p-4 bg-light rounded">
      <div className="row">
        <div className="col-md-4">
          <h5>შვებულების დღეები</h5>
          {selectedDays.length > 0 ? (
            <ul className="list-unstyled">
              {selectedDays.map((day, index) => (
                <li key={index}>
                  <span className="badge bg-primary">{day}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>შვებულების დღეები დანიშნული არ არის.</p>
          )}
        </div>

        <div className="col-md-4">
          <h5>შემცვლელი პირი</h5>
          <p>
            <strong>სახელი:</strong> {substitute?.substitute_name || "უცნობია"}
          </p>
          <p>
            <strong>პოზიცია:</strong>{" "}
            {substitute?.substitute_position || "უცნობია"}
          </p>
          <p>
            <strong>დეპარტამენტი:</strong>{" "}
            {substitute?.substitute_department || "უცნობია"}
          </p>
        </div>

        <div className="col-md-4">
          <h5>განხილვა</h5>
          <p>
            <strong>განიხილა:</strong> {review?.reviewed_by || "უცნობია"}
          </p>
          <p>
            <strong>განიხილვის თარიღი:</strong>{" "}
            {review?.reviewed_at || "უცნობია"}
          </p>
          {review?.rejection_reason && (
            <p>
              <strong>უარყოფის მიზეზი:</strong> {review.rejection_reason}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const VacationPageArchive = () => {
  document.title = "შვებულებების არქივი | Gorgia LLC"

  const [vacations, setVacations] = useState([])

  const fetchVacations = async () => {
    try {
      const response = await getVacations()
      setVacations(response.data.data)
    } catch (err) {
      console.error("Error fetching vocations:", err)
    }
  }

  useEffect(() => {
    fetchVacations()
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "მოითხოვა",
        accessor: "requested_by",
      },
      {
        Header: "მომთხოვნი პირი",
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
        substitute_department: vacation.substitute_department || "უცნობია",
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
        paid_leave: "ანაზღაურებადი",
        unpaid_leave: "არანაზღაურებადი",
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
                breadcrumbItem="შვებულებების არქივი"
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
    </React.Fragment>
  )
}

export default VacationPageArchive
