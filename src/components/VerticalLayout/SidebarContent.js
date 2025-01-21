/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useCallback, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { withTranslation } from "react-i18next"
import useAuth from "hooks/useAuth"
import MenuItem from "./MenuItem"
import { getMenuConfig } from "./menuConfig"
import "../customScrollbars.css"
import PropTypes from "prop-types"
import CrmSpinner from "components/CrmSpinner"

const SidebarContent = ({ t, onLinkClick }) => {
  const ref = useRef()
  const location = useLocation()
  const auth = useAuth()
  const [expandedMenus, setExpandedMenus] = useState({})
  const [activeMenus, setActiveMenus] = useState([])

  const menuConfig = useMemo(() => getMenuConfig(t, auth) || [], [t, auth])

  const isMenuActive = useCallback((item, currentPath) => {
    if (!item?.to) return false
    if (item.to === currentPath) return true
    if (currentPath.startsWith(item.to) && item.to !== "/") return true
    if (item.submenu) {
      return item.submenu.some(subItem => isMenuActive(subItem, currentPath))
    }
    return false
  }, [])

  const getActiveMenuParents = useCallback(
    (items = [], currentPath, parents = []) => {
      for (const item of items) {
        if (!item) continue
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
      if (!menuConfig) return

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
        if (!item) return acc
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
      if (!item) return
      
      // If clicking a link item (no submenu), just call onLinkClick
      if (!item.submenu) {
        onLinkClick()
        return
      }

      // For items with submenu, always toggle regardless of current route
      toggleMenu(item.key)
    },
    [toggleMenu, onLinkClick]
  )

  // Define renderSubmenu as a regular function to avoid circular dependencies
  const renderSubmenu = (submenuItems = []) => {
    return submenuItems.map((item, index) => {
      if (!item) return null
      return (
        <MenuItem
          key={`${item.to}-${index}`}
          to={item.to}
          icon={item.icon}
          label={item.label}
          hasSubmenu={!!item.submenu}
          isExpanded={item.submenu && expandedMenus[item.key]}
          isActive={activeMenus.includes(item.to)}
          onClick={() => handleMenuClick(item)}
          onLinkClick={onLinkClick}
        >
          {item.submenu ? renderSubmenu(item.submenu) : null}
        </MenuItem>
      )
    })
  }

  const menuItems = useMemo(
    () =>
      menuConfig.map((item, index) => {
        if (!item) return null
        return (
          <MenuItem
            key={`${item.to}-${index}`}
            to={item.to}
            icon={item.icon}
            label={item.label}
            hasSubmenu={!!item.submenu}
            isExpanded={item.submenu && expandedMenus[item.key]}
            isActive={activeMenus.includes(item.to)}
            onClick={() => handleMenuClick(item)}
            onLinkClick={onLinkClick}
          >
            {item.submenu && renderSubmenu(item.submenu)}
          </MenuItem>
        )
      }),
    [menuConfig, expandedMenus, activeMenus, handleMenuClick, onLinkClick]
  )

  useEffect(() => {
    if (location.pathname) {
      activateParentDropdown(location.pathname)
    }
  }, [location.pathname, activateParentDropdown])

  if (!auth.isInitialized) {
    return <CrmSpinner />
  }

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

SidebarContent.propTypes = {
  t: PropTypes.func.isRequired,
  onLinkClick: PropTypes.func.isRequired,
}

export default withTranslation()(React.memo(SidebarContent))
