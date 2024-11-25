import { useState, useCallback } from "react"

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
  const [expandedMenus, setExpandedMenus] = useState(initialState)

  const toggleMenu = useCallback(menuKey => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }))
  }, [])

  return { expandedMenus, toggleMenu }
}

export default useMenuState
