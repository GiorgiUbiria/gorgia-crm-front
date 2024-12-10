import React, { useEffect, useState, useMemo, useCallback } from "react"
import { Row, Col, Card, CardBody, Nav, NavItem } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import MuiTable from "../../components/Mui/MuiTable"
import {
  getDepartmentAgreements,
  downloadAgreement as downloadAgreementService,
} from "services/agreement"
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
    await downloadAgreementService(agreementId)
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

const LawyerPageArchive = () => {
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
        requested_by: agreement.user.name + " " + agreement.user.sur_name,
        contract_initiator: agreement.contract_initiator_name,
        contragent: {
          name: agreement.contragent_name,
          id: agreement.contragent_id,
          address: agreement.contragent_address,
          phone: agreement.contragent_phone_number,
          email: agreement.contragent_email,
        },
        director: {
          name: agreement.contragent_director_name,
          phone: agreement.contragent_director_phone_number,
        },
        expanded: {
          different_terms: agreement.payment_different_terms,
          contract_initiator: agreement.contract_initiator_name,
          conscription_term: agreement.conscription_term,
          product_delivery_address: agreement.product_delivery_address,
          product_payment_term: agreement.product_payment_term,
          bank_account: agreement.bank_account,
          rejection_reason: agreement.rejection_reason || null,
          price: agreement.product_cost,
          requested_by: agreement.user.name + " " + agreement.user.sur_name,
          status: STATUS_MAPPING[agreement.status] || agreement.status,
          created_at: new Date(agreement.created_at).toLocaleDateString(),
          updated_at: new Date(agreement.updated_at).toLocaleString(),
          requested_by: agreement.user.name + " " + agreement.user.sur_name,
          contragent: {
            name: agreement.contragent_name,
            id: agreement.contragent_id,
            address: agreement.contragent_address,
            phone: agreement.contragent_phone_number,
            email: agreement.contragent_email,
          },
          director: {
            name: agreement.contragent_director_name,
            phone: agreement.contragent_director_phone_number,
          },
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
        Header: "კონტრაგენტის დასახელება",
        accessor: "contragent.name",
        disableSortBy: true,
      },
      {
        Header: "ხელშეკრულების ინიციატორი",
        accessor: "contract_initiator",
        disableSortBy: true,
      },
      {
        Header: "მოთხოვნის თარიღი",
        accessor: "created_at",
      },
      {
        Header: "დადასტურების თარიღი",
        accessor: "updated_at",
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
          <span className="ms-2">{row.expanded.requested_by}</span>
        </div>

        {/* Details Grid */}
        <div className="border rounded p-4 bg-white mb-4">
          <Row className="g-4">
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCreditCard className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">
                    გადახდის განსხვავებული პირობები
                  </div>
                  <div className="fw-medium">
                    {row.expanded.different_terms ? "კი" : "არა"}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsVoicemail className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">
                    ხელშეკრულების ინიციატორი
                  </div>
                  <div className="fw-medium">
                    {row.expanded.contract_initiator}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <BsCalendar className="fs-7 text-primary" />
                <div>
                  <div className="text-muted small">ხელშეკრულების ვადა</div>
                  <div className="fw-medium">
                    {row.expanded.conscription_term}
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
                    {row.expanded.product_payment_term}
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
            {/* Additional Fields */}
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <i className="bx bx-dollar fs-7 text-primary"></i>
                <div>
                  <div className="text-muted small">ფასი</div>
                  <div className="fw-medium">{row.expanded.price} ₾</div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <i className="bx bx-building fs-7 text-primary"></i>
                <div>
                  <div className="text-muted small">კონტრაგენტის მისამართი</div>
                  <div className="fw-medium">
                    {row.expanded.contragent.address}
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
                    {row.expanded.contragent.phone}
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
                    {row.expanded.contragent.email}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <i className="bx bx-user fs-7 text-primary"></i>
                <div>
                  <div className="text-muted small">დირექტორის სახელი</div>
                  <div className="fw-medium">{row.expanded.director.name}</div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <i className="bx bx-phone-call fs-7 text-primary"></i>
                <div>
                  <div className="text-muted small">დირექტორის ტელეფონი</div>
                  <div className="fw-medium">{row.expanded.director.phone}</div>
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
                    searchableFields={["contragent.name", "requested_by"]}
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

export default LawyerPageArchive
