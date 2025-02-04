import React from "react"
import { Clock, CheckCircle, XCircle } from "lucide-react"
import { formatDate, getTimeElapsed } from "../../../../utils/dateUtils"

const TaskTimeline = ({ task }) => {
  const getTimelineIcon = status => {
    switch (status) {
      case "Completed":
        return (
          <CheckCircle
            className="text-emerald-500 dark:!text-emerald-400"
            size={20}
          />
        )
      case "Cancelled":
        return <XCircle className="text-red-500 dark:!text-red-400" size={20} />
      default:
        return <Clock className="text-[#105D8D] dark:!text-blue-400" size={20} />
    }
  }

  return (
    <div className="bg-white dark:!bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
      <h3 className="text-lg font-medium text-gray-900 dark:!text-gray-100 mb-3 sm:mb-4">
        თაიმლაინი
      </h3>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Clock size={20} className="text-[#105D8D] dark:!text-blue-400" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:!text-gray-100">
              შეიქმნა
            </p>
            <p className="text-sm text-gray-500 dark:!text-gray-400">
              {formatDate(task.data.created_at)}
            </p>
          </div>
        </div>

        {task.data.status === "In Progress" && (
          <div className="flex items-center gap-2 sm:gap-3">
            <Clock size={20} className="text-[#105D8D] dark:!text-blue-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:!text-gray-100">
                დაიწყო
              </p>
              <p className="text-sm text-gray-500 dark:!text-gray-400">
                {formatDate(task.data.updated_at)}
              </p>
            </div>
          </div>
        )}

        {(task.data.status === "Completed" ||
          task.data.status === "Cancelled") && (
          <div className="flex items-center gap-2 sm:gap-3">
            {getTimelineIcon(task.data.status)}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:!text-gray-100">
                {task.data.status === "Completed" ? "დასრულდა" : "გაუქმდა"}
              </p>
              <p className="text-sm text-gray-500 dark:!text-gray-400">
                {formatDate(task.data.updated_at)}
                <span className="ml-2 text-[#105D8D] dark:!text-blue-400">
                  (დრო:{" "}
                  {getTimeElapsed(task.data.created_at, task.data.updated_at)})
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
