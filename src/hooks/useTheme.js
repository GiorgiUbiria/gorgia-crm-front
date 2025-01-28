import { useEffect } from "react"
import { useThemeStore } from "../store/zustand/themeStore"

const THEME_STORAGE_KEY = "app-theme-preference"

export const useTheme = () => {
  const { isDarkMode, toggleTheme, setTheme } = useThemeStore()

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = e => {
      setTheme(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [setTheme])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark")
      localStorage.setItem(THEME_STORAGE_KEY, "dark")
      document.documentElement.style.colorScheme = "dark"
    } else {
      document.documentElement.setAttribute("data-theme", "light")
      localStorage.setItem(THEME_STORAGE_KEY, "light")
      document.documentElement.style.colorScheme = "light"
    }
  }, [isDarkMode])

  return { isDarkMode, toggleTheme }
}
