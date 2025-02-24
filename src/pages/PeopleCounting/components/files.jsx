import React from "react"
import { useGetUploadedFiles } from "queries/peopleCounting"
import { format } from "date-fns"
import { CrmTable } from "components/CrmTable"
import { Download } from "lucide-react"
import { toast } from "store/zustand/toastStore"
import defaultInstance from "../../../plugins/axios"

const UploadedFilesTable = () => {
  const { data: filesData, isLoading } = useGetUploadedFiles()

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await defaultInstance.get(
        `/api/people-counting/files/${fileId}/download`,
        {
          responseType: "blob",
        }
      )

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      })

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = fileName
      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("ფაილი წარმატებით ჩამოიტვირთა")
    } catch (error) {
      console.error("Download error:", error)
      const errorMessage =
        error.response?.data?.message || "ფაილის ჩამოტვირთვა ვერ მოხერხდა"
      toast.error(errorMessage)
    }
  }

  const columns = [
    {
      header: "ფაილის სახელი",
      accessorKey: "original_name",
      enableColumnFilter: false,
    },

    {
      header: "რეპორტის ტიპი",
      accessorKey: "report_type",
      cell: info => (info.getValue() === "monthly" ? "თვის" : "კვირის"),
      enableColumnFilter: false,
    },

    {
      header: "პერიოდი",
      accessorKey: "report_period",
      cell: info => format(new Date(info.getValue()), "dd/MM/yyyy"),
      enableColumnFilter: false,
    },

    {
      header: "სტატუსი",
      accessorKey: "status",
      cell: info => {
        const status = info.getValue()
        const statusMap = {
          pending: "მოლოდინში",
          processing: "მუშავდება",
          completed: "დასრულებული",
          failed: "შეცდომა",
        }
        const colorMap = {
          pending: "text-yellow-600",
          processing: "text-blue-600",
          completed: "text-green-600",
          failed: "text-red-600",
        }
        return <span className={colorMap[status]}>{statusMap[status]}</span>
      },
      enableColumnFilter: false,
    },

    {
      header: "ატვირთა",
      accessorKey: "user.name",
      enableColumnFilter: false,
    },

    {
      header: "ატვირთვის თარიღი",
      accessorKey: "created_at",
      cell: info => format(new Date(info.getValue()), "dd/MM/yyyy HH:mm"),
      enableColumnFilter: false,
    },

    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const { status, id, error_message, original_name } = row.original
        if (status === "completed") {
          return (
            <button
              onClick={() => handleDownload(id, original_name)}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 bg-transparent border-0 p-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              ჩამოტვირთვა
            </button>
          )
        }
        if (status === "failed" && error_message) {
          return (
            <span className="text-red-600" title={error_message}>
              {error_message}
            </span>
          )
        }
        return null
      },
      enableColumnFilter: false,
    },
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="bg-white dark:!bg-gray-800 rounded-xl shadow-lg">
      <CrmTable data={filesData?.data || []} columns={columns} size="lg" />
    </div>
  )
}

export default UploadedFilesTable
