import React from "react"
import { CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react"
import { STATUS_MAPPINGS, STATUS_COLORS } from "../../JobList/utils/mappings"

const TaskStatus = ({ status }) => {
  const statusConfig = {
    "in progress": {
      icon: Clock,
      label: STATUS_MAPPINGS["in progress"],
      classes: STATUS_COLORS["in progress"],
    },
    pending: {
      icon: AlertCircle,
      label: STATUS_MAPPINGS.pending,
      classes: STATUS_COLORS.pending,
    },
    completed: {
      icon: CheckCircle,
      label: STATUS_MAPPINGS.completed,
      classes: STATUS_COLORS.completed,
    },
    cancelled: {
      icon: XCircle,
      label: STATUS_MAPPINGS.cancelled,
      classes: STATUS_COLORS.cancelled,
    },
  }

  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending
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
