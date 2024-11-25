import React from "react"
import { Navigate } from "react-router-dom"
import useAuth from "hooks/useAuth"

const Authmiddleware = props => {
  const isAuth = useAuth()

  if (!isAuth) {
    return <Navigate to="/login" />
  }

  return <React.Fragment>{props.children}</React.Fragment>
}

export default Authmiddleware
