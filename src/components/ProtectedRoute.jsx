import React from "react"
import { Navigate } from "react-router-dom"
import useAuthStore from "../store/zustand/authStore"
import CrmSpinner from "./CrmSpinner"

const ProtectedRoute = ({
  children,
  permission,
  redirectTo = "/dashboard",
}) => {
  const can = useAuthStore(state => state.can)
  const isInitialized = useAuthStore(state => state.isInitialized)
  const user = useAuthStore(state => state.user)

  // Wait for auth to initialize
  if (!isInitialized) {
    return <CrmSpinner /> // or a loading spinner
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  // Check permissions if specified
  if (permission && !can(permission)) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}

export default ProtectedRoute
