import React, { Fragment, useMemo, useState } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import { Row, Col, Nav, NavItem, NavLink } from "reactstrap"
import { ToastContainer } from "react-toastify"
import { Link } from "react-router-dom"

import DeleteModal from "./DeleteModal"
import TaskModal from "./TaskModal"
import AssignModal from "./AssignModal"
import PaginationControls from "./PaginationControls"
import TaskTable from "./TaskTable"
import Spinners from "../../../components/Common/Spinner"

import {
  useTaskQueries,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useAssignTask,
  useStartTask,
  useFinishTask,
} from "../../../queries/tasks"

import useFetchUsers from "../../../hooks/useFetchUsers"
import useUserRoles from "../../../hooks/useUserRoles"

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

  const currentUser = JSON.parse(sessionStorage.getItem("authUser"))
  const isITDepartment = currentUser?.department_id === 5

  const { users: allUsers, loading: usersLoading } = useFetchUsers()
  const usersList = allUsers?.filter(user => user.department_id === 5)
  const userRoles = useUserRoles()

  const hasEditPermission = useMemo(
    () => userRoles.includes("admin"),
    [userRoles]
  )
  const hasAssignPermission = useMemo(() => isITDepartment, [isITDepartment])

  const {
    tasksList,
    myTasksList,
    assignedTasksList,
    isTasksListLoading,
    isMyTasksLoading,
    isAssignedTasksLoading,
  } = useTaskQueries(isITDepartment)

  const sortedTasks = useMemo(() => {
    const tasksToSort =
      isITDepartment || hasEditPermission
        ? activeTab === "all"
          ? [...(tasksList?.data || [])]
          : activeTab === "assigned"
          ? [...(assignedTasksList?.data || [])]
          : [...(tasksList?.data || [])]
        : [...(myTasksList?.data || [])]

    const filteredTasks = tasksToSort.filter(task => {
      if (activeTab === "completed") {
        return task.status === "Completed"
      }
      return task.status !== "Completed"
    })

    return filteredTasks.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()

      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA
    })
  }, [
    isITDepartment,
    activeTab,
    tasksList?.data,
    assignedTasksList?.data,
    myTasksList?.data,
    sortConfig,
    hasEditPermission,
  ])

  const isLoading = isITDepartment
    ? activeTab === "all"
      ? isTasksListLoading
      : isAssignedTasksLoading
    : isMyTasksLoading

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
        userRoles={userRoles}
        usersList={usersList}
        usersLoading={usersLoading}
        currentUser={currentUser}
        createTaskMutation={createTaskMutation}
        updateTaskMutation={updateTaskMutation}
      />
      <AssignModal
        isOpen={assignModal}
        toggle={setAssignModal}
        onAssign={handleAssignTask}
        task={task}
      />

      {isLoading ? (
        <Spinners setLoading={() => {}} />
      ) : (
        <Row>
          <Col xs="12">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
              <div className="w-full sm:w-auto">
                <h5 className="text-xl font-medium mb-3 sm:mb-0">
                  ბილეთების სია
                </h5>
                {(isITDepartment || hasEditPermission) && (
                  <Nav tabs className="mt-3 sm:mt-2">
                    <NavItem>
                      <NavLink
                        className={activeTab === "all" ? "active" : ""}
                        onClick={() => setActiveTab("all")}
                        style={{ cursor: "pointer" }}
                      >
                        ახალი და მიმდინარე
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === "assigned" ? "active" : ""}
                        onClick={() => setActiveTab("assigned")}
                        style={{ cursor: "pointer" }}
                      >
                        ჩემზე მიმაგრებული
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === "completed" ? "active" : ""}
                        onClick={() => setActiveTab("completed")}
                        style={{ cursor: "pointer" }}
                      >
                        დასრულებული
                      </NavLink>
                    </NavItem>
                  </Nav>
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
                  currentUser={currentUser}
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
      <ToastContainer />
    </div>
  )
}

export default TaskList
