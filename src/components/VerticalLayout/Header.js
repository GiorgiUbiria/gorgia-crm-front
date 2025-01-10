import PropTypes from "prop-types"
import React from "react"
import { Link } from "react-router-dom"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"

// Import components
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu"
import ThemeSwitcher from "../CommonForBoth/TopbarDropdown/ThemeSwitcher"

// Import logo
import logo from "../../assets/images/gorgia-logo-04.png"

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-[#edf3fd] dark:bg-gray-900 shadow-sm z-50 transition-colors">
      <div className="h-16 max-w-[1920px] mx-auto flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 hover:bg-blue-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-gray-700"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <XMarkIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            )}
          </button>
          <Link
            to="/"
            className="flex items-center transition-transform hover:scale-[1.02]"
            aria-label="Go to homepage"
          >
            <img
              src={logo}
              alt="Gorgia Logo"
              className="h-8 md:h-10 object-contain"
            />
          </Link>
        </div>

        <div className="flex items-center h-full">
          <ThemeSwitcher />
          <ProfileMenu />
        </div>
      </div>
    </header>
  )
}

Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
}

export default Header
