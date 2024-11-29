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

const STATUS_MAPPING = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
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
        Header: "სახელი",
        accessor: "user.name",
        disableSortBy: true,
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

  const transformedTrips = trips.map(trip => ({
    id: trip.id,
    trip_type: trip.trip_type,
    status: STATUS_MAPPING[trip.status] || trip.status,
    place_of_trip: trip.place_of_trip,
    purpose_of_trip: trip.purpose_of_trip,
    start_date: new Date(trip.start_date).toLocaleDateString(),
    end_date: new Date(trip.end_date).toLocaleDateString(),
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
  ]

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
                searchableFields={["user.name", "user.id"]}
                renderRowDetails={row => <div>{row.comment}</div>}
              />
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default UserTrip
