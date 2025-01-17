import React, { useState } from "react"
import { TabContent, TabPane } from "reactstrap"
import UsersTab from "./UsersTab"
import DepartmentsTab from "./DepartmentsTab"
import useAuth from "hooks/useAuth"
import { useGetDepartments } from "../../queries/admin"
import CrmSpinner from "components/CrmSpinner"
import { useGetRoles } from "../../queries/role"

const AdminPage = () => {
  document.title = "ადმინისტრირება | Gorgia LLC"

  const [activeTab, setActiveTab] = useState("1")
  const { can, isLoading: isAuthLoading, check } = useAuth()
  const { data: roles = [], isLoading: isRolesLoading } = useGetRoles()

  const { data: departments = [], isLoading: isDepartmentsLoading } =
    useGetDepartments({
      enabled: can("role:admin"),
    })

  const isLoading =
    isAuthLoading ||
    (can("role:admin") && isDepartmentsLoading) ||
    isRolesLoading

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab)
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

  return (
    <div className="w-full px-4 py-6">
      <div className="flex w-full border-b border-gray-200 dark:border-gray-700 mb-4">
        <button
          className={`w-1/2 text-sm sm:text-base py-2 px-1 sm:px-4 ${
            activeTab === "1"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
          onClick={() => toggle("1")}
        >
          მომხმარებლები
        </button>
        {check("role:admin").render(
          <button
            className={`w-1/2 text-sm sm:text-base py-2 px-1 sm:px-4 ${
              activeTab === "2"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => toggle("2")}
          >
            დეპარტამენტები
          </button>
        )}
      </div>
      <TabContent activeTab={activeTab} className="p-2 sm:p-3">
        <TabPane tabId="1">
          <UsersTab departments={departments} roles={roles} />
        </TabPane>
        <TabPane tabId="2">
          <DepartmentsTab departments={departments} />
        </TabPane>
      </TabContent>
    </div>
  )
}

export default AdminPage
