/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useCallback, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { withTranslation } from "react-i18next"
import { usePermissions } from "hooks/usePermissions"
import MenuItem from "./MenuItem"
import { getMenuConfig } from "./menuConfig"
import "../customScrollbars.css"

const SidebarContent = ({ t }) => {
  const ref = useRef()
  const location = useLocation()
  const { user } = usePermissions()
  const [expandedMenus, setExpandedMenus] = useState({})
  const [activeMenus, setActiveMenus] = useState([])

  const menuConfig = useMemo(() => getMenuConfig(t, user), [t, user])

  const isMenuActive = useCallback((item, currentPath) => {
    if (!item.to) return false

    if (item.to === currentPath) return true

    if (currentPath.startsWith(item.to) && item.to !== "/") return true

    if (item.submenu) {
      return item.submenu.some(subItem => isMenuActive(subItem, currentPath))
    }

    return false
  }, [])

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

      const newExpandedMenus = { ...expandedMenus }
      let shouldUpdateExpanded = false

      activeParents.forEach(key => {
        if (!newExpandedMenus[key]) {
          newExpandedMenus[key] = true
          shouldUpdateExpanded = true
        }
      })

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

      const newActiveMenus = [...activeParents, ...allActivePaths]

      const isActiveMenusDifferent =
        newActiveMenus.length !== activeMenus.length ||
        !newActiveMenus.every((menu, index) => menu === activeMenus[index])

      if (shouldUpdateExpanded) {
        setExpandedMenus(newExpandedMenus)
      }

      if (isActiveMenusDifferent) {
        setActiveMenus(newActiveMenus)
      }
    },
    [getActiveMenuParents, isMenuActive, menuConfig, expandedMenus, activeMenus]
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

  useEffect(() => {
    activateParentDropdown(location.pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <div
      ref={ref}
      className="h-full overflow-y-auto"
      style={{
        maxHeight: "100%",
        scrollbarWidth: "none",
      }}
    >
      <div className="w-full">
        <ul className="list-none space-y-3 w-full">{menuItems}</ul>
      </div>
    </div>
  )
}

export default withTranslation()(React.memo(SidebarContent))
