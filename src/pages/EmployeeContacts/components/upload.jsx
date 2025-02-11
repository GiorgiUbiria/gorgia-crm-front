import React, { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import defaultInstance from "plugins/axios"
import { format } from "date-fns"
import { toast } from "store/zustand/toastStore"
import { Loader2 } from "lucide-react"

const UploadEmployeeContactsForm = ({ onClose }) => {
  const [file, setFile] = useState(null)
  const [reportPeriod, setReportPeriod] = useState(
    format(new Date(), "yyyy-MM")
  )
  const queryClient = useQueryClient()

  const uploadMutation = useMutation({
    mutationFn: async formData => {
      const { data } = await defaultInstance.post(
        "/api/employee-contacts/upload/monthly",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      return data
    },
    onSuccess: data => {
      toast.success("ფაილი წარმატებით აიტვირთა და მუშავდება")
      
      // Start polling for file status
      const pollInterval = setInterval(async () => {
        try {
          const { data: fileData } = await defaultInstance.get(
            `/api/employee-contacts/files/${data.file.id}`
          )

          if (fileData.status === "completed") {
            clearInterval(pollInterval)
            toast.success("ფაილის დამუშავება დასრულდა")
            queryClient.invalidateQueries(["employee-contacts"])
            queryClient.invalidateQueries(["employee-contacts-files"])
            onClose()
          } else if (fileData.status === "failed") {
            clearInterval(pollInterval)
            toast.error("ფაილის დამუშავება ვერ მოხერხდა")
          }
        } catch (error) {
          clearInterval(pollInterval)
          console.error("Error polling file status:", error)
        }
      }, 2000) // Poll every 2 seconds

      // Clear interval after 5 minutes to prevent infinite polling
      setTimeout(() => {
        clearInterval(pollInterval)
      }, 5 * 60 * 1000)
    },
    onError: error => {
      toast.error(error.response?.data?.message || "შეცდომა ფაილის ატვირთვისას")
    },
  })

  const handleSubmit = e => {
    e.preventDefault()
    if (!file) {
      toast.error("გთხოვთ აირჩიოთ ფაილი")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("report_period", reportPeriod)

    uploadMutation.mutate(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:!text-gray-200">
          რეპორტის პერიოდი
        </label>
        <input
          type="month"
          value={reportPeriod}
          onChange={e => setReportPeriod(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:!bg-gray-700 dark:!border-gray-600"
          required
          disabled={uploadMutation.isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:!text-gray-200">
          ფაილი
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:!border-gray-600">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600 dark:!text-gray-400">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>აირჩიეთ ფაილი</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept=".xlsx,.xls,.csv"
                  onChange={e => setFile(e.target.files[0])}
                  disabled={uploadMutation.isLoading}
                />
              </label>
              <p className="pl-1">ან ჩააგდეთ</p>
            </div>
            <p className="text-xs text-gray-500 dark:!text-gray-400">
              XLSX, XLS, CSV მაქს. 10MB
            </p>
            {file && (
              <p className="text-sm text-gray-500 dark:!text-gray-400">
                არჩეული ფაილი: {file.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          disabled={uploadMutation.isLoading}
          className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:!bg-gray-700 dark:!text-gray-200 dark:!border-gray-600 dark:!hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          გაუქმება
        </button>
        <button
          type="submit"
          disabled={uploadMutation.isLoading}
          className="inline-flex justify-center items-center gap-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploadMutation.isLoading && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          {uploadMutation.isLoading ? "იტვირთება..." : "ატვირთვა"}
        </button>
      </div>
    </form>
  )
}

export default UploadEmployeeContactsForm
