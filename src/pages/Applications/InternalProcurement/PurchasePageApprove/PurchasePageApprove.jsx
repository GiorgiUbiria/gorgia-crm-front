import React, { useState, useMemo, useCallback } from "react"
import {
  Input,
  Modal,
  Form,
  FormGroup,
  Label,
  Card,
  CardBody,
} from "reactstrap"
import {
  BiXCircle,
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
  BiMessageAltX,
  BiLink,
  BiDownload,
} from "react-icons/bi"
import useAuth from "hooks/useAuth"
import MuiTable from "../../../../components/Mui/MuiTable"
import Button from "@mui/material/Button"
import {
  useGetPurchaseList,
  useUpdatePurchaseStatus,
  useUpdateProductStatus,
  useGetDepartmentPurchases,
} from "../../../../queries/purchase"
import { downloadPurchase } from "../../../../services/purchase"

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

const categoryDepartmentMap = {
  IT: 5,
  Marketing: 21,
  Security: 36,
  Network: 26,
  "Office Manager": 39,
  Farm: 38,
}

const PurchasePageApprove = () => {
  document.title = "შიდა შესყიდვების ვიზირება | Gorgia LLC"
  const {
    isDepartmentHead,
    isDepartmentHeadAssistant,
    getUserDepartmentId,
    isAdmin,
  } = useAuth()

  const [rejectionModal, setRejectionModal] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState(null)
  const [rejectionComment, setRejectionComment] = useState("")
  const [confirmModal, setConfirmModal] = useState(false)
  const [productStatusModal, setProductStatusModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productComment, setProductComment] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)

  const canViewTable = useMemo(() => {
    return (
      isAdmin() ||
      isDepartmentHead() ||
      isDepartmentHeadAssistant() ||
      getUserDepartmentId() === 7
    )
  }, [
    isAdmin,
    isDepartmentHead,
    isDepartmentHeadAssistant,
    getUserDepartmentId,
  ])

  const { data: purchaseData, isLoading: isPurchasesLoading } =
    useGetPurchaseList(
      {},
      {
        enabled: !!isAdmin() || getUserDepartmentId() === 7,
      }
    )

  const { mutate: updatePurchaseStatus, isLoading: isStatusUpdateLoading } =
    useUpdatePurchaseStatus()

  const {
    data: departmentPurchaseData,
    isLoading: isDepartmentPurchaseLoading,
  } = useGetDepartmentPurchases({}, { enabled: isDepartmentHead() })

  const { mutate: updateProductStatus, isLoading: isProductUpdateLoading } =
    useUpdateProductStatus()

  const canApproveRequest = useCallback(
    purchase => {
      if (purchase.status === "completed" || purchase.status === "rejected") {
        return false
      }

      if (isAdmin()) {
        return true
      }

      if (
        getUserDepartmentId() === 7 &&
        purchase.status === "pending products completion"
      ) {
        return true
      }

      if (!isDepartmentHead()) {
        return false
      }

      const purchaseCategory = purchase.category
      const requesterDepartmentId = purchase.requester?.department_id
      const categoryDepartmentId = categoryDepartmentMap[purchaseCategory]

      if (requesterDepartmentId === categoryDepartmentId) {
        return (
          purchase.status === "pending department head" &&
          getUserDepartmentId() === requesterDepartmentId
        )
      }

      switch (purchase.status) {
        case "pending department head":
          return getUserDepartmentId() === requesterDepartmentId
        case "pending requested department":
          return getUserDepartmentId() === categoryDepartmentId
        default:
          return false
      }
    },
    [isDepartmentHead, getUserDepartmentId, isAdmin]
  )

  const getNextStatus = purchase => {
    if (purchase.status === "pending department head") {
      const purchaseCategory = purchase.category
      const requesterDepartmentId = purchase.requester?.department_id
      const categoryDepartmentId = categoryDepartmentMap[purchaseCategory]

      if (requesterDepartmentId === categoryDepartmentId) {
        return "pending products completion"
      }
      return "pending requested department"
    }

    if (purchase.status === "pending requested department") {
      return "pending products completion"
    }

    if (purchase.status === "pending products completion") {
      return purchase.products?.every(p => p.status === "completed")
        ? "completed"
        : purchase.status
    }

    return purchase.status
  }

  const handleModalOpen = (action, purchase) => {
    setSelectedPurchase(purchase)
    if (action === "rejected") {
      setRejectionModal(true)
    } else {
      setConfirmModal(true)
    }
  }

  const handleConfirmAction = () => {
    const nextStatus = getNextStatus(selectedPurchase)

    if (
      getUserDepartmentId() === 7 &&
      nextStatus === "completed" &&
      (!selectedPurchase.products || selectedPurchase.products.length === 0)
    ) {
      setConfirmModal(false)
      setProductStatusModal(true)
      return
    }

    updatePurchaseStatus(
      { id: selectedPurchase.id, status: nextStatus },
      {
        onSuccess: () => {
          setSelectedPurchase(null)
          setConfirmModal(false)
        },
        onError: err => {
          console.error("Error updating purchase status:", err)
          alert(err.response?.data?.message || "შეცდომა სტატუსის განახლებისას")
        },
      }
    )
  }

  const handleRejectionSubmit = () => {
    updatePurchaseStatus(
      {
        id: selectedPurchase.id,
        status: "rejected",
        comment: rejectionComment,
      },
      {
        onSuccess: () => {
          setRejectionModal(false)
          setRejectionComment("")
          setSelectedPurchase(null)
        },
        onError: err => {
          console.error("Error rejecting purchase:", err)
          alert(err.response?.data?.message || "შეცდომა უარყოფისას")
        },
      }
    )
  }

  const handleProductStatusChange = (productId, newStatus) => {
    if (newStatus === "completed" && !selectedFile) {
      alert("გთხოვთ ატვირთოთ ფაილი")
      return
    }

    updateProductStatus(
      {
        purchaseId: selectedPurchase.id,
        productId,
        status: newStatus,
        comment: productComment,
        file: selectedFile,
      },
      {
        onSuccess: () => {
          setProductStatusModal(false)
          setProductComment("")
          setSelectedProduct(null)
          setSelectedPurchase(null)
          setSelectedFile(null)
        },
        onError: err => {
          console.error("Error updating product status:", err)
          alert(
            err.response?.data?.message ||
              "შეცდომა პროდუქტის სტატუსის განახლებისას"
          )
        },
      }
    )
  }

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
        Header: "შესყიდვის ტიპი",
        accessor: "procurement_type",
        Cell: ({ value }) => (
          <div>
            <span className="badge bg-primary">
              {value === "purchase"
                ? "შესყიდვა"
                : value === "price_inquiry"
                ? "ფასის მოკვლევა"
                : "მომსახურება"}
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
              className={`bx ${statusMap[value]?.icon || "bx-help-circle"}`}
              style={{ fontSize: "1.1rem" }}
            ></i>
            <span>{statusMap[value]?.label || value}</span>
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
      {
        Header: "მოქმედებები",
        Cell: ({ row }) => {
          const purchase = row.original
          if (!canApproveRequest(purchase) || getUserDepartmentId() === 7)
            return null

          return (
            <div className="d-flex gap-2">
              <Button
                onClick={() => handleModalOpen("approve", purchase)}
                color="success"
                variant="contained"
                size="small"
              >
                დამტკიცება
              </Button>
              <Button
                onClick={() => handleModalOpen("rejected", purchase)}
                color="error"
                variant="contained"
                size="small"
              >
                უარყოფა
              </Button>
            </div>
          )
        },
      },
    ],
    [canApproveRequest, getUserDepartmentId]
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
      field: "branches",
      label: "ფილიალები",
    },
  ]

  const ExpandedRowContent = rowData => {
    if (!rowData) return null

    const handleDownloadFile = async purchaseId => {
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
        label: "ფილიალები",
        value: rowData?.branches?.map(branch => branch).join(", ") || "N/A",
        icon: <BiBuilding />,
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
            onClick={() => handleDownloadFile(rowData.id)}
            className="btn btn-link btn-sm p-0 text-primary"
          >
            ჩამოტვირთვა
          </button>
        ) : (
          "N/A"
        ),
        icon: <BiDownload />,
      },
      {
        label: "პროდუქტების სია დანართში",
        value: rowData?.has_products_attachment ? (
          <span className="badge bg-info">დიახ</span>
        ) : (
          <span className="badge bg-secondary">არა</span>
        ),
        icon: <BiPackage />,
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
              <>
                <span className="text-muted">
                  <BiPackage className="me-1" />
                  {completedProductsCount}/{totalProductsCount} პროდუქტი
                  დასრულებული
                </span>
                {rowData.has_products_attachment && (
                  <span className="badge bg-warning text-dark">
                    <BiInfoCircle className="me-1" />
                    დანართში მითითებული პროდუქტების დამუშავება მიმდინარეობს
                  </span>
                )}
              </>
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
            <div className="mt-3">
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
              {rowData.has_products_attachment &&
                rowData.products.every(p => p.status === "completed") &&
                rowData.status === "pending products completion" && (
                  <div className="mt-2 text-warning">
                    <small>
                      <BiInfoCircle className="me-1" />
                      სასწრაფო პროდუქტები დასრულებულია. გთხოვთ დაასრულოთ
                      დანართში მითითებული პროდუქტების დამუშავება.
                    </small>
                  </div>
                )}
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
      if (!rowData?.products?.length) {
        if (
          getUserDepartmentId() === 7 &&
          rowData.status === "pending products completion"
        ) {
          return (
            <Card className="shadow-sm">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <BiPackage className="text-primary" size={24} />
                    <h6 className="mb-0">
                      {rowData.has_products_attachment
                        ? "პროდუქტები მითითებულია დანართში"
                        : "პროდუქტების სია ცარიელია"}
                    </h6>
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setSelectedProduct(null)
                      setSelectedPurchase(rowData)
                      setProductStatusModal(true)
                    }}
                  >
                    მოთხოვნის დასრულება
                  </Button>
                </div>
              </CardBody>
            </Card>
          )
        }
        return null
      }

      const showActions =
        getUserDepartmentId() === 7 &&
        rowData.status === "pending products completion"

      return (
        <Card className="shadow-sm">
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
                <BiPackage className="text-primary" size={24} />
                <h6 className="mb-0">
                  {rowData.has_products_attachment
                    ? "სასწრაფო პროდუქტები (დამატებითი პროდუქტები მითითებულია დანართში)"
                    : "პროდუქტები"}
                </h6>
              </div>

              {rowData.status === "pending products completion" && (
                <div className="d-flex align-items-center gap-3">
                  {rowData.has_products_attachment && (
                    <div className="text-warning d-flex align-items-center gap-2">
                      <BiInfoCircle size={20} />
                      <small>
                        დასრულებისთვის საჭიროა დანართში მითითებული ყველა
                        პროდუქტის დამუშავება
                      </small>
                    </div>
                  )}
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
                </div>
              )}
            </div>

            {showActions && (
              <div className="mb-3">
                <div className="d-flex flex-wrap gap-2">
                  {rowData.products
                    .filter(product => product.status !== "completed")
                    .map((product, index) => (
                      <Button
                        key={index}
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => {
                          setSelectedProduct(product)
                          setSelectedPurchase(rowData)
                          setProductStatusModal(true)
                        }}
                      >
                        დაასრულე: {product.name}
                      </Button>
                    ))}
                  {rowData.has_products_attachment &&
                    rowData.products.every(p => p.status === "completed") && (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                          setSelectedProduct(null)
                          setSelectedPurchase(rowData)
                          setProductStatusModal(true)
                        }}
                      >
                        მოთხოვნის დასრულება
                      </Button>
                    )}
                </div>
              </div>
            )}

            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>
                      <div className="d-flex align-items-center gap-2">
                        <BiBuilding /> <span>ფილიალები</span>
                      </div>
                    </th>
                    <th>
                      <div className="d-flex align-items-center gap-2">
                        <BiLabel /> <span>სახელი</span>
                      </div>
                    </th>
                    <th>
                      <div className="d-flex align-items-center gap-2">
                        <BiHash /> <span>რაოდენობა</span>
                      </div>
                    </th>
                    <th>
                      <div className="d-flex align-items-center gap-2">
                        <BiRuler /> <span>ზომები</span>
                      </div>
                    </th>
                    <th>
                      <div className="d-flex align-items-center gap-2">
                        <BiText /> <span>აღწერა</span>
                      </div>
                    </th>
                    <th>
                      <div className="d-flex align-items-center gap-2">
                        <BiWallet /> <span>გადამხდელი</span>
                      </div>
                    </th>
                    <th>
                      <div className="d-flex align-items-center gap-2">
                        <BiStore /> <span>მოძიებული ვარიანტი</span>
                      </div>
                    </th>
                    <th>
                      <div className="d-flex align-items-center gap-2">
                        <BiTime /> <span>ანალოგიური შესყიდვა</span>
                      </div>
                    </th>
                    <th>
                      <div className="d-flex align-items-center gap-2">
                        <BiBox /> <span>ასორტიმენტში</span>
                      </div>
                    </th>
                    <th>
                      <div className="d-flex align-items-center gap-2">
                        <BiFlag /> <span>სტატუსი</span>
                      </div>
                    </th>
                    <th>
                      <div className="d-flex align-items-center gap-2">
                        <BiComment /> <span>კომენტარი</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rowData.products.map((product, idx) => (
                    <tr key={idx}>
                      <td>
                        {product?.branches?.length > 0
                          ? product.branches.join(", ")
                          : "N/A"}
                      </td>
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
                ? purchaseData || []
                : departmentPurchaseData?.data || []
            }
            filterOptions={filterOptions}
            enableSearch={true}
            isLoading={
              isAdmin() || getUserDepartmentId() === 7
                ? isPurchasesLoading
                : isDepartmentPurchaseLoading
            }
            renderRowDetails={ExpandedRowContent}
            rowClassName="cursor-pointer hover:bg-gray-50"
          />
        </div>
      </div>

      <Modal
        isOpen={rejectionModal}
        toggle={() => setRejectionModal(false)}
        centered
        className="modal-dialog-centered"
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h5 className="text-lg font-medium">უარყოფის მიზეზი</h5>
          </div>
          <div className="p-4">
            <Form onSubmit={handleRejectionSubmit}>
              <FormGroup>
                <Label className="mb-2">კომენტარი</Label>
                <Input
                  type="textarea"
                  value={rejectionComment}
                  onChange={e => setRejectionComment(e.target.value)}
                  rows="4"
                  className="w-full rounded-lg"
                />
              </FormGroup>
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  type="button"
                  color="secondary"
                  onClick={() => setRejectionModal(false)}
                  className="px-4 py-2"
                >
                  გაუქმება
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isStatusUpdateLoading}
                  className="px-4 py-2"
                >
                  {isStatusUpdateLoading ? "მიმდინარეობს..." : "დადასტურება"}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={confirmModal}
        toggle={() => setConfirmModal(false)}
        centered
        className="modal-dialog-centered"
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <h5 className="text-lg font-medium mb-4">დაადასტურეთ მოქმედება</h5>
            <p className="text-gray-600">
              ნამდვილად გსურთ მოთხოვნის დადასტურება?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                color="secondary"
                onClick={() => setConfirmModal(false)}
                className="px-4 py-2"
              >
                გაუქმება
              </Button>
              <Button
                color="primary"
                onClick={handleConfirmAction}
                disabled={isStatusUpdateLoading}
                className="px-4 py-2"
              >
                {isStatusUpdateLoading ? "მიმდინარეობს..." : "დადასტურება"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={productStatusModal}
        toggle={() => setProductStatusModal(false)}
        centered
        className="modal-dialog-centered"
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h5 className="text-lg font-medium">
              {selectedProduct
                ? "პროდუქტის სტატუსის შეცვლა"
                : "მოთხოვნის დასრულება"}
            </h5>
          </div>
          <div className="p-4">
            <Form>
              <FormGroup>
                <Label for="productComment">
                  {selectedProduct
                    ? "კომენტარი"
                    : "დასრულების კომენტარი (სავალდებულო)"}
                </Label>
                <Input
                  type="textarea"
                  id="productComment"
                  value={productComment}
                  onChange={e => setProductComment(e.target.value)}
                  placeholder={
                    selectedProduct
                      ? "შეიყვანეთ კომენტარი..."
                      : "მიუთითეთ დასრულების კომენტარი..."
                  }
                  rows={4}
                  required
                  disabled={isProductUpdateLoading || isStatusUpdateLoading}
                />
              </FormGroup>

              {selectedProduct && (
                <FormGroup>
                  <Label for="fileUpload">ატვირთეთ ფაილი</Label>
                  <Input
                    type="file"
                    id="fileUpload"
                    onChange={e => {
                      const file = e.target.files[0]
                      if (file && file.size > 10 * 1024 * 1024) {
                        alert("ფაილის ზომა არ უნდა აღემატებოდეს 10MB-ს")
                        e.target.value = ""
                        setSelectedFile(null)
                        return
                      }
                      setSelectedFile(file)
                    }}
                    disabled={isProductUpdateLoading}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    required={true}
                  />
                  <small className="text-muted">
                    მაქსიმალური ზომა: 10MB. დაშვებული ფორმატები: PDF, DOC, DOCX,
                    XLS, XLSX, JPG, JPEG, PNG
                  </small>
                </FormGroup>
              )}

              <div className="flex justify-end gap-3 mt-4">
                {selectedProduct ? (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() =>
                      handleProductStatusChange(
                        selectedProduct?.id,
                        "completed"
                      )
                    }
                    disabled={
                      !productComment.trim() ||
                      isProductUpdateLoading ||
                      !selectedFile
                    }
                    className="px-4 py-2"
                  >
                    {isProductUpdateLoading ? "მიმდინარეობს..." : "დასრულება"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                      if (!productComment.trim()) {
                        alert("კომენტარი სავალდებულოა")
                        return
                      }
                      updatePurchaseStatus(
                        {
                          id: selectedPurchase.id,
                          status: "completed",
                          comment: productComment,
                        },
                        {
                          onSuccess: () => {
                            setProductStatusModal(false)
                            setProductComment("")
                            setSelectedPurchase(null)
                          },
                          onError: err => {
                            console.error("Error completing request:", err)
                            alert(
                              err.response?.data?.message ||
                                "შეცდომა მოთხოვნის დასრულებისას"
                            )
                          },
                        }
                      )
                    }}
                    disabled={!productComment.trim() || isStatusUpdateLoading}
                    className="px-4 py-2"
                  >
                    {isStatusUpdateLoading ? "მიმდინარეობს..." : "დასრულება"}
                  </Button>
                )}

                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setProductStatusModal(false)
                    setProductComment("")
                    setSelectedProduct(null)
                  }}
                  className="px-4 py-2"
                >
                  გაუქმება
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default PurchasePageApprove
