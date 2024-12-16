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
  if (!rowData) return null

  const {
    start_date,
    end_date,
    requested_for,
    departure_location,
    arrival_location,
    expanded: {
      purpose,
      substitute: {
        substitute_name,
        substitute_position,
        substitute_department,
      },
      review: { reviewed_by, reviewed_at, rejection_reason },
      vehicle: { vehicle_model, vehicle_plate, fuel_cost, vehicle_expense },
      costs: { food_cost, accommodation_cost, transportation_cost },
    },
  } = rowData

  return (
    <div className="p-3 bg-white rounded">
      <Row className="g-3">
        <Col md={6}>
          <div className="border rounded p-3 mb-3">
            <div className="d-flex align-items-center mb-2">
              <i className="bx bx-map-pin me-2 text-primary"></i>
              <h6 className="mb-0">მარშრუტი და დეტალები</h6>
            </div>
            <div className="d-flex align-items-center mb-2">
              <small className="text-muted">{departure_location}</small>
              <i className="bx bx-right-arrow-alt mx-2"></i>
              <small className="text-muted">{arrival_location}</small>
            </div>
            <div className="d-flex gap-3">
              <small>
                <i className="bx bx-calendar me-1"></i>
                {start_date} - {end_date}
              </small>
              <small>
                <i className="bx bx-user me-1"></i>
                {requested_for}
              </small>
            </div>
          </div>

          {vehicle_expense && (
            <div className="border rounded p-3 mb-3">
              <div className="d-flex align-items-center mb-2">
                <i className="bx bx-car me-2 text-primary"></i>
                <h6 className="mb-0">ავტომობილის ინფორმაცია</h6>
              </div>
              {vehicle_expense === true ? (
                <div className="d-flex flex-wrap gap-3">
                  <small>
                    <i className="bx bx-car me-1"></i>
                    {vehicle_model}
                  </small>
                  <small>
                    <i className="bx bx-tag me-1"></i>
                    {vehicle_plate}
                  </small>
                  <small>
                    <i className="bx bx-gas-pump me-1"></i>
                    {fuel_cost} ₾/100კმ
                  </small>
                </div>
              ) : (
                <small>საკუთარი ავტომობილის გარეშე</small>
              )}
            </div>
          )}
        </Col>

        <Col md={6}>
          <div className="border rounded p-3 mb-3">
            <div className="d-flex align-items-center mb-2">
              <i className="bx bx-money me-2 text-primary"></i>
              <h6 className="mb-0">ხარჯები</h6>
            </div>
            <div className="d-flex flex-wrap gap-3">
              <div
                className="bg-light rounded p-2"
                style={{ display: "flex", alignItems: "center" }}
              >
                <i className="bx bx-restaurant me-1"></i>
                <small>კვება: {food_cost} ₾</small>
              </div>
              <div
                className="bg-light rounded p-2"
                style={{ display: "flex", alignItems: "center" }}
              >
                <i className="bx bx-hotel me-1"></i>
                <small>საცხოვრებელი: {accommodation_cost} ₾</small>
              </div>
              <div
                className="bg-light rounded p-2"
                style={{ display: "flex", alignItems: "center" }}
              >
                <i className="bx bx-train me-1"></i>
                <small>ტრანსპორტი: {transportation_cost} ₾</small>
              </div>
            </div>
          </div>

          <div className="border rounded p-3">
            <div className="d-flex align-items-center mb-2">
              <i className="bx bx-user-pin me-2 text-primary"></i>
              <h6 className="mb-0">შემცვლელი</h6>
            </div>
            <div className="d-flex flex-column gap-1">
              <small>
                <i className="bx bx-user me-1"></i>
                {substitute_name}
              </small>
              <small>
                <i className="bx bx-briefcase me-1"></i>
                {substitute_position}
              </small>
              <small>
                <i className="bx bx-building me-1"></i>
                {substitute_department}
              </small>
            </div>
          </div>
        </Col>

        <Col md={12}>
          <div className="border rounded p-3">
            <Row>
              <Col md={6}>
                <div className="d-flex align-items-center mb-2">
                  <i className="bx bx-target-lock me-2 text-primary"></i>
                  <h6 className="mb-0">მიზანი</h6>
                </div>
                <small className="text-muted">{purpose}</small>
              </Col>
              <Col md={6}>
                <div className="d-flex align-items-center mb-2">
                  <i className="bx bx-check-circle me-2 text-primary"></i>
                  <h6 className="mb-0">განხილვა</h6>
                </div>
                {reviewed_by && (
                  <small>
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
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  )
}

const UserTrip = () => {
  document.title = "ჩემი მივლინებები | Gorgia LLC"

  const [trips, setTrips] = useState([])

  const fetchTrips = async () => {
    try {
      const response = await getTripList()
      setTrips(response.data.business_trips)
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
        Header: "გამგზავრების ადგილი",
        accessor: "departure_location",
        disableSortBy: true,
      },
      {
        Header: "დანიშნულების ადგილი",
        accessor: "arrival_location",
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
        disableSortBy: true,
        Cell: ({ value }) => (
          <span
            style={{
              color: typeMap[value].color,
              display: "flex",
              alignItems: "center",
            }}
          >
            <i className={`bx ${typeMap[value].icon} me-2`}></i>
            {typeMap[value].label}
          </span>
        ),
      },
      {
        Header: "სტატუსი",
        accessor: "status",
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
    trip_type: TYPE_MAPPING[trip.trip_type] || trip.trip_type,
    status: STATUS_MAPPING[trip.status] || trip.status,
    start_date: new Date(trip.start_date).toLocaleDateString(),
    end_date: new Date(trip.end_date).toLocaleDateString(),
    requested_by: trip.user?.name + " " + trip.user?.sur_name,
    requested_at: new Date(trip.created_at).toLocaleDateString(),
    requested_for: `${trip.employee_name || ""} | ${trip.position || ""} | ${
      trip.department || ""
    }`,
    departure_location: trip.departure_location,
    arrival_location: trip.arrival_location,
    expanded: {
      purpose: trip.purpose,
      substitute: {
        substitute_name: trip.substitute_name,
        substitute_position: trip.substitute_position,
        substitute_department: trip.substitute_department,
      },
      review: {
        reviewed_by: trip.reviewed_by
          ? trip.reviewed_by?.name + " " + trip.reviewed_by?.sur_name
          : "ჯერ არ არის განხილული",
        reviewed_at: trip.reviewed_at
          ? new Date(trip.reviewed_at).toLocaleDateString()
          : "-",
        rejection_reason: trip.rejection_reason || "",
      },
      vehicle: {
        vehicle_model: trip.vehicle_model,
        vehicle_plate: trip.vehicle_plate,
        fuel_cost: trip.fuel_cost,
        vehicle_expense: trip.vehicle_expense
          ? "საკუთარი ავტომობილით"
          : "საკუთარი ავტომობილის გარეშე",
      },
      costs: {
        food_cost: trip.food_cost,
        accommodation_cost: trip.accommodation_cost,
        transportation_cost: trip.transportation_cost,
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
                searchableFields={["departure_location", "arrival_location"]}
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
