/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#020617',
        'dark-card': '#0f172a',
        'dark-border': '#1e293b',
      },
    },
  },
  plugins: [],
}