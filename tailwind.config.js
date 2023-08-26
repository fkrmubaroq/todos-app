/** @type {import('tailwindcss/types').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        "active": 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      },
      colors: {
        "grey": "#f9f9f9",
        "grey-200": "#e3e6e7",
        "blue": "#2D41A7",      
        "dark": "#3e3e3e",
      }
    },
  },
  plugins: [],
};

module.exports = config;
