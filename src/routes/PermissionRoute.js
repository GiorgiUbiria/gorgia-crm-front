import React from "react"
import { Navigate } from "react-router-dom"
import { usePermissions } from "hooks/usePermissions"

const PermissionRoute = ({ permission, departmentId, children }) => {
  const { hasPermission, isAdmin } = usePermissions()

  if (isAdmin) {
    return <React.Fragment>{children}</React.Fragment>
  }

  if (permission && !hasPermission(permission, departmentId)) {
    return <Navigate to="/dashboard" replace />
  }

  return <React.Fragment>{children}</React.Fragment>
}

export default PermissionRoute
