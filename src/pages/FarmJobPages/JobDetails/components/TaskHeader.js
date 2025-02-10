import React from "react"
import { Clock, Calendar, User2 } from "lucide-react"
import { formatDate } from "../../../../utils/dateUtils"

const TaskHeader = ({ task }) => {
  return (
    <div className="border-b border-gray-200 dark:!border-gray-700 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="w-full">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:!text-gray-100 mb-2">
            {task.data.task_title}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 sm:mt-0">
              <span className="text-sm text-gray-500 dark:!text-gray-400">
                {task.data.user.name + " " + task.data.user.sur_name}
              </span>
              <span className="text-sm text-gray-500 dark:!text-gray-400">
                {task.data.phone_number}
              </span>
            </div>
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 dark:!text-gray-300">
            <div className="flex items-center gap-1">
              <User2
                size={16}
                className="text-[#105D8D] dark:!text-[#4DA8DA] shrink-0"
              />
              <span className="break-all">
                {task.data.assigned_users
                  .map(user => user.name + " " + user.sur_name)
                  .join(", ")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar
                size={16}
                className="text-[#105D8D] dark:!text-[#4DA8DA] shrink-0"
              />
              <span>ვადა: {formatDate(task.data.due_date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock
                size={16}
                className="text-[#105D8D] dark:!text-[#4DA8DA] shrink-0"
              />
              <span>შეიქმნა: {formatDate(task.data.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm sm:text-base text-gray-700 dark:!text-gray-300 mt-4">
        აღწერა: {task.data.description}
      </p>
    </div>
  )
}

export default TaskHeader
