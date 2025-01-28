import React, { useMemo } from "react"
import { Container } from "reactstrap"
import { useParams, useNavigate } from "react-router-dom"
import { useGetTask } from "../../../queries/tasks"
import TaskHeader from "./components/TaskHeader"
import TaskStatus from "./components/TaskStatus"
import TaskActions from "./components/TaskActions"
import TaskTimeline from "./components/TaskTimeline"
import CommentSection from "./components/CommentSection"
import useAuth from "hooks/useAuth"
import CrmSpinner from "components/CrmSpinner"
import { toast } from "store/zustand/toastStore"

const JobDetails = () => {
  document.title = "Job Details | Gorgia LLC"
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isLoading: userLoading, isAdmin, getUserDepartmentId } = useAuth()

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
        navigate("/support/it-tasks")
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

  const taskData = task?.data

  const hasEditPermission = useMemo(() => {
    if (!taskData) return false

    return (
      isAdmin() ||
      (getUserDepartmentId() === 5 &&
        taskData.assigned_users?.some(user => user.id === user?.id))
    )
  }, [taskData, isAdmin, getUserDepartmentId])

  const isITDepartment = getUserDepartmentId() === 5

  const canAccessTask = useMemo(() => {
    if (!taskData || !user) return false
    return (
      hasEditPermission ||
      isITDepartment ||
      taskData.user.id === user?.id ||
      taskData.assigned_users?.some(user => user.id === user?.id)
    )
  }, [taskData, hasEditPermission, isITDepartment, user])

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
      
    </div>
  )
}

export default JobDetails
