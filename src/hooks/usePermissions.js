import { useMemo } from "react"
import useUserRoles from "hooks/useUserRoles"

export const usePermissions = () => {
  const user = useMemo(() => {
    const storedUser = sessionStorage.getItem("authUser")
    return storedUser ? JSON.parse(storedUser) : null
  }, [])

  const hasRole = useMemo(
    () => role => user?.roles?.some(r => r.slug === role) || false,
    [user]
  )

  const hasPermission = useMemo(
    () => (permission, departmentId) => {
      if (!user) return false
      if (hasRole("admin")) return true

      const hasPermissionInRoles = user.roles?.some(role =>
        role.permissions.some(p => p.slug === permission)
      )
      if (!hasPermissionInRoles) return false

      if (departmentId !== undefined) {
        if (hasRole("department_head")) {
          return user.department_id === departmentId
        }

        if (
          permission.startsWith("hr-documents.") &&
          user.department_id === 8
        ) {
          return true
        }

        return user.department_id === departmentId
      }

      return true
    },
    [user, hasRole]
  )

  const roles = useUserRoles()

  const { isAdmin, isDepartmentHead, isHrMember } = useMemo(() => {
    return {
      isAdmin: roles.includes("admin"),
      isDepartmentHead: roles.includes("department_head"),
      isHrMember: user?.department_id === 8,
    }
  }, [roles, user])

  return {
    hasRole,
    hasPermission,
    roles,
    isAdmin,
    isDepartmentHead,
    isHrMember,
    userDepartmentId: user?.department_id,
  }
}
