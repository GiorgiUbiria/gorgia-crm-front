import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline"

const ThemeSwitcher = () => {
  const dispatch = useDispatch()
  const isDarkMode = useSelector(state => state.Layout.isDarkMode)

  console.log("Current theme state:", isDarkMode)

  const toggleTheme = () => {
    console.log("Theme toggle clicked, dispatching action")
    dispatch({ type: "TOGGLE_THEME" })
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center h-16 w-12 transition-colors hover:bg-blue-100 dark:hover:bg-gray-800"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <SunIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
      ) : (
        <MoonIcon className="h-5 w-5 text-gray-500" />
      )}
    </button>
  )
}

export default ThemeSwitcher 