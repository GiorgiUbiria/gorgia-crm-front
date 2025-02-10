import React from "react"
import { Play, CheckCircle } from "lucide-react"
import { useStartTask, useFinishTask } from "../../../../queries/farmTasks"
import { toast } from "store/zustand/toastStore"

const TaskActions = ({ task, canEdit }) => {
  const startTaskMutation = useStartTask()
  const finishTaskMutation = useFinishTask()

  if (!task) return null
  if (!canEdit) return null

  const currentUser = JSON.parse(sessionStorage.getItem("authUser"))

  const canUpdateStatus =
    (currentUser.department_id === 38 &&
      task.data.assigned_users?.some(user => user.id === currentUser.id)) ||
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
    in_progress: "bg-[#105D8D] hover:bg-[#0D4D75]",
    completed: "bg-emerald-600 hover:bg-emerald-700",
    cancelled: "bg-red-600 hover:bg-red-700",
  }

  return (
    <div className="flex flex-col gap-2 sm:gap-3 w-full sm:w-auto">
      {canUpdateStatus && task.data.status === "Pending" && (
        <button
          onClick={handleStartTask}
          disabled={startTaskMutation.isPending}
          className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base text-white dark:!text-gray-100 rounded-lg w-full sm:w-40 ${statusColors.in_progress} dark:!bg-[#0D4D75] dark:!hover:bg-[#105D8D] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
        >
          <Play size={14} className="shrink-0 sm:size-4" />
          {startTaskMutation.isPending ? "მიმდინარეობს..." : "დაწყება"}
        </button>
      )}

      {canUpdateStatus && task.data.status === "In Progress" && (
        <button
          onClick={handleFinishTask}
          disabled={finishTaskMutation.isPending}
          className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base text-white dark:!text-gray-100 rounded-lg w-full sm:w-40 ${statusColors.completed} dark:!bg-emerald-700 dark:!hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
        >
          <CheckCircle size={14} className="shrink-0 sm:size-4" />
          {finishTaskMutation.isPending ? "მიმდინარეობს..." : "დასრულება"}
        </button>
      )}
    </div>
  )
}

export default TaskActions
