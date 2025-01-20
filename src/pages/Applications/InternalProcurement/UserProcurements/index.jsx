import React, { useMemo } from "react"
import { Card, CardBody } from "reactstrap"
import {
  BiTime,
  BiCheckCircle,
  BiPackage,
  BiDetail,
  BiBuilding,
  BiUser,
  BiUserCheck,
  BiUserVoice,
  BiCalendar,
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
  BiComment,
  BiMessageAltX,
} from "react-icons/bi"
import MuiTable from "../../../../components/Mui/MuiTable"
import { useGetCurrentUserPurchases } from "../../../../queries/purchase"
import { downloadPurchaseProduct } from "../../../../services/purchase"
import { DownloadButton } from "../../../../components/CrmActionButtons/ActionButtons"

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

  const { data: purchaseData, isLoading } = useGetCurrentUserPurchases()

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

    const totalProductsCount = rowData.products?.length || 0
    const completedProductsCount =
      rowData.products?.filter(p => p.status === "completed")?.length || 0
    const progressPercentage = Math.round(
      (completedProductsCount / totalProductsCount) * 100
    )

    const details = [
      {
        label: "ფილიალი",
        value: rowData?.branch || "N/A",
        icon: <BiBuilding className="text-primary" />,
      },
      {
        label: "მომთხოვნი",
        value: rowData?.requester.name + " " + rowData?.requester.sur_name,
        icon: <BiUser className="w-5 h-5 text-gray-500" />,
      },
      {
        label: "მომთხოვნის დეპარტამენტი",
        value: rowData?.requester?.department?.name || "N/A",
        icon: <BiUser className="w-5 h-5 text-gray-500" />,
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

    const StatusTimeline = () => (
      <Card className="mb-4 shadow-sm">
        <CardBody>
          <div className="flex justify-between items-center mb-3">
            <div className="d-flex align-items-center gap-2">
              <BiTime className="text-primary" size={24} />
              <h6 className="mb-0">
                სტატუსი: {statusMap[rowData.status]?.label || rowData.status}
              </h6>
            </div>

            {rowData.status === "pending products completion" && (
              <span className="text-muted">
                <BiPackage className="me-1" />
                {completedProductsCount}/{totalProductsCount} პროდუქტი
                დასრულებული
              </span>
            )}
          </div>

          <div className="timeline space-y-2">
            {rowData.department_head_decision_date && (
              <div className="flex items-center gap-2">
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
              <div className="flex items-center gap-2">
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
            <div className="mt-3">
              <div className="h-2.5 bg-gray-200 rounded-full">
                <div
                  className="h-2.5 bg-success rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
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

      const handleDownload = async productId => {
        try {
          const response = await downloadPurchaseProduct(rowData.id, productId)

          const contentDisposition = response.headers["content-disposition"]
          let filename = `product_${productId}_file`
          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(
              /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
            )
            if (filenameMatch && filenameMatch[1]) {
              filename = filenameMatch[1].replace(/['"]/g, "")
            }
          }

          const blob = new Blob([response.data], {
            type: response.headers["content-type"],
          })

          const url = window.URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", filename)
          document.body.appendChild(link)
          link.click()

          link.parentNode.removeChild(link)
          window.URL.revokeObjectURL(url)
        } catch (error) {
          console.error("Error downloading file:", error)
          alert("ფაილის ჩამოტვირთვა ვერ მოხერხდა")
        }
      }

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
                      <BiWallet /> გადამხდელი
                    </th>
                    <th>
                      <BiStore /> მოძიებული ვარიანტი
                    </th>
                    <th>
                      <BiTime /> ანალოგიური შესყიდვა
                    </th>
                    <th>
                      <BiBox /> ასორტიმენტში
                    </th>
                    <th>
                      <BiFlag /> სტატუსი
                    </th>
                    <th>
                      <BiComment /> კომენტარი
                    </th>
                    <th>მოქმედებები</th>
                  </tr>
                </thead>
                <tbody>
                  {rowData.products.map((product, idx) => (
                    <tr key={idx}>
                      <td>{product?.name || "N/A"}</td>
                      <td>{product?.quantity || "N/A"}</td>
                      <td>{product?.dimensions || "N/A"}</td>
                      <td>{product?.description || "N/A"}</td>
                      <td>{product?.payer || "N/A"}</td>
                      <td>{product?.search_variant || "N/A"}</td>
                      <td>{product?.similar_purchase_planned || "N/A"}</td>
                      <td>{product?.in_stock_explanation || "N/A"}</td>
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
                      <td>
                        {product?.status === "completed" && (
                          <DownloadButton
                            props={{
                              onClick: () => handleDownload(product.id),
                              size: "sm",
                            }}
                            size="sm"
                          />
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
      <div className="p-4 space-y-4">
        <StatusTimeline />

        {rowData?.comment && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 text-red-500 mb-2">
              <BiMessageAltX size={24} />
              <strong>უარყოფის მიზეზი:</strong>
            </div>
            <p className="text-gray-600 mb-0">{rowData.comment}</p>
          </div>
        )}

        <PurchaseDetails />
        <ProductsTable />
      </div>
    )
  }

  return (
    <>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="p-4 sm:p-6">
          <MuiTable
            data={purchaseData?.data || []}
            columns={columns}
            filterOptions={filterOptions}
            enableSearch={false}
            initialPageSize={10}
            renderRowDetails={ExpandedRowContent}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  )
}

export default UserProcurements
