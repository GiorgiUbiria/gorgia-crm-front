import React, { useEffect, useState, useMemo } from "react"
import { Row, Col } from "reactstrap"
import Breadcrumbs from "components/Common/Breadcrumb"
import { getCurrentUserVocations } from "services/vacation"
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

const UserVocation = () => {
  document.title = "შვებულებები | Gorgia LLC"

  const [vacations, setVacations] = useState([])

  const fetchVacations = async () => {
    try {
      const response = await getCurrentUserVocations()
      setVacations(response.data.data)
    } catch (err) {
      console.error("Error fetching vocations:", err)
    }
  }

  useEffect(() => {
    fetchVacations()
  }, [])

  console.log(vacations)

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
    start_date: vacation.start_date,
    end_date: vacation.end_date,
    user: {
      name: vacation.user.name + " " + vacation.user.sur_name,
    },
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
        paid: "ანაზღაურებადი",
        unpaid: "არანაზღაურებადი",
        administrative: "ადმინისტრაციული",
      },
    },
  ]

  return (
    <React.Fragment>
      <div className="page-content mb-4">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs
                title="განცხადებები"
                breadcrumbItem="ჩემი შვებულებები"
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
              renderRowDetails={row => <div>{row.comment}</div>}
            />
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default UserVocation
