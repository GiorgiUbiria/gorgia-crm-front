/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: ["selector", "[data-theme*='dark']"],
  theme: {
    extend: {
      spacing: {
        '1.5': '0.375rem',
      },
      colors: {
        'sidebar-bg': '#EDF3FD',
      },
      maxHeight: {
        '96': '24rem',
      },
      backgroundColor: {
        'app': {
          light: '#f8fafc', // gray-50
          dark: '#111827', // gray-900
        }
      }
    },
  },
  plugins: [],
}

