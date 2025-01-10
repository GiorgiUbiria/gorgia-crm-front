import React from "react"
import { Navigate } from "react-router-dom"
import useAuth from "hooks/useAuth"
import RoleRoute from "./PermissionRoute"

const Authmiddleware = ({ requiredRoles = [], requiredDepartmentIds = [], children }) => {
  const isAuth = useAuth()

  if (!isAuth) {
    return <Navigate to="/auth/login" />
  }

  if (requiredRoles.length > 0 || requiredDepartmentIds.length > 0) {
    return (
      <RoleRoute requiredRoles={requiredRoles} requiredDepartmentIds={requiredDepartmentIds}>
        {children}
      </RoleRoute>
    )
  }

  return <>{children}</>
}

export default Authmiddleware
