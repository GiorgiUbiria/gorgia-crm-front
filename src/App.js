import PropTypes from "prop-types"
import React from "react"
import { Routes, Route } from "react-router-dom"
import { authProtectedRoutes, publicRoutes } from "./routes"
import VerticalLayout from "./components/VerticalLayout/"
import NonAuthLayout from "./components/NonAuthLayout"
import AuthInitializer from "./components/AuthInitializer"
import ToastContainer from "./components/CrmToast/ToastContainer"
import "./assets/scss/theme.scss"
import "boxicons/css/boxicons.min.css"
import "./index.css"
import UserRegistrationNotification from "components/UserRegistrationNotification"
import useAuth from "hooks/useAuth"

const App = () => {
  const Layout = VerticalLayout

  const { user, getUserDepartmentId, isDepartmentHead } = useAuth()

  return (
    <>
      <AuthInitializer />
      {user && (
        <UserRegistrationNotification
          userId={user.id}
          departmentId={getUserDepartmentId()}
          isHeadOfDepartment={isDepartmentHead()}
        />
      )}
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={<NonAuthLayout>{route.component}</NonAuthLayout>}
            key={idx}
            exact={true}
          />
        ))}
        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={<Layout>{route.component}</Layout>}
            key={idx}
            exact={true}
          />
        ))}
      </Routes>
      <ToastContainer />
    </>
  )
}

App.propTypes = {
  layout: PropTypes.any,
}

export default App
