import PropTypes from "prop-types"
import React from "react"
import { connect } from "react-redux"
import withRouter from "components/Common/withRouter"
import { withTranslation } from "react-i18next"
import SidebarContent from "./SidebarContent"

const Sidebar = ({ isOpen, setIsOpen }) => {
  const handleLinkClick = () => {
    if (window.innerWidth < 768) { // md breakpoint
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`
          fixed inset-0 bg-gray-900/50 z-30 transition-opacity duration-300
          md:hidden
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 bottom-0 left-0 w-72 bg-[#edf3fd] dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          transition-all duration-300 z-40 
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
          overflow-hidden
          shadow-lg md:shadow-none
        `}
      >
        <div className="flex flex-col h-full">
          <div 
            className="flex-1 overflow-y-auto"
            style={{
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
          >
            <div className="p-4">
              <SidebarContent onLinkClick={handleLinkClick} />
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
}

const mapStatetoProps = state => {
  return {
    layout: state.Layout,
  }
}

export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)))
