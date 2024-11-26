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
    // Overriding fontFamily to use @next/font loaded families
    fontFamily: {
      mono: 'var(--font-mono)',
      sans: 'var(--font-sans)',
      serif: 'var(--font-serif)',
    },
    extend: {
      colors: {
        primary: {
          dark: '#1A1A1A',    // Dark background
          cream: '#F5F5F5',   // Light text
          forest: '#2F4F4F',  // Newsletter background
          teal: '#008080',    // Accent color
          coral: '#FF6B6B',   // Button background
          rust: '#CF4F4F',    // Button hover
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
