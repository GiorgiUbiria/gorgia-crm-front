import React from "react"
import { Table, Badge, Spinner } from "reactstrap"
import { Link, useNavigate } from "react-router-dom"
import { MdEdit, MdDelete, Md1kPlus } from "react-icons/md"
import { formatDate } from "../../../utils/dateUtils"
import useCurrentUser from "../../../hooks/useCurrentUser"

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
  const { currentUser, isLoading } = useCurrentUser()

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <Spinner color="primary" />
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="text-center p-5">
        <p>Please log in to view tasks.</p>
      </div>
    )
  }

  const canAccessTaskDetails = task => {
    return (
      hasEditPermission || // Admin
      task.user_id === currentUser?.id || // Task creator
      (currentUser?.department_id === 5 && // IT department
        task.assigned_to === currentUser?.id) // Assigned user
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
      header: "პასუხისმგებელი პირი",
      accessorKey: "assigned_to",
      cell: task => {
        const user = task.assigned_user
        return user ? `${user.name} ${user.sur_name}` : "დაუნიშნავი"
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
          {hasAssignPermission &&
            !task.assigned_to &&
            task.status === "Pending" &&
            activeTab !== "assigned" && (
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
