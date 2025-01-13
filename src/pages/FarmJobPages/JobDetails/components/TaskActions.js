import React from "react"
import { Play, CheckCircle } from "lucide-react"
import { useUpdateFarmTask } from "../../../../queries/farmTasks"
import { toast } from "react-toastify"

const TaskActions = ({ task, canEdit }) => {
  const updateTaskMutation = useUpdateFarmTask()

  if (!task) return null
  if (!canEdit) return null

  const currentUser = JSON.parse(sessionStorage.getItem("authUser"))

  const canUpdateStatus =
    (currentUser.department_id === 38 &&
      task.data.assigned_users?.some(user => user.id === currentUser.id)) ||
    canEdit

  const handleStartTask = async () => {
    try {
      await updateTaskMutation.mutateAsync({
        id: task.data.id,
        data: { status: "In Progress" }
      })
      toast.success("დავალება დაწყებულია")
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "დავალების დაწყების დროს დაფიქსირდა შეცდომა"
      )
    }
  }

  const handleFinishTask = async () => {
    try {
      await updateTaskMutation.mutateAsync({
        id: task.data.id,
        data: { status: "Completed" }
      })
      toast.success("დავალება დასრულებულია")
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "დავალების დასრულების დროს დაფიქსირდა შეცდომა"
      )
    }
  }

  const statusColors = {
    in_progress: "bg-[#105D8D] hover:bg-[#0D4D75]",
    completed: "bg-emerald-600 hover:bg-emerald-700",
    cancelled: "bg-red-600 hover:bg-red-700",
  }

  return (
    <div className="flex gap-3">
      {canUpdateStatus && task.data.status === "Pending" && (
        <button
          onClick={handleStartTask}
          disabled={updateTaskMutation.isPending}
          className={`flex items-center gap-2 px-4 py-2 text-white rounded ${statusColors.in_progress} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Play size={16} />
          {updateTaskMutation.isPending ? "მიმდინარეობს..." : "დაწყება"}
        </button>
      )}

      {canUpdateStatus && task.data.status === "In Progress" && (
        <button
          onClick={handleFinishTask}
          disabled={updateTaskMutation.isPending}
          className={`flex items-center gap-2 px-4 py-2 text-white rounded ${statusColors.completed} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <CheckCircle size={16} />
          {updateTaskMutation.isPending ? "მიმდინარეობს..." : "დასრულება"}
        </button>
      )}
    </div>
  )
}

export default TaskActions
