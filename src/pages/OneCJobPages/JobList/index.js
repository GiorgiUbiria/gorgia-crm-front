import React, { useMemo, useCallback } from "react"
import * as Tooltip from "@radix-ui/react-tooltip"
import {
  useGetMyTasks,
  useGetTaskList,
  useGetTasksAssignedToMe,
} from "../../../queries/oneCTasks"
import { CrmTable } from "components/CrmTable"
import useAuth from "hooks/useAuth"
import CrmSpinner from "components/CrmSpinner"
import CrmDialog, { DialogButton } from "components/CrmDialogs/Dialog"
import { AddOneCTaskForm } from "./components/add"
import useModalStore from "store/zustand/modalStore"
import { AssignTaskForm } from "./components/assign"
import { useNavigate } from "react-router-dom"
import {
  STATUS_MAPPINGS,
  PRIORITY_MAPPINGS,
  STATUS_COLORS,
  PRIORITY_COLORS,
} from "./utils/mappings"

const TaskList = () => {
  document.title = "1C Tasks List | Gorgia LLC"
  const [activeTab, setActiveTab] = React.useState("all")
  const navigate = useNavigate()

  const handleRowClick = useCallback(
    row => {
      navigate(`/support/1c-tasks/${row.original.id}`)
    },
    [navigate]
  )

  const { openModal, closeModal, isModalOpen, getModalData } = useModalStore()
  const isAddModalOpen = isModalOpen("addOneCTask")
  const isAssignModalOpen = isModalOpen("assignOneCTask")

  const { can, check } = useAuth()

  const hasAssignPermission = useMemo(
    () => can("role:admin|department:35"),
    [can]
  )

  const canViewAllTasks = useMemo(() => can("role:admin|department:35"), [can])

  const { data: tasksList = [], isLoading } = useGetTaskList({
    enabled: canViewAllTasks,
  })

  const { data: myTasksList = [], isLoading: isLoadingMy } = useGetMyTasks()

  const { data: assignedTasksList = [], isLoading: isLoadingAssigned } =
    useGetTasksAssignedToMe({
      enabled: canViewAllTasks,
    })

  const tasks = useMemo(() => {
    if (hasAssignPermission) {
      switch (activeTab) {
        case "all":
          return tasksList?.data || []
        case "my":
          return myTasksList?.data || []
        case "assigned":
          return assignedTasksList?.data || []
        case "completed":
          return (
            tasksList?.data?.filter(
              task => task.status?.toLowerCase() === "completed"
            ) || []
          )
        default:
          return []
      }
    }
    return myTasksList?.data || []
  }, [
    activeTab,
    hasAssignPermission,
    tasksList?.data,
    myTasksList?.data,
    assignedTasksList?.data,
  ])

  const transformedOneCTasks = useMemo(() => {
    return (
      tasks?.map(task => ({
        id: task.id,
        created_at: new Date(task.created_at).toLocaleDateString("ka"),
        status: task.status?.toLowerCase(),
        phone: task.phone_number,
        priority: task.priority?.toLowerCase(),
        title: task.task_title,
        requester: task.user.name + " " + task.user.sur_name,
        assigned_to: task.assigned_users,
      })) || []
    )
  }, [tasks])

  const columns = useMemo(
    () =>
      [
        {
          id: "id",
          accessorFn: row => row.id,
          cell: info => info.getValue(),
          header: () => <span>#</span>,
          enableColumnFilter: false,
          sortingFn: "basic",
          sortDescFirst: true,
        },
        {
          id: "requester",
          accessorFn: row => row.requester,
          cell: info => info.getValue(),
          header: () => <span>მომთხოვნი პირი</span>,
          meta: {
            filterVariant: "text",
          },
          enableSorting: false,
        },
        {
          id: "created_at",
          accessorKey: "created_at",
          header: () => "მოთხოვნის თარიღი",
          cell: info => info.getValue(),
          enableColumnFilter: false,
          sortingFn: "datetime",
          sortDescFirst: true,
        },
        {
          id: "phone",
          accessorKey: "phone",
          header: () => <span>მომთხოვნის ნომერი</span>,
          meta: {
            filterVariant: "text",
          },
          enableSorting: false,
        },
        {
          id: "priority",
          accessorKey: "priority",
          header: () => <span>მოთხოვნის პრიორიტეტი</span>,
          cell: info => {
            const priority = info.getValue()?.toLowerCase()
            return (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  PRIORITY_COLORS[priority] || PRIORITY_COLORS.medium
                }`}
              >
                {PRIORITY_MAPPINGS[priority] || priority}
              </span>
            )
          },
          meta: {
            filterVariant: "select",
            filterOptions: Object.entries(PRIORITY_MAPPINGS).map(
              ([value, label]) => ({
                value,
                label,
              })
            ),
          },
          enableSorting: false,
        },
        {
          id: "status",
          accessorKey: "status",
          header: () => <span>მოთხოვნის სტატუსი</span>,
          cell: info => {
            const status = info.getValue()?.toLowerCase()
            return (
              <div className="inline-flex justify-center">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    STATUS_COLORS[status] || STATUS_COLORS.pending
                  }`}
                  title={STATUS_MAPPINGS[status] || status}
                >
                  {STATUS_MAPPINGS[status] || status}
                </span>
              </div>
            )
          },
          meta: {
            filterVariant: "select",
            filterOptions: Object.entries(STATUS_MAPPINGS).map(([value]) => ({
              value: value,
              label: STATUS_MAPPINGS[value],
            })),
          },
          enableSorting: false,
        },
        {
          id: "assigned_to",
          accessorFn: row => row.assigned_to,
          header: () => <span>მოთხოვნას ასრულებს</span>,
          cell: info => {
            const workers = info.getValue() || []
            if (workers.length === 0) return null

            const firstWorker = workers[0]
            const remainingWorkers = workers.slice(1)

            return (
              <div className="relative group">
                <div className="flex items-center">
                  <span className="text-sm">
                    {firstWorker.name + " " + firstWorker.sur_name}
                  </span>
                  {remainingWorkers.length > 0 && (
                    <Tooltip.Provider>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <button className="ml-2 px-2 py-0.5 text-xs bg-gray-100 dark:!bg-gray-700 text-gray-600 dark:!text-gray-300 rounded-full">
                            +{remainingWorkers.length}
                          </button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="bg-white dark:!bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:!border-gray-700"
                            sideOffset={5}
                          >
                            <div className="flex flex-col gap-1">
                              {remainingWorkers.map(worker => (
                                <div
                                  key={worker.id}
                                  className="whitespace-nowrap text-sm text-gray-700 dark:!text-gray-300"
                                >
                                  {worker.name + " " + worker.sur_name}
                                </div>
                              ))}
                            </div>
                            <Tooltip.Arrow className="fill-white dark:!fill-gray-800" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  )}
                </div>
              </div>
            )
          },
          enableSorting: false,
        },
        hasAssignPermission && {
          id: "actions",
          enableColumnFilter: false,
          enableSorting: false,
          header: () => <span>მოქმედებები</span>,
          cell: ({ row }) => {
            if (row.original.assigned_to?.length > 0) {
              return null
            }

            return (
              <DialogButton
                actionType="assign"
                size="sm"
                label="მიღება"
                onClick={e => {
                  e.stopPropagation()
                  openModal("assignOneCTask", {
                    task_id: row.original.id,
                  })
                }}
              />
            )
          },
        },
      ].filter(Boolean),
    [hasAssignPermission, openModal]
  )

  if (isLoading || isLoadingAssigned || isLoadingMy) {
    return <CrmSpinner />
  }

  return (
    <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
      <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-4">
        <div className="w-full">
          <h5 className="text-lg sm:text-xl font-medium mb-2 text-gray-900 dark:!text-gray-100">
            ბილეთების სია
          </h5>
          <div className="flex flex-wrap gap-1 sm:gap-0 mt-2 border-b border-gray-200 dark:!border-gray-700 overflow-x-auto">
            <button
              className={`px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${
                activeTab === "my"
                  ? "text-blue-600 dark:!text-blue-400 border-b-2 border-blue-600 dark:!border-blue-400"
                  : "text-gray-500 dark:!text-gray-400 hover:text-gray-700 dark:!hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("my")}
            >
              ჩემი ბილეთები
            </button>
            {check("role:admin|department:35").render(
              <>
                <button
                  className={`px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${
                    activeTab === "all"
                      ? "text-blue-600 dark:!text-blue-400 border-b-2 border-blue-600 dark:!border-blue-400"
                      : "text-gray-500 dark:!text-gray-400 hover:text-gray-700 dark:!hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  ყველა ბილეთი
                </button>
                <button
                  className={`px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${
                    activeTab === "assigned"
                      ? "text-blue-600 dark:!text-blue-400 border-b-2 border-blue-600 dark:!border-blue-400"
                      : "text-gray-500 dark:!text-gray-400 hover:text-gray-700 dark:!hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("assigned")}
                >
                  ჩემზე მიბმული
                </button>
                <button
                  className={`px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${
                    activeTab === "completed"
                      ? "text-blue-600 dark:!text-blue-400 border-b-2 border-blue-600 dark:!border-blue-400"
                      : "text-gray-500 dark:!text-gray-400 hover:text-gray-700 dark:!hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("completed")}
                >
                  დასრულებული
                </button>
              </>
            )}
          </div>
        </div>
        <div className="w-full sm:w-auto mt-2 sm:mt-0">
          <DialogButton
            actionType="add"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => openModal("addOneCTask")}
          />
        </div>
      </div>

      <CrmDialog
        isOpen={isAddModalOpen}
        onOpenChange={open => {
          if (!open) closeModal("addOneCTask")
        }}
        title="1C თასქის დამატება"
        description="შეავსეთ ფორმა თასქის დასამატებლად"
        footer={
          <>
            <DialogButton
              actionType="cancel"
              onClick={() => closeModal("addOneCTask")}
            />
            <DialogButton
              type="submit"
              actionType="add"
              form="addOneCTaskForm"
            />
          </>
        }
      >
        <AddOneCTaskForm onSuccess={() => closeModal("addOneCTask")} />
      </CrmDialog>

      <CrmDialog
        isOpen={isAssignModalOpen}
        onOpenChange={open => {
          if (!open) closeModal("assignOneCTask")
        }}
        title="შემსრულებლის მიბმა"
        description="გსურთ მიიღოთ ეს თასქი?"
        footer={
          <>
            <DialogButton
              actionType="cancel"
              onClick={() => closeModal("assignOneCTask")}
            />
            <DialogButton
              type="submit"
              label="მიღება"
              actionType="assign"
              form="assignOneCTaskForm"
            />
          </>
        }
      >
        <AssignTaskForm
          onSuccess={() => closeModal("assignOneCTask")}
          task_id={getModalData("assignOneCTask")?.task_id}
        />
      </CrmDialog>

      <div className="overflow-x-auto">
        <CrmTable
          data={transformedOneCTasks}
          columns={columns}
          onRowClick={handleRowClick}
        />
      </div>
    </div>
  )
}

export default TaskList
