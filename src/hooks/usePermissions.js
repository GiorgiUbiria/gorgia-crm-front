export const usePermissions = () => {
  const user = JSON.parse(sessionStorage.getItem("authUser")) || {}

  const hasRole = role => {
    return user?.roles?.some(r => r.slug === role) || false
  }

  const isAdmin = hasRole("admin")
  const isDepartmentHead = hasRole("department_head")
  const isDepartmentHeadAssistant = hasRole("department_head_assistant")
  const isHrMember = user?.department_id === 8

  return {
    user,
    hasRole,
    isAdmin,
    isDepartmentHead,
    isDepartmentHeadAssistant,
    isHrMember,
    userDepartmentId: user?.department_id,
    userDepartment: user?.department.name,
  }
}
