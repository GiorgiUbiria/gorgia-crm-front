import { create } from "zustand"

const checkPermission = (user, permissionString) => {
  if (!permissionString || !user) return true
  if (!user) return false

  const orConditions = permissionString.split("|")

  return orConditions.some(orCondition => {
    const andConditions = orCondition.split(",")

    return andConditions.every(condition => {
      const [key, value] = condition.trim().split(":")

      switch (key) {
        case "role":
          return user.roles?.some(role => role.slug === value)
        case "department":
        case "department_id":
          return user.department_id === parseInt(value)
        case "user":
        case "user_id":
          return user.id === parseInt(value)
        default:
          console.warn(`Unknown permission key: ${key}`)
          return false
      }
    })
  })
}

const useAuthStore = create((set, get) => ({
  user: JSON.parse(sessionStorage.getItem("authUser")) || null,
  isInitialized: false,

  initialize: () => {
    const user = JSON.parse(sessionStorage.getItem("authUser"))
    set({ user, isInitialized: true })
  },

  setUser: user => {
    sessionStorage.setItem("authUser", JSON.stringify(user))
    set({ user })
  },

  clearUser: () => {
    sessionStorage.removeItem("authUser")
    set({ user: null })
  },

  can: permission => {
    const { user } = get()
    return checkPermission(user, permission)
  },

  isAdmin: () => {
    const { user } = get()
    return user?.roles?.some(role => role.slug === "admin") || false
  },

  isSuperAdmin: () => {
    const { user } = get()
    return user?.id === 1
  },

  isDepartmentHead: () => {
    const { user } = get()
    console.log(user)
    return user?.roles?.some(role => role.slug === "department_head") || false
  },

  isDepartmentHeadAssistant: () => {
    const { user } = get()
    return (
      user?.roles?.some(role => role.slug === "department_head_assistant") ||
      false
    )
  },

  isHrMember: () => {
    const { user } = get()
    return user?.department_id === 8
  },

  isLegalDepartment: () => {
    const { user } = get()
    return user?.department_id === 10
  },

  isITDepartment: () => {
    const { user } = get()
    return user?.department_id === 5
  },

  isITSupport: () => {
    const { user } = get()
    return user?.roles?.some(role => role.slug === "it_support")
  },

  isSecurityManager: () => {
    const { user } = get()
    return user?.roles?.some(role => role.slug === "security_manager")
  },

  hasAnyRole: roles => {
    const { user } = get()
    return roles.some(role => user?.roles?.some(r => r.slug === role))
  },

  hasAllRoles: roles => {
    const { user } = get()
    return roles.every(role => user?.roles?.some(r => r.slug === role))
  },

  isInDepartment: departmentId => {
    const { user } = get()
    return user?.department_id === departmentId
  },

  getUserDepartmentId: () => {
    const { user } = get()
    return user?.department_id
  },

  getUserDepartment: () => {
    const { user } = get()
    return user?.department?.name
  },

  canManageInDepartment: departmentId => {
    const { user } = get()
    return (
      user?.roles?.some(
        role => role.slug === "admin" || role.slug === "department_head"
      ) &&
      (user?.department_id === departmentId ||
        user?.roles?.some(role => role.slug === "admin"))
    )
  },

  canApproveForDepartment: departmentId => {
    const { user } = get()
    return (
      user?.roles?.some(
        role =>
          role.slug === "admin" ||
          role.slug === "department_head" ||
          role.slug === "department_head_assistant"
      ) &&
      (user?.department_id === departmentId ||
        user?.roles?.some(role => role.slug === "admin"))
    )
  },

  hasAdminPanelAccess: () => {
    const { user } = get()
    return (
      user?.roles?.some(role => role.slug === "admin") ||
      user?.roles?.some(role => role.slug === "department_head") ||
      user?.department_id === 8
    )
  },

  canManageRoles: () => {
    const { user } = get()
    return user?.roles?.some(role => role.slug === "admin")
  },

  canDeleteUsers: () => {
    const { user } = get()
    return (
      user?.roles?.some(role => role.slug === "admin") ||
      user?.department_id === 8
    )
  },

  canViewAllUsers: () => {
    const { user } = get()
    return (
      user?.roles?.some(role => role.slug === "admin") ||
      (user?.department_id === 8 &&
        user?.roles?.some(role => role.slug === "department_head_assistant"))
    )
  },

  canAccessDepartmentsTab: () => {
    const { user } = get()
    return user?.roles?.some(role => role.slug === "admin")
  },
}))

export default useAuthStore
