import React from "react"
import { CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react"

const TaskStatus = ({ status }) => {
  const statusConfig = {
    "In Progress": {
      icon: Clock,
      label: "მიმდინარე",
      classes: "bg-[#105D8D] dark:!bg-[#0D4D75] text-white dark:!text-gray-100",
    },
    Pending: {
      icon: AlertCircle,
      label: "მოლოდინის რეჟიმში",
      classes:
        "bg-yellow-100 dark:!bg-yellow-900 text-yellow-800 dark:!text-yellow-200",
    },
    Completed: {
      icon: CheckCircle,
      label: "დასრულებული",
      classes:
        "bg-emerald-100 dark:!bg-emerald-900 text-emerald-800 dark:!text-emerald-200",
    },
    Cancelled: {
      icon: XCircle,
      label: "გაუქმებული",
      classes: "bg-red-100 dark:!bg-red-900 text-red-800 dark:!text-red-200",
    },
  }

  const config = statusConfig[status] || statusConfig["Pending"]
  const Icon = config.icon

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${config.classes}`}
    >
      <Icon size={16} className="shrink-0" />
      <span>{config.label}</span>
    </div>
  )
}

export default TaskStatus
