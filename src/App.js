import React from "react"
import { Routes, Route } from "react-router-dom"
import { authProtectedRoutes, publicRoutes } from "./routes"
import VerticalLayout from "./components/VerticalLayout/"
import NonAuthLayout from "./components/NonAuthLayout"
import AuthInitializer from "./components/AuthInitializer"
import ToastContainer from "./components/CrmToast/ToastContainer"

const App = () => {
  const Layout = VerticalLayout

  return (
    <>
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
    </>
  )
}

export default App
