import React, { useEffect, useState, useMemo, useCallback } from "react"
import {
  Row,
  Col,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Card,
  CardBody,
} from "reactstrap"
import {
  BiQuestionMark,
  BiCheck,
  BiX,
  BiXCircle,
  BiArrowBack,
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
import Breadcrumbs from "../../../../components/Common/Breadcrumb"
import {
  getPurchaseList,
  updatePurchaseStatus,
  updateProductStatus,
} from "../../../../services/purchase"
import { usePermissions } from "../../../../hooks/usePermissions"
import MuiTable from "../../../../components/Mui/MuiTable"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"

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
  const { isDepartmentHead, userDepartmentId, isAdmin } = usePermissions()

  const [purchases, setPurchases] = useState([])
  const [rejectionModal, setRejectionModal] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState(null)
  const [rejectionComment, setRejectionComment] = useState("")
  const [confirmModal, setConfirmModal] = useState(false)
  const [productStatusModal, setProductStatusModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productComment, setProductComment] = useState("")
  const [isStatusUpdateLoading, setIsStatusUpdateLoading] = useState(false)
  const [isProductUpdateLoading, setIsProductUpdateLoading] = useState(false)

  const canViewTable = useMemo(() => {
    return isAdmin || isDepartmentHead || userDepartmentId === 17
  }, [isAdmin, isDepartmentHead, userDepartmentId])

  const fetchPurchases = async () => {
    try {
      const response = await getPurchaseList(true)
      console.log("Purchase data:", response.data)
      if (response.data?.data) {
        setPurchases(response.data.data)
      }
    } catch (err) {
      console.error("Error fetching purchase requests:", err)
    }
  }

  useEffect(() => {
    if (canViewTable) {
      fetchPurchases()
    }
  }, [canViewTable])

  const canManageProducts = useCallback(
    purchase => {
      return (
        isAdmin ||
        (userDepartmentId === 17 &&
          purchase.status === "pending products completion")
      )
    },
    [isAdmin, userDepartmentId]
  )

  const canApproveRequest = useCallback(
    purchase => {
      if (purchase.status === "completed" || purchase.status === "rejected")
        return false
      if (isAdmin) return true
      if (!isDepartmentHead) return false

      const purchaseCategory = purchase.category
      const requesterDepartmentId = purchase.requester?.department_id
      const categoryDepartmentId = categoryDepartmentMap[purchaseCategory]

      const skipFirstStep = requesterDepartmentId === categoryDepartmentId

      switch (purchase.status) {
        case "pending department head":
          return userDepartmentId === requesterDepartmentId && !skipFirstStep
        case "pending requested department":
          return userDepartmentId === categoryDepartmentId
        default:
          return false
      }
    },
    [isDepartmentHead, userDepartmentId, isAdmin]
  )

  const getNextStatus = purchase => {
    const requesterDepartmentId = purchase.requester?.department_id
    const categoryDepartmentId = categoryDepartmentMap[purchase.category]
    const skipFirstStep = requesterDepartmentId === categoryDepartmentId

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

  const handleConfirmAction = async () => {
    try {
      setIsStatusUpdateLoading(true)
      const nextStatus = getNextStatus(selectedPurchase)
      const response = await updatePurchaseStatus(
        selectedPurchase.id,
        nextStatus
      )

      console.log("Response:", response)

      if (response.status === 200) {
        setSelectedPurchase(null)
        setConfirmModal(false)
        await fetchPurchases()
      }
    } catch (err) {
      console.error("Error updating purchase status:", err)
      alert(err.response?.data?.message || "შეცდომა სტატუსის განახლებისას")
    } finally {
      setIsStatusUpdateLoading(false)
    }
  }

  const handleRejectionSubmit = async () => {
    try {
      setIsStatusUpdateLoading(true)
      const response = await updatePurchaseStatus(
        selectedPurchase.id,
        "rejected",
        rejectionComment
      )
      if (response.data.success) {
        setRejectionModal(false)
        setRejectionComment("")
        setSelectedPurchase(null)
        await fetchPurchases()
      }
    } catch (err) {
      console.error("Error rejecting purchase:", err)
      alert(err.response?.data?.message || "შეცდომა უარყოფისას")
    } finally {
      setIsStatusUpdateLoading(false)
    }
  }

  const handleProductStatusChange = async (productId, newStatus) => {
    try {
      setIsProductUpdateLoading(true)
      const response = await updateProductStatus(
        selectedPurchase.id,
        productId,
        newStatus,
        productComment
      )
      if (response.data?.data) {
        setProductStatusModal(false)
        setProductComment("")
        setSelectedProduct(null)
        setSelectedPurchase(null)
        await fetchPurchases()
      }
    } catch (err) {
      console.error("Error updating product status:", err)
      alert(
        err.response?.data?.message || "შეცდომა პროდუქტის სტატუსის განახლებისას"
      )
    } finally {
      setIsProductUpdateLoading(false)
    }
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
      console.log(rowData.products)

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

  return (
    <React.Fragment>
      <div className="page-content mb-4">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs
                title="განცხადებები"
                breadcrumbItem="შიდა შესყიდვების ვიზირება"
              />
            </Col>
          </Row>
          {canViewTable ? (
            <Row>
              <MuiTable
                data={purchases}
                columns={columns}
                filterOptions={filterOptions}
                enableSearch={true}
                searchableFields={["branch"]}
                initialPageSize={10}
                renderRowDetails={ExpandedRowContent}
              />
            </Row>
          ) : (
            <Row>
              <Col>
                <div className="text-center p-5">
                  <h4>თქვენ არ გაქვთ წვდომა ამ გვერდზე</h4>
                </div>
              </Col>
            </Row>
          )}
        </div>
      </div>

      <Modal
        isOpen={confirmModal}
        toggle={() => !isStatusUpdateLoading && setConfirmModal(false)}
      >
        <ModalHeader
          toggle={() => !isStatusUpdateLoading && setConfirmModal(false)}
        >
          დაადასტურეთ მოქმედება
        </ModalHeader>
        <ModalBody className="text-center">
          <div className="d-flex flex-column align-items-center">
            <BiQuestionMark className="text-warning mb-3" size={48} />

            <p className="mb-4">
              დარწმუნებული ხართ, რომ გსურთ შესყიდვის მოთხოვნის დამტკიცება?
              {selectedPurchase && (
                <small className="d-block text-muted mt-2">
                  შემდეგი სტატუსი იქნება:{" "}
                  {statusMap[getNextStatus(selectedPurchase)]?.label}
                </small>
              )}
            </p>

            <div className="d-flex justify-content-center gap-3">
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmAction}
                disabled={isStatusUpdateLoading}
                startIcon={
                  isStatusUpdateLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <BiCheck />
                  )
                }
              >
                {isStatusUpdateLoading ? "მიმდინარეობს..." : "დადასტურება"}
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setConfirmModal(false)}
                disabled={isStatusUpdateLoading}
                startIcon={<BiX />}
              >
                გაუქმება
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={rejectionModal}
        toggle={() => !isStatusUpdateLoading && setRejectionModal(false)}
      >
        <ModalHeader
          toggle={() => !isStatusUpdateLoading && setRejectionModal(false)}
        >
          <BiXCircle className="text-danger me-2" size={24} />
          უარყოფის მიზეზი
        </ModalHeader>

        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="rejectionComment" className="fw-bold mb-2">
                გთხოვთ მიუთითოთ უარყოფის მიზეზი
              </Label>

              <Input
                type="textarea"
                name="rejectionComment"
                id="rejectionComment"
                value={rejectionComment}
                onChange={e => setRejectionComment(e.target.value)}
                rows="4"
                required
                className="mb-3"
                placeholder="შეიყვანეთ უარყოფის დეტალური მიზეზი..."
                disabled={isStatusUpdateLoading}
              />
            </FormGroup>
          </Form>

          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="contained"
              color="error"
              onClick={handleRejectionSubmit}
              disabled={!rejectionComment.trim() || isStatusUpdateLoading}
              startIcon={
                isStatusUpdateLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <BiXCircle />
                )
              }
            >
              {isStatusUpdateLoading ? "მიმდინარეობს..." : "უარყოფა"}
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setRejectionModal(false)}
              disabled={isStatusUpdateLoading}
              startIcon={<BiArrowBack />}
            >
              გაუქმება
            </Button>
          </div>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={productStatusModal}
        toggle={() => !isProductUpdateLoading && setProductStatusModal(false)}
      >
        <ModalHeader
          toggle={() => !isProductUpdateLoading && setProductStatusModal(false)}
        >
          პროდუქტის სტატუსის შეცვლა
        </ModalHeader>

        <ModalBody>
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

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button
                variant="contained"
                color="success"
                onClick={() =>
                  handleProductStatusChange(selectedProduct?.id, "completed")
                }
                disabled={!productComment.trim() || isProductUpdateLoading}
                startIcon={
                  isProductUpdateLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <BiCheck />
                  )
                }
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
                disabled={isProductUpdateLoading}
                startIcon={<BiArrowBack />}
              >
                გაუქმება
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default PurchasePageApprove
