/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cny-red': '#D7000F',
        'cny-gold': '#FFD700',
      }
    },
  },
  plugins: [],
}
