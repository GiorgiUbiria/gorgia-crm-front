import PropTypes from "prop-types"
import React from "react"
import { IoArrowBack } from "react-icons/io5"
import { useTheme } from "../../hooks/useTheme"
import Header from "./Header"
import Sidebar from "./Sidebar"
import Footer from "./Footer"
import Breadcrumbs from "./Breadcrumbs"

const Layout = props => {
  useTheme()

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen flex flex-col bg-app-light dark:bg-app-dark transition-colors duration-200">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Sidebar
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div
        className={`flex-1 transition-all duration-200 ${
          isSidebarOpen ? "md:ml-72" : ""
        }`}
      >
        <div className="flex flex-col min-h-screen pt-16">
          <div className="flex-1 flex flex-col">
            <div className="mx-4 mt-4 flex justify-between items-center">
              <button
                onClick={handleGoBack}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <IoArrowBack className="text-lg" />
                <span>უკან</span>
              </button>
              <Breadcrumbs />
            </div>
            <main className="flex-1 px-4 py-6">
              <div className="!bg-white dark:!bg-gray-900 rounded-lg !shadow-sm dark:!shadow-gray-800/30 p-6 mb-8 transition-colors duration-200">
                {props.children}
              </div>
            </main>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.any,
}

export default Layout
