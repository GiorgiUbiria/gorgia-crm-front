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
        return (
          <Clock className="text-[#105D8D] dark:!text-[#4DA8DA]" size={20} />
        )
    }
  }

  return (
    <div className="bg-white dark:!bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:!text-gray-100 mb-4 sm:mb-6">
        თაიმლაინი
      </h3>
      <div className="space-y-4">
        <div className="flex items-start sm:items-center gap-3">
          <Clock
            size={20}
            className="text-[#105D8D] dark:!text-[#4DA8DA] shrink-0 mt-0.5 sm:mt-0"
          />
          <div>
            <p className="text-sm sm:text-base font-medium text-gray-900 dark:!text-gray-100">
              შეიქმნა
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:!text-gray-400">
              {formatDate(task.data.created_at)}
            </p>
          </div>
        </div>

        {task.data.status === "In Progress" && (
          <div className="flex items-start sm:items-center gap-3">
            <Clock
              size={20}
              className="text-[#105D8D] dark:!text-[#4DA8DA] shrink-0 mt-0.5 sm:mt-0"
            />
            <div>
              <p className="text-sm sm:text-base font-medium text-gray-900 dark:!text-gray-100">
                დაიწყო
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:!text-gray-400">
                {formatDate(task.data.updated_at)}
              </p>
            </div>
          </div>
        )}

        {(task.data.status === "Completed" ||
          task.data.status === "Cancelled") && (
          <div className="flex items-start sm:items-center gap-3">
            <div className="shrink-0 mt-0.5 sm:mt-0">
              {getTimelineIcon(task.data.status)}
            </div>
            <div>
              <p className="text-sm sm:text-base font-medium text-gray-900 dark:!text-gray-100">
                {task.data.status === "Completed" ? "დასრულდა" : "გაუქმდა"}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:!text-gray-400">
                {formatDate(task.data.updated_at)}
                <span className="block sm:inline sm:ml-2 text-[#105D8D] dark:!text-[#4DA8DA] mt-1 sm:mt-0">
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
