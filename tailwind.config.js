/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // GigaCandanga brand colors
        primary: {
          DEFAULT: '#004A86',  // Congress Blue
          dark: '#003666',
          light: '#0066B3',
        },
        accent: {
          DEFAULT: '#FF9900',  // GigaCandanga Orange
          dark: '#E68A00',
          light: '#FFB340',
        },
        sky: {
          DEFAULT: '#A6E1EC',  // Blizzard Blue
          light: '#D4F1F7',
        },
        surface: {
          light: '#F8FAFC',
          DEFAULT: '#E2E8F0',
          dark: '#1E293B',
        },
        background: {
          light: '#E8F4F8',
          dark: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
