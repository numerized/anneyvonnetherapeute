const { theme } = require('@sanity/demo/tailwind')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    ...theme,
    fontFamily: {
      sans: ['var(--font-montserrat)', 'sans-serif'],
      mono: ['var(--font-mono)', 'monospace'],
      serif: ['var(--font-serif)', 'serif'],
      nove: ['var(--font-nove)', 'sans-serif'],
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
        }
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
