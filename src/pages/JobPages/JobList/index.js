import React, { Fragment, useMemo, useState } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import { Row, Col, Nav, NavItem, NavLink } from "reactstrap"
import { ToastContainer, toast } from "react-toastify"
import { Link } from "react-router-dom"

import DeleteModal from "./DeleteModal"
import TaskModal from "./TaskModal"
import AssignModal from "./AssignModal"
import PaginationControls from "./PaginationControls"
import TaskTable from "./TaskTable"
import Spinners from "../../../components/Common/Spinner"

import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
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

  // Query for all tasks
  const { data: allTasksData, isLoading: isAllTasksLoading } = useTasks({})

  // Query for my tasks
  const { data: myTasksData, isLoading: isMyTasksLoading } = useTasks({
    assigned_user_id: currentUser?.id,
  })

  // Query for assigned tasks
  const { data: assignedTasksData, isLoading: isAssignedTasksLoading } = useTasks({
    department_id: 5,
    assigned_user_id: currentUser?.id,
  })

  const tasksList = allTasksData?.data || []
  const myTasksList = myTasksData?.data || []
  const assignedTasksList = assignedTasksData?.data || []

  const sortedTasks = useMemo(() => {
    const tasksToSort =
      isITDepartment || hasEditPermission
        ? activeTab === "all"
          ? [...tasksList]
          : activeTab === "assigned"
          ? [...assignedTasksList]
          : [...tasksList]
        : [...myTasksList]

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
    tasksList,
    assignedTasksList,
    myTasksList,
    sortConfig,
    hasEditPermission,
  ])

  const isLoading = isITDepartment
    ? activeTab === "all"
      ? isAllTasksLoading
      : isAssignedTasksLoading
    : isMyTasksLoading

  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

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
      toast.success("დავალება წარმატებით წაიშალა")
    } catch (error) {
      console.error("Error deleting task:", error)
      toast.error(
        error.response?.data?.message ||
          "დავალების წაშლის დროს დაფიქსირდა შეცდომა"
      )
    }
  }

  const handleAssignTask = async selectedUsers => {
    try {
      await updateTaskMutation.mutateAsync({
        id: task.id,
        data: {
          assigned_users: selectedUsers,
        },
      })
      setAssignModal(false)
      toast.success("დავალება წარმატებით მიენიჭა")
    } catch (error) {
      console.error("Error assigning task:", error)
      toast.error(
        error.response?.data?.message ||
          "დავალების მინიჭების დროს დაფიქსირდა შეცდომა"
      )
    }
  }

  const handleStartTask = async taskId => {
    try {
      await updateTaskMutation.mutateAsync({
        id: taskId,
        data: { status: "In Progress" },
      })
      toast.success("დავალება დაწყებულია")
    } catch (error) {
      console.error("Error starting task:", error)
      toast.error(
        error.response?.data?.message ||
          "დავალების დაწყების დროს დაფიქსირდა შეცდომა"
      )
    }
  }

  const handleFinishTask = async taskId => {
    try {
      await updateTaskMutation.mutateAsync({
        id: taskId,
        data: { status: "Completed" },
      })
      toast.success("დავალება დასრულებულია")
    } catch (error) {
      console.error("Error finishing task:", error)
      toast.error(
        error.response?.data?.message ||
          "დავალების დასრულების დროს დაფიქსირდა შეცდომა"
      )
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
