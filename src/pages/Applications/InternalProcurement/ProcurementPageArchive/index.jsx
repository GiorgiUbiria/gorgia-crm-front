import React, { useMemo, useCallback } from "react"
import { Card, CardBody } from "reactstrap"
import {
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
  BiXCircle,
  BiMessageAltX,
  BiLink,
  BiDownload,
} from "react-icons/bi"
import MuiTable from "../../../../components/Mui/MuiTable"
import {
  useGetPurchaseList,
  useGetDepartmentPurchases,
} from "../../../../queries/purchase"
import {
  downloadPurchaseProduct,
  downloadPurchase,
} from "../../../../services/purchase"
import { DownloadButton } from "../../../../components/CrmActionButtons/ActionButtons"
import useAuth from "hooks/useAuth"

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

  const {
    isAdmin,
    isDepartmentHead,
    isDepartmentHeadAssistant,
    getUserDepartmentId,
    can,
  } = useAuth()
  const { data: purchaseData, isLoading } = useGetPurchaseList(
    {},
    {
      enabled: isAdmin() || getUserDepartmentId() === 7 || can("user:373"),
    }
  )

  const {
    data: departmentPurchaseData,
    isLoading: isDepartmentPurchaseLoading,
  } = useGetDepartmentPurchases(_, _, {
    enabled:
      (isDepartmentHead() || isDepartmentHeadAssistant()) &&
      !isAdmin() &&
      getUserDepartmentId() !== 7 &&
      !can("user:373"),
  })

  const canViewTable = useMemo(() => {
    return (
      isAdmin() ||
      isDepartmentHead() ||
      isDepartmentHeadAssistant() ||
      getUserDepartmentId() === 7 ||
      can("user:373")
    )
  }, [
    isAdmin,
    isDepartmentHead,
    isDepartmentHeadAssistant,
    getUserDepartmentId,
    can,
  ])

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
            <small className="text-gray-500">
              {row.original.requester?.department?.name || "N/A"}
            </small>
          </div>
        ),
      },
      {
        Header: "შესყიდვის ტიპი",
        accessor: "procurement_type",
        Cell: ({ value }) => (
          <div>
            <span className="badge bg-primary">
              {value === "purchase" ? "შესყიდვა" : "ფასის მოკვლევა"}
            </span>
          </div>
        ),
      },
      {
        Header: "ფილიალები",
        accessor: "branches",
        Cell: ({ value }) => (
          <div>
            {value?.map(branch => (
              <span key={branch} className="badge bg-primary">
                {branch}
              </span>
            ))}
          </div>
        ),
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

    const handleDownloadPurchaseFile = async purchaseId => {
      try {
        const response = await downloadPurchase(purchaseId)

        const contentDisposition = response.headers["content-disposition"]
        let filename = `purchase_${purchaseId}_file`
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
          )
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, "")
          }
        }

        const blob = new Blob([response.data], {
          type: response.headers["content-type"] || "application/octet-stream",
        })

        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", filename)
        document.body.appendChild(link)
        link.click()

        // Cleanup
        link.parentNode.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error("Error downloading file:", error)
        alert("ფაილის ჩამოტვირთვა ვერ მოხერხდა")
      }
    }

    const details = [
      {
        label: "კომენტარი",
        value: rowData?.comment || "N/A",
        icon: <BiComment />,
      },
      {
        label: "ფილიალები",
        value: rowData?.branches?.map(branch => branch).join(", ") || "N/A",
        icon: <BiBuilding className="w-5 h-5 text-gray-500" />,
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
        icon: <BiUser className="w-5 h-5 text-gray-500" />,
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
      {
        label: "გარე ბმული",
        value: rowData?.external_url ? (
          <a
            href={rowData.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary"
          >
            {rowData.external_url}
          </a>
        ) : (
          "N/A"
        ),
        icon: <BiLink />,
      },
      {
        label: "მიმაგრებული ფაილი",
        value: rowData?.file_path ? (
          <button
            onClick={() => handleDownloadPurchaseFile(rowData.id)}
            className="btn btn-link btn-sm p-0 text-primary"
          >
            ჩამოტვირთვა
          </button>
        ) : (
          "N/A"
        ),
        icon: <BiDownload />,
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
            type:
              response.headers["content-type"] || "application/octet-stream",
          })

          const url = window.URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", filename)
          document.body.appendChild(link)
          link.click()

          // Cleanup
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
                      <BiBuilding /> ფილიალი
                    </th>
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
                      <td>{product?.branch || "N/A"}</td>
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
                        {product?.status === "completed" &&
                          product?.file_path && (
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
      <div className="p-4">
        <StatusTimeline />

        {rowData?.comment && (
          <Card className="mb-4 shadow-sm">
            <CardBody>
              {rowData?.status === "rejected" ? (
                <div className="d-flex align-items-center gap-2 text-danger mb-2">
                  <BiMessageAltX size={24} />
                  <strong>უარყოფის მიზეზი:</strong>
                  <p className="mb-0">{rowData.comment}</p>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2 text-success mb-2">
                  <BiCheckCircle size={24} />
                  <strong>დასრულების კომენტარი:</strong>
                  <p className="mb-0">{rowData.comment}</p>
                </div>
              )}
            </CardBody>
          </Card>
        )}

        <PurchaseDetails />
        <ProductsTable />
      </div>
    )
  }

  if (!canViewTable) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center max-w-lg w-full">
          <BiXCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            წვდომა შეზღუდულია
          </h2>
          <p className="text-gray-600">
            თქვენ არ გაქვთ ამ გვერდის ნახვის უფლება
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="p-4 sm:p-6">
          <MuiTable
            columns={columns}
            data={
              isAdmin() || getUserDepartmentId() === 7
                ? purchaseData?.data || []
                : departmentPurchaseData?.data || []
            }
            filterOptions={filterOptions}
            customSearchFunction={customSearchFunction}
            enableSearch={true}
            isLoading={
              isAdmin() || getUserDepartmentId() === 7
                ? isLoading
                : isDepartmentPurchaseLoading
            }
            renderRowDetails={ExpandedRowContent}
            rowClassName="cursor-pointer hover:bg-gray-50"
          />
        </div>
      </div>
    </>
  )
}

export default ProcurementPageArchive
