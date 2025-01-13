import React, { useEffect, useState, useMemo } from "react"
import { Row, Col } from "reactstrap"
import { getAllTripsList } from "../../../../services/trip"
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
    color: "#4a90e2",
  },
  international: {
    label: "საერთაშორისო",
    icon: "bx-globe",
    color: "#50b766",
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
    duration_days,
    position,
    expanded: {
      purpose,
      substitute: {
        substitute_name,
        substitute_position,
        substitute_department,
      },
      review: { reviewed_by, reviewed_at, rejection_reason },
      vehicle: {
        vehicle_model,
        vehicle_plate,
        fuel_type,
        fuel_cost,
        vehicle_expense,
        total_fuel,
      },
      costs: { food_cost, accommodation_cost, transportation_cost, final_cost },
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
              <small>
                <i className="bx bx-time me-1"></i>
                {duration_days} დღე
              </small>
              <small>
                <i className="bx bx-briefcase me-1"></i>
                {position}
              </small>
            </div>
          </div>

          {vehicle_expense && (
            <div className="border rounded p-3 mb-3">
              <div className="d-flex align-items-center mb-2">
                <i className="bx bx-car me-2 text-primary"></i>
                <h6 className="mb-0">ავტომობილის დეტალები</h6>
              </div>
              <div className="d-flex flex-column gap-1">
                <small>
                  <strong>მოდელი:</strong> {vehicle_model}
                </small>
                <small>
                  <strong>ნომერი:</strong> {vehicle_plate}
                </small>
                <small>
                  <strong>საწვავის ტიპი:</strong> {fuel_type}
                </small>
                <small>
                  <strong>საწვავის ხარჯი 100კმ-ზე:</strong> {fuel_cost} ლიტრი
                </small>
                <small>
                  <strong>სულ საწვავი:</strong> {total_fuel} ლიტრი
                </small>
              </div>
            </div>
          )}

          <div className="border rounded p-3">
            <div className="d-flex align-items-center mb-2">
              <i className="bx bx-money me-2 text-primary"></i>
              <h6 className="mb-0">ხარჯები</h6>
            </div>
            <div className="d-flex flex-column gap-1">
              <small>
                <strong>კვების ხარჯი:</strong> {food_cost}₾
              </small>
              <small>
                <strong>საცხოვრებელი ხარჯი:</strong> {accommodation_cost}₾
              </small>
              <small>
                <strong>ტრანსპორტირების ხარჯი:</strong> {transportation_cost}₾
              </small>
              <small>
                <strong>ჯამური ხარჯი:</strong> {final_cost}₾
              </small>
            </div>
          </div>
        </Col>

        <Col md={6}>
          <div className="border rounded p-3 mb-3">
            <div className="d-flex align-items-center mb-2">
              <i className="bx bx-user-pin me-2 text-primary"></i>
              <h6 className="mb-0">შემცვლელის დეტალები</h6>
            </div>
            <div className="d-flex flex-column gap-1">
              <small>
                <strong>სახელი:</strong> {substitute_name}
              </small>
              <small>
                <strong>პოზიცია:</strong> {substitute_position}
              </small>
              <small>
                <strong>დეპარტამენტი:</strong> {substitute_department}
              </small>
            </div>
          </div>

          <div className="border rounded p-3 mb-3">
            <div className="d-flex align-items-center mb-2">
              <i className="bx bx-detail me-2 text-primary"></i>
              <h6 className="mb-0">მიზანი</h6>
            </div>
            <p className="mb-0 small">{purpose}</p>
          </div>

          <div className="border rounded p-3">
            <div className="d-flex align-items-center mb-2">
              <i className="bx bx-check-shield me-2 text-primary"></i>
              <h6 className="mb-0">განხილვის დეტალები</h6>
            </div>
            <div className="d-flex flex-column gap-1">
              <small>
                <strong>განმხილველი:</strong> {reviewed_by}
              </small>
              <small>
                <strong>განხილვის თარიღი:</strong> {reviewed_at}
              </small>
              {rejection_reason && (
                <small>
                  <strong>უარყოფის მიზეზი:</strong> {rejection_reason}
                </small>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

const TripPageArchive = () => {
  document.title = "მივლინებების არქივი | Gorgia LLC"

  const [trips, setTrips] = useState([])

  const fetchTrips = async () => {
    try {
      const response = await getAllTripsList()
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
        Header: "მომთხოვნი პირი",
        accessor: "requested_by",
        disableSortBy: true,
      },
      {
        Header: "თანამშრომლის სახელი/გვარი",
        accessor: "requested_for",
        disableSortBy: true,
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
        Cell: ({ value }) => {
          const type = typeMap[value] || {
            label: value,
            icon: "bx-question-mark",
            color: "#999",
          }
          return (
            <span
              style={{
                color: type.color,
                display: "flex",
                alignItems: "center",
              }}
            >
              <i className={`bx ${type.icon} me-2`}></i>
              {type.label}
            </span>
          )
        },
      },
      {
        Header: "სტატუსი",
        accessor: "status",
        Cell: ({ value }) => {
          const status = statusMap[value] || {
            label: value,
            icon: "bx-question-mark",
            color: "#999",
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
                    : value === "rejected"
                    ? "#ffebee"
                    : value === "approved"
                    ? "#e8f5e9"
                    : "#f5f5f5",
                color: status.color,
              }}
            >
              <i className={`bx ${status.icon} me-2`}></i>
              {status.label}
            </span>
          )
        },
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
    requested_by: trip.user ? `${trip.user.name} ${trip.user.sur_name}` : "",
    requested_at: new Date(trip.created_at).toLocaleDateString(),
    requested_for: trip.employee_name,
    departure_location: trip.departure_location,
    arrival_location: trip.arrival_location,
    duration_days: trip.duration_days,
    position: trip.position,
    expanded: {
      purpose: trip.purpose,
      substitute: {
        substitute_name: trip.substitute_name,
        substitute_position: trip.substitute_position,
        substitute_department: trip.department,
      },
      review: {
        reviewed_by: trip.reviewed_by
          ? `${trip.reviewed_by.name} ${trip.reviewed_by.sur_name}`
          : "ჯერ არ არის განხილული",
        reviewed_at: trip.reviewed_at
          ? new Date(trip.reviewed_at).toLocaleDateString()
          : "-",
        rejection_reason: trip.rejection_reason || "",
      },
      vehicle: {
        vehicle_model: trip.vehicle_model || "",
        vehicle_plate: trip.vehicle_plate || "",
        fuel_type: trip.fuel_type || "",
        fuel_cost: trip.fuel_consumption_per_100 || "",
        vehicle_expense: trip.vehicle_expense === 1,
        total_fuel: trip.total_fuel || "",
      },
      costs: {
        food_cost: trip.food_cost,
        accommodation_cost: trip.accommodation_cost,
        transportation_cost: trip.transportation_cost,
        final_cost: trip.final_cost,
      },
      available_destinations: trip.available_destinations || [],
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
    <>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="p-4 sm:p-6">
          <MuiTable
            title="განცხადებები"
            breadcrumbItem="მივლინებების არქივი"
            columns={columns}
            data={transformedTrips}
            filterOptions={filterOptions}
            initialPageSize={10}
            enableSearch={true}
            searchableFields={[
              "requested_by",
              "requested_for",
              "departure_location",
              "arrival_location",
            ]}
            renderRowDetails={expandedRow}
          />
        </div>
      </div>
    </>
  )
}

export default TripPageArchive
