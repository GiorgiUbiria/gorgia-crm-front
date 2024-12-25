import PropTypes from "prop-types"
import React, { useEffect } from "react"
import withRouter from "components/Common/withRouter"
import {
  changeLayout,
  changeLayoutMode,
  changeSidebarTheme,
  changeSidebarThemeImage,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
  showRightSidebarAction,
} from "../../store/actions"

// Layout Related Components
import Header from "./Header"
import Sidebar from "./Sidebar"

//redux
import { useSelector, useDispatch } from "react-redux"
import { createSelector } from "reselect"

const Layout = props => {
  const dispatch = useDispatch()

  const selectLayoutProperties = createSelector(
    state => state.Layout,
    layout => ({
      isPreloader: layout.isPreloader,
      layoutModeType: layout.layoutModeType,
      leftSideBarThemeImage: layout.leftSideBarThemeImage,
      leftSideBarType: layout.leftSideBarType,
      layoutWidth: layout.layoutWidth,
      topbarTheme: layout.topbarTheme,
      showRightSidebar: layout.showRightSidebar,
      leftSideBarTheme: layout.leftSideBarTheme,
    })
  )

  const {
    leftSideBarThemeImage,
    layoutWidth,
    leftSideBarType,
    topbarTheme,
    leftSideBarTheme,
    layoutModeType,
  } = useSelector(selectLayoutProperties)

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  //hides right sidebar on body click
  const hideRightbar = event => {
    var rightbar = document.getElementById("right-bar")
    //if clicked in inside right bar, then do nothing
    if (rightbar && rightbar.contains(event.target)) {
      return
    } else {
      //if clicked in outside of rightbar then fire action for hide rightbar
      dispatch(showRightSidebarAction(false))
    }
  }

  /*
  layout  settings
  */

  useEffect(() => {
    //init body click event fot toggle rightbar
    document.body.addEventListener("click", hideRightbar, true)
    return () => {
      document.body.removeEventListener("click", hideRightbar, true)
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    dispatch(changeLayout("vertical"))
  }, [dispatch])

  useEffect(() => {
    if (leftSideBarTheme) {
      dispatch(changeSidebarTheme(leftSideBarTheme))
    }
  }, [leftSideBarTheme, dispatch])

  useEffect(() => {
    if (layoutModeType) {
      dispatch(changeLayoutMode(layoutModeType))
    }
  }, [layoutModeType, dispatch])

  useEffect(() => {
    if (leftSideBarThemeImage) {
      dispatch(changeSidebarThemeImage(leftSideBarThemeImage))
    }
  }, [leftSideBarThemeImage, dispatch])

  useEffect(() => {
    if (layoutWidth) {
      dispatch(changeLayoutWidth(layoutWidth))
    }
  }, [layoutWidth, dispatch])

  useEffect(() => {
    if (leftSideBarType) {
      dispatch(changeSidebarType(leftSideBarType))
    }
  }, [leftSideBarType, dispatch])

  useEffect(() => {
    if (topbarTheme) {
      dispatch(changeTopbarTheme(topbarTheme))
    }
  }, [topbarTheme, dispatch])

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Sidebar
        theme={leftSideBarTheme}
        type={leftSideBarType}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
      />
      <main
        className={`pt-16 transition-all duration-300 ${
          isSidebarOpen ? "md:ml-64" : ""
        }`}
      >
        {props.children}
      </main>
    </div>
  )
}

Layout.propTypes = {
  changeLayoutWidth: PropTypes.func,
  changeSidebarTheme: PropTypes.func,
  changeSidebarThemeImage: PropTypes.func,
  changeSidebarType: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  children: PropTypes.any,
  isPreloader: PropTypes.any,
  layoutWidth: PropTypes.any,
  leftSideBarTheme: PropTypes.any,
  leftSideBarThemeImage: PropTypes.any,
  leftSideBarType: PropTypes.any,
  location: PropTypes.object,
  showRightSidebar: PropTypes.any,
  topbarTheme: PropTypes.any,
}

export default withRouter(Layout)
