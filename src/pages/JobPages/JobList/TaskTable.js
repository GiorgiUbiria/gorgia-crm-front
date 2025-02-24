import React from "react"
import { Table, Badge, Spinner, UncontrolledTooltip } from "reactstrap"
import { Link, useNavigate } from "react-router-dom"
import { MdEdit, MdDelete, Md1kPlus } from "react-icons/md"
import { formatDate } from "../../../utils/dateUtils"
import useAuth from "hooks/useAuth"
import { useTheme } from "hooks/useTheme"

const TaskTable = ({
  tasks,
  sortConfig,
  handleSort,
  hasEditPermission,
  hasAssignPermission,
  onEdit,
  onDelete,
  onAssign,
  activeTab,
}) => {
  const navigate = useNavigate()
  const { user, isLoading, getUserDepartmentId, isAdmin, isITSupport } =
    useAuth()
  const { isDarkMode } = useTheme()

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <Spinner color="primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center p-5">
        <p>Please log in to view tasks.</p>
      </div>
    )
  }

  const canAccessTaskDetails = task => {
    if (!task) return false

    return (
      hasEditPermission ||
      task.user_id === user?.id ||
      getUserDepartmentId() === 5 ||
      task.assigned_users?.some(user => user.id === user?.id)
    )
  }

  const handleRowClick = (e, task) => {
    if (e.target.closest(".action-button")) {
      return
    }

    if (canAccessTaskDetails(task)) {
      navigate(`/support/it-tasks/${task.id}`)
    } else {
      console.warn("You don't have permission to view this task's details")
    }
  }

  const canShowAssignButton = task => {
    if (getUserDepartmentId() !== 5) return false

    if (task.status === "Completed" || task.status === "Cancelled") return false

    if (activeTab === "assigned") return false

    const isAdminUser = isAdmin()
    const isITSupportUser = isITSupport()

    if (isAdminUser || isITSupportUser) return true

    return !task.assigned_users?.some(user => user.id === user?.id)
  }

  const columns = [
    {
      header: "N.",
      accessorKey: "id",
      cell: task =>
        canAccessTaskDetails(task) ? (
          <Link
            to={`/support/it-tasks/${task.id}`}
            className="text-body fw-bold"
          >
            {task.id}
          </Link>
        ) : (
          <span className="text-body">{task.id}</span>
        ),
    },
    {
      header: "პრობლემის ტიპი",
      accessorKey: "task_title",
    },
    {
      header: "მომხმარებელი",
      accessorKey: "user",
      cell: task =>
        task.user ? `${task.user.name} ${task.user.sur_name}` : "N/A",
    },
    {
      header: "ტელეფონი",
      accessorKey: "phone_number",
      cell: task => task.phone_number || "N/A",
    },
    {
      header: "IP მისამართი",
      accessorKey: "ip_address",
      cell: task => task.ip_address || "N/A",
    },
    {
      header: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => handleSort("created_at")}
        >
          შექმნის თარიღი
          <span style={{ marginLeft: "4px" }}>
            {sortConfig.key === "created_at" &&
              (sortConfig.direction === "desc" ? "↓" : "↑")}
          </span>
        </div>
      ),
      accessorKey: "created_at",
      cell: task => formatDate(task.created_at),
    },
    {
      header: "დასრულების თარიღი",
      accessorKey: "end_time",
      cell: task => (task.end_time ? formatDate(task.end_time) : "N/A"),
    },
    {
      header: "პრიორიტეტი",
      accessorKey: "priority",
      cell: task => {
        switch (task.priority) {
          case "High":
            return (
              <Badge className="!bg-red-100 dark:!bg-red-900/50 text-red-800 dark:!text-red-200">
                მაღალი
              </Badge>
            )
          case "Medium":
            return (
              <Badge className="!bg-yellow-100 dark:!bg-yellow-900/50 text-yellow-800 dark:!text-yellow-200">
                საშუალო
              </Badge>
            )
          case "Low":
            return (
              <Badge className="!bg-green-100 dark:!bg-green-900/50 text-green-800 dark:!text-green-200">
                დაბალი
              </Badge>
            )
          default:
            return (
              <Badge className="!bg-gray-100 dark:!bg-gray-900/50 text-gray-800 dark:!text-gray-200">
                უცნობი
              </Badge>
            )
        }
      },
    },
    {
      header: "სტატუსი",
      accessorKey: "status",
      cell: task => {
        switch (task.status) {
          case "Pending":
            return (
              <Badge className="!bg-yellow-50 dark:!bg-yellow-900/50 text-yellow-700 dark:!text-yellow-200">
                ახალი
              </Badge>
            )
          case "In Progress":
            return (
              <Badge className="!bg-blue-50 dark:!bg-blue-900/50 text-blue-700 dark:!text-blue-200">
                მიმდინარე
              </Badge>
            )
          case "Completed":
            return (
              <Badge className="!bg-green-50 dark:!bg-green-900/50 text-green-700 dark:!text-green-200">
                დასრულებული
              </Badge>
            )
          case "Cancelled":
            return (
              <Badge className="!bg-red-50 dark:!bg-red-900/50 text-red-700 dark:!text-red-200">
                გაუქმებული
              </Badge>
            )
          default:
            return (
              <Badge className="bg-gray-50 dark:!bg-gray-900/50 text-gray-700 dark:!text-gray-200">
                უცნობი
              </Badge>
            )
        }
      },
    },
    {
      header: "პასუხისმგებელი პირები",
      accessorKey: "assigned_users",
      cell: task => {
        if (!task.assigned_users?.length) return "დაუნიშნავი"

        const assignedUsers = task.assigned_users
        const mainUser = assignedUsers[0]
        const displayName = `${mainUser.name} ${mainUser.sur_name}`

        if (assignedUsers.length === 1) return displayName

        const tooltipId = `assigned-users-${task.id}`
        return (
          <>
            <span id={tooltipId} style={{ cursor: "help" }}>
              {displayName} +{assignedUsers.length - 1}
            </span>
            <UncontrolledTooltip target={tooltipId} placement="top">
              {assignedUsers
                .slice(1)
                .map(user => `${user.name} ${user.sur_name}`)
                .join(", ")}
            </UncontrolledTooltip>
          </>
        )
      },
    },
    {
      header: "მოქმედება",
      cell: task => (
        <ul className="list-unstyled hstack gap-1 mb-0">
          {hasEditPermission && (
            <>
              <li data-bs-toggle="tooltip" data-bs-placement="top" title="Edit">
                <Link
                  to="#"
                  className="btn btn-sm action-button text-info dark:!text-blue-300 hover:bg-blue-50 dark:!hover:bg-blue-900/30"
                  onClick={e => {
                    e.stopPropagation()
                    onEdit(task)
                  }}
                >
                  <MdEdit />
                </Link>
              </li>
              <li
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Delete"
              >
                <Link
                  to="#"
                  className="btn btn-sm action-button text-danger dark:!text-red-300 hover:bg-red-50 dark:!hover:bg-red-900/30"
                  onClick={e => {
                    e.stopPropagation()
                    onDelete(task)
                  }}
                >
                  <MdDelete />
                </Link>
              </li>
            </>
          )}
          {hasAssignPermission && canShowAssignButton(task) && (
            <li>
              <Link
                to="#"
                className="btn btn-sm action-button text-info dark:!text-blue-300 hover:bg-blue-50 dark:!hover:bg-blue-900/30"
                onClick={e => {
                  e.stopPropagation()
                  onAssign(task)
                }}
              >
                <Md1kPlus />
              </Link>
            </li>
          )}
        </ul>
      ),
    },
  ]

  return (
    <div className="overflow-x-auto">
      <Table
        hover
        size="sm"
        data-bs-theme={isDarkMode ? "dark" : "light"}
        className="table-nowrap min-w-full text-gray-500 dark:!text-gray-400 text-sm"
      >
        <thead className="bg-gray-50 dark:!bg-gray-800/50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.accessorKey || index}
                className="whitespace-nowrap text-gray-600 dark:!text-gray-300 text-sm font-medium"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr
              key={task.id}
              onClick={e => handleRowClick(e, task)}
              className={`cursor-pointer ${
                index % 2 === 0
                  ? "bg-white dark:!bg-gray-900"
                  : "bg-gray-50 dark:!bg-gray-800/50"
              } hover:bg-gray-100 dark:!hover:bg-gray-700/50 
                ${canAccessTaskDetails(task) ? "" : "opacity-75"}`}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={`${task.id}-${column.accessorKey || colIndex}`}
                  className="whitespace-nowrap text-sm"
                >
                  {column.cell ? column.cell(task) : task[column.accessorKey]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default TaskTable
