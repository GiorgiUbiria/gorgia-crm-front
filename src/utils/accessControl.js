export const AccessRoles = {
  ADMIN: "admin",
  DEPARTMENT_HEAD: "department_head",
  HR_MEMBER: "hr_member",
}

export const checkAccess = (
  user,
  requiredRoles = [],
  requiredDepartmentIds = []
) => {
  if (!user) return false

  const { roles, department_id } = user

  const hasRequiredRole = requiredRoles.some(role => {
    if (role === AccessRoles.HR_MEMBER) {
      return department_id === 8
    }
    return roles.some(r => r.slug === role)
  })

  const hasRequiredDepartment =
    requiredDepartmentIds.length === 0 ||
    requiredDepartmentIds.includes(department_id)

  return hasRequiredRole && hasRequiredDepartment
}
