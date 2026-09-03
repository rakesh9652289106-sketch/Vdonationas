/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        devotional: {
          maroon: '#6B1D2F',
          'maroon-dark': '#4A121F',
          'maroon-light': '#8C2B43',
          saffron: '#E06D29',
          'saffron-light': '#F58A42',
          gold: '#D4AF37',
          'gold-light': '#F3E5AB',
          cream: '#FAF7F2',
          'cream-dark': '#F4EFE6',
          charcoal: '#1C1917',
          ivory: '#FFFDF9',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-merriweather)', 'serif'],
      },
      boxShadow: {
        devotional: '0 4px 20px -2px rgba(107, 29, 47, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        gold: '0 4px 15px -2px rgba(212, 175, 55, 0.25)',
      },
    },
  },
  plugins: [],
};
