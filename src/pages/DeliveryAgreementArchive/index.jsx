import React, { useEffect, useState, useMemo, useCallback } from "react"
import { Row, Col, Card, CardBody } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import MuiTable from "../../components/Mui/MuiTable"
import {
  getDepartmentAgreements as getDeliveryDepartmentAgreements,
  downloadAgreement as downloadDeliveryAgreementService,
} from "services/deliveryAgreement"
import { toast, ToastContainer } from "react-toastify"
import {
  BsBank,
  BsCalendar,
  BsCreditCard,
  BsMap,
  BsPerson,
  BsVoicemail,
} from "react-icons/bs"

const handleDownload = async agreementId => {
  try {
    await downloadDeliveryAgreementService(agreementId)
    toast.success("ხელშეკრულება წარმატებით ჩამოიტვირთა")
  } catch (error) {
    console.error("Download failed:", error)
    toast.error(error.message || "ფაილი არ არის ხელმისაწვდომი ჩამოსატვირთად")
  }
}

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

const DeliveryAgreementArchive = () => {
  document.title = "ხელშეკრულებების არქივი | Gorgia LLC"
  const [agreements, setAgreements] = useState([])

  const fetchAgreements = async () => {
    try {
      const response = await getDeliveryDepartmentAgreements()
      setAgreements(response.data.data)
    } catch (err) {
      console.error("Error fetching agreements:", err)
    }
  }

  useEffect(() => {
    fetchAgreements()
  }, [])

  const transformedAgreements = useMemo(() => {
    return agreements.map(agreement => {
      return {
        id: agreement.id,
        status: STATUS_MAPPING[agreement.status] || agreement.status,
        created_at: agreement.created_at,
        cost: agreement.sum_cost,
        cost_type: agreement.sum_cost_type,
        jursdictional_unit: {
          name: agreement.jursdictional_name,
          id: agreement.jursdictional_id_number,
          address: agreement.jursdictional_address,
        },
        agreement_type: agreement.agreement_type,
        director: {
          name: agreement.director_full_name,
          id: agreement.director_id_number,
        },
        expanded: {
          action_act: agreement.action_act,
          rejection_reason: agreement.rejection_reason || null,
          requested_by: agreement.user.name + " " + agreement.user.sur_name,
        },
      }
    })
  }, [agreements])

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "იურიდიული პირის დასახელება",
        accessor: "jursdictional_unit.name",
      },
      {
        Header: "საიდენტიფიკაციო კოდი",
        accessor: "jursdictional_unit.id",
      },
      {
        Header: "მისამართი",
        accessor: "jursdictional_unit.address",
      },
      {
        Header: "ხელშეკრულების ტიპი",
        accessor: "agreement_type",
      },
      {
        Header: "დირექტორის სახელი და გვარი",
        accessor: "director.name",
      },
      {
        Header: "დირექტორის პირადი ნომერი",
        accessor: "director.id",
      },
      {
        Header: "ჯამური ღირებულება",
        accessor: "cost",
        Cell: ({ value, row }) => (
          <div>
            {value
              ? new Intl.NumberFormat("ka-GE", {
                  style: "currency",
                  currency: "GEL",
                }).format(value)
              : "N/A"}
          </div>
        ),
      },
      {
        Header: "ღირებულების ტიპი",
        accessor: "cost_type",
      },
      {
        Header: "სტატუსი",
        accessor: "status",
        Cell: ({ value }) => {
          const status = statusMap[value] || {
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
              <i className={`bx ${status.icon} me-2`}></i>
              {status.label}
            </span>
          )
        },
      },
    ],
    []
  )

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

  const renderRowDetails = useCallback(row => {
    if (!row) return null

    return (
      <div className="p-4 bg-light rounded">
        {/* Rejection reason banner */}
        {row.expanded.rejection_reason && (
          <div className="alert alert-danger d-flex align-items-center mb-4">
            <i className="bx bx-error-circle me-2 fs-5"></i>
            <div>
              <strong>უარყოფის მიზეზი:</strong> {row.expanded.rejection_reason}
            </div>
          </div>
        )}

        {/* Requester info */}
        <div className="d-flex align-items-center mb-4 gap-2 text-muted">
          <BsPerson className="fs-3 text-primary" />
          <strong>მოითხოვა:</strong>
          <span className="ms-2">{row.expanded.requested_by}</span>
        </div>

        {/* Agreement details */}
        <div className="border rounded p-4 bg-white mb-4">
          <Row className="g-4">
            {/* Agreement Type */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCreditCard className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">ხელშეკრულების ტიპი</div>
                  <div className="fw-medium">{row.agreement_type}</div>
                </div>
              </div>
            </Col>

            {/* Cost */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsVoicemail className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">ღირებულება</div>
                  <div className="fw-medium">
                    {row.cost} {row.cost_type}
                  </div>
                </div>
              </div>
            </Col>

            {/* Jurisdictional Unit */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCalendar className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">იურიდიული პირი</div>
                  <div className="fw-medium">
                    {row.jursdictional_unit.name} ({row.jursdictional_unit.id}
                    )
                  </div>
                </div>
              </div>
            </Col>

            {/* Address */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsMap className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">მისამართი</div>
                  <div className="fw-medium">
                    {row.jursdictional_unit.address}
                  </div>
                </div>
              </div>
            </Col>

            {/* Director */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCalendar className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">დირექტორი</div>
                  <div className="fw-medium">
                    {row.director.name} ({row.director.id})
                  </div>
                </div>
              </div>
            </Col>

            {/* Created Date */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsBank className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">შექმნის თარიღი</div>
                  <div className="fw-medium">{row.created_at}</div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Download button for approved agreements */}
        {row.status === "approved" && (
          <button
            className="btn btn-primary"
            onClick={() => handleDownload(row.id)}
          >
            <i className="bx bx-download me-2"></i>
            ხელშეკრულების ჩამოტვირთვა
          </button>
        )}
      </div>
    )
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs
                title="ხელშეკრულებები"
                breadcrumbItem="ხელშეკრულებების არქივი"
              />
            </Col>
          </Row>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <MuiTable
                    columns={columns}
                    data={transformedAgreements}
                    initialPageSize={10}
                    pageSizeOptions={[5, 10, 15, 20]}
                    enableSearch={true}
                    searchableFields={["jursdictional_unit.name"]}
                    filterOptions={filterOptions}
                    onRowClick={() => {}}
                    renderRowDetails={renderRowDetails}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default DeliveryAgreementArchive
