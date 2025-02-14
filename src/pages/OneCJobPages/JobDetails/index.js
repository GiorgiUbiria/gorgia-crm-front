import React, { useMemo } from "react"
import { Container } from "reactstrap"
import { useParams, useNavigate } from "react-router-dom"
import { useGetTask } from "../../../queries/oneCTasks"
import TaskHeader from "./components/TaskHeader"
import TaskStatus from "./components/TaskStatus"
import TaskActions from "./components/TaskActions"
import TaskTimeline from "./components/TaskTimeline"
import CommentSection from "./components/CommentSection"
import useAuth from "hooks/useAuth"
import CrmSpinner from "components/CrmSpinner"
import { toast } from "store/zustand/toastStore"

const JobDetails = () => {
  document.title = "1C Task Details | Gorgia LLC"
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    user,
    isLoading: userLoading,
    getUserDepartmentId,
    isAdmin,
  } = useAuth()

  const {
    data: task,
    isLoading: taskLoading,
    error,
  } = useGetTask(id, {
    onError: error => {
      if (error.response?.status === 403) {
        toast.error("შენ არ გაქვს უფლება იხილო ეს დავალება", "შეცდომა", {
          duration: 2000,
          size: "small",
        })
        navigate("/support/1c-tasks")
      } else {
        toast.error(
          "დავალების ინფორმაციის ჩატვირთვის დროს დაფიქსირდა შეცდომა",
          "შეცდომა",
          {
            duration: 2000,
            size: "small",
          }
        )
        console.error("Error fetching task details:", error)
      }
    },
  })

  const isOneCDepartment = getUserDepartmentId() === 35

  const hasEditPermission = useMemo(() => {
    if (!task) return false

    return (
      isAdmin() ||
      (isOneCDepartment &&
        task.data.assigned_users?.some(user => user.id === user?.id)) ||
      isAdmin()
    )
  }, [task, isAdmin, isOneCDepartment])

  const canAccessTask = useMemo(() => {
    if (!task || !user) return false
    return (
      hasEditPermission ||
      isOneCDepartment ||
      task.data.user.id === user.id ||
      task.data.assigned_users?.some(user => user.id === user.id)
    )
  }, [task, hasEditPermission, isOneCDepartment, user])

  if (userLoading || taskLoading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="d-flex justify-content-center align-items-center min-vh-100">
            <CrmSpinner />
          </div>
        </Container>
      </div>
    )
  }

  if (error || !task || !canAccessTask) {
    navigate("/support/1c-tasks")
    return null
  }

  return (
    <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
      <div className="bg-white dark:!bg-gray-800 shadow rounded-lg mb-4 sm:mb-6">
        <TaskHeader task={task} />
        <div className="p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-200 dark:!border-gray-700">
          <TaskStatus status={task.data.status} />
          <TaskActions task={task} canEdit={hasEditPermission} />
        </div>
        <div className="p-3 sm:p-4 md:p-6">
          <TaskTimeline task={task} />
        </div>
      </div>
      <CommentSection task={task} canComment={canAccessTask} />
    </div>
  )
}

export default JobDetails
