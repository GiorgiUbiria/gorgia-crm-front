import PropTypes from "prop-types"
import React from "react"
import { Routes, Route } from "react-router-dom"
import { authProtectedRoutes, publicRoutes } from "./routes"

import Authmiddleware from "./routes/route"
import VerticalLayout from "./components/VerticalLayout/"
import NonAuthLayout from "./components/NonAuthLayout"
import { NotificationsProvider } from "context/NotificationsContext"

import "./assets/scss/theme.scss"
import DataProvider from "components/hoc/DataProvider"
import "boxicons/css/boxicons.min.css"
import "./index.css"
import TaskNotification from "./components/TaskNotification"
import UserRegisteredInDepartmentNotification from "./components/UsreRegisteredInDepartmentNotification"
import CsrfTokenProvider from "routes/csrf"
import { usePermissions } from "hooks/usePermissions"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const getLayout = () => {
  let Layout = VerticalLayout
  return Layout
}

const App = () => {
  const Layout = getLayout()
  const { hasRole, userDepartmentId } = usePermissions()

  const shouldShowITNotifications =
    hasRole("admin") || hasRole("department_head") || userDepartmentId === 5

  const shouldShowDepartmentNotifications =
    hasRole("admin") || hasRole("department_head")

  return (
    <CsrfTokenProvider>
      <NotificationsProvider>
        <DataProvider>
          <ToastContainer />
          {shouldShowITNotifications && <TaskNotification />}
          {shouldShowDepartmentNotifications && (
            <UserRegisteredInDepartmentNotification
              departmentId={userDepartmentId}
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
                element={
                  <Authmiddleware
                    permission={route.permission}
                    departmentId={route.departmentId}
                  >
                    <Layout>{route.component}</Layout>
                  </Authmiddleware>
                }
                key={idx}
                exact={true}
              />
            ))}
          </Routes>
        </DataProvider>
      </NotificationsProvider>
    </CsrfTokenProvider>
  )
}

App.propTypes = {
  layout: PropTypes.any,
}

export default App
