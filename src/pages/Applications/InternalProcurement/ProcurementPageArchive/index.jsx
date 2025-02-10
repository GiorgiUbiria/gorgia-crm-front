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
import { useTheme } from "../../../../hooks/useTheme"
import classNames from "classnames"

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

  const { isDarkMode } = useTheme()

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
        icon: <BiComment className="dark:!text-gray-300" />,
      },
      {
        label: "ფილიალები",
        value: rowData?.branches?.map(branch => branch).join(", ") || "N/A",
        icon: (
          <BiBuilding className="w-5 h-5 text-gray-500 dark:!text-gray-400" />
        ),
      },
      {
        label: "მომთხოვნი",
        value: rowData?.requester.name + " " + rowData?.requester.sur_name,
        icon: <BiUser className="w-5 h-5 text-gray-500 dark:!text-gray-400" />,
      },
      {
        label: "მომთხოვნის დეპარტამენტი",
        value: rowData?.requester?.department?.name || "N/A",
        icon: <BiUser className="w-5 h-5 text-gray-500 dark:!text-gray-400" />,
      },
      {
        label: "მომთხოვნის ხელმძღვანელი",
        value: rowData?.responsible_for_purchase
          ? `${rowData.responsible_for_purchase.name} ${rowData.responsible_for_purchase.sur_name}`
          : "N/A",
        icon: <BiUser className="w-5 h-5 text-gray-500 dark:!text-gray-400" />,
      },
      {
        label: "მიმართულების ხელმძღვანელი",
        value: rowData?.category_head
          ? `${rowData.category_head.name} ${rowData.category_head.sur_name}`
          : "N/A",
        icon: <BiUserCheck className="dark:!text-gray-300" />,
      },
      {
        label: "შესყიდვაზე პასუხისმგებელი",
        value: rowData?.reviewer
          ? `${rowData.reviewer.name} ${rowData.reviewer.sur_name}`
          : "N/A",
        icon: <BiUserVoice className="dark:!text-gray-300" />,
      },
      {
        label: "მოთხოვნილი მიღების თარიღი",
        value: rowData?.requested_arrival_date
          ? new Date(rowData.requested_arrival_date).toLocaleDateString()
          : "N/A",
        icon: <BiCalendar className="dark:!text-gray-300" />,
      },
      {
        label: "მცირე ვადის მიზეზი",
        value: rowData?.short_date_notice_explanation || "N/A",
        icon: <BiTime className="dark:!text-gray-300" />,
      },
      {
        label: "საჭიროების გადაჭარბების მიზეზი",
        value: rowData?.exceeds_needs_reason || "N/A",
        icon: <BiInfoCircle className="dark:!text-gray-300" />,
      },
      {
        label: "იქმნება მარაგი",
        value: rowData?.creates_stock ? "დიახ" : "არა",
        icon: <BiBox className="dark:!text-gray-300" />,
      },
      {
        label: "მარაგის მიზანი",
        value: rowData?.stock_purpose || "N/A",
        icon: <BiTargetLock className="dark:!text-gray-300" />,
      },
      {
        label: "მიწოდების მისამართი",
        value: rowData?.delivery_address || "N/A",
        icon: <BiMapPin className="dark:!text-gray-300" />,
      },
      {
        label: "გარე ბმული",
        value: rowData?.external_url ? (
          <a
            href={rowData.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary dark:!text-primary-400"
          >
            {rowData.external_url}
          </a>
        ) : (
          "N/A"
        ),
        icon: <BiLink className="dark:!text-gray-300" />,
      },
      {
        label: "მიმაგრებული ფაილი",
        value: rowData?.file_path ? (
          <button
            onClick={() => handleDownloadPurchaseFile(rowData.id)}
            className="btn btn-link btn-sm p-0 text-primary dark:!text-primary-400"
          >
            ჩამოტვირთვა
          </button>
        ) : (
          "N/A"
        ),
        icon: <BiDownload className="dark:!text-gray-300" />,
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
      <Card className="mb-4 shadow-sm dark:!bg-gray-800 dark:!border-gray-700">
        <CardBody className="dark:!bg-gray-800">
          <div className="d-flex align-items-center gap-2 mb-3">
            <BiTime className="text-primary dark:!text-primary-400" size={24} />
            <h6 className="mb-0 dark:!text-gray-200">შესყიდვის სტატუსი</h6>
          </div>

          <div className="d-flex align-items-center gap-3 mb-3">
            <span
              className={`badge bg-${
                rowData.status === "completed" ? "success" : "primary"
              } px-3 py-2 dark:!bg-${
                rowData.status === "completed" ? "success" : "primary"
              }-600`}
            >
              <div className="d-flex align-items-center gap-2 dark:!text-gray-200">
                {rowData.status === "completed" ? (
                  <BiCheckCircle />
                ) : (
                  <BiLoader />
                )}
                {statusMap[rowData.status]?.label || rowData.status}
              </div>
            </span>

            {rowData.status === "pending products completion" && (
              <span className="text-muted dark:!text-gray-400">
                <BiPackage className="me-1" />
                {completedProductsCount}/{totalProductsCount} პროდუქტი
                დასრულებული
              </span>
            )}
          </div>

          <div className="timeline">
            {rowData.department_head_decision_date && (
              <div className="timeline-item">
                <BiCheckCircle className="text-success dark:!text-success-400" />
                <small className="text-muted dark:!text-gray-400">
                  დეპარტამენტის უფროსის გადაწყვეტილება:{" "}
                  {new Date(
                    rowData.department_head_decision_date
                  ).toLocaleString()}
                </small>
              </div>
            )}

            {rowData.requested_department_decision_date && (
              <div className="timeline-item">
                <BiCheckCircle className="text-success dark:!text-success-400" />
                <small className="text-muted dark:!text-gray-400">
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
      <Card className="mb-4 shadow-sm dark:!bg-gray-800 dark:!border-gray-700">
        <CardBody className="dark:!bg-gray-800">
          <div className="d-flex align-items-center gap-2 mb-3">
            <BiDetail
              className="text-primary dark:!text-primary-400"
              size={24}
            />
            <h6 className="mb-0 dark:!text-gray-200">შესყიდვის დეტალები</h6>
          </div>

          <div className="row g-3">
            {details.map((detail, index) => (
              <div key={index} className="col-md-6">
                <div className="d-flex align-items-center gap-2">
                  <span className="text-primary dark:!text-primary-400">
                    {detail.icon}
                  </span>
                  <div>
                    <strong className="dark:!text-gray-300">
                      {detail.label}:
                    </strong>
                    <div className="dark:!text-gray-400">{detail.value}</div>
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

          link.parentNode.removeChild(link)
          window.URL.revokeObjectURL(url)
        } catch (error) {
          console.error("Error downloading file:", error)
          alert("ფაილის ჩამოტვირთვა ვერ მოხერხდა")
        }
      }

      return (
        <Card className="shadow-sm dark:!bg-gray-800 dark:!border-gray-700">
          <CardBody className="dark:!bg-gray-800">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
                <BiPackage
                  className="text-primary dark:!text-primary-400"
                  size={24}
                />
                <h6 className="mb-0 dark:!text-gray-200">პროდუქტები</h6>
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
              <table className="table table-hover dark:!bg-gray-800 dark:!border-gray-700">
                <thead
                  className={classNames(
                    isDarkMode ? "table-dark" : "table-light",
                    "dark:!bg-gray-700"
                  )}
                >
                  <tr>
                    <th className="dark:!text-gray-300">
                      <BiBuilding className="dark:!text-gray-400" /> ფილიალი
                    </th>
                    <th className="dark:!text-gray-300">
                      <BiLabel className="dark:!text-gray-400" /> სახელი
                    </th>
                    <th className="dark:!text-gray-300">
                      <BiHash className="dark:!text-gray-400" /> რაოდენობა
                    </th>
                    <th className="dark:!text-gray-300">
                      <BiRuler className="dark:!text-gray-400" /> ზომები
                    </th>
                    <th className="dark:!text-gray-300">
                      <BiText className="dark:!text-gray-400" /> აღწერა
                    </th>
                    <th className="dark:!text-gray-300">
                      <BiWallet className="dark:!text-gray-400" /> გადამხდელი
                    </th>
                    <th className="dark:!text-gray-300">
                      <BiStore className="dark:!text-gray-400" /> მოძიებული
                      ვარიანტი
                    </th>
                    <th className="dark:!text-gray-300">
                      <BiTime className="dark:!text-gray-400" /> ანალოგიური
                      შესყიდვა
                    </th>
                    <th className="dark:!text-gray-300">
                      <BiBox className="dark:!text-gray-400" /> ასორტიმენტში
                    </th>
                    <th className="dark:!text-gray-300">
                      <BiFlag className="dark:!text-gray-400" /> სტატუსი
                    </th>
                    <th className="dark:!text-gray-300">
                      <BiComment className="dark:!text-gray-400" /> კომენტარი
                    </th>
                    <th className="dark:!text-gray-300">მოქმედებები</th>
                  </tr>
                </thead>
                <tbody
                  className={classNames(
                    isDarkMode ? "table-dark" : "table-light",
                    "dark:!bg-gray-800"
                  )}
                >
                  {rowData.products.map((product, idx) => (
                    <tr
                      key={idx}
                      className="dark:!bg-gray-800 dark:!border-gray-700 hover:dark:!bg-gray-700"
                    >
                      <td className="dark:!text-gray-400">
                        {product?.branch || "N/A"}
                      </td>
                      <td className="dark:!text-gray-400">
                        {product?.name || "N/A"}
                      </td>
                      <td className="dark:!text-gray-400">
                        {product?.quantity || "N/A"}
                      </td>
                      <td className="dark:!text-gray-400">
                        {product?.dimensions || "N/A"}
                      </td>
                      <td className="dark:!text-gray-400">
                        {product?.description || "N/A"}
                      </td>
                      <td className="dark:!text-gray-400">
                        {product?.payer || "N/A"}
                      </td>
                      <td className="dark:!text-gray-400">
                        {product?.search_variant || "N/A"}
                      </td>
                      <td className="dark:!text-gray-400">
                        {product?.similar_purchase_planned || "N/A"}
                      </td>
                      <td className="dark:!text-gray-400">
                        {product?.in_stock_explanation || "N/A"}
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
                                ? "dark:!bg-green-900/20"
                                : "dark:!bg-orange-900/20",
                            color:
                              product?.status === "completed"
                                ? "dark:!text-green-400"
                                : "dark:!text-orange-400",
                          }}
                          className={
                            product?.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }
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
                          <span className="text-muted dark:!text-gray-400">
                            {product.comment}
                          </span>
                        ) : (
                          <span className="text-muted dark:!text-gray-400">
                            -
                          </span>
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
