import React, { useEffect, useState, useMemo, useCallback } from "react"
import { Row, Col } from "reactstrap"
import MuiTable from "../../../../components/Mui/MuiTable"
import {
  getUserAgreemnets,
  downloadAgreement as downloadAgreementService,
} from "services/agreement"
import {
  BsBank,
  BsCalendar,
  BsCreditCard,
  BsMap,
  BsPerson,
  BsVoicemail,
} from "react-icons/bs"
import { toast, ToastContainer } from "react-toastify"

const StandardAgreementUser = () => {
  document.title = "ჩემი ხელშეკრულებები | Gorgia LLC"
  const [agreements, setAgreements] = useState([])

  const statusMap = {
    pending: {
      label: "განხილვაში",
      icon: "bx-time",
      color: "#e65100",
    },
    rejected: {
      label: "უარყოფილი",
      icon: "bx-x-circle",
      color: "#c62828",
    },
    approved: {
      label: "დამტკიცებული",
      icon: "bx-check-circle",
      color: "#2e7d32",
    },
  }

  const fetchAgreements = async () => {
    try {
      const response = await getUserAgreemnets()
      if (response?.data?.data) {
        setAgreements(response.data.data)
      }
    } catch (err) {
      console.error("Error fetching agreements:", err)
      toast.error("ხელშეკრულებების ჩატვირთვა ვერ მოხერხდა")
    }
  }

  useEffect(() => {
    fetchAgreements()
  }, [])

  const transformedAgreements = useMemo(() => {
    return agreements.map(agreement => ({
      id: agreement.id,
      contragent_name: agreement.contragent_name,
      contract_initiator_name: agreement.contract_initiator_name,
      created_at: agreement.created_at,
      status: agreement.status,
      accepted_at: agreement.accepted_at,
      rejected_at: agreement.rejected_at,
      expanded: {
        ...agreement,
        user: agreement.user,
        products: agreement.products || [],
      },
    }))
  }, [agreements])

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "კონტრაგენტის დასახელება",
        accessor: "contragent_name",
        disableSortBy: true,
      },
      {
        Header: "ხელშეკრულების ინიციატორი",
        accessor: "contract_initiator_name",
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

  const handleDownload = async agreementId => {
    try {
      await downloadAgreementService(agreementId)
      toast.success("ხელშეკრულება წარმატებით ჩამოიტვირთა")
    } catch (error) {
      console.error("Download failed:", error)
      toast.error(error.message || "ფაილი არ არის ხელმისაწვდომი ჩამოსატვირთად")
    }
  }

  const renderRowDetails = useCallback(row => {
    if (!row) return null

    return (
      <div className="p-4 bg-light rounded">
        {/* Status Banner */}
        {row.expanded.rejection_reason && (
          <div className="alert alert-danger d-flex align-items-center mb-4">
            <i className="bx bx-error-circle me-2 fs-5"></i>
            <div>
              <strong>უარყოფის მიზეზი:</strong> {row.expanded.rejection_reason}
            </div>
          </div>
        )}

        {/* Requester Info */}
        <div className="d-flex align-items-center mb-4 gap-2 text-muted">
          <BsPerson className="fs-3 text-primary" />
          <strong>მოითხოვა:</strong>
          <span className="ms-2">{row.expanded.user?.name || "N/A"}</span>
        </div>

        {/* Details Grid */}
        <div className="border rounded p-4 bg-white mb-4">
          <Row className="g-4">
            {/* Payment Terms Section */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCreditCard className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">
                    გადახდის განსხვავებული პირობები
                  </div>
                  <div className="fw-medium">
                    {row.expanded.payment_different_terms ? "კი" : "არა"}
                  </div>
                </div>
              </div>
            </Col>
            {row.expanded.payment_different_terms && (
              <>
                <Col md={6}>
                  <div className="d-flex align-items-center gap-2">
                    <i className="bx bx-dollar fs-7 text-primary"></i>
                    <div>
                      <div className="text-muted small">ავანსის პროცენტი</div>
                      <div className="fw-medium">
                        {row.expanded.advance_payment_percentage}%
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex align-items-center gap-2">
                    <i className="bx bx-dollar fs-7 text-primary"></i>
                    <div>
                      <div className="text-muted small">დარჩენილი თანხის პროცენტი</div>
                      <div className="fw-medium">
                        {row.expanded.remaining_payment_percentage}%
                      </div>
                    </div>
                  </div>
                </Col>
              </>
            )}

            {/* Contract Details */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsVoicemail className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">
                    ხელშეკრულების ინიციატორი
                  </div>
                  <div className="fw-medium">
                    {row.expanded.contract_initiator_name}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCalendar className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">კონსიგნაციის ვადა</div>
                  <div className="fw-medium">
                    {row.expanded.conscription_term} დღე
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsMap className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">მიწოდების მისამართი</div>
                  <div className="fw-medium">
                    {row.expanded.product_delivery_address}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCalendar className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">გადახდის ვადა</div>
                  <div className="fw-medium">
                    {row.expanded.product_payment_term} დღე
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsBank className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">საბანკო ანგარიში</div>
                  <div className="fw-medium">{row.expanded.bank_account}</div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <i className="bx bx-dollar fs-7 text-primary"></i>
                <div>
                  <div className="text-muted small">პროდუქციის ღირებულება</div>
                  <div className="fw-medium">{row.expanded.product_cost} ₾</div>
                </div>
              </div>
            </Col>

            {/* Products Section */}
            <Col md={12}>
              <div className="mt-4">
                <h6 className="mb-3">პროდუქტები</h6>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>დასახელება</th>
                        <th>ფასი</th>
                      </tr>
                    </thead>
                    <tbody>
                      {row.expanded.products?.map((product, index) => (
                        <tr key={index}>
                          <td>{product.product_name}</td>
                          <td>{product.product_price} ₾</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>

            {/* Contragent Details */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <i className="bx bx-building fs-7 text-primary"></i>
                <div>
                  <div className="text-muted small">კონტრაგენტის მისამართი</div>
                  <div className="fw-medium">
                    {row.expanded.contragent_address}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <i className="bx bx-phone fs-7 text-primary"></i>
                <div>
                  <div className="text-muted small">კონტრაგენტის ტელეფონი</div>
                  <div className="fw-medium">
                    {row.expanded.contragent_phone_number}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <i className="bx bx-envelope fs-7 text-primary"></i>
                <div>
                  <div className="text-muted small">კონტრაგენტის ელფოსტა</div>
                  <div className="fw-medium">
                    {row.expanded.contragent_email}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <i className="bx bx-user fs-7 text-primary"></i>
                <div>
                  <div className="text-muted small">დირექტორის სახელი</div>
                  <div className="fw-medium">{row.expanded.contragent_director_name}</div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <i className="bx bx-phone-call fs-7 text-primary"></i>
                <div>
                  <div className="text-muted small">დირექტორის ტელეფონი</div>
                  <div className="fw-medium">{row.expanded.contragent_director_phone_number}</div>
                </div>
              </div>
            </Col>
          </Row>
          {row.expanded.status === "approved" && (
            <Row className="mt-4">
              <Col md={12}>
                <button
                  className="btn btn-primary"
                  onClick={() => handleDownload(row.expanded.id)}
                >
                  <i className="bx bx-download me-2"></i>
                  ხელშეკრულების ჩამოტვირთვა
                </button>
              </Col>
            </Row>
          )}
        </div>
      </div>
    )
  }, [handleDownload])

  return (
    <>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MuiTable
          columns={columns}
          data={transformedAgreements}
          initialPageSize={10}
          pageSizeOptions={[5, 10, 15, 20]}
          enableSearch={true}
          searchableFields={["contragent.name"]}
          filterOptions={filterOptions}
          renderRowDetails={renderRowDetails}
        />
      </div>
      <ToastContainer />
    </>
  )
}

export default StandardAgreementUser
