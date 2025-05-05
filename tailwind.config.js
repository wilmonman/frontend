/** @type {import('tailwindcss').Config} */
module.exports = {
  // Dark mode support
  darkMode: 'class',

  // Scanning source files
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  // Default theme settings
  theme: {
    extend: {
      // --- Font Family ---
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },

      // --- Animation ---
       keyframes: {
         'slide-down': {
           'from': { transform: 'translateY(-100%)', opacity: '0' },
           'to': { transform: 'translateY(0)', opacity: '1' },
         }
       },
       animation: {
         'slide-down': 'slide-down 0.5s ease-out forwards',
       }

    }, 
  }, 

  plugins: [],
};
