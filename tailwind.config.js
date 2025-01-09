/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
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
    },
  },
  variants: {},
  plugins: [],
}

