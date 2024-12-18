import React from "react"
import { Play, CheckCircle, XCircle, RefreshCcw } from "lucide-react"

const TaskActions = ({ status, canEdit, onUpdateStatus }) => {
  if (!canEdit) return null

  const statusColors = {
    in_progress: "bg-[#105D8D] hover:bg-[#0D4D75]",
    completed: "bg-emerald-600 hover:bg-emerald-700",
    cancelled: "bg-red-600 hover:bg-red-700",
  }

  return (
    <div className="flex gap-3">
      {status !== "In Progress" && status !== "Completed" && (
        <button
          onClick={() => onUpdateStatus("In Progress")}
          className={`flex items-center gap-2 px-4 py-2 text-white rounded ${statusColors.in_progress}`}
        >
          {status === "Cancelled" ? (
            <RefreshCcw size={16} />
          ) : (
            <Play size={16} />
          )}
          {status === "Cancelled" ? "თავიდან დაწყება" : "დაწყება"}
        </button>
      )}

      {status === "In Progress" && (
        <button
          onClick={() => onUpdateStatus("Completed")}
          className={`flex items-center gap-2 px-4 py-2 text-white rounded ${statusColors.completed}`}
        >
          <CheckCircle size={16} />
          დასრულება
        </button>
      )}

      {status !== "Cancelled" && status !== "Completed" && (
        <button
          onClick={() => onUpdateStatus("Cancelled")}
          className={`flex items-center gap-2 px-4 py-2 text-white rounded ${statusColors.cancelled}`}
        >
          <XCircle size={16} />
          გაუქმება
        </button>
      )}
    </div>
  )
}

export default TaskActions
