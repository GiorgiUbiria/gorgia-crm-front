import React, { useEffect, useState, useMemo } from "react"
import { Row, Col } from "reactstrap"

import Breadcrumbs from "../../../../components/Common/Breadcrumb"
import { getPurchaseList } from "../../../../services/purchase"
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

const STATUS_MAPPING = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
}

const ExpandedRowContent = ({ rowData }) => {
  const details = [
    { label: "მიწოდების ვადა", value: rowData.deadline },
    { label: "მოკლე ვადის მიზეზი", value: rowData.short_period_reason },
    { label: "მარაგის მიზანი", value: rowData.stock_purpose },
    { label: "მარკა/მოდელი", value: rowData.brand_model },
    { label: "ალტერნატივა", value: rowData.alternative },
    {
      label: "კონკურენტული ფასი",
      value: rowData.competitive_price || "არ არის მითითებული",
    },
    {
      label: "იგეგმება თუ არა მომდევნო თვეში",
      value: rowData.planned_next_month,
    },
    { label: "თანხის ანაზღაურება", value: rowData.who_pay_amount },
    {
      label: "პასუხისმგებელი თანამშრომელი",
      value: rowData.name_surname_of_employee,
    },
  ]

  return (
    <div className="p-3 bg-light rounded">
      {rowData.comment && (
        <div className="mb-3">
          <span className="fw-bold text-danger">უარყოფის მიზეზი: </span>
          <p className="mb-0">{rowData.comment}</p>
        </div>
      )}
      <div className="row g-2">
        {details.map((detail, index) => (
          <div key={index} className="col-md-6">
            <span className="fw-bold">{detail.label}: </span>
            <span>{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const UserProcurement = () => {
  document.title = "ჩემი შესყიდვები | Gorgia LLC"

  const [procurements, setProcurements] = useState([])

  const fetchProcurements = async () => {
    try {
      const response = await getPurchaseList()
      setProcurements(response.data.internal_purchases)
    } catch (err) {
      console.error("Error fetching purchases:", err)
    }
  }

  useEffect(() => {
    fetchProcurements()
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "თარიღი",
        accessor: "created_at",
        sortType: "basic",
        Cell: ({ value }) => (
          <div className="date-wrapper">
            <i className="bx bx-calendar me-2"></i>
            {new Date(value).toLocaleDateString()}
          </div>
        ),
      },
      {
        Header: "სტატუსი",
        accessor: "status",
        disableSortBy: true,
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
        Header: "მიზანი",
        accessor: "objective",
        disableSortBy: true,
      },
      {
        Header: "მიზეზი",
        accessor: "reason",
        disableSortBy: true,
      },
      {
        Header: "დეპარტამენტი",
        accessor: "department",
        disableSortBy: true,
      },
      {
        Header: "მიღებული მისამართი",
        accessor: "delivery_address",
        disableSortBy: true,
      },
      {
        Header: "შემმოწმებელი",
        accessor: "reviewer",
        disableSortBy: true,
      },
    ],
    []
  )

  const transformedPurchases = procurements.map(purchase => ({
    id: purchase.id,
    status: STATUS_MAPPING[purchase.status] || purchase.status,
    created_at: purchase.created_at,
    user: {
      name: purchase.performer_name,
      id: purchase.id_code_or_personal_number,
      position: purchase.service_description,
      location: purchase.legal_or_actual_address,
    },
    objective: purchase.objective,
    reason: purchase.reason,
    department: purchase.department?.name || "არ არის მითითებული",
    delivery_address: purchase.delivery_address,
    reviewer: purchase.reviewed_by
      ? `${purchase.reviewed_by.name || ""} ${
          purchase.reviewed_by.sur_name || ""
        }`
      : "არ არის მითითებული",
    comment: purchase.comment,
    deadline: purchase.deadline,
    short_period_reason: purchase.short_period_reason,
    stock_purpose: purchase.stock_purpose,
    brand_model: purchase.brand_model,
    alternative: purchase.alternative,
    competitive_price: purchase.competitive_price,
    planned_next_month: purchase.planned_next_month,
    who_pay_amount: purchase.who_pay_amount,
    name_surname_of_employee: purchase.name_surname_of_employee,
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
      field: "department",
      label: "დეპარტამენტი",
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
                breadcrumbItem="ჩემი შესყიდვები"
              />
            </Col>
          </Row>
          <Row>
            <MuiTable
              data={transformedPurchases}
              columns={columns}
              filterOptions={filterOptions}
              enableSearch={true}
              searchableFields={["reviewer", "department"]}
              initialPageSize={10}
              renderRowDetails={expandedRow}
            />
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default UserProcurement
