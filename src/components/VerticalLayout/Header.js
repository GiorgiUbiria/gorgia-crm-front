import PropTypes from "prop-types"
import React from "react"
import { Link } from "react-router-dom"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"

// Import components
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown"
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu"

// Import logo
import logo from "../../assets/images/gorgia-logo-04.png"

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-[#edf3fd] shadow-sm z-50">
      <div className="h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="h-8" />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <NotificationDropdown />
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
