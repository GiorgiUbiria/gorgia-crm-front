import React from "react"

const TaskHeader = ({ taskData }) => {
  if (!taskData) return null

  return (
    <div className="p-6 border-b border-gray-200">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {taskData.task_title}
      </h1>
      <div className="text-sm text-gray-500">
        <p className="mb-2">{taskData.description}</p>
        <div className="flex gap-4">
          <span>Phone: {taskData.phone_number}</span>
          <span>Due Date: {taskData.due_date}</span>
          <span>Priority: {taskData.priority}</span>
        </div>
      </div>
    </div>
  )
}

export default TaskHeader
