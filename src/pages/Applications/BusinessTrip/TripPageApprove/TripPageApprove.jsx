import React, { useEffect, useState, useMemo } from "react"
import {
  Row,
  Col,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
} from "reactstrap"
import Breadcrumbs from "../../../../components/Common/Breadcrumb"
import { getTripList, updateTripStatus } from "../../../../services/trip"
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

const STATUS_MAPPING = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
}

const TripPageApprove = () => {
  document.title = "მივლინებების ვიზირება | Georgia LLC"

  const [trips, setTrips] = useState([])
  const [rejectionModal, setRejectionModal] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [rejectionComment, setRejectionComment] = useState("")
  const [confirmModal, setConfirmModal] = useState(false)
  const [actionType, setActionType] = useState(null)

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

  const handleModalOpen = (action, tripId) => {
    setSelectedTrip(tripId)
    setActionType(action)
    if (action === "rejected") {
      setRejectionModal(true)
    } else {
      setConfirmModal(true)
    }
  }

  const handleConfirmAction = async () => {
    try {
      const response = await updateTripStatus(selectedTrip, actionType)
      if (response.status === 200) {
        setTrips(prevTrips =>
          prevTrips.map(trip =>
            trip.id === selectedTrip ? { ...trip, status: actionType } : trip
          )
        )
        setConfirmModal(false)
        setSelectedTrip(null)
        setActionType(null)
      }
    } catch (err) {
      console.error("Error updating trip status:", err)
    }
  }

  const handleRejectionSubmit = async () => {
    try {
      const response = await updateTripStatus(
        selectedTrip,
        "rejected",
        rejectionComment
      )
      if (response.status === 200) {
        setTrips(prevTrips =>
          prevTrips.map(trip =>
            trip.id === selectedTrip ? { ...trip, status: "rejected" } : trip
          )
        )
        setRejectionModal(false)
        setRejectionComment("")
        setSelectedTrip(null)
      }
    } catch (err) {
      console.error("Error rejecting trip:", err)
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
              <Breadcrumbs title="განცხადებები" breadcrumbItem="მივლინებების ვიზირება" />
            </Col>
          </Row>
          <Row>
            <Col xl={12}>
              <MuiTable
                columns={columns}
                data={transformedTrips}
                filterOptions={filterOptions}
                initialPageSize={10}
                searchableFields={["user.name", "user.id"]}
                enableSearch={true}
                renderRowDetails={row => <div>{row.comment}</div>}
              />
            </Col>
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

export default TripPageApprove
