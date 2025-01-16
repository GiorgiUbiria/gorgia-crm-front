/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from "react"
import Spinners from "../../../components/Common/Spinner"
import * as Tooltip from "@radix-ui/react-tooltip"
import {
  useGetMyTasks,
  useGetTaskList,
  useGetTasksAssignedToMe,
} from "../../../queries/farmTasks"
import useFetchUsers from "../../../hooks/useFetchUsers"
import { CrmTable } from "components/CrmTable"
import { usePermissions } from "hooks/usePermissions"
import { AddButton } from "components/CrmActionButtons"
import CrmSpinner from "components/CrmSpinner"
import CrmDialog, { DialogButton } from "components/CrmDialogs/Dialog"
import { AddFarmTaskForm } from "./components/add"

const TaskList = () => {
  document.title = "Farm Tasks List | Gorgia LLC"
  const [activeTab, setActiveTab] = useState("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const currentUser = JSON.parse(sessionStorage.getItem("authUser"))
  const isFarmDepartment = currentUser?.department_id === 38
  const { users: allUsers, loading: usersLoading } = useFetchUsers()
  const usersList = allUsers?.filter(user => user.department_id === 38)
  const { isAdmin } = usePermissions()

  const hasEditPermission = useMemo(() => isAdmin, [isAdmin])
  const hasAssignPermission = useMemo(
    () => isFarmDepartment || isAdmin,
    [isFarmDepartment, isAdmin]
  )

  const { data: tasksList = [], isLoading } = useGetTaskList({
    enabled: isFarmDepartment || hasEditPermission,
  })

  const { data: myTasksList = [], isLoading: isLoadingMy } = useGetMyTasks()

  const { data: assignedTasksList = [], isLoading: isLoadingAssigned } =
    useGetTasksAssignedToMe({
      enabled: isFarmDepartment || hasEditPermission,
    })

  let tasks
  if (hasAssignPermission) {
    if (activeTab === "all") {
      tasks = tasksList?.data || []
    } else if (activeTab === "my") {
      tasks = myTasksList?.data || []
    } else if (activeTab === "assigned") {
      tasks = assignedTasksList?.data || []
    } else {
      // completed
      tasks = tasksList?.data?.filter(task => task.status === "Completed")
    }
  }

  const transformedFarmTasks = React.useMemo(() => {
    return (
      tasks?.map(task => ({
        id: task.id,
        created_at: new Date(task.created_at).toLocaleDateString("ka"),
        status: task.status,
        phone: task.phone_number,
        priority: task.priority,
        title: task.task_title,
        requester: task.user.name + " " + task.user.sur_name,
        assigned_to: task.assigned_users,
      })) || []
    )
  }, [tasks])

  const columns = React.useMemo(
    () => [
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
        meta: {
          filterVariant: "select",
        },
        enableSorting: false,
      },
      {
        id: "status",
        accessorKey: "status",
        header: () => <span>მოთხოვნის სტატუსი</span>,
        meta: {
          filterVariant: "select",
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
                        <button className="ml-2 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                          +{remainingWorkers.length}
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                          sideOffset={5}
                        >
                          <div className="flex flex-col gap-1">
                            {remainingWorkers.map(worker => (
                              <div
                                key={worker.id}
                                className="whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                              >
                                {worker.name + " " + worker.sur_name}
                              </div>
                            ))}
                          </div>
                          <Tooltip.Arrow className="fill-white dark:fill-gray-800" />
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
        cell: () => {
          return <span> მოქმედების ღილაკები </span>
        },
      },
    ],
    [hasAssignPermission]
  )

  if (isLoading || isLoadingAssigned || isLoadingMy) {
    return <CrmSpinner />
  }

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {isLoading ? (
        <Spinners setLoading={() => {}} />
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <div className="w-full sm:w-auto">
            <h5 className="text-xl font-medium mb-3 sm:mb-0 text-gray-900 dark:text-gray-100">
              ბილეთების სია
            </h5>
            <div className="flex mt-3 sm:mt-2 border-b border-gray-200 dark:border-gray-700">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "my"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("my")}
              >
                ჩემი ბილეთები
              </button>
              {(isFarmDepartment || hasEditPermission) && (
                <>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "all"
                        ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("all")}
                  >
                    ყველა ბილეთი
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "assigned"
                        ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("assigned")}
                  >
                    ჩემზე მიბმული ბილეთები
                  </button>
                </>
              )}
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "completed"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("completed")}
              >
                დასრულებული ბილეთები
              </button>
            </div>
          </div>
          <div className="mt-3 sm:mt-0">
            <DialogButton
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
            >
              <AddButton size="sm" />
            </DialogButton>
          </div>
        </div>
      )}
      <CrmDialog
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        title="სამეურნეო თასქის დამატება"
        description="შეავსეთ ფორმა თასქის დასამატებლად"
        footer={
          <>
            <DialogButton
              variant="secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              გაუქმება
            </DialogButton>
            <DialogButton type="submit" form="addFarmTaskForm">
              დამატება
            </DialogButton>
          </>
        }
      >
        <AddFarmTaskForm onSuccess={() => setIsAddModalOpen(false)} />
      </CrmDialog>
      <CrmTable data={transformedFarmTasks} columns={columns} />
    </div>
  )
}

export default TaskList
