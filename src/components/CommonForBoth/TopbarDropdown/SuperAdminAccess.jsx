import React, { useState } from "react"
import { Cog6ToothIcon } from "@heroicons/react/24/outline"
import useAuth from "../../../hooks/useAuth"
import {
  getSuperAdminAccess,
  updateSuperAdminRoles,
  updateSuperAdminDepartment,
} from "../../../services/superAdmin"
import { toast } from "../../../store/zustand/toastStore"

const SuperAdminAccess = () => {
  const { isSuperAdmin, setUser, user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [accessData, setAccessData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchAccessData = async () => {
    try {
      setLoading(true)
      const { data } = await getSuperAdminAccess()

      // Update the local state for the form
      setAccessData({
        availableRoles: data.all_roles || [],
        currentRoles: (data.roles || []).map(role => role.id),
        availableDepartments: data.all_departments || [],
        currentDepartment: data.department?.id || null,
      })

      // Also update the user data to ensure it stays in sync
      const updatedUser = {
        ...user,
        roles: data.roles || user.roles,
        department: data.department || user.department,
        department_id: data.department?.id || user.department_id,
      }

      // Ensure roles array exists
      if (!updatedUser.roles) {
        updatedUser.roles = []
      }

      setUser(updatedUser)
      sessionStorage.setItem("authUser", JSON.stringify(updatedUser))
    } catch (error) {
      console.error("Fetch access data error:", error)
      toast.error("მონაცემების მიღება ვერ მოხერხდა")
    } finally {
      setLoading(false)
    }
  }

  const handleRolesUpdate = async roleIds => {
    try {
      setLoading(true)
      const { data } = await updateSuperAdminRoles(roleIds)

      // Keep all existing user data and update only what's changed
      const updatedUser = {
        ...user,
        roles: data.roles || user.roles,
        department: data.department || user.department,
        department_id: data.department?.id || user.department_id,
      }

      // Ensure roles array exists
      if (!updatedUser.roles) {
        updatedUser.roles = []
      }

      setUser(updatedUser)
      sessionStorage.setItem("authUser", JSON.stringify(updatedUser))

      toast.success("როლები წარმატებით განახლდა")
      await fetchAccessData()
    } catch (error) {
      console.error("Update roles error:", error)
      toast.error(
        error.response?.data?.message || "როლების განახლება ვერ მოხერხდა"
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDepartmentUpdate = async departmentId => {
    try {
      setLoading(true)
      const { data } = await updateSuperAdminDepartment(departmentId)

      // Keep all existing user data and update only what's changed
      const updatedUser = {
        ...user,
        department: data.department || user.department,
        department_id: data.department?.id || user.department_id,
        roles: data.roles || user.roles,
      }

      // Ensure roles array exists
      if (!updatedUser.roles) {
        updatedUser.roles = []
      }

      setUser(updatedUser)
      sessionStorage.setItem("authUser", JSON.stringify(updatedUser))

      toast.success("დეპარტამენტი წარმატებით განახლდა")
      await fetchAccessData()
    } catch (error) {
      console.error("Update department error:", error)
      toast.error(
        error.response?.data?.message || "დეპარტამენტის განახლება ვერ მოხერხდა"
      )
    } finally {
      setLoading(false)
    }
  }

  const openModal = () => {
    setIsOpen(true)
    fetchAccessData()
  }

  if (!isSuperAdmin()) return null

  return (
    <>
      <button
        onClick={openModal}
        className="p-1.5 sm:p-2 hover:bg-blue-100 dark:!hover:bg-gray-800 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:!focus:ring-gray-700"
        title="სუპერ ადმინისტრატორის წვდომა"
      >
        <Cog6ToothIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:!text-gray-200" />
      </button>

      <div
        className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-black/30"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        ></div>

        <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
          <div className="w-full max-w-md mx-2 sm:mx-0 p-4 sm:p-6 overflow-hidden text-left align-middle bg-white dark:!bg-gray-800 shadow-xl rounded-lg sm:rounded-2xl">
            <h2
              className="text-lg font-medium mb-4 text-gray-900 dark:!text-gray-100"
              id="modal-title"
            >
              სუპერ ადმინისტრატორის წვდომის კონფიგურაცია
            </h2>

            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {accessData && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2 text-gray-800 dark:!text-gray-200">
                        როლები
                      </h3>
                      <div className="space-y-2">
                        {accessData.availableRoles.map(role => (
                          <label
                            key={role.id}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={accessData.currentRoles.includes(
                                role.id
                              )}
                              onChange={e => {
                                const newRoles = e.target.checked
                                  ? [...accessData.currentRoles, role.id]
                                  : accessData.currentRoles.filter(
                                      id => id !== role.id
                                    )
                                handleRolesUpdate(newRoles)
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:!border-gray-600 dark:!bg-gray-700"
                            />
                            <span className="text-gray-700 dark:!text-gray-200">
                              {role.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2 text-gray-800 dark:!text-gray-200">
                        დეპარტამენტი
                      </h3>
                      <select
                        value={accessData.currentDepartment || ""}
                        onChange={e =>
                          handleDepartmentUpdate(Number(e.target.value))
                        }
                        className="w-full rounded-md border border-gray-300 dark:!border-gray-600 bg-white dark:!bg-gray-700 px-3 py-2 text-gray-700 dark:!text-gray-200"
                      >
                        <option value="">აირჩიეთ დეპარტამენტი</option>
                        {accessData.availableDepartments.map(dept => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:!text-gray-200 hover:bg-gray-100 dark:!hover:bg-gray-700 rounded-md"
                  >
                    დახურვა
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default SuperAdminAccess
