import React from "react"
import { formatDate } from "../../../utils/dateUtils"

const DailyDescription = ({ daily }) => {
  if (!daily) return null

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            შეფასების დეტალები
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">სახელი:</span>
              <p className="text-gray-900">{daily.name}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">თარიღი:</span>
              <p className="text-gray-900">{formatDate(daily.date)}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">დეპარტამენტი:</span>
              <p className="text-gray-900">{daily.department?.name}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">აღწერა</h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">
              {daily.description || "აღწერა არ არის"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(DailyDescription)
