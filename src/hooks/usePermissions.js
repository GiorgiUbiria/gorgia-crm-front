// src/hooks/usePermissions.js
export const usePermissions = () => {
  const user = JSON.parse(sessionStorage.getItem("authUser"))

  const hasRole = role => {
    return user?.roles?.some(r => r.slug === role) || false
  }

  const hasPermission = (permission, departmentId) => {
    if (!user) return false

    // Admin has all permissions
    if (hasRole("admin")) return true

    // Check if user has the permission in any of their roles
    const hasPermissionInRoles = user.roles?.some(role =>
      role.permissions.some(p => p.slug === permission)
    )

    if (!hasPermissionInRoles) return false

    // If departmentId is specified, check department access
    if (departmentId !== undefined) {
      // Department heads can access their own department
      if (hasRole("department_head")) {
        return user.department_id === departmentId
      }

      // For HR documents, allow HR department members to access
      if (permission.startsWith("hr-documents.") && user.department_id === 8) {
        return true
      }

      // For other department-specific permissions
      return user.department_id === departmentId
    }

    return true
  }

  const isAdmin = hasRole("admin")
  const isDepartmentHead = hasRole("department_head")
  const isHrMember = user?.department_id === 8

  return {
    hasRole,
    hasPermission,
    isAdmin,
    isDepartmentHead,
    isHrMember,
    userDepartmentId: user?.department_id,
  }
}
