import React, { useEffect, useState, useMemo, useCallback } from "react"
import { Row, Col, Card, CardBody } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import MuiTable from "../../components/Mui/MuiTable"
import {
  getDepartmentAgreements,
  downloadAgreement as downloadAgreementService,
} from "services/agreement"
import { toast, ToastContainer } from "react-toastify"

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
        created_at: agreement.created_at,
        price: agreement.product_cost,
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
        Header: "კონტრაგენტის დასახელება/სახელი და გვარი",
        accessor: "contragent.name",
      },
      {
        Header: "პირადი ნომერი/საიდენტიფიკაციო კოდი",
        accessor: "contragent.id",
      },
      {
        Header: "მისამართი",
        accessor: "contragent.address",
      },
      {
        Header: "ტელეფონის ნომერი",
        accessor: "contragent.phone",
      },
      {
        Header: "ელ.ფოსტა",
        accessor: "contragent.email",
      },
      {
        Header: "დირექტორის სახელი და გვარი",
        accessor: "director.name",
      },
      {
        Header: "დირექტორის ტელეფონის ნომერი",
        accessor: "director.phone",
      },
      {
        Header: "პროდუქციის ღირებულება",
        accessor: "price",
        Cell: ({ value }) => (
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
    if (!row) {
      return null
    }

    return (
      <div className="p-3">
        {row.expanded.rejection_reason && (
          <div className="alert alert-danger mb-3">
            უარყოფის მიზეზი: {row.expanded.rejection_reason}
          </div>
        )}
        <div className="mb-3">
          <Row>
            <Col md={6}>
              <div className="mb-2">
                <strong>გადახდის განსხვავებული პირობები: </strong>
                {row.expanded.different_terms ? "კი" : "არა"}
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-2">
                <strong>
                  ხელშეკრულების გაფორმების ინიციატორი და შესრულებაზე
                  პასუხისმგებელი პირი:{" "}
                </strong>
                {row.expanded.contract_initiator}
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <div className="mb-2">
                <strong>ხელშეკრულების ვადა: </strong>
                {row.expanded.conscription_term}
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-2">
                <strong>პროდუქციის მიწოდების მისამართი: </strong>
                {row.expanded.product_delivery_address}
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <div className="mb-2">
                <strong>პროდუქციის გადახდის ვადა: </strong>
                {row.expanded.product_payment_term}
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-2">
                <strong>საბანკო ანგარიში: </strong>
                {row.expanded.bank_account}
              </div>
            </Col>
          </Row>
        </div>
        {row.status === "approved" && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleDownload(row.id)}
          >
            <i className="bx bx-download me-1"></i>
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
                    searchableFields={["contragent.name"]}
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
