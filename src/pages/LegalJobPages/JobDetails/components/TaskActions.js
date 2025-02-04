import React from "react"
import { Play, CheckCircle } from "lucide-react"
import { useStartTask, useFinishTask } from "../../../../queries/legalTasks"
import { toast } from "store/zustand/toastStore"
import useAuth from "hooks/useAuth"

const TaskActions = ({ task, canEdit }) => {
  const { user } = useAuth()
  const startTaskMutation = useStartTask()
  const finishTaskMutation = useFinishTask()

  if (!task) return null
  if (!canEdit) return null

  const canUpdateStatus =
    (user.department_id === 10 &&
      task.data.assigned_users?.some(user => user.id === user.id)) ||
    canEdit

  const handleStartTask = async () => {
    try {
      await startTaskMutation.mutateAsync(task.data.id)
      toast.success("დავალება დაწყებულია", "წარმატება", {
        duration: 2000,
        size: "small",
      })
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "დავალების დაწყების დროს დაფიქსირდა შეცდომა",
        "შეცდომა",
        {
          duration: 2000,
          size: "small",
        }
      )
    }
  }

  const handleFinishTask = async () => {
    try {
      await finishTaskMutation.mutateAsync(task.data.id)
      toast.success("დავალება დასრულებულია", "წარმატება", {
        duration: 2000,
        size: "small",
      })
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "დავალების დასრულების დროს დაფიქსირდა შეცდომა",
        "შეცდომა",
        {
          duration: 2000,
          size: "small",
        }
      )
    }
  }

  const statusColors = {
    in_progress:
      "bg-[#105D8D] hover:bg-[#0D4D75] dark:!bg-blue-700 dark:!hover:bg-blue-800",
    completed:
      "bg-emerald-600 hover:bg-emerald-700 dark:!bg-emerald-700 dark:!hover:bg-emerald-800",
    cancelled:
      "bg-red-600 hover:bg-red-700 dark:!bg-red-700 dark:!hover:bg-red-800",
  }

  return (
    <div className="flex gap-2 sm:gap-3">
      {canUpdateStatus && task.data.status === "Pending" && (
        <button
          onClick={handleStartTask}
          className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-white rounded ${statusColors.in_progress}`}
        >
          <Play size={14} className="sm:size-[16px]" />
          დაწყება
        </button>
      )}

      {canUpdateStatus && task.data.status === "In Progress" && (
        <button
          onClick={handleFinishTask}
          className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-white rounded ${statusColors.completed}`}
        >
          <CheckCircle size={14} className="sm:size-[16px]" />
          დასრულება
        </button>
      )}
    </div>
  )
}

export default TaskActions
