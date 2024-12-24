import React, { useEffect, useState, useMemo, useCallback } from "react"
import { Row, Col } from "reactstrap"
import Breadcrumbs from "../../../../components/Common/Breadcrumb"
import { getPurchaseList } from "../../../../services/purchase"
import MuiTable from "../../../../components/Mui/MuiTable"

const statusMap = {
  "pending department head": {
    label: "განხილვაში (დეპარტამენტის უფროსი)",
    icon: "bx-time",
    color: "#FFA500",
  },
  "pending requested department": {
    label: "განხილვაში (მოთხოვნილი დეპარტამენტი)",
    icon: "bx-time",
    color: "#FFA500",
  },
  "pending products completion": {
    label: "პროდუქტების დასრულების მოლოდინში",
    icon: "bx-loader",
    color: "#3498db",
  },
  completed: {
    label: "დასრულებული",
    icon: "bx-check-circle",
    color: "#28a745",
  },
  rejected: {
    label: "უარყოფილი",
    icon: "bx-x-circle",
    color: "#dc3545",
  },
}

const ProcurementPageArchive = () => {
  document.title = "შესყიდვების არქივი | Gorgia LLC"
  const [purchases, setPurchases] = useState([])

  const fetchPurchases = async () => {
    try {
      const response = await getPurchaseList()
      if (response.data?.data) {
        setPurchases(response.data.data)
      }
    } catch (err) {
      console.error("Error fetching purchases:", err)
    }
  }

  useEffect(() => {
    fetchPurchases()
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "მოითხოვა",
        accessor: "requester",
        Cell: ({ row }) => (
          <div>
            <div>
              {row.original.requester?.name} {row.original.requester?.sur_name}
            </div>
            <small className="text-muted">
              {row.original.requester?.department?.name || "N/A"}
            </small>
          </div>
        ),
      },
      {
        Header: "ფილიალი",
        accessor: "branch",
      },
      {
        Header: "მოთხოვნის თარიღი",
        accessor: "created_at",
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
                value === "pending department head" ||
                value === "pending requested department"
                  ? "#fff3e0"
                  : value === "rejected"
                  ? "#ffebee"
                  : value === "completed"
                  ? "#e8f5e9"
                  : "#f5f5f5",
              color:
                value === "pending department head" ||
                value === "pending requested department"
                  ? "#e65100"
                  : value === "rejected"
                  ? "#c62828"
                  : value === "completed"
                  ? "#2e7d32"
                  : "#757575",
            }}
          >
            <i
              className={`bx ${
                statusMap[value]?.icon || "bx-help-circle"
              } me-2`}
            ></i>
            {statusMap[value]?.label || value}
          </span>
        ),
      },
      {
        Header: "კატეგორია",
        accessor: "category",
      },
      {
        Header: "მიზანი",
        accessor: "purchase_purpose",
      },
    ],
    []
  )

  const filterOptions = [
    {
      field: "status",
      label: "სტატუსი",
      valueLabels: {
        "pending department head": "განხილვაში (დეპარტამენტის უფროსი)",
        "pending requested department": "განხილვაში (მოთხოვნილი დეპარტამენტი)",
        "pending products completion": "პროდუქტების დასრულების მოლოდინში",
        completed: "დასრულებული",
        rejected: "უარყოფილი",
      },
    },
    {
      field: "category",
      label: "კატეგორია",
      valueLabels: {
        IT: "IT",
        Marketing: "Marketing",
        Security: "Security",
        Network: "Network",
        "Office Manager": "Office Manager",
        Farm: "Farm",
      },
    },
    {
      field: "branch",
      label: "ფილიალი",
    },
  ]

  const customSearchFunction = useCallback((rows, searchValue) => {
    if (!searchValue || typeof searchValue !== "string") return rows

    const searchTerm = searchValue.toLowerCase().trim()
    if (!searchTerm) return rows

    return rows.filter(row => {
      if (!row.original.requester) return false
      const requesterName = `${row.original.requester.name || ""} ${
        row.original.requester.sur_name || ""
      }`.toLowerCase()
      return requesterName.includes(searchTerm)
    })
  }, [])

  const ExpandedRowContent = rowData => {
    if (!rowData) return null

    const details = [
      { label: "ფილიალი", value: rowData?.branch || "N/A" },
      {
        label: "შესყიდვაზე პასუხისმგებელი",
        value: rowData?.responsible_for_purchase
          ? `${rowData.responsible_for_purchase.name} ${rowData.responsible_for_purchase.sur_name}`
          : "N/A",
      },
      {
        label: "მოთხოვნილი მიღების თარიღი",
        value: rowData?.requested_arrival_date
          ? new Date(rowData.requested_arrival_date).toLocaleDateString()
          : "N/A",
      },
      {
        label: "მცირე ვადის მიზეზი",
        value: rowData?.short_date_notice_explanation || "N/A",
      },
      {
        label: "აღემატება საჭიროებას",
        value: rowData?.exceeds_needs ? "დიახ" : "არა",
      },
      {
        label: "საჭიროების გადაჭარბების მიზეზი",
        value: rowData?.exceeds_needs_reason || "N/A",
      },
      {
        label: "იქმნება მარაგი",
        value: rowData?.creates_stock ? "დიახ" : "არა",
      },
      { label: "მარაგის მიზანი", value: rowData?.stock_purpose || "N/A" },
      {
        label: "მიწოდების მისამართი",
        value: rowData?.delivery_address || "N/A",
      },
    ]

    const completedProductsCount =
      rowData?.products?.filter(p => p.status === "completed").length || 0
    const totalProductsCount = rowData?.products?.length || 0

    return (
      <div className="p-3 bg-light rounded">
        {/* Status Timeline */}
        <div className="mb-4">
          <h6 className="mb-3">შესყიდვის სტატუსი</h6>
          <div className="d-flex align-items-center gap-2 mb-2">
            <div
              className={`badge bg-${
                rowData.status === "completed" ? "success" : "primary"
              }`}
            >
              {statusMap[rowData.status]?.label || rowData.status}
            </div>
            {rowData.status === "pending products completion" && (
              <small className="text-muted">
                ({completedProductsCount}/{totalProductsCount} პროდუქტი
                დასრულებული)
              </small>
            )}
          </div>
          {rowData.department_head_decision_date && (
            <small className="text-muted d-block">
              დეპარტამენტის უფროსის გადაწყვეტილების თარიღი:{" "}
              {new Date(rowData.department_head_decision_date).toLocaleString()}
            </small>
          )}
          {rowData.requested_department_decision_date && (
            <small className="text-muted d-block">
              მოთხოვნილი დეპარტამენტის გადაწყვეტილების თარიღი:{" "}
              {new Date(
                rowData.requested_department_decision_date
              ).toLocaleString()}
            </small>
          )}
        </div>

        {/* Rejection Comment */}
        {rowData?.comment && (
          <div className="mb-3">
            <span className="fw-bold text-danger">უარყოფის მიზეზი: </span>
            <p className="mb-0">{rowData.comment}</p>
          </div>
        )}

        {/* Main Details */}
        <div className="row g-2 mb-4">
          {details.map((detail, index) => (
            <div key={index} className="col-md-6">
              <span className="fw-bold">{detail.label}: </span>
              <span>{detail.value}</span>
            </div>
          ))}
        </div>

        {/* Products Section */}
        {rowData?.products && rowData.products.length > 0 && (
          <div className="mt-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">პროდუქტები</h6>
              {rowData.status === "pending products completion" && (
                <div
                  className="progress"
                  style={{ width: "200px", height: "10px" }}
                >
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{
                      width: `${
                        (completedProductsCount / totalProductsCount) * 100
                      }%`,
                    }}
                    aria-valuenow={
                      (completedProductsCount / totalProductsCount) * 100
                    }
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              )}
            </div>
            <div className="table-responsive">
              <table className="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th>სახელი</th>
                    <th>რაოდენობა</th>
                    <th>ზომები</th>
                    <th>აღწერა</th>
                    <th>დამატებითი ინფორმაცია</th>
                    <th>გადამხდელი</th>
                    <th>მომწოდებელი</th>
                    <th>სტატუსი</th>
                  </tr>
                </thead>
                <tbody>
                  {rowData.products.map((product, idx) => (
                    <tr key={idx}>
                      <td>{product?.name || "N/A"}</td>
                      <td>{product?.quantity || "N/A"}</td>
                      <td>{product?.dimensions || "N/A"}</td>
                      <td>{product?.description || "N/A"}</td>
                      <td>{product?.additional_information || "N/A"}</td>
                      <td>
                        {product?.payer === "department"
                          ? "დეპარტამენტი"
                          : "კომპანია"}
                      </td>
                      <td>
                        {product?.supplier_exists ? (
                          <div>
                            <div>{product.supplier_name}</div>
                            <small className="text-muted d-block">
                              {product.supplier_contact_information}
                            </small>
                            {product.supplier_offer_details && (
                              <small className="text-muted d-block">
                                შეთავაზება: {product.supplier_offer_details}
                              </small>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted">არ არსებობს</span>
                        )}
                      </td>
                      <td>
                        <div>
                          <span
                            className={`badge bg-${
                              product?.status === "completed"
                                ? "success"
                                : "warning"
                            }`}
                          >
                            {product?.status === "completed"
                              ? "დასრულებული"
                              : "პროცესში"}
                          </span>
                          {product?.comment && (
                            <small className="d-block text-muted mt-1">
                              {product.comment}
                            </small>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <React.Fragment>
      <div className="page-content mb-4">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs
                title="განცხადებები"
                breadcrumbItem="შესყიდვების არქივი"
              />
            </Col>
          </Row>
          <Row>
            <MuiTable
              data={purchases}
              columns={columns}
              filterOptions={filterOptions}
              enableSearch={true}
              searchableFields={["requester"]}
              customSearchFunction={customSearchFunction}
              initialPageSize={10}
              renderRowDetails={ExpandedRowContent}
            />
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ProcurementPageArchive
