import { create } from "zustand"
import { persist } from "zustand/middleware"

const THEME_STORAGE_KEY = "app-theme-preference"

const preloadThemes = () => {
  requestIdleCallback(() => {
    const themes = ["light", "dark"]
    themes.forEach(theme => {
      const link = document.createElement("link")
      link.rel = "prefetch"
      link.href = `data:text/css,*[data-theme='${theme}']`
      document.head.appendChild(link)
    })
  })
}

const updateDocumentTheme = isDark => {
  document.documentElement.classList.add("theme-transitioning")

  requestAnimationFrame(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    )
    document.documentElement.style.colorScheme = isDark ? "dark" : "light"
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light")

    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning")
    }, 150)
  })
}

const style = document.createElement("style")
style.textContent = `
  :root {
    --theme-transition-duration: 150ms;
    --theme-transition-easing: cubic-bezier(0.4, 0.0, 0.2, 1);
  }
  
  .theme-transitioning * {
    transition: background-color var(--theme-transition-duration) var(--theme-transition-easing),
                color var(--theme-transition-duration) var(--theme-transition-easing),
                border-color var(--theme-transition-duration) var(--theme-transition-easing);
    backface-visibility: hidden;
    transform: translateZ(0);
  }

  .theme-transitioning main,
  .theme-transitioning nav,
  .theme-transitioning header,
  .theme-transitioning footer {
    will-change: background-color, color;
  }

  .theme-transitioning.preload * {
    transition: none !important;
  }
`
document.head.appendChild(style)

preloadThemes()

export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDarkMode:
        localStorage.getItem(THEME_STORAGE_KEY) === "dark" ||
        (localStorage.getItem(THEME_STORAGE_KEY) === null &&
          window?.matchMedia?.("(prefers-color-scheme: dark)")?.matches) ||
        false,
      toggleTheme: () => {
        const newIsDarkMode = !get().isDarkMode
        set({ isDarkMode: newIsDarkMode })
        updateDocumentTheme(newIsDarkMode)
      },
      setTheme: isDark => {
        set({ isDarkMode: isDark })
        updateDocumentTheme(isDark)
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      partialize: state => ({ isDarkMode: state.isDarkMode }),
      onRehydrateStorage: () => state => {
        if (state) {
          document.documentElement.classList.add("preload")
          updateDocumentTheme(state.isDarkMode)
          requestAnimationFrame(() => {
            document.documentElement.classList.remove("preload")
          })
        }
      },
    }
  )
)
