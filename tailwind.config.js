/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D4A5A5',
        secondary: '#9B7E7E', 
        accent: '#E8B4B8',
        surface: '#FFFFFF',
        background: '#FAF8F7',
        success: '#7EBF9E',
        warning: '#F4C17A',
        error: '#E07B7B',
        info: '#8DAED6'
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.15)',
      }
    },
  },
  plugins: [],
}