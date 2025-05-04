
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  darkMode: 'class', // Class-based Dark mode
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Font setup
      },
    },
  },
  plugins: [],
}
