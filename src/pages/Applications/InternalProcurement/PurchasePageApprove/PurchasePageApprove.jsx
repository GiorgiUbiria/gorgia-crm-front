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
  BiCog,
  BiPhone,
  BiNote,
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
      const nextStatus = getNextStatus(selectedPurchase)
      const response = await updatePurchaseStatus(
        selectedPurchase.id,
        nextStatus
      )

      if (response.data.success) {
        await fetchPurchases()
        setConfirmModal(false)
        setSelectedPurchase(null)
      }
    } catch (err) {
      console.error("Error updating purchase status:", err)
    }
  }

  const handleRejectionSubmit = async () => {
    try {
      const response = await updatePurchaseStatus(
        selectedPurchase.id,
        "rejected",
        rejectionComment
      )
      if (response.data.success) {
        await fetchPurchases()
        setRejectionModal(false)
        setRejectionComment("")
        setSelectedPurchase(null)
      }
    } catch (err) {
      console.error("Error rejecting purchase:", err)
    }
  }

  const handleProductStatusChange = async (productId, newStatus) => {
    try {
      const response = await updateProductStatus(
        selectedPurchase.id,
        productId,
        newStatus,
        productComment
      )
      if (response.data?.data) {
        await fetchPurchases()
        setProductStatusModal(false)
        setProductComment("")
        setSelectedProduct(null)
        setSelectedPurchase(null)
      }
    } catch (err) {
      console.error("Error updating product status:", err)
      alert(
        err.response?.data?.message || "შეცდომა პროდუქტის სტატუსის განახლებისას"
      )
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
                    {canManageProducts(rowData) && (
                      <th>
                        <BiCog /> მოქმედებები
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

      <Modal isOpen={confirmModal} toggle={() => setConfirmModal(false)}>
        <ModalHeader toggle={() => setConfirmModal(false)}>
          დაადასტურეთ მოქმედება
        </ModalHeader>

        <ModalBody className="text-center">
          <BiQuestionMark className="text-warning" size={48} />

          <p className="mb-4">
            დარწმუნებული ხართ, რომ გსურთ შესყიდვის მოთხოვნის დამტკიცება?
            {selectedPurchase && (
              <small className="d-block text-muted mt-2">
                შემდეგი სტატუსი იქნება:{" "}
                {statusMap[getNextStatus(selectedPurchase)]?.label}
              </small>
            )}
          </p>

          <div className="d-flex justify-content-center gap-2">
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmAction}
              startIcon={<BiCheck />}
            >
              დადასტურება
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setConfirmModal(false)}
              startIcon={<BiX />}
            >
              გაუქმება
            </Button>
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={rejectionModal} toggle={() => setRejectionModal(false)}>
        <ModalHeader toggle={() => setRejectionModal(false)}>
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
              />
            </FormGroup>
          </Form>

          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="contained"
              color="error"
              onClick={handleRejectionSubmit}
              disabled={!rejectionComment.trim()}
              startIcon={<BiXCircle />}
            >
              უარყოფა
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setRejectionModal(false)}
              startIcon={<BiArrowBack />}
            >
              გაუქმება
            </Button>
          </div>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={productStatusModal}
        toggle={() => setProductStatusModal(false)}
      >
        <ModalHeader toggle={() => setProductStatusModal(false)}>
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
              />
            </FormGroup>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button
                variant="contained"
                color="success"
                onClick={() =>
                  handleProductStatusChange(selectedProduct?.id, "completed")
                }
                disabled={!productComment.trim()}
              >
                დასრულება
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setProductStatusModal(false)

                  setProductComment("")

                  setSelectedProduct(null)
                }}
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
