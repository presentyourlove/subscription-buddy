/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0f172a',
          primary: '#7c3aed', // Example purple
          secondary: '#db2777' // Example pink
        }
      }
    }
  },
  plugins: []
}
