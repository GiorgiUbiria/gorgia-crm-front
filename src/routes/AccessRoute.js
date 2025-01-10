import React from "react"
import { Navigate } from "react-router-dom"
import { useAccess } from "utils/accessGate"

const AccessRoute = ({ conditions = "", children }) => {
  const hasAccess = useAccess(conditions)

  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default AccessRoute
