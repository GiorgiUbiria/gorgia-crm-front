import useAuthStore from "../store/zustand/authStore"

const useAuth = () => {
  const store = useAuthStore()

  // Ensure the store is initialized
  if (!store.isInitialized) {
    store.initialize()
  }

  return {
    // Basic auth state
    user: store.user,
    isInitialized: store.isInitialized,

    // Auth actions
    setUser: store.setUser,
    clearUser: store.clearUser,
    initialize: store.initialize,

    // Permission checks
    can: store.can,
    isAdmin: store.isAdmin,
    isDepartmentHead: store.isDepartmentHead,
    isDepartmentHeadAssistant: store.isDepartmentHeadAssistant,
    isHrMember: store.isHrMember,

    // Role checks
    hasAnyRole: store.hasAnyRole,
    hasAllRoles: store.hasAllRoles,

    // Department checks
    isInDepartment: store.isInDepartment,
    getUserDepartmentId: store.getUserDepartmentId,
    getUserDepartment: store.getUserDepartment,

    // Complex checks
    canManageInDepartment: store.canManageInDepartment,
    canApproveForDepartment: store.canApproveForDepartment,

    // Helper to check multiple permissions (any)
    canAny: permissions => {
      return permissions.some(permission => store.can(permission))
    },

    // Helper to check multiple permissions (all)
    canAll: permissions => {
      return permissions.every(permission => store.can(permission))
    },

    // Helper for conditional rendering
    check: permission => ({
      isAllowed: store.can(permission),
      render: component => (store.can(permission) ? component : null),
    }),
  }
}

export default useAuth
