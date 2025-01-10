import React from "react"
import { Navigate } from "react-router-dom"
import { usePermissions } from "hooks/usePermissions"
import { checkAccess } from "utils/accessControl"

const RoleRoute = ({ requiredRoles = [], requiredDepartmentIds = [], children }) => {
  const { user } = usePermissions()

  const hasAccess = checkAccess(user, requiredRoles, requiredDepartmentIds)

  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default RoleRoute
