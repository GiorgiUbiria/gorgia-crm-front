/* eslint-disable no-unused-vars */
import React, { useMemo } from "react"
import * as XLSX from "xlsx"
import { CrmTable } from "components/CrmTable"
import CrmDialog, { DialogButton } from "components/CrmDialogs/Dialog"
import { AddUserForm } from "./components/user/add"
import useModalStore from "store/zustand/modalStore"
import {
  useGetAdminUsers,
  useApproveDepartmentMember,
  useRejectDepartmentMember,
  useGetDepartmentMembers,
  useDeleteUser,
} from "queries/admin"
import CrmSpinner from "components/CrmSpinner"
import { EditUserForm } from "./components/user/edit"
import { Badge } from "./components/Badge"
import useAuth from "hooks/useAuth"

const roleNameMapping = {
  admin: "ადმინისტრატორი",
  hr: "HR მენეჯერი",
  vip: "VIP მომხმარებელი",
  user: "მომხმარებელი",
  department_head: "დეპარტამენტის უფროსი",
  department_head_assistant: "დეპარტამენტის უფროსის ასისტენტი",
  manager: "მენეჯერი",
  ceo: "გენერალური დირექტორი",
  ceo_assistant: "გენერალური დირექტორის ასისტენტი",
}

const statusMapping = {
  pending: { label: "მოლოდინში", variant: "warning" },
  accepted: { label: "დადასტურებული", variant: "success" },
  rejected: { label: "უარყოფილი", variant: "destructive" },
}

const UsersTab = ({ departments = [], roles = [] }) => {
  const {
    canManageRoles,
    canDeleteUsers,
    canViewAllUsers,
    isDepartmentHead,
    getUserDepartmentId,
  } = useAuth()

  const { openModal, closeModal, isModalOpen, getModalData } = useModalStore()
  const { data: allUsers = [], isLoading } = useGetAdminUsers({
    enabled: canViewAllUsers() && !isDepartmentHead(),
  })
  const { data: members = [], isLoading: isLoadingMembers } =
    useGetDepartmentMembers(getUserDepartmentId(), {
      enabled: isDepartmentHead() && !canViewAllUsers(),
    })

  const approveMutation = useApproveDepartmentMember()
  const rejectMutation = useRejectDepartmentMember()
  const deleteUserMutation = useDeleteUser()

  const users = useMemo(() => {
    if (canViewAllUsers()) {
      return allUsers
    }
    if (isDepartmentHead() && !canViewAllUsers()) {
      return members
    }
    return []
  }, [allUsers, members, canViewAllUsers, isDepartmentHead])

  const transformedUsers = useMemo(() => {
    if (!Array.isArray(users)) return []

    return users.map(user => ({
      ...user,
      id: user.id,
      role:
        user.roles?.length > 0
          ? user.roles
              ?.map(role => {
                return roleNameMapping[role.slug] || role.name
              })
              .join(", ")
          : "არ აქვს როლი მინიჭებული",
      position: user.position || "-",
      displayName: {
        fullName: `${user.name || ""} ${user.sur_name || ""}`.trim() || "-",
        firstName: user.name || "-",
        lastName: user.sur_name || "-",
      },
      email: user.email || "-",
      department: {
        id: user.department?.id,
        name: user.department?.name || "არ არის მითითებული",
      },
      mobile_number: user.mobile_number || "-",
      working_start_date: user.working_start_date || null,
      status: user.status || "pending",
      statusBadge: statusMapping[user.status || "pending"],
      user_id: user.id_number || "-",
    }))
  }, [users])

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
        id: "name",
        accessorFn: row => row.displayName.fullName,
        cell: info => info.getValue(),
        header: () => <span>სახელი/გვარი</span>,
        meta: {
          filterVariant: "text",
        },
        enableSorting: false,
      },
      {
        id: "user_id",
        accessorKey: "user_id",
        header: () => <span>პირადი ნომერი</span>,
        meta: {
          filterVariant: "text",
        },
        enableSorting: false,
      },
      {
        id: "email",
        accessorKey: "email",
        header: () => <span>ელ-ფოსტა</span>,
        meta: {
          filterVariant: "text",
        },
        enableSorting: false,
      },
      {
        id: "mobile_number",
        accessorKey: "mobile_number",
        header: () => <span>ტელეფონის ნომერი</span>,
        meta: {
          filterVariant: "text",
        },
        enableSorting: false,
      },
      {
        id: "department",
        accessorKey: "department.name",
        header: () => <span>დეპარტამენტი</span>,
        meta: {
          filterVariant: "select",
        },
        enableSorting: false,
      },
      {
        id: "position",
        accessorKey: "position",
        header: () => <span>პოზიცია</span>,
        meta: {
          filterVariant: "text",
        },
        enableSorting: false,
      },
      {
        id: "role",
        accessorKey: "role",
        header: () => <span>როლი</span>,
        meta: {
          filterVariant: "select",
        },
        enableSorting: false,
      },
      {
        id: "status",
        accessorKey: "status",
        header: () => <span>სტატუსი</span>,
        cell: info => {
          const status = info.row.original.statusBadge || statusMapping.pending
          return <Badge variant={status.variant}>{status.label}</Badge>
        },
        meta: {
          filterVariant: "select",
          filterOptions: Object.entries(statusMapping).map(
            ([value, label]) => ({
              value: value,
              label: label.label,
            })
          ),
        },
        enableSorting: false,
      },
      {
        id: "actions",
        enableColumnFilter: false,
        enableSorting: false,
        header: "მოქმედებები",
        cell: info => {
          const user = info.row.original
          return (
            <div className="flex flex-col gap-y-2 max-w-full justify-center items-center">
              <div className="flex items-center gap-x-1">
                <DialogButton
                  actionType="edit"
                  size="xs"
                  onClick={() => {
                    openModal("editUser", { user })
                  }}
                />
                {canDeleteUsers() && (
                  <DialogButton
                    actionType="delete"
                    size="xs"
                    onClick={() => openModal("deleteUser", { user })}
                  />
                )}
              </div>
              {user.status === "pending" && (
                <div className="flex items-center gap-x-1">
                  <DialogButton
                    actionType="approve"
                    size="xs"
                    onClick={() => openModal("approveUser", { user })}
                  />
                  <DialogButton
                    actionType="reject"
                    size="xs"
                    onClick={() => openModal("rejectUser", { user })}
                  />
                </div>
              )}
            </div>
          )
        },
      },
    ],
    [canDeleteUsers, openModal]
  )

  const exportToExcel = () => {
    const data = [
      [
        "სახელი/გვარი",
        "პირადი ნომერი",
        "ელ-ფოსტა",
        "დეპარტამენტი",
        "მობილური",
        "დაწყების თარიღი",
        "როლი",
      ],
      ...transformedUsers.map(user => [
        user.displayName.fullName,
        user.user_id,
        user.email,
        user.department.name,
        user.mobile_number,
        user.working_start_date
          ? new Date(user.working_start_date).toLocaleDateString()
          : "-",
        user.role,
      ]),
    ]

    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Users")
    XLSX.writeFile(wb, "მომხმარებლები.xlsx")
  }

  if (
    (canViewAllUsers() && !isDepartmentHead() && isLoading) ||
    (isDepartmentHead() && !canViewAllUsers() && isLoadingMembers)
  ) {
    return (
      <div className="flex justify-center items-center h-64">
        <CrmSpinner />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex gap-x-2">
        <DialogButton
          actionType="add"
          size="sm"
          onClick={() => openModal("addUser")}
        />
        <DialogButton
          actionType="downloadExcel"
          size="sm"
          onClick={exportToExcel}
        />
      </div>

      <CrmDialog
        isOpen={isModalOpen("addUser")}
        onOpenChange={open => !open && closeModal("addUser")}
        title="მომხმარებლის დამატება"
        description="შეავსეთ ფორმა მომხმარებლის დასამატებლად"
        footer={
          <>
            <DialogButton
              actionType="cancel"
              onClick={() => closeModal("addUser")}
            >
              გაუქმება
            </DialogButton>
            <DialogButton actionType="add" type="submit" form="addUserForm">
              დამატება
            </DialogButton>
          </>
        }
      >
        <AddUserForm
          onSuccess={() => closeModal("addUser")}
          departments={departments}
          roles={canManageRoles() ? roles : []}
          canEditRoles={canManageRoles()}
        />
      </CrmDialog>

      <CrmDialog
        isOpen={isModalOpen("editUser")}
        onOpenChange={open => !open && closeModal("editUser")}
        title="მომხმარებლის რედაქტირება"
        description="შეავსეთ ფორმა მომხმარებლის რედაქტირებისთვის"
        footer={
          <>
            <DialogButton
              actionType="cancel"
              onClick={() => closeModal("editUser")}
            >
              გაუქმება
            </DialogButton>
            <DialogButton actionType="edit" type="submit" form="editUserForm">
              შენახვა
            </DialogButton>
          </>
        }
      >
        <EditUserForm
          onSuccess={() => closeModal("editUser")}
          departments={departments}
          roles={canManageRoles() ? roles : []}
          canEditRoles={canManageRoles()}
          user={getModalData("editUser")?.user}
        />
      </CrmDialog>

      <CrmDialog
        isOpen={isModalOpen("approveUser")}
        onOpenChange={open => !open && closeModal("approveUser")}
        title="მომხმარებლის დადასტურება"
        description={`ნამდვილად გსურთ მომხმარებლის "${
          getModalData("approveUser")?.user?.displayName?.fullName
        }" დადასტურება?`}
        footer={
          <>
            <DialogButton
              actionType="cancel"
              onClick={() => closeModal("approveUser")}
            >
              გაუქმება
            </DialogButton>
            <DialogButton
              actionType="approve"
              onClick={async () => {
                const user = getModalData("approveUser")?.user
                if (!user.department.id) {
                  console.error("User doesn't have a department assigned")
                  return
                }
                await approveMutation.mutateAsync({
                  departmentId: user.department.id,
                  userId: user.id,
                })
                closeModal("approveUser")
              }}
              loading={approveMutation.isPending}
            >
              დადასტურება
            </DialogButton>
          </>
        }
      />

      <CrmDialog
        isOpen={isModalOpen("rejectUser")}
        onOpenChange={open => !open && closeModal("rejectUser")}
        title="მომხმარებლის უარყოფა"
        description={`ნამდვილად გსურთ მომხმარებლის "${
          getModalData("rejectUser")?.user?.displayName?.fullName
        }" უარყოფა?`}
        footer={
          <>
            <DialogButton
              actionType="cancel"
              onClick={() => closeModal("rejectUser")}
            >
              გაუქმება
            </DialogButton>
            <DialogButton
              actionType="reject"
              onClick={async () => {
                const user = getModalData("rejectUser")?.user
                await rejectMutation.mutateAsync({
                  departmentId: user.department?.id,
                  userId: user.id,
                })
                closeModal("rejectUser")
              }}
              loading={rejectMutation.isPending}
            >
              უარყოფა
            </DialogButton>
          </>
        }
      />

      <CrmDialog
        isOpen={isModalOpen("deleteUser")}
        onOpenChange={open => !open && closeModal("deleteUser")}
        title="მომხმარებლის წაშლა"
        description={`ნამდვილად გსურთ მომხმარებლის "${
          getModalData("deleteUser")?.user?.displayName?.fullName
        }" წაშლა?`}
        footer={
          <>
            <DialogButton
              actionType="cancel"
              onClick={() => closeModal("deleteUser")}
            >
              გაუქმება
            </DialogButton>
            <DialogButton
              actionType="delete"
              onClick={async () => {
                const user = getModalData("deleteUser")?.user
                await deleteUserMutation.mutateAsync(user.id)
                closeModal("deleteUser")
              }}
              loading={deleteUserMutation.isPending}
            >
              წაშლა
            </DialogButton>
          </>
        }
      />

      <CrmTable columns={columns} data={transformedUsers} size="md" />
    </div>
  )
}

export default UsersTab
