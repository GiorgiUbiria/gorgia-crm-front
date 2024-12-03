import React from "react"
import { Navigate } from "react-router-dom"
import useAuth from "hooks/useAuth"
import PermissionRoute from "./PermissionRoute"

const Authmiddleware = ({ permission, departmentId, children }) => {
  const isAuth = useAuth()

  if (!isAuth) {
    return <Navigate to="/auth/login" />
  }

  if (permission) {
    return (
      <PermissionRoute permission={permission} departmentId={departmentId}>
        {children}
      </PermissionRoute>
    )
  }

  return <React.Fragment>{children}</React.Fragment>
}

export default Authmiddleware
