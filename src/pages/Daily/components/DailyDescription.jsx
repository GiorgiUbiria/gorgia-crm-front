import React from "react"
import { formatDate } from "../../../utils/dateUtils"

const DailyDescription = ({ daily }) => {
  if (!daily) return null

  return (
    <div className="bg-white dark:!bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:!text-gray-100 mb-4">
            შეფასების დეტალები
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500 dark:!text-gray-400">
                სახელი:
              </span>
              <p className="text-gray-900 dark:!text-gray-100">{daily.name}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:!text-gray-400">
                თარიღი:
              </span>
              <p className="text-gray-900 dark:!text-gray-100">
                {formatDate(daily.date)}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:!text-gray-400">
                დეპარტამენტი:
              </span>
              <p className="text-gray-900 dark:!text-gray-100">
                {daily.department?.name}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:!text-gray-100 mb-4">
            აღწერა
          </h3>
          <div className="prose prose-sm max-w-none dark:!prose-invert">
            <p className="text-gray-700 dark:!text-gray-300 whitespace-pre-wrap">
              {daily.description || "აღწერა არ არის"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(DailyDescription)
