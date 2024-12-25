/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useCallback, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import SimpleBar from "simplebar-react"
import { withTranslation } from "react-i18next"
import { usePermissions } from "hooks/usePermissions"
import MenuItem from "./MenuItem"
import { getMenuConfig } from "./menuConfig"

const SidebarContent = ({ t }) => {
  const ref = useRef()
  const location = useLocation()
  const { user } = usePermissions()
  const [expandedMenus, setExpandedMenus] = useState({})
  const [activeMenus, setActiveMenus] = useState([])

  const menuConfig = useMemo(() => getMenuConfig(t, user), [t, user])

  // Enhanced isMenuActive to handle nested paths
  const isMenuActive = useCallback((item, currentPath) => {
    if (!item.to) return false

    // Exact match
    if (item.to === currentPath) return true

    // Check if current path starts with item's path (for nested routes)
    if (currentPath.startsWith(item.to) && item.to !== "/") return true

    // Check submenu
    if (item.submenu) {
      return item.submenu.some(subItem => isMenuActive(subItem, currentPath))
    }

    return false
  }, [])

  // Enhanced getActiveMenuParents to handle nested paths
  const getActiveMenuParents = useCallback(
    (items, currentPath, parents = []) => {
      for (const item of items) {
        if (isMenuActive(item, currentPath)) {
          return parents
        }
        if (item.submenu) {
          const found = getActiveMenuParents(item.submenu, currentPath, [
            ...parents,
            item.key,
          ])
          if (found.length) return found
        }
      }
      return []
    },
    [isMenuActive]
  )

  const activateParentDropdown = useCallback(
    path => {
      const activeParents = getActiveMenuParents(menuConfig, path)
      setExpandedMenus(prev => {
        const newState = { ...prev }
        activeParents.forEach(key => {
          newState[key] = true
        })
        return newState
      })

      // Find all active paths (current path and its parent paths)
      const allActivePaths = menuConfig.reduce((acc, item) => {
        if (isMenuActive(item, path)) {
          acc.push(item.to)
        }
        if (item.submenu) {
          item.submenu.forEach(subItem => {
            if (isMenuActive(subItem, path)) {
              acc.push(subItem.to)
            }
          })
        }
        return acc
      }, [])

      setActiveMenus([...activeParents, ...allActivePaths])
    },
    [menuConfig, getActiveMenuParents, isMenuActive]
  )

  const toggleMenu = useCallback(key => {
    setExpandedMenus(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }, [])

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
      return submenuItems.map((item, index) => (
        <MenuItem
          key={`${item.to}-${index}`}
          to={item.to}
          icon={item.icon}
          label={item.label}
          hasSubmenu={!!item.submenu}
          isExpanded={item.submenu && expandedMenus[item.key]}
          isActive={activeMenus.includes(item.to)}
          onClick={() => handleMenuClick(item)}
        >
          {item.submenu && renderSubmenu(item.submenu)}
        </MenuItem>
      ))
    },
    [expandedMenus, activeMenus, handleMenuClick]
  )

  const menuItems = useMemo(
    () =>
      menuConfig.map((item, index) => (
        <MenuItem
          key={`${item.to}-${index}`}
          to={item.to}
          icon={item.icon}
          label={item.label}
          hasSubmenu={!!item.submenu}
          isExpanded={item.submenu && expandedMenus[item.key]}
          isActive={activeMenus.includes(item.to)}
          onClick={() => handleMenuClick(item)}
        >
          {item.submenu && renderSubmenu(item.submenu)}
        </MenuItem>
      )),
    [menuConfig, expandedMenus, activeMenus, handleMenuClick, renderSubmenu]
  )

  // Activate menu based on current path
  useEffect(() => {
    activateParentDropdown(location.pathname)
  }, [location.pathname, activateParentDropdown])

  // Recalculate SimpleBar on mount
  useEffect(() => {
    ref.current?.recalculate()
  }, [])

  return (
    <SimpleBar
      ref={ref}
      className="h-full custom-scrollbar"
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
      <div id="sidebar-menu" className="px-4 py-2">
        <ul className="list-none" id="side-menu">
          {menuItems}
        </ul>
      </div>
    </SimpleBar>
  )
}

export default withTranslation()(React.memo(SidebarContent))
