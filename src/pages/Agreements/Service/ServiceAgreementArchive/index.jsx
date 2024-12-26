import React, { useEffect, useState, useMemo, useCallback } from "react"
import { Row, Col } from "reactstrap"
import {
  getDepartmentAgreements,
  downloadAgreement,
} from "services/serviceAgreement"
import {
  BsBank,
  BsCalendar,
  BsCreditCard,
  BsMap,
  BsPerson,
} from "react-icons/bs"
import MuiTable from "../../../../components/Mui/MuiTable"
import { toast, ToastContainer } from "react-toastify"

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

const handleDownload = async agreementId => {
  try {
    await downloadAgreement(agreementId)
    toast.success("ხელშეკრულება წარმატებით ჩამოიტვირთა")
  } catch (error) {
    console.error("Download failed:", error)
    toast.error(error.message || "ფაილი არ არის ხელმისაწვდომი ჩამოსატვირთად")
  }
}

const ServiceAgreementArchive = () => {
  document.title = "ხელშეკრულებების არქივი | Gorgia LLC"
  const [agreements, setAgreements] = useState([])

  const fetchAgreements = async () => {
    try {
      const response = await getDepartmentAgreements()
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
        created_at: new Date(agreement.created_at).toLocaleDateString(),
        updated_at: new Date(agreement.updated_at).toLocaleString(),
        accepted_at: agreement.accepted_at
          ? new Date(agreement.accepted_at).toLocaleString()
          : "-",
        rejected_at: agreement.rejected_at
          ? new Date(agreement.rejected_at).toLocaleString()
          : "-",
        executor_firm_name: agreement.executor_firm_name,
        service_type: agreement.service_type,
        requested_by: agreement.user.name + " " + agreement.user.sur_name,
        expanded: {
          service_cost: agreement.service_cost,
          service_term: agreement.service_term,
          executor_factual_address: agreement.executor_factual_address,
          executor_bank_swift: agreement.executor_bank_swift,
          director_full_name: agreement.director_full_name,
          executor_id_number: agreement.executor_id_number,
          executor_home_address: agreement.executor_home_address,
          executor_full_name: agreement.executor_full_name,
          executor_position: agreement.executor_position,
          executor_bank_account: agreement.executor_bank_account,
          executor_bank_name: agreement.executor_bank_name,
          director_id_number: agreement.director_id_number,
          service_place: agreement.service_place,
          service_payment_details: agreement.service_payment_details,
          service_active_term: agreement.service_active_term,
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
        Header: "მოითხოვა",
        accessor: "requested_by",
        disableSortBy: true,
      },
      {
        Header: "სახელწოდება (საფირმო)",
        accessor: "executor_firm_name",
        disableSortBy: true,
      },
      {
        Header: "მომსახურების სახეობა",
        accessor: "service_type",
        disableSortBy: true,
      },
      {
        Header: "მოთხოვნის თარიღი",
        accessor: "created_at",
      },
      {
        Header: "სტატუსის ცვლილების თარიღი",
        accessor: row => {
          switch (row.status) {
            case "approved":
              return row.accepted_at
            case "rejected":
              return row.rejected_at
            default:
              return "-"
          }
        },
        id: "status_date",
      },
      {
        Header: "სტატუსი",
        accessor: "status",
        disableSortBy: true,
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
            {/* ფაქტიური მისამართი */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsMap className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">ფაქტობრივი მისამართი</div>
                  <div className="fw-medium">
                    {row.expanded.executor_factual_address}
                  </div>
                </div>
              </div>
            </Col>

            {/* SWIFT კოდი */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsBank className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">ბანკის კოდი</div>
                  <div className="fw-medium">
                    {row.expanded.executor_bank_swift}
                  </div>
                </div>
              </div>
            </Col>

            {/* დირექტორის ინფორმაცია */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsPerson className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">დირექტორის ინფორმაცია</div>
                  <div className="fw-medium">
                    {row.expanded.director_full_name} (
                    {row.expanded.director_id_number})
                  </div>
                </div>
              </div>
            </Col>

            {/* მომსახურების ადგილი */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsMap className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">მომსახურების ადგილი</div>
                  <div className="fw-medium">{row.expanded.service_place}</div>
                </div>
              </div>
            </Col>

            {/* გადახდის დეტალები */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCreditCard className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">გადახდის დეტალები</div>
                  <div className="fw-medium">
                    {row.expanded.service_payment_details}
                  </div>
                </div>
              </div>
            </Col>

            {/* მომსახურების აქტიური ვადა */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCalendar className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">
                    მომსახურების აქტიური ვადა
                  </div>
                  <div className="fw-medium">
                    {row.expanded.service_active_term}
                  </div>
                </div>
              </div>
            </Col>

            {/* Executor ID Number */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsPerson className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">
                    შემსრულებლის პირადი ნომერი/საიდენტიფიკაციო კოდი
                  </div>
                  <div className="fw-medium">
                    {row.expanded.executor_id_number}
                  </div>
                </div>
              </div>
            </Col>

            {/* Executor Home Address */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsPerson className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">სახლის მისამართი</div>
                  <div className="fw-medium">
                    {row.expanded.executor_home_address}
                  </div>
                </div>
              </div>
            </Col>

            {/* Executor Full Name */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsPerson className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">
                    შემსრულებლის სრული სახელი
                  </div>
                  <div className="fw-medium">
                    {row.expanded.executor_full_name}
                  </div>
                </div>
              </div>
            </Col>

            {/* Executor Position */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsPerson className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">შემსრულებლის პოზიცია</div>
                  <div className="fw-medium">
                    {row.expanded.executor_position}
                  </div>
                </div>
              </div>
            </Col>

            {/* Executor Bank Account */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsBank className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">
                    შემსრულებლის საბანკო ანგარიში
                  </div>
                  <div className="fw-medium">
                    {row.expanded.executor_bank_account}
                  </div>
                </div>
              </div>
            </Col>

            {/* Executor Bank Name */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsBank className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">
                    შემსრულებლის ბანკის სახელი
                  </div>
                  <div className="fw-medium">
                    {row.expanded.executor_bank_name}
                  </div>
                </div>
              </div>
            </Col>

            {/* Service Cost */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCreditCard className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">
                    მომსახურების ღირებულება
                  </div>
                  <div className="fw-medium">{row.expanded.service_cost} ₾</div>
                </div>
              </div>
            </Col>

            {/* Service Term */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCalendar className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">მომსახურების ვადა</div>
                  <div className="fw-medium">
                    {row.expanded.service_term} დღე
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={12}>
              {row.status === "approved" && (
                <button
                  className="btn btn-primary"
                  onClick={() => handleDownload(row.id)}
                >
                  <i className="bx bx-download me-2"></i>
                  ხელშეკრულების ჩამოტვირთვა
                </button>
              )}
            </Col>
          </Row>
        </div>
      </div>
    )
  }, [])

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MuiTable
          columns={columns}
          data={transformedAgreements}
          initialPageSize={10}
          pageSizeOptions={[5, 10, 15, 20]}
          enableSearch={true}
          searchableFields={["executor_firm_name", "requested_by"]}
          filterOptions={filterOptions}
          onRowClick={() => {}}
          renderRowDetails={renderRowDetails}
        />
      </div>
      <ToastContainer />
    </>
  )
}

export default ServiceAgreementArchive
