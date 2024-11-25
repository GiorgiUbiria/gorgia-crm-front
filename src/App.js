import PropTypes from "prop-types"
import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { createSelector } from "reselect"
import { Routes, Route } from "react-router-dom"
import { layoutTypes } from "./constants/layout"
import { authProtectedRoutes, publicRoutes } from "./routes"

import Authmiddleware from "./routes/route"

import VerticalLayout from "./components/VerticalLayout/"
import NonAuthLayout from "./components/NonAuthLayout"

import "./assets/scss/theme.scss"
import DataProvider from "components/hoc/DataProvider"

const getLayout = layoutType => {
  let Layout = VerticalLayout
  switch (layoutType) {
    case layoutTypes.VERTICAL:
      Layout = VerticalLayout
      break
    default:
      break
  }
  return Layout
}

const App = () => {
  const LayoutProperties = createSelector(
    state => state.Layout,
    layout => ({
      layoutType: layout.layoutType,
    })
  )

  const { layoutType } = useSelector(LayoutProperties)

  const Layout = getLayout(layoutType)

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
              <Authmiddleware>
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
