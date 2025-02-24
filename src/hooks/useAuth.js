import useAuthStore from "../store/zustand/authStore"

const useAuth = () => {
  const store = useAuthStore()

  if (!store.isInitialized) {
    store.initialize()
  }

  return {
    user: store.user,
    isInitialized: store.isInitialized,

    setUser: store.setUser,
    clearUser: store.clearUser,
    initialize: store.initialize,

    can: store.can,
    isAdmin: store.isAdmin,
    isSuperAdmin: store.isSuperAdmin,
    isDepartmentHead: store.isDepartmentHead,
    isDepartmentHeadAssistant: store.isDepartmentHeadAssistant,
    isAssistant: store.isAssistant,
    isHrMember: store.isHrMember,
    isLegalDepartment: store.isLegalDepartment,
    isITDepartment: store.isITDepartment,
    isITSupport: store.isITSupport,

    hasAnyRole: store.hasAnyRole,
    hasAllRoles: store.hasAllRoles,

    isInDepartment: store.isInDepartment,
    getUserDepartmentId: store.getUserDepartmentId,
    getUserDepartment: store.getUserDepartment,

    canManageInDepartment: store.canManageInDepartment,
    canApproveForDepartment: store.canApproveForDepartment,

    hasAdminPanelAccess: store.hasAdminPanelAccess,
    canManageRoles: store.canManageRoles,
    canDeleteUsers: store.canDeleteUsers,
    canViewAllUsers: store.canViewAllUsers,
    canAccessDepartmentsTab: store.canAccessDepartmentsTab,

    canAny: permissions => {
      return permissions.some(permission => store.can(permission))
    },

    canAll: permissions => {
      return permissions.every(permission => store.can(permission))
    },

    check: permission => ({
      isAllowed: store.can(permission),
      render: component => (store.can(permission) ? component : null),
    }),
  }
}

export default useAuth
