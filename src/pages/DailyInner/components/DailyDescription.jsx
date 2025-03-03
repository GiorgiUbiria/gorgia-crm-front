import React, { useState, useEffect } from "react"
import { formatDate } from "../../../utils/dateUtils"
import useAuth from "../../../hooks/useAuth"
import { useUpdateRegularDaily } from "../../../queries/daily"
import { toast } from "../../../store/zustand/toastStore"

const DailyDescription = ({ daily }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [description, setDescription] = useState(daily?.description || "")
  const { user, isAdmin } = useAuth()
  const updateMutation = useUpdateRegularDaily()

  useEffect(() => {
    if (!isEditing && !updateMutation.isPending) {
      setDescription(daily?.description || "")
    }
  }, [daily?.description, isEditing, updateMutation.isPending])

  if (!daily) return null

  const canEdit = isAdmin || user?.id === daily.user_id

  const handleEdit = () => {
    setDescription(daily.description || "")
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!daily.id) {
      toast.error("დეილის ID ვერ მოიძებნა")
      return
    }

    try {
      const result = await updateMutation.mutateAsync({
        id: daily.id,
        data: {
          description,
          date: daily.date,
          name: daily.name,
          department_id: daily.department_id,
        },
      })
      setIsEditing(false)
      setDescription(result.daily.description)
      toast.success("აღწერა წარმატებით განახლდა")
    } catch (error) {
      console.error("Failed to update description:", error)
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "აღწერის განახლება ვერ მოხერხდა"
      )
    }
  }

  const handleCancel = () => {
    setDescription(daily.description || "")
    setIsEditing(false)
  }

  const displayDescription = updateMutation.isPending
    ? description
    : daily.description || "აღწერა არ არის"

  return (
    <div className="bg-white dark:!bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:!text-gray-100 mb-3 sm:mb-4">
            შეფასების დეტალები
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div>
              <span className="text-xs sm:text-sm text-gray-500 dark:!text-gray-400">
                სახელი:
              </span>
              <p className="text-sm sm:text-base text-gray-900 dark:!text-gray-100">
                {daily.name}
              </p>
            </div>
            <div>
              <span className="text-xs sm:text-sm text-gray-500 dark:!text-gray-400">
                თარიღი:
              </span>
              <p className="text-sm sm:text-base text-gray-900 dark:!text-gray-100">
                {formatDate(daily.date)}
              </p>
            </div>
            <div>
              <span className="text-xs sm:text-sm text-gray-500 dark:!text-gray-400">
                დეპარტამენტი:
              </span>
              <p className="text-sm sm:text-base text-gray-900 dark:!text-gray-100">
                {daily.department?.name}
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:!text-gray-100">
              აღწერა
            </h3>
            {canEdit && !isEditing && !updateMutation.isPending && (
              <button
                onClick={handleEdit}
                className="text-primary hover:text-primary-dark dark:!text-primary-light dark:!hover:text-primary transition-colors duration-200"
              >
                რედაქტირება
              </button>
            )}
          </div>
          {isEditing ? (
            <div className="space-y-4">
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full h-32 p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-100"
                placeholder="აღწერა"
                disabled={updateMutation.isPending}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:!bg-gray-700 dark:!text-gray-200 dark:!border-gray-600 dark:!hover:bg-gray-600"
                  disabled={updateMutation.isPending}
                >
                  გაუქმება
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark dark:!bg-primary-light dark:!hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "მიმდინარეობს..." : "შენახვა"}
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`prose prose-sm sm:prose max-w-none dark:!prose-invert ${
                updateMutation.isPending ? "opacity-50" : ""
              }`}
            >
              <p className="text-sm sm:text-base text-gray-700 dark:!text-gray-300 whitespace-pre-wrap">
                {displayDescription}
              </p>
              {updateMutation.isPending && (
                <div className="text-xs sm:text-sm text-gray-500 dark:!text-gray-400 mt-2">
                  განახლება მიმდინარეობს...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default React.memo(DailyDescription)
