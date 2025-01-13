import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

const THEME_STORAGE_KEY = "app-theme-preference"

export const useTheme = () => {
  const dispatch = useDispatch()
  const isDarkMode = useSelector(state => state.Layout.isDarkMode)

  const toggleTheme = () => {
    dispatch({ type: "TOGGLE_THEME" })
  }

  // Initialize theme based on saved preference or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" && !isDarkMode) {
      dispatch({ type: "TOGGLE_THEME" })
    } else if (savedTheme === "light" && isDarkMode) {
      dispatch({ type: "TOGGLE_THEME" })
    } else if (!savedTheme && prefersDark && !isDarkMode) {
      dispatch({ type: "TOGGLE_THEME" })
    }

    // Apply theme attribute immediately
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
  }, [])

  // Update theme when it changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem(THEME_STORAGE_KEY, "dark")
      document.documentElement.style.colorScheme = "dark"
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem(THEME_STORAGE_KEY, "light")
      document.documentElement.style.colorScheme = "light"
    }
  }, [isDarkMode])

  return { isDarkMode, toggleTheme }
}
