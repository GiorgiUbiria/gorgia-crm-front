import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

const THEME_STORAGE_KEY = "app-theme-preference"

export const useTheme = () => {
  const dispatch = useDispatch()
  const isDarkMode = useSelector(state => state.Layout.isDarkMode)

  // Initialize theme from storage
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    console.log("Saved theme from storage:", savedTheme)
    if (savedTheme === "dark" && !isDarkMode) {
      dispatch({ type: "TOGGLE_THEME" })
    }
  }, [])

  // Apply theme changes and save preference
  useEffect(() => {
    console.log("Applying theme change:", isDarkMode ? "dark" : "light")
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem(THEME_STORAGE_KEY, "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem(THEME_STORAGE_KEY, "light")
    }
  }, [isDarkMode])

  return { isDarkMode }
} 