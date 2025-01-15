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
  BiCog,
  BiComment,
  BiMessageAltX,
} from "react-icons/bi"
import { usePermissions } from "../../../../hooks/usePermissions"
import MuiTable from "../../../../components/Mui/MuiTable"
import Button from "@mui/material/Button"
import {
  useGetPurchaseList,
  useUpdatePurchaseStatus,
  useUpdateProductStatus,
  useGetDepartmentPurchases,
} from "../../../../queries/purchase"

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
    userDepartmentId,
    isAdmin,
  } = usePermissions()

  const [rejectionModal, setRejectionModal] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState(null)
  const [rejectionComment, setRejectionComment] = useState("")
  const [confirmModal, setConfirmModal] = useState(false)
  const [productStatusModal, setProductStatusModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productComment, setProductComment] = useState("")

  const canViewTable = useMemo(() => {
    return (
      isAdmin ||
      isDepartmentHead ||
      isDepartmentHeadAssistant ||
      userDepartmentId === 7
    )
  }, [isAdmin, isDepartmentHead, isDepartmentHeadAssistant, userDepartmentId])

  const { data: purchaseData, isLoading: isPurchasesLoading } =
    useGetPurchaseList(true)

  const { mutate: updatePurchaseStatus, isLoading: isStatusUpdateLoading } =
    useUpdatePurchaseStatus()

  const {
    data: departmentPurchaseData,
    isLoading: isDepartmentPurchaseLoading,
  } = useGetDepartmentPurchases()

  console.log(purchaseData, departmentPurchaseData)

  const { mutate: updateProductStatus, isLoading: isProductUpdateLoading } =
    useUpdateProductStatus()

  const canManageProducts = useCallback(
    purchase => {
      return (
        isAdmin ||
        (userDepartmentId === 7 &&
          purchase.status === "pending products completion")
      )
    },
    [isAdmin, userDepartmentId]
  )

  const canApproveRequest = useCallback(
    purchase => {
      // Completed or Rejected can't
      if (purchase.status === "completed" || purchase.status === "rejected")
        return false

      // Admin can always
      if (isAdmin) return true

      // Department head only
      if (!isDepartmentHead) return false

      const purchaseCategory = purchase.category
      const requesterDepartmentId = purchase.requester?.department_id
      const categoryDepartmentId = categoryDepartmentMap[purchaseCategory]

      switch (purchase.status) {
        case "pending department head":
          return userDepartmentId === requesterDepartmentId
        case "pending requested department":
          return userDepartmentId === categoryDepartmentId
        default:
          return false
      }
    },
    [isDepartmentHead, userDepartmentId, isAdmin]
  )

  const getNextStatus = purchase => {
    const skipFirstStep = false

    switch (purchase.status) {
      case "pending department head":
        return skipFirstStep
          ? "pending products completion"
          : "pending requested department"

      case "pending requested department":
        return "pending products completion"

      case "pending products completion":
        return purchase.products?.every(p => p.status === "completed")
          ? "completed"
          : purchase.status

      default:
        return purchase.status
    }
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
    updateProductStatus(
      {
        purchaseId: selectedPurchase.id,
        productId,
        status: newStatus,
        comment: productComment,
      },
      {
        onSuccess: () => {
          setProductStatusModal(false)
          setProductComment("")
          setSelectedProduct(null)
          setSelectedPurchase(null)
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
          if (!canApproveRequest(purchase)) return null

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
    [canApproveRequest]
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
                    {canManageProducts(rowData) && (
                      <th>
                        <div className="d-flex align-items-center gap-2">
                          <BiCog /> <span>მოქმედებები</span>
                        </div>
                      </th>
                    )}
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
                      {canManageProducts(rowData) && (
                        <td>
                          {product?.status !== "completed" && (
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => {
                                setSelectedProduct(product)
                                setSelectedPurchase(rowData)
                                setProductStatusModal(true)
                              }}
                              startIcon={<BiCheckCircle />}
                            >
                              დასრულება
                            </Button>
                          )}
                        </td>
                      )}
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
              (isAdmin || userDepartmentId === 7)
                ? purchaseData?.data || []
                : departmentPurchaseData?.data || []
            }
            filterOptions={filterOptions}
            enableSearch={true}
            isLoading={
              isAdmin ? isPurchasesLoading : isDepartmentPurchaseLoading
            }
            renderRowDetails={ExpandedRowContent}
            rowClassName="cursor-pointer hover:bg-gray-50"
          />
        </div>
      </div>

      {/* Modals */}
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
            <h5 className="text-lg font-medium">პროდუქტის სტატუსის შეცვლა</h5>
          </div>
          <div className="p-4">
            <Form>
              <FormGroup>
                <Label for="productComment">კომენტარი</Label>
                <Input
                  type="textarea"
                  id="productComment"
                  value={productComment}
                  onChange={e => setProductComment(e.target.value)}
                  placeholder="შეიყვანეთ კომენტარი..."
                  rows={4}
                  required
                  disabled={isProductUpdateLoading}
                />
              </FormGroup>

              <div className="flex justify-end gap-3 mt-4">
                <Button
                  variant="contained"
                  color="success"
                  onClick={() =>
                    handleProductStatusChange(selectedProduct?.id, "completed")
                  }
                  disabled={!productComment.trim() || isProductUpdateLoading}
                  className="px-4 py-2"
                >
                  {isProductUpdateLoading ? "მიმდინარეობს..." : "დასრულება"}
                </Button>

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
