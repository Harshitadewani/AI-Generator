/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-bg': '#f3f4f6',
        'light-text': '#1f2937',
        'dark-bg': '#020617',
        'dark-text': '#f9fafb',
      }
    },
  },
  plugins: [],
}
