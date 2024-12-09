import React, { useEffect, useState, useMemo } from "react"
import { Row, Col } from "reactstrap"
import Breadcrumbs from "components/Common/Breadcrumb"
import { getTripList } from "../../../../services/trip"
import MuiTable from "../../../../components/Mui/MuiTable"

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
  regional: {
    label: "რეგიონალური",
    icon: "bx-map",
  },
  international: {
    label: "საერთაშორისო",
    icon: "bx-globe",
  },
}

const STATUS_MAPPING = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
}

const TYPE_MAPPING = {
  regional: "regional",
  international: "international",
}

const ExpandedRowContent = ({ rowData }) => {
  const details = [
    { label: "მივლინების ადგილი", value: rowData.place_of_trip },
    { label: "მივლინების საფუძველი", value: rowData.business_trip_basis },
    { label: "მივლინების მიზანი", value: rowData.purpose_of_trip },
    { label: "აღწერა", value: rowData.description },
    { label: "მივლინების მოწყობა", value: rowData.business_trip_arrangement },
    { label: "მოსალოდნელი შედეგი", value: rowData.expected_result_business_trip },
    { label: "ფაქტობრივი შედეგი", value: rowData.actual_result },
    { label: "მივლინების ტიპი", value: rowData.trip_type },
    { label: "ხარჯები", value: `
      სამივლინებო: ${rowData.expense_vocation}
      ტრანსპორტი: ${rowData.expense_transport}
      საცხოვრებელი: ${rowData.expense_living}
      კვება: ${rowData.expense_meal}
      ჯამური: ${rowData.total_expense}
    `},
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

const UserTrip = () => {
  document.title = "ჩემი მივლინებები | Gorgia LLC"

  const [trips, setTrips] = useState([])

  const fetchTrips = async () => {
    try {
      const response = await getTripList()
      setTrips(response.data.business)
    } catch (err) {
      console.error("Error fetching trip requests:", err)
    }
  }

  useEffect(() => {
    fetchTrips()
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "ადგილი",
        accessor: "place_of_trip",
        disableSortBy: true,
      },
      {
        Header: "მიზეზი",
        accessor: "purpose_of_trip",
        disableSortBy: true,
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
        Header: "ტიპი",
        accessor: "trip_type",
        Cell: ({ value }) => (
          <span>
            <i className={`bx ${typeMap[value].icon} me-2`}></i>
            {typeMap[value].label}
          </span>
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
    ],
    []
  )

  const transformedTrips = trips.map(trip => ({
    id: trip.id,
    trip_type: TYPE_MAPPING[trip.trip_type] || trip.trip_type,
    status: STATUS_MAPPING[trip.status] || trip.status,
    place_of_trip: trip.place_of_trip,
    purpose_of_trip: trip.purpose_of_trip,
    start_date: new Date(trip.start_date).toLocaleDateString(),
    end_date: new Date(trip.end_date).toLocaleDateString(),
    reviewed_by: trip.reviewed_by?.name + " " + trip.reviewed_by?.sur_name || "არ არის მითითებული",
    user: {
      name: trip.performer_name,
      id: trip.id_code_or_personal_number,
      position: trip.service_description,
      location: trip.legal_or_actual_address,
    },
    comment: trip.comment,
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
      field: "trip_type",
      label: "ტიპი",
      valueLabels: {
        regional: "რეგიონალური",
        international: "საერთაშორისო",
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
                breadcrumbItem="ჩემი მივლინებები"
              />
            </Col>
          </Row>
          <Row>
            <Col xl={12}>
              <MuiTable
                columns={columns}
                data={transformedTrips}
                filterOptions={filterOptions}
                initialPageSize={10}
                enableSearch={true}
                searchableFields={["requested_by", "reviewed_by"]}
                renderRowDetails={expandedRow}
              />
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default UserTrip
