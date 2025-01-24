import PropTypes from "prop-types"
import React from "react"
import { Routes, Route } from "react-router-dom"
import { authProtectedRoutes, publicRoutes } from "./routes"
import VerticalLayout from "./components/VerticalLayout/"
import NonAuthLayout from "./components/NonAuthLayout"
import AuthInitializer from "./components/AuthInitializer"
import ToastContainer from "./components/CrmToast/ToastContainer"

import "./assets/scss/theme.scss"
import DataProvider from "components/hoc/DataProvider"
import "boxicons/css/boxicons.min.css"
import "./index.css"

const getLayout = () => {
  let Layout = VerticalLayout
  return Layout
}

const App = () => {
  const Layout = getLayout()

  return (
    <DataProvider>
      <AuthInitializer />
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
    </DataProvider>
  )
}

App.propTypes = {
  layout: PropTypes.any,
}

export default App
