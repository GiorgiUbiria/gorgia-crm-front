import React from "react"
import { CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react"

const TaskStatus = ({ status }) => {
  const statusConfig = {
    "In Progress": {
      icon: Clock,
      label: "მიმდინარე",
      classes: "bg-[#105D8D] text-white",
    },
    Pending: {
      icon: AlertCircle,
      label: "მოლოდინის რეჟიმში",
      classes: "bg-yellow-100 text-yellow-800",
    },
    Completed: {
      icon: CheckCircle,
      label: "დასრულებული",
      classes: "bg-emerald-100 text-emerald-800",
    },
    Cancelled: {
      icon: XCircle,
      label: "გაუქმებული",
      classes: "bg-red-100 text-red-800",
    },
  }

  const config = statusConfig[status] || statusConfig["Pending"]
  const Icon = config.icon

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.classes}`}
    >
      <Icon size={16} />
      <span>{config.label}</span>
    </div>
  )
}

export default TaskStatus
