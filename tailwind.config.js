/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1F3A',
          light: '#123059',
          dark: '#071528',
        },
        gold: {
          DEFAULT: '#C9A227',
          light: '#E4C55E',
          dark: '#9C7D1A',
        },
        cream: '#FAF6EC',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(11,31,58,0.25)',
      },
    },
  },
  plugins: [],
}
