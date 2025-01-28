import React, { useMemo } from "react"
import { Container } from "reactstrap"
import { useParams, useNavigate } from "react-router-dom"
import { useGetTask } from "../../../queries/farmTasks"
import TaskHeader from "./components/TaskHeader"
import TaskStatus from "./components/TaskStatus"
import TaskActions from "./components/TaskActions"
import TaskTimeline from "./components/TaskTimeline"
import CommentSection from "./components/CommentSection"
import CrmSpinner from "components/CrmSpinner"
import { toast } from "store/zustand/toastStore"

const JobDetails = () => {
  document.title = "Farm Task Details | Gorgia LLC"
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin, user } = useAuth()

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
        navigate("/support/farm-tasks")
      } else {
        toast.error("დავალების ინფორმაციის ჩატვირთვის დროს დაფიქსირდა შეცდომა", "შეცდომა", {
          duration: 2000,
          size: "small",
        })
        console.error("Error fetching task details:", error)
      }
    },
  })

  const hasEditPermission = useMemo(() => {
    if (!task) return false

    return (
      isAdmin() ||
      (getUserDepartmentId() === 38 &&
        task.data.assigned_users?.some(user => user.id === user?.id)) ||
      isAdmin()
    )
  }, [task, isAdmin])

  const isFarmDepartment = getUserDepartmentId() === 38

  const canAccessTask = useMemo(() => {
    if (!task || !user) return false
    return (
      hasEditPermission ||
      isFarmDepartment ||
      task.data.user.id === user?.id ||
      task.data.assigned_users?.some(user => user.id === user?.id)
    )
  }, [task, user, hasEditPermission, isFarmDepartment])

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
    navigate("/support/farm-tasks")
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
      
    </div>
  )
}

export default JobDetails
