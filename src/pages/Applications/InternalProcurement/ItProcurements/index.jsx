import React, { useMemo, useState, useCallback } from "react"
import { CrmTable } from "components/CrmTable"
import {
  useGetITPurchases,
  useUpdatePurchaseReviewStatus,
} from "../../../../queries/purchase"
import useAuth from "hooks/useAuth"
import ProductsList from "./ProductsList"
import { downloadPurchase } from "../../../../services/purchase"
import CrmDialog, { DialogButton } from "components/CrmDialogs/Dialog"
import { BiInfoCircle } from "react-icons/bi"

const statusMap = {
  "pending department head": {
    label: "განხილვაში (დეპარტამენტის უფროსი)",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  },
  "pending IT team review": {
    label: "განხილვაში (IT გუნდი)",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  },
  "pending requested department": {
    label: "განხილვაში (მოთხოვნილი დეპარტამენტი)",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  },
  "pending products completion": {
    label: "პროდუქტების დასრულების მოლოდინში",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  },
  completed: {
    label: "დასრულებული",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  },
  rejected: {
    label: "უარყოფილი",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  },
}

const ItProcurements = () => {
  document.title = "IT შესყიდვების განხილვა | Gorgia LLC"
  const [selectedPurchase, setSelectedPurchase] = useState(null)
  const [reviewComment, setReviewComment] = useState("")
  const [attachmentFile, setAttachmentFile] = useState(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)

  const { isAdmin, isITDepartment } = useAuth()
  const { mutate: updatePurchaseReview, isLoading: isReviewLoading } =
    useUpdatePurchaseReviewStatus()

  const { data: purchaseData } = useGetITPurchases({
    enabled: isAdmin() || isITDepartment(),
  })

  console.log(purchaseData)

  const handleDownloadAttachment = useCallback(async purchaseId => {
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
  }, [])

  const handleReviewPurchase = useCallback(() => {
    if (!selectedPurchase) return

    const data = {
      review_comment: reviewComment || null,
      file: attachmentFile,
    }

    updatePurchaseReview(
      {
        id: selectedPurchase.id,
        data,
      },
      {
        onSuccess: () => {
          setIsReviewDialogOpen(false)
          setReviewComment("")
          setAttachmentFile(null)
          setSelectedPurchase(null)
        },
        onError: err => {
          console.error("Error reviewing purchase:", err)
          alert(err.response?.data?.message || "შეცდომა განხილვის ატვირთვისას")
        },
      }
    )
  }, [selectedPurchase, reviewComment, attachmentFile, updatePurchaseReview])

  const handleCloseReviewDialog = useCallback(() => {
    setIsReviewDialogOpen(false)
    setReviewComment("")
    setAttachmentFile(null)
    setSelectedPurchase(null)
  }, [])

  const columns = useMemo(
    () => [
      {
        id: "expander",
        header: "",
        cell: ({ row }) => {
          const isPendingITReview = row.original.status === "pending IT team review";
          return (
            <button
              onClick={row.getToggleExpandedHandler()}
              className="px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              style={{ visibility: isPendingITReview ? "visible" : "hidden" }}
            >
              {row.getIsExpanded() ? "▼" : "▶"}
            </button>
          );
        },
      },
      {
        id: "id",
        accessorFn: row => row.id,
        cell: info => info.getValue(),
        header: () => <span>#</span>,
        enableColumnFilter: false,
        sortingFn: "basic",
        sortDescFirst: true,
      },
      {
        id: "requester",
        accessorFn: row => row.requester,
        header: () => <span>მოითხოვა</span>,
        cell: info => {
          const requester = info.getValue()
          return (
            <div>
              <div className="text-gray-900 dark:text-gray-100">
                {requester?.name} {requester?.sur_name}
              </div>
              <small className="text-gray-500 dark:text-gray-400">
                {requester?.department?.name || "N/A"}
              </small>
            </div>
          )
        },
        meta: {
          filterVariant: "text",
        },
        enableSorting: false,
      },
      {
        id: "procurement_type",
        accessorKey: "procurement_type",
        header: () => <span>შესყიდვის ტიპი</span>,
        cell: info => {
          const value = info.getValue()
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              {value === "purchase"
                ? "შესყიდვა"
                : value === "price_inquiry"
                  ? "ფასის მოკვლევა"
                  : "მომსახურება"}
            </span>
          )
        },
        enableSorting: false,
      },
      {
        id: "branches",
        accessorKey: "branches",
        header: () => <span>ფილიალები</span>,
        cell: info => {
          const branches = info.getValue()
          return (
            <div className="flex flex-wrap gap-1">
              {Array.isArray(branches) &&
                branches.map((branch, index) => (
                  <span
                    key={`${branch}-${index}`}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                  >
                    {branch}
                  </span>
                ))}
            </div>
          )
        },
        meta: {
          filterVariant: "text",
        },
        enableSorting: false,
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: () => <span>მოთხოვნის თარიღი</span>,
        cell: info => {
          const value = info.getValue()
          return (
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <i className="bx bx-calendar mr-2"></i>
              {value ? new Date(value).toLocaleDateString() : "N/A"}
            </div>
          )
        },
        enableColumnFilter: false,
        sortingFn: "datetime",
        sortDescFirst: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: () => <span>სტატუსი</span>,
        cell: info => {
          const value = info.getValue()
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusMap[value]?.color ||
                "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                }`}
            >
              {statusMap[value]?.label || value}
            </span>
          )
        },
        enableSorting: false,
      },
      {
        id: "purchase_purpose",
        accessorKey: "purchase_purpose",
        header: () => <span>მიზანი</span>,
        cell: info => (
          <div className="text-gray-900 dark:text-gray-100">
            {info.getValue() || "N/A"}
          </div>
        ),
        meta: {
          filterVariant: "text",
        },
        enableSorting: false,
      },
    ],
    []
  )

  const renderExpandedRow = useCallback(
    row => {
      const details = [
        {
          label: "ფილიალები",
          value: row?.branches?.join(", ") || "N/A",
          icon: "bx-building",
        },
        {
          label: "მომთხოვნი",
          value: `${row?.requester?.name} ${row?.requester?.sur_name}`,
          icon: "bx-user",
        },
        {
          label: "მომთხოვნის დეპარტამენტი",
          value: row?.requester?.department?.name || "N/A",
          icon: "bx-user",
        },
        {
          label: "მომთხოვნის ხელმძღვანელი",
          value: row?.responsible_for_purchase
            ? `${row.responsible_for_purchase.name} ${row.responsible_for_purchase.sur_name}`
            : "N/A",
          icon: "bx-user-check",
        },
      ]

      const canCompleteReview =
        row.status === "pending IT team review" &&
        (!row.products?.length ||
          row.products?.every(p => p.review_status === "reviewed"))

      return (
        <div className="p-4 bg-white dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {details.map((detail, index) => (
              <div key={index} className="flex items-center gap-2">
                <i className={`bx ${detail.icon} text-gray-400`}></i>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {detail.label}
                  </div>
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {detail.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-4">
            {row.has_products_attachment && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownloadAttachment(row.id)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                >
                  პროდუქტების სიის ჩამოტვირთვა
                </button>
                {row.status === "pending IT team review" && (
                  <span className="text-sm text-gray-500">
                    <BiInfoCircle className="inline-block mr-1" />
                    შეგიძლიათ განახლებული სია ატვირთოთ განხილვის დასრულებისას
                  </span>
                )}
              </div>
            )}
            {canCompleteReview && (
              <button
                onClick={() => {
                  setSelectedPurchase(row)
                  setIsReviewDialogOpen(true)
                }}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors"
              >
                განხილვის დასრულება
              </button>
            )}
          </div>

          {row.products && row.products.length > 0 && (
            <>
              {row.status === "pending IT team review" &&
                !row.products.every(p => p.review_status === "reviewed") && (
                  <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <BiInfoCircle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm">
                          განხილვის დასრულებამდე საჭიროა ყველა პროდუქტის
                          განხილვა
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              <ProductsList purchase={row} />
            </>
          )}
        </div>
      )
    },
    [handleDownloadAttachment]
  )

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        <CrmTable
          columns={columns}
          data={Array.isArray(purchaseData) ? purchaseData : []}
          size="sm"
          defaultSortBy={[{ id: "created_at", desc: true }]}
          renderSubComponent={({ row }) => renderExpandedRow(row.original)}
          getRowCanExpand={() => true}
        />
      </div>

      <CrmDialog
        isOpen={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
        title="შესყიდვის განხილვის დასრულება"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              განხილვის კომენტარი
            </label>
            <textarea
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              rows={3}
              placeholder="შეიყვანეთ კომენტარი (არასავალდებულო)..."
            />
          </div>

          {selectedPurchase?.has_products_attachment && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  განახლებული პროდუქტების სია
                </label>
                <button
                  type="button"
                  onClick={() => handleDownloadAttachment(selectedPurchase.id)}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  არსებული სიის ჩამოტვირთვა
                </button>
              </div>
              <input
                type="file"
                onChange={e => {
                  const file = e.target.files[0]
                  if (file) {
                    const extension = file.name.split(".").pop().toLowerCase()
                    if (!["xls", "xlsx"].includes(extension)) {
                      alert("დაშვებულია მხოლოდ Excel ფაილები (xls, xlsx)")
                      e.target.value = ""
                      setAttachmentFile(null)
                      return
                    }
                    if (file.size > 10 * 1024 * 1024) {
                      alert("ფაილის ზომა არ უნდა აღემატებოდეს 10MB-ს")
                      e.target.value = ""
                      setAttachmentFile(null)
                      return
                    }
                    setAttachmentFile(file)
                  }
                }}
                accept=".xls,.xlsx"
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                  file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-100"
              />
              <small className="text-gray-500 dark:text-gray-400 mt-1 block">
                მაქსიმალური ზომა: 10MB. დაშვებული ფორმატები: XLS, XLSX
              </small>
              {!attachmentFile && (
                <small className="text-gray-500 dark:text-gray-400 mt-1 block">
                  <BiInfoCircle className="inline-block mr-1" />
                  ფაილის აუტვირთაობის შემთხვევაში არსებული სია დარჩება უცვლელი
                </small>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <DialogButton
              actionType="cancel"
              onClick={handleCloseReviewDialog}
            />
            <DialogButton
              actionType="approve"
              onClick={handleReviewPurchase}
              disabled={isReviewLoading}
            />
          </div>
        </div>
      </CrmDialog>
    </div>
  )
}

export default ItProcurements
