import React, { useState } from "react"
import { TabContent, TabPane } from "reactstrap"
import UsersTab from "./UsersTab"
import DepartmentsTab from "./DepartmentsTab"
import { usePermissions } from "hooks/usePermissions"
import useFetchUser from "hooks/useFetchUser"
import { useGetDepartments, useGetDepartmentMembers } from "../../queries/admin"
import { useGetUsers } from "../../queries/user"

const AdminPage = () => {
  document.title = "ადმინისტრირება | Gorgia LLC"

  const [activeTab, setActiveTab] = useState("1")
  const { user: currentUser } = useFetchUser()
  const { isAdmin, isDepartmentHead, userDepartmentId, isHrMember } =
    usePermissions()

  const { data: departments = [] } = useGetDepartments({
    enabled: isAdmin,
  })

  const { data: adminUsers = [], refetch: refetchUsers } = useGetUsers({
    enabled: isAdmin || isHrMember,
  })

  const { data: departmentMembers = [], refetch: refetchDepartmentMembers } =
    useGetDepartmentMembers(userDepartmentId, {
      enabled: isDepartmentHead && !!userDepartmentId,
    })

  const users = isDepartmentHead ? departmentMembers : adminUsers

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const handleUserDeleted = () => {
    if (isDepartmentHead) {
      refetchDepartmentMembers()
    } else {
      refetchUsers()
    }
  }

  if (!currentUser) {
    return (
      <div className="bg-gray-50 min-h-screen w-full">
        <div className="w-full px-4 py-6">
          <div className="flex justify-center items-center">
            <div className="text-center">Loading user data...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full px-4 py-6">
        <div className="p-2 sm:p-4 md:p-6">
          {isAdmin ? (
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
                  <DepartmentsTab departments={departments} users={users} />
                </TabPane>

                <TabPane tabId="2">
                  <UsersTab
                    users={users}
                    onUserDeleted={handleUserDeleted}
                    currentUserDepartmentId={userDepartmentId}
                    isDepartmentHead={isDepartmentHead}
                  />
                </TabPane>
              </TabContent>
            </>
          ) : isHrMember ? (
            <UsersTab
              users={users}
              onUserDeleted={handleUserDeleted}
              isDepartmentHead={true}
              currentUserDepartmentId={userDepartmentId}
            />
          ) : isDepartmentHead && users.length > 0 ? (
            <UsersTab
              users={users}
              onUserDeleted={handleUserDeleted}
              isDepartmentHead={true}
              isAdmin={isAdmin}
              isHrMember={isHrMember}
              currentUserDepartmentId={userDepartmentId}
            />
          ) : (
            <div className="alert alert-warning w-full mx-auto">
              თქვენ არ გაქვთ წვდომა!
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminPage
