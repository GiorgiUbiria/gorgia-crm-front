import React, { useEffect, useState, useMemo, useCallback } from "react"
import { Row, Col } from "reactstrap"
import MuiTable from "../../../../components/Mui/MuiTable"
import {
  getUserAgreemnets,
  downloadAgreement,
} from "services/marketingAgreement"
import {
  BsBank,
  BsCalendar,
  BsCreditCard,
  BsMap,
  BsPerson,
} from "react-icons/bs"

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
    toast.success("ხელშეკრულება წარმატებით ჩამოიტვირთა", "შესრულდა", {
      duration: 2000,
      size: "small",
    })
  } catch (error) {
    console.error("Download failed:", error)
    toast.error(
      error.message || "ფაილი არ არის ხელმისაწვდომი ჩამოსატვირთად",
      "შეცდომა",
      {
        duration: 2000,
        size: "small",
      }
    )
  }
}

const MarketingAgreementUser = () => {
  document.title = "ჩემი ხელშეკრულებები | Gorgia LLC"
  const [agreements, setAgreements] = useState([])

  const fetchAgreements = async () => {
    try {
      const response = await getUserAgreemnets()
      if (response?.data?.data) {
        setAgreements(response.data.data)
      }
    } catch (err) {
      console.error("Error fetching agreements:", err)
      toast.error("ხელშეკრულებების ჩატვირთვა ვერ მოხერხდა", "შეცდომა", {
        duration: 2000,
        size: "small",
      })
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
        requested_by: agreement.user.name + " " + agreement.user.sur_name,
        executor_firm_name: agreement.executor_firm_name,
        marketing_service_type: agreement.marketing_service_type,
        expanded: {
          executor_firm_name: agreement.executor_firm_name,
          marketing_service_type: agreement.marketing_service_type,
          marketing_service_start_date: agreement.marketing_service_start_date,
          marketing_service_end_date: agreement.marketing_service_end_date,
          service_cost: agreement.service_cost,
          executor_id_number: agreement.executor_id_number,
          executor_home_address: agreement.executor_home_address,
          executor_full_name: agreement.executor_full_name,
          executor_position: agreement.executor_position,
          executor_bank_account: agreement.executor_bank_account,
          executor_bank_name: agreement.executor_bank_name,
          executor_factual_address: agreement.executor_factual_address,
          executor_bank_swift: agreement.executor_bank_swift,
          director_full_name: agreement.director_full_name,
          director_id_number: agreement.director_id_number,
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
        Header: "სახელწოდება (საფირმო)",
        accessor: "executor_firm_name",
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
                  <div className="text-muted small">სახელწოდება (საფირმო)</div>
                  <div className="fw-medium">
                    {row.expanded.executor_firm_name}
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCreditCard className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">სერვისის სახეობა</div>
                  <div className="fw-medium">
                    {row.expanded.marketing_service_type}
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCalendar className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">სერვისის ვადა</div>
                  <div className="fw-medium">
                    {new Date(
                      row.expanded.marketing_service_start_date
                    ).toLocaleDateString()}{" "}
                    -{" "}
                    {new Date(
                      row.expanded.marketing_service_end_date
                    ).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsBank className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">სერვისის ღირებულება</div>
                  <div className="fw-medium">{row.expanded.service_cost}</div>
                </div>
              </div>
            </Col>

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

            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsMap className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">სახლის მისამართი</div>
                  <div className="fw-medium">
                    {row.expanded.executor_home_address}
                  </div>
                </div>
              </div>
            </Col>

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
                <BsCreditCard className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">გადახდის პირობები</div>
                  <div className="fw-medium">
                    {row.expanded.service_payment_details}
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCalendar className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">
                    ხელშეკრულების მოქმედების ვადა
                  </div>
                  <div className="fw-medium">
                    {row.expanded.service_active_term}
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCalendar className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">შექმნის თარიღი</div>
                  <div className="fw-medium">{row.created_at}</div>
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
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MuiTable
          columns={columns}
          data={transformedAgreements}
          initialPageSize={10}
          pageSizeOptions={[5, 10, 15, 20]}
          enableSearch={true}
          searchableFields={["executor_firm_name"]}
          filterOptions={filterOptions}
          renderRowDetails={renderRowDetails}
        />
      </div>
    </>
  )
}

export default MarketingAgreementUser
