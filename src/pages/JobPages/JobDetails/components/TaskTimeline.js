import React from "react"
import { Clock, CheckCircle, XCircle } from "lucide-react"
import { formatDate, getTimeElapsed } from "../../../../utils/dateUtils"

const TaskTimeline = ({ taskData }) => {
  if (!taskData) return null

  const getTimelineIcon = status => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="text-emerald-500" size={20} />
      case "Cancelled":
        return <XCircle className="text-red-500" size={20} />
      default:
        return <Clock className="text-[#105D8D]" size={20} />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">თაიმლაინი</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Clock size={20} className="text-[#105D8D]" />
          <div>
            <p className="text-sm font-medium text-gray-900">შეიქმნა</p>
            <p className="text-sm text-gray-500">
              {formatDate(taskData.created_at)}
            </p>
          </div>
        </div>

        {taskData.status === "In Progress" && (
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-[#105D8D]" />
            <div>
              <p className="text-sm font-medium text-gray-900">დაიწყო</p>
              <p className="text-sm text-gray-500">
                {formatDate(taskData.updated_at)}
              </p>
            </div>
          </div>
        )}

        {(taskData.status === "Completed" ||
          taskData.status === "Cancelled") && (
          <div className="flex items-center gap-3">
            {getTimelineIcon(taskData.status)}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {taskData.status === "Completed" ? "დასრულდა" : "გაუქმდა"}
              </p>
              <p className="text-sm text-gray-500">
                {formatDate(taskData.updated_at)}
                <span className="ml-2 text-[#105D8D]">
                  (დრო:{" "}
                  {getTimeElapsed(taskData.created_at, taskData.updated_at)})
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskTimeline
