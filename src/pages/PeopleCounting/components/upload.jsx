import React, { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { useUploadMonthlyReport, useUploadWeeklyReport } from "queries/peopleCounting"

const UploadPeopleCountingForm = ({ onSuccess }) => {
  const [reportType, setReportType] = useState("monthly")
  const uploadMonthlyReportMutation = useUploadMonthlyReport()
  const uploadWeeklyReportMutation = useUploadWeeklyReport()

  const form = useForm({
    defaultValues: {
      file: null,
      report_period: "",
    },
    onSubmit: async ({ value }) => {
      const { file, report_period } = value
      
      try {
        if (reportType === "monthly") {
          await uploadMonthlyReportMutation.mutateAsync({
            file,
            reportPeriod: report_period,
          })
        } else {
          await uploadWeeklyReportMutation.mutateAsync({
            file,
            reportPeriod: report_period,
          })
        }
        
        onSuccess?.()
      } catch (error) {
        console.error("Error uploading report:", error)
      }
    },
  })

  const isSubmitting = uploadMonthlyReportMutation.isPending || uploadWeeklyReportMutation.isPending

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1">
          რეპორტის ტიპი
        </label>
        <select
          value={reportType}
          onChange={e => {
            setReportType(e.target.value)
            form.setFieldValue("report_period", "")
          }}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
        >
          <option value="monthly">თვიური</option>
          <option value="weekly">კვირის</option>
        </select>
      </div>

      <form.Field
        name="report_period"
        validators={{
          onChange: ({ value }) => {
            if (!value) return "პერიოდის მითითება სავალდებულოა"
            if (reportType === "weekly") {
              const date = new Date(value)
              if (date.getDay() !== 1) {
                return "კვირის რეპორტი უნდა იწყებოდეს ორშაბათს"
              }
            }
            return undefined
          },
        }}
      >
        {field => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
            >
              {reportType === "monthly" ? "რეპორტის პერიოდი" : "პერიოდის დასაწყისი"}
            </label>
            <input
              type={reportType === "monthly" ? "month" : "date"}
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={e => field.handleChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-500">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="file"
        validators={{
          onChange: ({ value }) =>
            !value ? "ფაილის ატვირთვა სავალდებულოა" : undefined,
        }}
      >
        {field => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
            >
              Excel ფაილი
            </label>
            <input
              type="file"
              id={field.name}
              name={field.name}
              accept=".xlsx,.xls"
              onChange={e => field.handleChange(e.target.files[0])}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:!file:bg-gray-600 dark:!file:text-gray-200"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-500">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit]) => (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "მიმდინარეობს..." : "ატვირთვა"}
            </button>
          </div>
        )}
      </form.Subscribe>
    </form>
  )
}

export default UploadPeopleCountingForm 