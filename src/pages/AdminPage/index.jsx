import React, { useState } from "react"
import { TabContent, TabPane } from "reactstrap"
import UsersTab from "./UsersTab"
import DepartmentsTab from "./DepartmentsTab"
import useAuth from "hooks/useAuth"
import { useGetDepartments, useGetDepartmentMembers } from "../../queries/admin"
import { useGetUsers } from "../../queries/user"
import CrmSpinner from "components/CrmSpinner"

const AdminPage = () => {
  document.title = "ადმინისტრირება | Gorgia LLC"

  const [activeTab, setActiveTab] = useState("1")
  const { user: currentUser, can, check, isLoading: isAuthLoading } = useAuth()

  const { data: departments = [], isLoading: isDepartmentsLoading } =
    useGetDepartments({
      enabled: can("role:admin"),
    })

  const {
    data: adminUsers = [],
    isLoading: isAdminUsersLoading,
    refetch: refetchUsers,
  } = useGetUsers({
    enabled: can("role:admin|role:hr"),
  })

  const {
    data: departmentMembers = [],
    isLoading: isDepartmentMembersLoading,
    refetch: refetchDepartmentMembers,
  } = useGetDepartmentMembers(currentUser?.department_id, {
    enabled: can("role:department_head") && !!currentUser?.department_id,
  })

  const users = can("role:department_head") ? departmentMembers : adminUsers
  const isLoading =
    isAuthLoading ||
    (can("role:admin") && (isDepartmentsLoading || isAdminUsersLoading)) ||
    (can("role:department_head") && isDepartmentMembersLoading)

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const handleUserDeleted = () => {
    if (can("role:department_head")) {
      refetchDepartmentMembers()
    } else {
      refetchUsers()
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 min-h-screen w-full">
        <div className="w-full px-4 py-6">
          <div className="flex justify-center items-center h-[calc(100vh-12rem)]">
            <CrmSpinner size="lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 min-h-screen w-full">
        <div className="w-full px-4 py-6">
          <div className="flex justify-center items-center">
            <div className="text-center text-gray-600 dark:text-gray-300">
              მომხმარებლის მონაცემები ვერ მოიძებნა
            </div>
          </div>
        </div>
      </div>
    )
  }

  const adminContent = (
    <>
      <div className="flex w-full border-b border-gray-200 dark:border-gray-700 mb-4">
        <button
          className={`w-1/2 text-sm sm:text-base py-2 px-1 sm:px-4 ${
            activeTab === "1"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
          onClick={() => toggle("1")}
        >
          დეპარტამენტები
        </button>
        <button
          className={`w-1/2 text-sm sm:text-base py-2 px-1 sm:px-4 ${
            activeTab === "2"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
          onClick={() => toggle("2")}
        >
          მომხმარებლები
        </button>
      </div>

      <TabContent activeTab={activeTab} className="p-2 sm:p-3">
        <TabPane tabId="1">
          {isDepartmentsLoading ? (
            <div className="flex justify-center py-8">
              <CrmSpinner size="md" />
            </div>
          ) : (
            <DepartmentsTab departments={departments} users={users} />
          )}
        </TabPane>

        <TabPane tabId="2">
          {isAdminUsersLoading ? (
            <div className="flex justify-center py-8">
              <CrmSpinner size="md" />
            </div>
          ) : (
            <UsersTab
              users={users}
              onUserDeleted={handleUserDeleted}
              currentUserDepartmentId={currentUser?.department_id}
              isDepartmentHead={can("role:department_head")}
            />
          )}
        </TabPane>
      </TabContent>
    </>
  )

  const hrContent = isAdminUsersLoading ? (
    <div className="flex justify-center py-8">
      <CrmSpinner size="md" />
    </div>
  ) : (
    <UsersTab
      users={users}
      onUserDeleted={handleUserDeleted}
      isDepartmentHead={true}
      currentUserDepartmentId={currentUser?.department_id}
    />
  )

  const departmentHeadContent = isDepartmentMembersLoading ? (
    <div className="flex justify-center py-8">
      <CrmSpinner size="md" />
    </div>
  ) : users.length > 0 ? (
    <UsersTab
      users={users}
      onUserDeleted={handleUserDeleted}
      isDepartmentHead={true}
      isAdmin={can("role:admin")}
      isHrMember={can("role:hr")}
      currentUserDepartmentId={currentUser?.department_id}
    />
  ) : (
    <div className="alert alert-warning w-full mx-auto">
      თქვენ არ გაქვთ წვდომა!
    </div>
  )

  return (
    <>
      <div className="w-full px-4 py-6">
        <div className="p-2 sm:p-4 md:p-6">
          {check("role:admin").render(adminContent)}
          {check("role:hr").render(hrContent)}
          {check("role:department_head").render(departmentHeadContent)}
        </div>
      </div>
    </>
  )
}

export default AdminPage
