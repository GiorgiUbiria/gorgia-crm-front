import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const THEME_STORAGE_KEY = "app-theme-preference"

// Pre-load both themes' resources
const preloadThemes = () => {
  requestIdleCallback(() => {
    const themes = ['light', 'dark']
    themes.forEach(theme => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = `data:text/css,*[data-theme='${theme}']`
      document.head.appendChild(link)
    })
  })
}

const updateDocumentTheme = (isDark) => {
  // Add transition class before changes
  document.documentElement.classList.add('theme-transitioning')
  
  // Use single RAF for quicker response
  requestAnimationFrame(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light')
    
    // Remove transition class after a shorter duration
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning')
    }, 150) // Much shorter duration for a snappier feel
  })
}

// Add optimized transition styles
const style = document.createElement('style')
style.textContent = `
  :root {
    --theme-transition-duration: 150ms;
    --theme-transition-easing: cubic-bezier(0.4, 0.0, 0.2, 1);
  }
  
  /* Apply transitions only during theme change */
  .theme-transitioning * {
    transition: background-color var(--theme-transition-duration) var(--theme-transition-easing),
                color var(--theme-transition-duration) var(--theme-transition-easing),
                border-color var(--theme-transition-duration) var(--theme-transition-easing);
    backface-visibility: hidden;
    transform: translateZ(0);
  }

  /* Optimize paint performance for large areas */
  .theme-transitioning main,
  .theme-transitioning nav,
  .theme-transitioning header,
  .theme-transitioning footer {
    will-change: background-color, color;
  }

  /* Prevent transition on page load */
  .theme-transitioning.preload * {
    transition: none !important;
  }
`
document.head.appendChild(style)

// Preload themes for faster switching
preloadThemes()

export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDarkMode: localStorage.getItem(THEME_STORAGE_KEY) === 'dark' || 
                 (localStorage.getItem(THEME_STORAGE_KEY) === null && 
                  window?.matchMedia?.("(prefers-color-scheme: dark)")?.matches) || 
                 false,
      toggleTheme: () => {
        const newIsDarkMode = !get().isDarkMode
        set({ isDarkMode: newIsDarkMode })
        updateDocumentTheme(newIsDarkMode)
      },
      setTheme: (isDark) => {
        set({ isDarkMode: isDark })
        updateDocumentTheme(isDark)
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.classList.add('preload')
          updateDocumentTheme(state.isDarkMode)
          requestAnimationFrame(() => {
            document.documentElement.classList.remove('preload')
          })
        }
      },
    }
  )
) 