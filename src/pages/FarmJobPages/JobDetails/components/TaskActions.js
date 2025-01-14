import React from "react"
import { Play, CheckCircle } from "lucide-react"
import { useStartTask, useFinishTask } from "../../../../queries/farmTasks"
import { toast } from "react-toastify"

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
      await finishTaskMutation.mutateAsync(task.data.id)
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
          className={`flex items-center gap-2 px-4 py-2 text-white rounded ${statusColors.in_progress}`}
        >
          <Play size={16} />
          დაწყება
        </button>
      )}

      {canUpdateStatus && task.data.status === "In Progress" && (
        <button
          onClick={handleFinishTask}
          className={`flex items-center gap-2 px-4 py-2 text-white rounded ${statusColors.completed}`}
        >
          <CheckCircle size={16} />
          დასრულება
        </button>
      )}
    </div>
  )
}

export default TaskActions