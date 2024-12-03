import PropTypes from "prop-types"
import React from "react"
import { Routes, Route } from "react-router-dom"
import { authProtectedRoutes, publicRoutes } from "./routes"

import Authmiddleware from "./routes/route"
import VerticalLayout from "./components/VerticalLayout/"
import NonAuthLayout from "./components/NonAuthLayout"

import "./assets/scss/theme.scss"
import DataProvider from "components/hoc/DataProvider"
import 'boxicons/css/boxicons.min.css';

const getLayout = () => {
  let Layout = VerticalLayout
  return Layout
}

const App = () => {
  const Layout = getLayout()

  return (
    <DataProvider>
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
  )
}

App.propTypes = {
  layout: PropTypes.any,
}

export default App
