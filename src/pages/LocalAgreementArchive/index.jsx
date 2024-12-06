import React, { useEffect, useState, useMemo, useCallback } from "react"
import { Row, Col, Card, CardBody } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { getDepartmentAgreements, downloadAgreement } from "services/localAgreement"
import {
  BsBank,
  BsCalendar,
  BsCreditCard,
  BsMap,
  BsPerson,
} from "react-icons/bs"
import MuiTable from "../../components/Mui/MuiTable"
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

const LocalAgreementArchive = () => {
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
        created_at: agreement.created_at,
        executor_firm_name: agreement.executor_firm_name,
        executor_id_number: agreement.executor_id_number,
        executor_home_address: agreement.executor_home_address,
        executor_full_name: agreement.executor_full_name,
        executor_position: agreement.executor_position,
        executor_bank_account: agreement.executor_bank_account,
        executor_bank_name: agreement.executor_bank_name,
        agreement_automatic_renewal: agreement.agreement_automatic_renewal === 1 ? "კი" : "არა",
        exclusivity: agreement.exclusivity === 1 ? "კი" : "არა",
        agreement_active_term: agreement.agreement_active_term,
        exclusive_placement: agreement.exclusive_placement,
        expanded: {
          executor_factual_address: agreement.executor_factual_address,
          executor_bank_swift: agreement.executor_bank_swift,
          director_full_name: agreement.director_full_name,
          director_id_number: agreement.director_id_number,
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
        Header: "ფირმის დასახელება",
        accessor: "executor_firm_name",
      },
      {
        Header: "საიდენტიფიკაციო ნომერი",
        accessor: "executor_id_number",
      },
      {
        Header: "იურიდიული მისამართი",
        accessor: "executor_home_address",
      },
      {
        Header: "შემსრულებლის სახელი",
        accessor: "executor_full_name",
      },
      {
        Header: "ავტომატური განახლება",
        accessor: "agreement_automatic_renewal",
      },
      {
        Header: "ექსკლუზიურობა",
        accessor: "exclusivity",
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
        {row.expanded.rejection_reason && (
          <div className="alert alert-danger d-flex align-items-center mb-4">
            <i className="bx bx-error-circle me-2 fs-5"></i>
            <div>
              <strong>უარყოფის მიზეზი:</strong> {row.expanded.rejection_reason}
            </div>
          </div>
        )}
        <div className="d-flex align-items-center mb-4 gap-2 text-muted">
          <BsPerson className="fs-3 text-primary" />
          <strong>მოითხოვა:</strong>
          <span className="ms-2">{row.expanded.requested_by}</span>
        </div>

        <div className="border rounded p-4 bg-white mb-4">
          <Row className="g-4">
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
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsMap className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">ექსკლუზიური ადგილი</div>
                  <div className="fw-medium">{row.exclusive_placement ? row.exclusive_placement : "არა"}</div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCreditCard className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">ბანკის ანგარიში</div>
                  <div className="fw-medium">
                    {row.executor_bank_account}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCalendar className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">
                    ხელშეკრულების აქტივობის ვადა
                  </div>
                  <div className="fw-medium">
                    {row.agreement_active_term}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCalendar className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">შექმნის თარიღი</div>
                  <div className="fw-medium">{new Date(row.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

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
                    searchableFields={["executor_firm_name", "executor_full_name"]}
                    filterOptions={filterOptions}
                    onRowClick={() => { }}
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

export default LocalAgreementArchive

