/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '1.5': '0.375rem', // for gap-1.5
        // Add more custom spacing if needed
      },
      colors: {
        'sidebar-bg': '#EDF3FD', // Example: define sidebar background if needed
        // Define other custom colors
      },
      maxHeight: {
        '96': '24rem', // for max-h-96
      },
      // Add other extensions as necessary
    },
  },
  variants: {},
  plugins: [],
}

