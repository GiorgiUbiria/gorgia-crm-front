import React, { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { createHrAdditionalDocument } from "services/hrDocument"
import { toast } from "store/zustand/toastStore"
import useAuth from "hooks/useAuth"
import { DialogButton } from "components/CrmDialogs/Dialog"
import FileUpload from "components/FileUpload"

const DOCUMENT_TYPES = {
  BULLETIN: "bulletin",
  DOCTOR: "doctor",
}

const HrAdditionalPage = () => {
  const { user, isAdmin, isHrMember } = useAuth()
  const [files, setFiles] = useState([])
  const [isForEmployee, setIsForEmployee] = useState(false)
  const isDepartmentHead =
    isHrMember && user?.roles?.some(role => role.slug === "department_head")

  const form = useForm({
    defaultValues: {
      type: "",
      employeeName: "",
      employeeDepartment: isDepartmentHead ? user.department?.name : "",
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData()
        formData.append("type", value.type)
        formData.append("is_for_employee", isForEmployee ? "1" : "0")

        if (isForEmployee) {
          formData.append("employee_name", value.employeeName)
          formData.append("employee_department", value.employeeDepartment)
        }

        files.forEach((file, index) => {
          if (file instanceof File) {
            formData.append(`attachments[${index}]`, file, file.name)
          }
        })

        if (files.length === 0) {
          toast.error("გთხოვთ აირჩიოთ მინიმუმ ერთი ფაილი", "შეცდომა")
          return
        }

        await createHrAdditionalDocument(formData)
        toast.success("დოკუმენტი წარმატებით შეიქმნა", "წარმატება")
      } catch (error) {
        toast.error("დოკუმენტის შექმნა ვერ მოხერხდა", "შეცდომა")
      }
    },
  })

  const showEmployeeOption = isAdmin || isDepartmentHead

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 dark:!bg-gray-900 dark:!text-gray-100">
      <form.Field name="type">
        {field => (
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:!text-gray-300">
              დოკუმენტის ტიპი
            </label>
            <select
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={e => field.handleChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:!bg-gray-800 dark:!border-gray-700 dark:!text-gray-100"
            >
              <option value="">აირჩიეთ ტიპი</option>
              {Object.entries(DOCUMENT_TYPES).map(([key, type]) => (
                <option key={key} value={type} className="dark:!bg-gray-800">
                  {type === DOCUMENT_TYPES.BULLETIN
                    ? "ბიულეტენი"
                    : "ექიმის დოკუმენტი"}
                </option>
              ))}
            </select>
          </div>
        )}
      </form.Field>

      {showEmployeeOption && (
        <div className="mb-6">
          <label className="flex items-center text-sm text-gray-700 dark:!text-gray-300">
            <input
              type="checkbox"
              checked={isForEmployee}
              onChange={e => setIsForEmployee(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:!bg-gray-800 dark:!border-gray-700"
            />
            <span className="ml-2">დოკუმენტი სხვა თანამშრომლისთვის</span>
          </label>
        </div>
      )}

      {isForEmployee && (
        <>
          <form.Field name="employeeName">
            {field => (
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:!text-gray-300">
                  თანამშრომლის სახელი
                </label>
                <input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:!bg-gray-800 dark:!border-gray-700 dark:!text-gray-100"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="employeeDepartment">
            {field => (
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:!text-gray-300">
                  თანამშრომლის დეპარტამენტი
                </label>
                <input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:!bg-gray-800 dark:!border-gray-700 dark:!text-gray-100"
                  readOnly={isDepartmentHead}
                />
              </div>
            )}
          </form.Field>
        </>
      )}

      <div className="mb-6">
        <FileUpload
          files={files}
          onChange={setFiles}
          accept=".pdf,.jpg,.png"
          multiple
        />
      </div>

      <DialogButton
        type="submit"
        actionType="add"
        onClick={form.handleSubmit}
        disabled={files.length === 0}
        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:!bg-indigo-700 dark:!hover:bg-indigo-600"
      >
        გაგზავნა
      </DialogButton>
    </div>
  )
}

export default HrAdditionalPage
