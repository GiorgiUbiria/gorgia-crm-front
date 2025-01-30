import React, { Fragment, useMemo, useState } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import { Row, Col } from "reactstrap"
import { Link } from "react-router-dom"

import DeleteModal from "./DeleteModal"
import TaskModal from "./TaskModal"
import AssignModal from "./AssignModal"
import PaginationControls from "./PaginationControls"
import TaskTable from "./TaskTable"
import CrmSpinner from "components/CrmSpinner"

import {
  useTaskQueries,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useAssignTask,
  useStartTask,
  useFinishTask,
} from "../../../queries/tasks"
import { useGetListNames } from "../../../queries/admin"

import useAuth from "hooks/useAuth"

const TaskList = () => {
  document.title = "Tasks List | Gorgia LLC"

  const [activeTab, setActiveTab] = useState("all")
  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [task, setTask] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [assignModal, setAssignModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  })

  const { user, isITDepartment, isAdmin } = useAuth()

  const { data: allUsers, isLoading: usersLoading } = useGetListNames({
    enabled: isITDepartment() || isAdmin(),
  })

  const usersList = allUsers?.filter(user => user.department_id === 5)

  const hasEditPermission = useMemo(() => isAdmin(), [isAdmin])
  const hasAssignPermission = useMemo(() => isITDepartment(), [isITDepartment])

  const {
    tasksList,
    myTasksList,
    assignedTasksList,
    isTasksListLoading,
    isMyTasksLoading,
    isAssignedTasksLoading,
  } = useTaskQueries(isITDepartment, isAdmin)

  console.log("Tasks list", tasksList)

  const sortedTasks = useMemo(() => {
    let tasksToSort = []

    if (isITDepartment()) {
      if (activeTab === "all") {
        tasksToSort = tasksList?.data || []
      } else if (activeTab === "assigned") {
        tasksToSort = assignedTasksList?.data || []
      } else if (activeTab === "completed") {
        tasksToSort = tasksList?.data || []
      }
    } else if (hasEditPermission) {
      tasksToSort = tasksList?.data || []
    } else {
      tasksToSort = myTasksList?.data || []
    }

    const filteredTasks = tasksToSort.filter(task => {
      if (isITDepartment() || hasEditPermission) {
        if (activeTab === "completed") {
          return task.status === "Completed"
        }
        return task.status !== "Completed"
      }
      return true
    })

    return filteredTasks.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()

      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA
    })
  }, [
    isITDepartment,
    hasEditPermission,
    activeTab,
    tasksList?.data,
    assignedTasksList?.data,
    myTasksList?.data,
    sortConfig,
  ])

  const isLoading = useMemo(() => {
    if (isITDepartment) {
      return activeTab === "all" || activeTab === "completed"
        ? isTasksListLoading
        : isAssignedTasksLoading
    } else if (hasEditPermission) {
      return isTasksListLoading
    }
    return isMyTasksLoading
  }, [
    isITDepartment,
    hasEditPermission,
    activeTab,
    isTasksListLoading,
    isAssignedTasksLoading,
    isMyTasksLoading,
  ])

  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()
  const assignTaskMutation = useAssignTask()
  const startTaskMutation = useStartTask()
  const finishTaskMutation = useFinishTask()

  const handleTaskClick = task => {
    setTask(task)
    setIsEdit(true)
    setModal(true)
  }

  const onClickDelete = task => {
    setTask(task)
    setDeleteModal(true)
  }

  const onClickAssign = task => {
    setTask(task)
    setAssignModal(true)
  }

  const handleDeleteTask = async () => {
    try {
      if (task && task.id) {
        await deleteTaskMutation.mutateAsync(task.id)
      }
      setDeleteModal(false)
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const handleAssignTask = async selectedUsers => {
    try {
      await assignTaskMutation.mutateAsync({
        taskId: task.id,
        userIds: selectedUsers,
      })
      setAssignModal(false)
    } catch (error) {
      console.error("Error assigning task:", error)
      toast.error(
        error.response?.data?.message ||
          "დავალების მიღების დროს დაფიქსირდა შეცდომა"
      )
    }
  }

  const handleStartTask = async taskId => {
    try {
      await startTaskMutation.mutateAsync(taskId)
    } catch (error) {
      console.error("Error starting task:", error)
    }
  }

  const handleFinishTask = async taskId => {
    try {
      await finishTaskMutation.mutateAsync(taskId)
    } catch (error) {
      console.error("Error finishing task:", error)
    }
  }

  const handleSort = () => {
    setSortConfig(prevConfig => ({
      key: "created_at",
      direction: prevConfig.direction === "asc" ? "desc" : "asc",
    }))
  }

  const totalPages = Math.ceil((sortedTasks?.length || 0) / itemsPerPage)

  const handlePageClick = page => {
    if (page !== currentPage) {
      setCurrentPage(page)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  console.log("Users list", usersList)

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteTask}
        onCloseClick={() => setDeleteModal(false)}
      />
      <TaskModal
        isOpen={modal}
        toggle={setModal}
        isEdit={isEdit}
        task={task}
        usersList={usersList}
        usersLoading={usersLoading}
        currentUser={user}
        createTaskMutation={createTaskMutation}
        updateTaskMutation={updateTaskMutation}
      />
      <AssignModal
        isOpen={assignModal}
        toggle={setAssignModal}
        onAssign={handleAssignTask}
        usersList={usersList}
        task={task}
      />

      {isLoading ? (
        <CrmSpinner />
      ) : (
        <Row>
          <Col xs="12">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
              <div className="w-full sm:w-auto">
                <h5 className="text-xl font-medium mb-3 sm:mb-0 text-gray-900 dark:!text-gray-100">
                  ბილეთების სია
                </h5>
                {(isITDepartment() || hasEditPermission) && (
                  <div className="flex mt-3 sm:mt-2 border-b border-gray-200 dark:!border-gray-700">
                    <button
                      className={`px-4 py-2 text-sm font-medium ${
                        activeTab === "all"
                          ? "text-blue-600 dark:!text-blue-400 border-b-2 border-blue-600 dark:!border-blue-400"
                          : "text-gray-500 dark:!text-gray-400 hover:text-gray-700 dark:!hover:text-gray-300"
                      }`}
                      onClick={() => setActiveTab("all")}
                    >
                      ახალი და მიმდინარე
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium ${
                        activeTab === "assigned"
                          ? "text-blue-600 dark:!text-blue-400 border-b-2 border-blue-600 dark:!border-blue-400"
                          : "text-gray-500 dark:!text-gray-400 hover:text-gray-700 dark:!hover:text-gray-300"
                      }`}
                      onClick={() => setActiveTab("assigned")}
                    >
                      ჩემზე მიმაგრებული
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium ${
                        activeTab === "completed"
                          ? "text-blue-600 dark:!text-blue-400 border-b-2 border-blue-600 dark:!border-blue-400"
                          : "text-gray-500 dark:!text-gray-400 hover:text-gray-700 dark:!hover:text-gray-300"
                      }`}
                      onClick={() => setActiveTab("completed")}
                    >
                      დასრულებული
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-3 sm:mt-0">
                <Link
                  to="#!"
                  onClick={() => {
                    setIsEdit(false)
                    setTask(null)
                    setModal(true)
                  }}
                  className="btn btn-primary w-full sm:w-auto"
                >
                  ახალი ბილეთის გახსნა
                </Link>
                {(isAdmin() || isITDepartment()) && (
                  <Link
                    to="/support/it-tasks/charts"
                    className="btn btn-secondary w-full sm:w-auto ml-2"
                  >
                    ანალიტიკა
                  </Link>
                )}
              </div>
            </div>
            {sortedTasks.length > 0 ? (
              <Fragment>
                <TaskTable
                  tasks={sortedTasks}
                  sortConfig={sortConfig}
                  handleSort={handleSort}
                  hasEditPermission={hasEditPermission}
                  hasAssignPermission={hasAssignPermission}
                  onEdit={handleTaskClick}
                  onDelete={onClickDelete}
                  onAssign={onClickAssign}
                  onStartTask={handleStartTask}
                  onFinishTask={handleFinishTask}
                  activeTab={activeTab}
                  currentUser={user}
                />
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageClick={handlePageClick}
                  onPrevious={handlePreviousPage}
                  onNext={handleNextPage}
                />
              </Fragment>
            ) : (
              <div className="text-center py-8">თასქები არ არის</div>
            )}
          </Col>
        </Row>
      )}
    </div>
  )
}

export default TaskList
