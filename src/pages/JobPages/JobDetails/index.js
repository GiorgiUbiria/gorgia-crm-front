import React, { useMemo } from "react"
import { Container } from "reactstrap"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useGetTask } from "../../../queries/tasks"
import TaskHeader from "./components/TaskHeader"
import TaskStatus from "./components/TaskStatus"
import TaskActions from "./components/TaskActions"
import TaskTimeline from "./components/TaskTimeline"
import CommentSection from "./components/CommentSection"
import useUserRoles from "../../../hooks/useUserRoles"
import useCurrentUser from "../../../hooks/useCurrentUser"
import Spinners from "../../../components/Common/Spinner"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const JobDetails = () => {
  document.title = "Job Details | Gorgia LLC"
  const { id } = useParams()
  const navigate = useNavigate()
  const userRoles = useUserRoles()
  const { currentUser, isLoading: userLoading } = useCurrentUser()

  const {
    data: task,
    isLoading: taskLoading,
    error,
  } = useGetTask(id, {
    onError: error => {
      if (error.response?.status === 403) {
        toast.error("შენ არ გაქვს უფლება იხილო ეს დავალება")
        navigate("/support/it-tasks")
      } else {
        toast.error("დავალების ინფორმაციის ჩატვირთვის დროს დაფიქსირდა შეცდომა")
        console.error("Error fetching task details:", error)
      }
    },
  })

  const taskData = task?.data

  const hasEditPermission = useMemo(() => {
    if (!taskData) return false

    return (
      userRoles.includes("admin") ||
      (currentUser?.department_id === 5 &&
        taskData.assigned_users?.some(user => user.id === currentUser?.id))
    )
  }, [userRoles, currentUser, taskData])

  const isITDepartment = currentUser?.department_id === 5

  const canAccessTask = useMemo(() => {
    if (!taskData || !currentUser) return false
    return (
      hasEditPermission ||
      isITDepartment ||
      taskData.user.id === currentUser.id ||
      taskData.assigned_users?.some(user => user.id === currentUser.id)
    )
  }, [taskData, hasEditPermission, isITDepartment, currentUser])

  if (userLoading || taskLoading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="d-flex justify-content-center align-items-center min-vh-100">
            <Spinners />
          </div>
        </Container>
      </div>
    )
  }

  if (error || !taskData || !canAccessTask) {
    navigate("/support/it-tasks")
    return null
  }

  console.log("Rendering with taskData:", taskData)

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white shadow rounded-lg mb-6">
        <TaskHeader taskData={taskData} />
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <TaskStatus status={taskData.status} />
          <TaskActions taskData={taskData} canEdit={hasEditPermission} />
        </div>
        <div className="p-6">
          <TaskTimeline taskData={taskData} />
        </div>
      </div>
      <CommentSection taskData={taskData} canComment={canAccessTask} />
      <ToastContainer />
    </div>
  )
}

export default JobDetails
