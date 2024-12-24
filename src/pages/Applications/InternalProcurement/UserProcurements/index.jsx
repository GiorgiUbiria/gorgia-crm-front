import React, { useEffect, useState, useMemo } from "react"
import { Row, Col, Card, CardBody } from "reactstrap"
import {
  BiX,
  BiTime,
  BiCheckCircle,
  BiLoader,
  BiPackage,
  BiDetail,
  BiBuilding,
  BiUser,
  BiUserCheck,
  BiUserVoice,
  BiCalendar,
  BiTrendingUp,
  BiInfoCircle,
  BiBox,
  BiTargetLock,
  BiMapPin,
  BiLabel,
  BiHash,
  BiRuler,
  BiText,
  BiWallet,
  BiStore,
  BiFlag,
  BiPhone,
  BiNote,
  BiComment,
  BiMessageAltX,
} from "react-icons/bi"
import Breadcrumbs from "../../../../components/Common/Breadcrumb"
import { getCurrentUserPurchases } from "../../../../services/purchase"
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

const UserProcurements = () => {
  document.title = "ჩემი შესყიდვები | Gorgia LLC"
  const [purchases, setPurchases] = useState([])

  const fetchPurchases = async () => {
    try {
      const response = await getCurrentUserPurchases()
      if (response.data?.data) {
        setPurchases(response.data.data)
      }
    } catch (err) {
      console.error("Error fetching user purchases:", err)
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
              padding: "8px 12px",
              borderRadius: "4px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
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
        Header: "მიმართულება",
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
      label: "მიმართულება",
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

  const ExpandedRowContent = rowData => {
    if (!rowData) return null

    const details = [
      {
        label: "ფილიალი",
        value: rowData?.branch || "N/A",
        icon: <BiBuilding />,
      },
      {
        label: "მომთხოვნის ხელმძღვანელი",
        value: rowData?.responsible_for_purchase
          ? `${rowData.responsible_for_purchase.name} ${rowData.responsible_for_purchase.sur_name}`
          : "N/A",
        icon: <BiUser />,
      },
      {
        label: "მიმართულების ხელმძღვანელი",
        value: rowData?.category_head
          ? `${rowData.category_head.name} ${rowData.category_head.sur_name}`
          : "N/A",
        icon: <BiUserCheck />,
      },
      {
        label: "შესყიდვაზე პასუხისმგებელი",
        value: rowData?.reviewer
          ? `${rowData.reviewer.name} ${rowData.reviewer.sur_name}`
          : "N/A",
        icon: <BiUserVoice />,
      },
      {
        label: "მოთხოვნილი მიღების თარიღი",
        value: rowData?.requested_arrival_date
          ? new Date(rowData.requested_arrival_date).toLocaleDateString()
          : "N/A",
        icon: <BiCalendar />,
      },
      {
        label: "მცირე ვადის მიზეზი",
        value: rowData?.short_date_notice_explanation || "N/A",
        icon: <BiTime />,
      },
      {
        label: "აღემატება საჭიროებას",
        value: rowData?.exceeds_needs ? "დიახ" : "არა",
        icon: <BiTrendingUp />,
      },
      {
        label: "საჭიროების გადაჭარბების მიზეზი",
        value: rowData?.exceeds_needs_reason || "N/A",
        icon: <BiInfoCircle />,
      },
      {
        label: "იქმნება მარაგი",
        value: rowData?.creates_stock ? "დიახ" : "არა",
        icon: <BiBox />,
      },
      {
        label: "მარაგის მიზანი",
        value: rowData?.stock_purpose || "N/A",
        icon: <BiTargetLock />,
      },
      {
        label: "მიწოდების მისამართი",
        value: rowData?.delivery_address || "N/A",
        icon: <BiMapPin />,
      },
    ]

    const completedProductsCount =
      rowData?.products?.filter(p => p.status === "completed").length || 0
    const totalProductsCount = rowData?.products?.length || 0
    const progressPercentage =
      totalProductsCount === 0
        ? 0
        : (completedProductsCount / totalProductsCount) * 100

    const StatusTimeline = () => (
      <Card className="mb-4 shadow-sm">
        <CardBody>
          <div className="d-flex align-items-center gap-2 mb-3">
            <BiTime className="text-primary" size={24} />
            <h6 className="mb-0">შესყიდვის სტატუსი</h6>
          </div>

          <div className="d-flex align-items-center gap-3 mb-3">
            <span
              className={`badge bg-${
                rowData.status === "completed" ? "success" : "primary"
              } px-3 py-2`}
            >
              <div className="d-flex align-items-center gap-2">
                {rowData.status === "completed" ? (
                  <BiCheckCircle />
                ) : (
                  <BiLoader />
                )}
                {statusMap[rowData.status]?.label || rowData.status}
              </div>
            </span>

            {rowData.status === "pending products completion" && (
              <span className="text-muted">
                <BiPackage className="me-1" />
                {completedProductsCount}/{totalProductsCount} პროდუქტი
                დასრულებული
              </span>
            )}
          </div>

          <div className="timeline">
            {rowData.department_head_decision_date && (
              <div className="timeline-item">
                <BiCheckCircle className="text-success" />
                <small className="text-muted">
                  დეპარტამენტის უფროსის გადაწყვეტილება:{" "}
                  {new Date(
                    rowData.department_head_decision_date
                  ).toLocaleString()}
                </small>
              </div>
            )}

            {rowData.requested_department_decision_date && (
              <div className="timeline-item">
                <BiCheckCircle className="text-success" />
                <small className="text-muted">
                  მოთხოვნილი დეპარტამენტის გადაწყვეტილება:{" "}
                  {new Date(
                    rowData.requested_department_decision_date
                  ).toLocaleString()}
                </small>
              </div>
            )}
          </div>

          {totalProductsCount > 0 && (
            <div className="progress mt-3" style={{ height: "10px" }}>
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${progressPercentage}%` }}
                aria-valuenow={progressPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          )}
        </CardBody>
      </Card>
    )

    const PurchaseDetails = () => (
      <Card className="mb-4 shadow-sm">
        <CardBody>
          <div className="d-flex align-items-center gap-2 mb-3">
            <BiDetail className="text-primary" size={24} />
            <h6 className="mb-0">შესყიდვის დეტალები</h6>
          </div>

          <div className="row g-3">
            {details.map((detail, index) => (
              <div key={index} className="col-md-6">
                <div className="d-flex align-items-center gap-2">
                  <span className="text-primary">{detail.icon}</span>
                  <div>
                    <strong>{detail.label}:</strong>
                    <div>{detail.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    )

    const ProductsTable = () => {
      if (!rowData?.products?.length) return null

      return (
        <Card className="shadow-sm">
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
                <BiPackage className="text-primary" size={24} />
                <h6 className="mb-0">პროდუქტები</h6>
              </div>

              {rowData.status === "pending products completion" && (
                <div style={{ width: "200px" }}>
                  <div className="progress" style={{ height: "10px" }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: `${progressPercentage}%` }}
                      aria-valuenow={progressPercentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>
                      <BiLabel /> სახელი
                    </th>
                    <th>
                      <BiHash /> რაოდენობა
                    </th>
                    <th>
                      <BiRuler /> ზომები
                    </th>
                    <th>
                      <BiText /> აღწერა
                    </th>
                    <th>
                      <BiInfoCircle /> დამატებითი ინფორმაცია
                    </th>
                    <th>
                      <BiWallet /> გადამხდელი
                    </th>
                    <th>
                      <BiStore /> მომწოდებელი
                    </th>
                    <th>
                      <BiFlag /> სტატუსი
                    </th>
                    <th>
                      <BiComment /> კომენტარი
                    </th>
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
                      <td>{product?.payer || "N/A"}</td>
                      <td>
                        {product?.supplier_exists ? (
                          <div>
                            <div className="d-flex align-items-center gap-1">
                              <BiBuilding />
                              {product.supplier_name}
                            </div>
                            <small className="text-muted d-block">
                              <BiPhone className="me-1" />
                              {product.supplier_contact_information}
                            </small>
                            {product.supplier_offer_details && (
                              <small className="text-muted d-block">
                                <BiNote className="me-1" />
                                შეთავაზება: {product.supplier_offer_details}
                              </small>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted">
                            <BiX /> არ არსებობს
                          </span>
                        )}
                      </td>
                      <td>
                        <span
                          style={{
                            padding: "6px 12px",
                            borderRadius: "4px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "0.875rem",
                            backgroundColor:
                              product?.status === "completed"
                                ? "#e8f5e9"
                                : "#fff3e0",
                            color:
                              product?.status === "completed"
                                ? "#2e7d32"
                                : "#e65100",
                          }}
                        >
                          {product?.status === "completed" ? (
                            <BiCheckCircle size={16} />
                          ) : (
                            <BiTime size={16} />
                          )}
                          <span>
                            {product?.status === "completed"
                              ? "დასრულებული"
                              : "პროცესში"}
                          </span>
                        </span>
                      </td>
                      <td>
                        {product?.comment ? (
                          <span className="text-muted">{product.comment}</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )
    }

    return (
      <div className="p-4">
        <StatusTimeline />

        {rowData?.comment && (
          <Card className="mb-4 shadow-sm">
            <CardBody>
              <div className="d-flex align-items-center gap-2 text-danger mb-2">
                <BiMessageAltX size={24} />
                <strong>უარყოფის მიზეზი:</strong>
              </div>
              <p className="mb-0">{rowData.comment}</p>
            </CardBody>
          </Card>
        )}

        <PurchaseDetails />
        <ProductsTable />
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
                breadcrumbItem="ჩემი შესყიდვები"
              />
            </Col>
          </Row>
          <Row>
            <MuiTable
              data={purchases}
              columns={columns}
              filterOptions={filterOptions}
              enableSearch={false}
              initialPageSize={10}
              renderRowDetails={ExpandedRowContent}
            />
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default UserProcurements
