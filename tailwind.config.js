/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{html,htm}",
    "./src/**/*.css",
    "./public/index.html",
  ],
  darkMode: ["selector", "[data-theme*='dark']"],
  theme: {
    extend: {
      spacing: {
        1.5: "0.375rem",
      },
      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
      },
      transitionDuration: {
        '0': '0ms',
        '2000': '2000ms',
      },
      transitionTimingFunction: {
        'theme': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      colors: {
        "sidebar-bg": "#EDF3FD",
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
        },
        secondary: "#F1F5F9",
        info: "#0EA5E9",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        destructive: "#DC2626",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      maxHeight: {
        96: "24rem",
      },
      backgroundColor: {
        app: {
          light: "#f8fafc", // gray-50
          dark: "#111827", // gray-900
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    function({ addBase }) {
      addBase({
        ':root': {
          '--theme-transition': '0.3s ease-in-out',
        },
        '*, *::before, *::after': {
          'transition-property': 'background-color, border-color, color, fill, stroke',
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'transition-duration': '0.3s',
        },
      })
    },
  ],
}
