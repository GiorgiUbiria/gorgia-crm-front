import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import defaultInstance from "plugins/axios"
import { format } from "date-fns"
import { Download, Loader2 } from "lucide-react"
import { toast } from "store/zustand/toastStore"

const getStatusConfig = status => {
  switch (status) {
    case "completed":
      return {
        label: "დასრულებული",
        className: "bg-green-100 text-green-800 dark:!bg-green-900 dark:!text-green-200",
      }
    case "processing":
      return {
        label: "მუშავდება",
        className: "bg-yellow-100 text-yellow-800 dark:!bg-yellow-900 dark:!text-yellow-200",
      }
    case "failed":
      return {
        label: "შეცდომა",
        className: "bg-red-100 text-red-800 dark:!bg-red-900 dark:!text-red-200",
      }
    default:
      return {
        label: "უცნობი",
        className: "bg-gray-100 text-gray-800 dark:!bg-gray-900 dark:!text-gray-200",
      }
  }
}

const UploadedFilesTable = () => {
  const [page, setPage] = useState(1)

  const { data: filesData, isLoading } = useQuery({
    queryKey: ["employee-contacts-files", page],
    queryFn: async () => {
      const { data } = await defaultInstance.get(
        "/api/employee-contacts/files",
        {
          params: { page },
        }
      )
      return data
    },
  })

  const handleDownload = async file => {
    try {
      const response = await defaultInstance.get(
        `/api/employee-contacts/files/${file.id}/download`,
        {
          responseType: "blob",
        }
      )

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", file.original_name)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      toast.error("შეცდომა ფაილის ჩამოტვირთვისას")
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 dark:!text-white mb-4">
        ატვირთული ფაილები
      </h2>

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300 dark:!divide-gray-700">
          <thead className="bg-gray-50 dark:!bg-gray-800">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:!text-gray-200 sm:pl-6"
              >
                ფაილის სახელი
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:!text-gray-200"
              >
                რეპორტის პერიოდი
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:!text-gray-200"
              >
                ატვირთა
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:!text-gray-200"
              >
                სტატუსი
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:!text-gray-200"
              >
                ატვირთვის თარიღი
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">ჩამოტვირთვა</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:!divide-gray-700 bg-white dark:!bg-gray-900">
            {filesData?.files?.data?.map(file => {
              const status = getStatusConfig(file.status)
              return (
                <tr key={file.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:!text-gray-200 sm:pl-6">
                    {file.original_name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:!text-gray-400">
                    {format(new Date(file.report_period), "MMMM yyyy")}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:!text-gray-400">
                    {file.user?.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold ${status.className}`}
                    >
                      {file.status === "processing" && (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      )}
                      {status.label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:!text-gray-400">
                    {format(new Date(file.created_at), "dd/MM/yyyy HH:mm")}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    {file.status === "completed" && (
                      <button
                        onClick={() => handleDownload(file)}
                        className="text-blue-600 hover:text-blue-900 dark:!text-blue-400 dark:!hover:text-blue-300"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filesData?.files?.last_page > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 dark:!border-gray-700 bg-white dark:!bg-gray-900 px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:!bg-gray-800 dark:!border-gray-600 dark:!text-gray-200"
            >
              წინა
            </button>
            <button
              onClick={() =>
                setPage(prev => Math.min(prev + 1, filesData.files.last_page))
              }
              disabled={page === filesData.files.last_page}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:!bg-gray-800 dark:!border-gray-600 dark:!text-gray-200"
            >
              შემდეგი
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:!text-gray-200">
                ნაჩვენებია{" "}
                <span className="font-medium">{filesData.files.from || 0}</span>{" "}
                -დან{" "}
                <span className="font-medium">{filesData.files.to || 0}</span>{" "}
                -მდე{" "}
                <span className="font-medium">{filesData.files.total}</span>{" "}
                -დან
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:!ring-gray-600 dark:!hover:bg-gray-800"
                >
                  <span className="sr-only">წინა</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    setPage(prev =>
                      Math.min(prev + 1, filesData.files.last_page)
                    )
                  }
                  disabled={page === filesData.files.last_page}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:!ring-gray-600 dark:!hover:bg-gray-800"
                >
                  <span className="sr-only">შემდეგი</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UploadedFilesTable
