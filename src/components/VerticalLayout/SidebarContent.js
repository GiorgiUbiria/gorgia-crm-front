import React, { useEffect, useRef, useCallback, useMemo } from "react"
import { useLocation } from "react-router-dom"
import SimpleBar from "simplebar-react"
import MetisMenu from "metismenujs"
import { withTranslation } from "react-i18next"
import useIsAdmin from "hooks/useIsAdmin"
import useIsDepartmentHead from "hooks/useIsDepartmentHead"
import MenuItem from "./MenuItem"
import { getMenuConfig } from "./menuConfig"
import useMenuState from "./useMenuState"

const SidebarContent = ({ t }) => {
  const ref = useRef()
  const isAdmin = useIsAdmin()
  const isDepartmentHead = useIsDepartmentHead()
  const location = useLocation()

  const { expandedMenus, toggleMenu } = useMenuState()

  const menuConfig = useMemo(
    () => getMenuConfig(t, isAdmin, isDepartmentHead),
    [t, isAdmin, isDepartmentHead]
  )

  const activateParentDropdown = useCallback(item => {
    item.classList.add("active")
    const parent = item.parentElement
    const parent2El = parent.childNodes[1]

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show")
    }

    if (parent) {
      parent.classList.add("mm-active")
      const parent2 = parent.parentElement

      if (parent2) {
        parent2.classList.add("mm-show")

        const parent3 = parent2.parentElement

        if (parent3) {
          parent3.classList.add("mm-active")
          parent3.childNodes[0].classList.add("mm-active")
          const parent4 = parent3.parentElement
          if (parent4) {
            parent4.classList.add("mm-show")
            const parent5 = parent4.parentElement
            if (parent5) {
              parent5.classList.add("mm-show")
              parent5.childNodes[0].classList.add("mm-active")
            }
          }
        }
      }
      scrollElement(item)
      return false
    }
    scrollElement(item)
    return false
  }, [])

  const removeActivation = useCallback(items => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i]
      const parent = items[i].parentElement

      if (item && item.classList.contains("active")) {
        item.classList.remove("active")
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.length && parent.childNodes[1]
            ? parent.childNodes[1]
            : null
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show")
        }

        parent.classList.remove("mm-active")
        const parent2 = parent.parentElement

        if (parent2) {
          parent2.classList.remove("mm-show")

          const parent3 = parent2.parentElement
          if (parent3) {
            parent3.classList.remove("mm-active")
            parent3.childNodes[0].classList.remove("mm-active")

            const parent4 = parent3.parentElement
            if (parent4) {
              parent4.classList.remove("mm-show")
              const parent5 = parent4.parentElement
              if (parent5) {
                parent5.classList.remove("mm-show")
                parent5.childNodes[0].classList.remove("mm-active")
              }
            }
          }
        }
      }
    }
  }, [])

  const scrollElement = useCallback(item => {
    if (!item) return

    const currentPosition = item.offsetTop
    if (currentPosition > window.innerHeight) {
      const scrollElement = ref.current?.getScrollElement()
      if (scrollElement) {
        scrollElement.scrollTop = currentPosition - 300
      }
    }
  }, [])

  const activeMenu = useCallback(() => {
    const pathName = location.pathname
    const ul = document.getElementById("side-menu")
    if (!ul) return

    const items = ul.getElementsByTagName("a")
    removeActivation(items)

    const matchingMenuItem = Array.from(items).find(
      item => pathName === item.pathname
    )
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem)
    }
  }, [location.pathname, activateParentDropdown, removeActivation])

  const handleMenuClick = useCallback(
    item => {
      if (!item.submenu) {
        document.body.classList.remove("sidebar-enable")
        document.dispatchEvent(new CustomEvent("closeSidebar"))
      }
      if (item.submenu) {
        toggleMenu(item.key)
      }
    },
    [toggleMenu]
  )

  const renderSubmenu = useCallback(
    submenuItems => {
      return submenuItems.filter(Boolean).map((item, index) => (
        <MenuItem
          key={`${item.key || item.to}-${index}`}
          to={item.to}
          label={item.label}
          hasSubmenu={!!item.submenu}
          isExpanded={item.submenu && expandedMenus[item.key]}
          onClick={() => handleMenuClick(item)}
        >
          {item.submenu && renderSubmenu(item.submenu)}
        </MenuItem>
      ))
    },
    [expandedMenus, handleMenuClick]
  )

  const menuItems = useMemo(
    () =>
      menuConfig.map((item, index) => (
        <MenuItem
          key={`${item.key || item.to}-${index}`}
          to={item.to}
          icon={item.icon}
          label={item.label}
          hasSubmenu={!!item.submenu}
          isExpanded={item.submenu && expandedMenus[item.key]}
          onClick={() => handleMenuClick(item)}
        >
          {item.submenu && renderSubmenu(item.submenu)}
        </MenuItem>
      )),
    [menuConfig, expandedMenus, handleMenuClick, renderSubmenu]
  )

  useEffect(() => {
    ref.current?.recalculate()
  }, [])

  useEffect(() => {
    new MetisMenu("#side-menu")
    activeMenu()
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    activeMenu()
  }, [activeMenu])

  return (
    <SimpleBar
      ref={ref}
      className="custom-scrollbar"
      style={{
        maxHeight: "100%",
        "--sb-track-color": "rgba(255, 255, 255, 0.1)",
        "--sb-thumb-color": "rgba(255, 255, 255, 0.4)",
        "--sb-size": "4px",
      }}
      autoHide={true}
      timeout={400}
      clickOnTrack={false}
    >
      <div id="sidebar-menu">
        <ul className="metismenu list-unstyled" id="side-menu">
          {menuItems}
        </ul>
      </div>
    </SimpleBar>
  )
}

export default withTranslation()(React.memo(SidebarContent))
