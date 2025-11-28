/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
        background: '#F0F9FC',  // Light blue-tinted background
        text: '#111827',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
