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

const UserProcurement = () => {
  document.title = "შესყიდვები | Gorgia LLC"

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
        Header: "შემმოწმებული",
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
    department: purchase.department?.name || "N/A",
    delivery_address: purchase.delivery_address,
    reviewer: purchase.reviewed_by
      ? `${purchase.reviewed_by.name || ""} ${
          purchase.reviewed_by.sur_name || ""
        }`
      : "N/A",
    comment: purchase.comment,
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
              renderRowDetails={row => <div>{row.comment}</div>}
            />
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default UserProcurement
