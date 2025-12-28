/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['"Cairo"', 'Tahoma', 'sans-serif'],
      },
      colors: {
        primary: '#2563eb',
        secondary: '#0ea5e9',
        dark: '#0f172a',
      },
      boxShadow: {
        card: '0 10px 25px -15px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [require('tailwindcss-rtl')],
}

