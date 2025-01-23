import React from "react"
import { useThemeStore } from "../../../store/zustand/themeStore"
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline"

const ThemeSwitcher = () => {
  const { isDarkMode, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center h-16 w-12 transition-all duration-200 hover:bg-blue-100 dark:hover:bg-gray-800"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <SunIcon className="h-5 w-5 text-yellow-500 transition-all duration-200 transform hover:scale-110" />
      ) : (
        <MoonIcon className="h-5 w-5 text-blue-600 transition-all duration-200 transform hover:scale-110" />
      )}
    </button>
  )
}

export default ThemeSwitcher
