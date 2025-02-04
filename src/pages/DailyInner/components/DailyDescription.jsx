import React from "react"
import { formatDate } from "../../../utils/dateUtils"

const DailyDescription = ({ daily }) => {
  if (!daily) return null

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
          <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:!text-gray-100 mb-3 sm:mb-4">
            აღწერა
          </h3>
          <div className="prose prose-sm sm:prose max-w-none dark:!prose-invert">
            <p className="text-sm sm:text-base text-gray-700 dark:!text-gray-300 whitespace-pre-wrap">
              {daily.description || "აღწერა არ არის"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(DailyDescription)
