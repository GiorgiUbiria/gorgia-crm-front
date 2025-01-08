import PropTypes from "prop-types"
import React from "react"
import { Link } from "react-router-dom"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"

// Import components
// import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown"
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu"

// Import logo
import logo from "../../assets/images/gorgia-logo-04.png"

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-[#edf3fd] shadow-sm z-50">
      <div className="h-16 max-w-[1920px] mx-auto flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <XMarkIcon className="w-6 h-6 text-gray-700" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-gray-700" />
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

        <div className="flex items-center space-x-2 md:space-x-4">
          {/* <div className="hidden md:block">
            <NotificationDropdown />
          </div> */}
          <div className="relative">
            <ProfileMenu />
          </div>
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
