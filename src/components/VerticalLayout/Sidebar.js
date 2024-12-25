import PropTypes from "prop-types"
import React from "react"
import { connect } from "react-redux"
import withRouter from "components/Common/withRouter"

import { withTranslation } from "react-i18next"
import SidebarContent from "./SidebarContent"

const Sidebar = ({ isOpen }) => {
  return (
    <aside
      className={`
        fixed top-16 bottom-0 left-0 w-72 bg-[#edf3fd] border-r 
        transition-all duration-300 z-40 overflow-hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="p-2 h-full">
        <SidebarContent />
      </div>
    </aside>
  )
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
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
