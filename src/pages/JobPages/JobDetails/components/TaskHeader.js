import React from "react"
import { Clock, Calendar, User2 } from "lucide-react"
import { formatDate } from "../../../../utils/dateUtils"

const TaskHeader = ({ task }) => {
  return (
    <div className="border-b border-gray-200 p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {task.task_title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User2 size={16} className="text-[#105D8D]" />
              <span>{task.assigned_to}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} className="text-[#105D8D]" />
              <span>ვადა: {formatDate(task.due_date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} className="text-[#105D8D]" />
              <span>შეიქმნა: {formatDate(task.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-gray-700 mt-4">{task.description}</p>
    </div>
  )
}

export default TaskHeader
