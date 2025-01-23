import React, { useMemo } from "react"
import { Container } from "reactstrap"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useGetTask } from "../../../queries/legalTasks"
import TaskHeader from "./components/TaskHeader"
import TaskStatus from "./components/TaskStatus"
import TaskActions from "./components/TaskActions"
import TaskTimeline from "./components/TaskTimeline"
import CommentSection from "./components/CommentSection"
import useAuth from "hooks/useAuth"
import Spinners from "../../../components/Common/Spinner"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const JobDetails = () => {
  document.title = "Legal Task Details | Gorgia LLC"
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isLoading: userLoading } = useAuth()

  const {
    data: task,
    isLoading: taskLoading,
    error,
  } = useGetTask(id, {
    onError: error => {
      if (error.response?.status === 403) {
        toast.error("შენ არ გაქვს უფლება იხილო ეს დავალება")
        navigate("/support/legal-tasks")
      } else {
        toast.error("დავალების ინფორმაციის ჩატვირთვის დროს დაფიქსირდა შეცდომა")
        console.error("Error fetching task details:", error)
      }
    },
  })

  const hasEditPermission = useMemo(() => {
    if (!task) return false

    return (
      isAdmin() ||
      (isLegalDepartment() &&
        task.data.assigned_users?.some(user => user.id === user?.id)) ||
      isAdmin()
    )
  }, [task, isLegalDepartment])

  const isLegalDepartment = getUserDepartmentId() === 10

  const canAccessTask = useMemo(() => {
    if (!task || !user) return false
    return (
      hasEditPermission ||
      isLegalDepartment ||
      task.data.user.id === user.id ||
      task.data.assigned_users?.some(user => user.id === user.id)
    )
  }, [task, hasEditPermission, isLegalDepartment, user])

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

  if (error || !task || !canAccessTask) {
    navigate("/support/legal-tasks")
    return null
  }

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white shadow rounded-lg mb-6">
        <TaskHeader task={task} />
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <TaskStatus status={task.data.status} />
          <TaskActions task={task} canEdit={hasEditPermission} />
        </div>
        <div className="p-6">
          <TaskTimeline task={task} />
        </div>
      </div>
      <CommentSection task={task} canComment={canAccessTask} />
      <ToastContainer />
    </div>
  )
}

export default JobDetails