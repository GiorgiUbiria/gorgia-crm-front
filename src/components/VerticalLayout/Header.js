import PropTypes from "prop-types"
import React from "react"

import { connect } from "react-redux"
import { Link } from "react-router-dom"

import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown"
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu"

import logoLight from "../../assets/images/logo-light.png"

//i18n
import { withTranslation } from "react-i18next"

// Redux Store
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
} from "../../store/actions"

import { HiMenuAlt2 } from "react-icons/hi"

const Header = props => {
  const toggleMenu = () => {
    document.body.classList.toggle("sidebar-enable")
    props.toggleLeftmenu(!props.leftMenu)
  }

  React.useEffect(() => {
    const handleCloseSidebar = () => {
      props.toggleLeftmenu(false)
    }

    document.addEventListener("closeSidebar", handleCloseSidebar)
    return () =>
      document.removeEventListener("closeSidebar", handleCloseSidebar)
  }, [props.toggleLeftmenu])

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex align-items-center">
            <div className="navbar-brand-box d-block">
              <Link to="/" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logoLight} alt="" height="42" />
                </span>
              </Link>
              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logoLight} alt="" height="42" />
                </span>
              </Link>
            </div>

            <button
              type="button"
              className="btn header-item d-lg-none"
              onClick={toggleMenu}
              data-testid="mobile-menu-btn"
              style={{ fontSize: "1.75rem" }}
            >
              <HiMenuAlt2
                className="hamburger-icon"
                style={{ fontSize: "larger" }}
              />
            </button>
          </div>
          <div className="d-flex">
            <NotificationDropdown />
            <ProfileMenu />
          </div>
        </div>
      </header>
    </React.Fragment>
  )
}

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
}

const mapStatetoProps = state => {
  const { layoutType, showRightSidebar, leftMenu, leftSideBarType } =
    state.Layout
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType }
}

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header))
