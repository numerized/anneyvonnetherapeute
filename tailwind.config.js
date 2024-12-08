const { theme } = require('@sanity/demo/tailwind')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './intro-template/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    ...theme,
    fontFamily: {
      mono: 'var(--font-mono)',
      montserrat: 'var(--font-montserrat)',
      serif: 'var(--font-serif)',
    },
    extend: {
      colors: {
        primary: {
          yellow: '#D9B70D',
          brown: '#8B4513',
          rust: '#C1666D',
          coral: '#E8927C',
          cream: '#F7EDE2',
          dark: '#2A3A3A',
          forest: '#395756',
          teal: '#7BA7BC',
          sky: '#89C5CC'
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
