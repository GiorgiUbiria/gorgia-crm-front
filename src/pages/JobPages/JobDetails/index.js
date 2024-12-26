import React, { useEffect, useState, useMemo } from "react"
import { Container } from "reactstrap"
import { useParams } from "react-router-dom"
import { getTask, updateTaskStatus } from "services/tasks"
import TaskHeader from "./components/TaskHeader"
import TaskStatus from "./components/TaskStatus"
import TaskActions from "./components/TaskActions"
import TaskTimeline from "./components/TaskTimeline"
import CommentSection from "./components/CommentSection"
import useUserRoles from "../../../hooks/useUserRoles"
const JobDetails = () => {
  document.title = "Job Details | Gorgia LLC"
  const { id } = useParams()
  const [task, setTask] = useState(null)
  const userRoles = useUserRoles()
  const currentUser = JSON.parse(sessionStorage.getItem("authUser"))

  const hasEditPermission = useMemo(() => {
    return userRoles.includes("admin") || currentUser?.department_id === 5
  }, [userRoles, currentUser])

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await getTask(id)
        if (response) {
          setTask(response)
        } else {
          console.error("Task not found or response format is incorrect")
        }
      } catch (error) {
        console.error("Error fetching task details:", error)
      }
    }

    fetchTask()
  }, [id])

  const handleUpdateStatus = async newStatus => {
    try {
      const updatedTask = await updateTaskStatus(task.id, newStatus)
      setTask(updatedTask)
    } catch (error) {
      console.error("Error updating task status:", error)
    }
  }

  if (!task) {
    return (
      <div className="page-content">
        <Container fluid>
          <div>იტვირთება...</div>
        </Container>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white shadow rounded-lg mb-6">
        <TaskHeader task={task} />
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <TaskStatus status={task.status} />
          <TaskActions
            status={task.status}
            canEdit={hasEditPermission}
            onUpdateStatus={handleUpdateStatus}
            userId={currentUser?.id}
            taskAssignedTo={task.assigned_to}
          />
        </div>
        <div className="p-6">
          <TaskTimeline task={task} />
        </div>
      </div>
      <CommentSection task={task} setTask={setTask} />
    </div>
  )
}

export default JobDetails
