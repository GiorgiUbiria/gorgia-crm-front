import { create } from "zustand"

/**
 * Permission checker that evaluates complex permission strings
 * Format: "role:admin|department:8,role:department_head|user:123"
 * Supports AND (,) and OR (|) operations
 */
const checkPermission = (user, permissionString) => {
  if (!permissionString || !user) return true
  if (!user) return false

  // Split by OR operator
  const orConditions = permissionString.split("|")

  return orConditions.some(orCondition => {
    // Split by AND operator
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
  // State
  user: JSON.parse(sessionStorage.getItem("authUser")) || null,
  isInitialized: false,

  // Actions
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

  // Permission Checks
  can: permission => {
    const { user } = get()
    return checkPermission(user, permission)
  },

  // Common Permission Helpers
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

  // Compound Permission Checks
  hasAnyRole: roles => {
    const { user } = get()
    return roles.some(role => user?.roles?.some(r => r.slug === role))
  },

  hasAllRoles: roles => {
    const { user } = get()
    return roles.every(role => user?.roles?.some(r => r.slug === role))
  },

  // Department Checks
  isInDepartment: departmentId => {
    const { user } = get()
    return user?.department_id === departmentId
  },

  // User Info
  getUserDepartmentId: () => {
    const { user } = get()
    return user?.department_id
  },

  getUserDepartment: () => {
    const { user } = get()
    return user?.department?.name
  },

  // Complex Permission Checks
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

  // Admin panel specific permissions
  hasAdminPanelAccess: () => {
    const { user } = get()
    return (
      user?.roles?.some(role => role.slug === "admin") ||
      user?.roles?.some(role => role.slug === "department_head") ||
      user?.department_id === 8 // HR department
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
      user?.department_id === 8 // HR department
    )
  },

  canViewAllUsers: () => {
    const { user } = get()
    return (
      user?.roles?.some(role => role.slug === "admin") ||
      (user?.department_id === 8 &&
        user?.roles?.some(role => role.slug === "department_head_assistant")) // HR department
    )
  },

  canAccessDepartmentsTab: () => {
    const { user } = get()
    return user?.roles?.some(role => role.slug === "admin")
  },
}))

export default useAuthStore
