/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F7CFF',
          50: '#EDF2FF',
          100: '#E0E8FF',
          200: '#C7D7FF',
          300: '#AEC6FF',
          400: '#95B5FF',
          500: '#4F7CFF',
          600: '#3A5FD9',
          700: '#2A48B8',
          800: '#1B3597',
          900: '#0C2176',
        },
      },
    },
  },
  plugins: [],
}
