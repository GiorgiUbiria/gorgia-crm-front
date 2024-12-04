import { useState, useCallback, useEffect } from "react"

const MENU_STATE_KEY = "sidebar_menu_state"
const initialState = {
  applications: false,
  hrDocs: false,
  contracts: false,
  leads: false,
  internalPurchases: false,
  vacation: false,
  business: false,
}

const useMenuState = () => {
  const [expandedMenus, setExpandedMenus] = useState(() => {
    const savedState = localStorage.getItem(MENU_STATE_KEY)
    return savedState ? JSON.parse(savedState) : initialState
  })

  useEffect(() => {
    localStorage.setItem(MENU_STATE_KEY, JSON.stringify(expandedMenus))
  }, [expandedMenus])

  const toggleMenu = useCallback(menuKey => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }))
  }, [])

  return { expandedMenus, toggleMenu }
}

export default useMenuState
