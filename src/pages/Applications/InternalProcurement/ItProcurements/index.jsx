import React, { useMemo, useState } from "react"
import { CrmTable } from "components/CrmTable"
import {
  useGetPurchaseList,
  useUpdatePurchaseStatus,
} from "../../../../queries/purchase"
import useAuth from "hooks/useAuth"
import ProductsList from "./ProductsList"
import { downloadPurchase } from "../../../../services/purchase"
import CrmDialog, { DialogButton } from "components/CrmDialogs/Dialog"

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
  const [attachmentFile, setAttachmentFile] = useState(null)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)

  const { isAdmin, isITDepartment } = useAuth()
  const { mutate: updatePurchaseStatus } = useUpdatePurchaseStatus()

  const { data: purchaseData } = useGetPurchaseList(
    { category: "IT" },
    {
      enabled: isAdmin() || isITDepartment(),
    }
  )

  const handleDownloadAttachment = async purchaseId => {
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

  const handleUploadAttachment = () => {
    if (!attachmentFile || !selectedPurchase) return

    updatePurchaseStatus(
      {
        id: selectedPurchase.id,
        status: "pending requested department",
        comment: "განახლებული პროდუქტების სია",
        file: attachmentFile,
      },
      {
        onSuccess: () => {
          setIsUploadDialogOpen(false)
          setAttachmentFile(null)
          setSelectedPurchase(null)
        },
        onError: err => {
          console.error("Error uploading attachment:", err)
          alert(err.response?.data?.message || "შეცდომა ფაილის ატვირთვისას")
        },
      }
    )
  }

  const columns = useMemo(
    () => [
      {
        id: "expander",
        header: "",
        cell: ({ row }) => (
          <button
            onClick={row.getToggleExpandedHandler()}
            className="px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {row.getIsExpanded() ? "▼" : "▶"}
          </button>
        ),
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
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusMap[value]?.color ||
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

  const renderExpandedRow = row => {
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

        {row.has_products_attachment && (
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={() => handleDownloadAttachment(row.id)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              პროდუქტების სიის ჩამოტვირთვა
            </button>
            <button
              onClick={() => {
                setSelectedPurchase(row)
                setIsUploadDialogOpen(true)
              }}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors"
            >
              პროდუქტების სიის განახლება
            </button>
          </div>
        )}

        {row.products && row.products.length > 0 && (
          <ProductsList purchase={row} />
        )}
      </div>
    )
  }

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
        isOpen={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        title="პროდუქტების სიის განახლება"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              აირჩიეთ ფაილი
            </label>
            <input
              type="file"
              onChange={e => setAttachmentFile(e.target.files[0])}
              accept=".xls,.xlsx"
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-100"
            />
          </div>
          <div className="flex justify-end gap-2">
            <DialogButton
              actionType="cancel"
              onClick={() => {
                setIsUploadDialogOpen(false)
                setAttachmentFile(null)
                setSelectedPurchase(null)
              }}
            />
            <DialogButton
              actionType="approve"
              onClick={handleUploadAttachment}
              disabled={!attachmentFile}
            />
          </div>
        </div>
      </CrmDialog>
    </div>
  )
}

export default ItProcurements
