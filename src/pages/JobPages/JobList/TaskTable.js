import React from "react"
import { Table, Badge, Spinner, UncontrolledTooltip } from "reactstrap"
import { Link, useNavigate } from "react-router-dom"
import { MdEdit, MdDelete, Md1kPlus } from "react-icons/md"
import { formatDate } from "../../../utils/dateUtils"
import useAuth from "hooks/useAuth"

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
  const { user, isLoading, getUserDepartmentId } = useAuth()

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
      hasEditPermission || // Admin
      task.user_id === user?.id || // Task creator
      getUserDepartmentId() === 5 || // IT department
      task.assigned_users?.some(user => user.id === user?.id) // Assigned user
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
    // Check if user is in IT department
    if (getUserDepartmentId() !== 5) return false

    // Don't show for completed or cancelled tasks
    if (task.status === "Completed" || task.status === "Cancelled") return false

    // Don't show in assigned tab
    if (activeTab === "assigned") return false

    const isAdmin = isAdmin()
    const isITSupport = isITSupport()

    // Always show for admin and IT support, regardless of assignment
    if (isAdmin || isITSupport) return true

    // For regular IT members, only show if they're not already assigned
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
            return <Badge className="bg-danger">მაღალი</Badge>
          case "Medium":
            return <Badge className="bg-warning">საშუალო</Badge>
          case "Low":
            return <Badge className="bg-success">დაბალი</Badge>
          default:
            return <Badge className="bg-secondary">უცნობი</Badge>
        }
      },
    },
    {
      header: "სტატუსი",
      accessorKey: "status",
      cell: task => {
        switch (task.status) {
          case "Pending":
            return <Badge className="bg-warning">ახალი</Badge>
          case "In Progress":
            return <Badge className="bg-info">მიმდინარე</Badge>
          case "Completed":
            return <Badge className="bg-success">დასრულებული</Badge>
          case "Cancelled":
            return <Badge className="bg-danger">გაუქმებული</Badge>
          default:
            return <Badge className="bg-secondary">უცნობი</Badge>
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
                  className="btn btn-sm btn-soft-info action-button"
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
                  className="btn btn-sm btn-soft-danger action-button"
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
                className="btn btn-sm btn-soft-info action-button"
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
      <Table hover className="table-nowrap min-w-full">
        <thead className="thead-light">
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.accessorKey || index}
                className="whitespace-nowrap"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr
              key={task.id}
              onClick={e => handleRowClick(e, task)}
              className={`cursor-pointer hover:bg-gray-50 ${
                canAccessTaskDetails(task) ? "" : "opacity-75"
              }`}
            >
              {columns.map((column, index) => (
                <td
                  key={`${task.id}-${column.accessorKey || index}`}
                  className="whitespace-nowrap"
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
