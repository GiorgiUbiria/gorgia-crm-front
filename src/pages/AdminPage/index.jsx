import React, { useState } from "react"
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"
import classnames from "classnames"
import UsersTab from "./UsersTab"
import DepartmentsTab from "./DepartmentsTab"
import { usePermissions } from "hooks/usePermissions"
import useFetchUser from "hooks/useFetchUser"
import {
  useGetDepartments,
  useGetDepartmentMembers,
} from "../../queries/admin"
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

  const handleDepartmentDeleted = () => {
    if (isAdmin) {
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
              <Nav
                tabs
                className="nav-tabs-custom nav-justified flex flex-wrap"
              >
                <NavItem className="w-1/2">
                  <NavLink
                    className={classnames(
                      "text-sm sm:text-base py-2 px-1 sm:px-4",
                      { active: activeTab === "1" }
                    )}
                    onClick={() => toggle("1")}
                  >
                    <span>დეპარტამენტები</span>
                  </NavLink>
                </NavItem>
                <NavItem className="w-1/2">
                  <NavLink
                    className={classnames(
                      "text-sm sm:text-base py-2 px-1 sm:px-4",
                      { active: activeTab === "2" }
                    )}
                    onClick={() => toggle("2")}
                  >
                    <span>მომხმარებლები</span>
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeTab} className="p-2 sm:p-3">
                <TabPane tabId="1">
                  <DepartmentsTab
                    departments={departments}
                    onDepartmentDeleted={handleDepartmentDeleted}
                    users={users}
                  />
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
              Unauthorized access. Please contact administrator.
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminPage
