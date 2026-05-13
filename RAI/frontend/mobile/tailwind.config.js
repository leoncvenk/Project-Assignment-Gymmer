/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],

  colors: {
    background: '#f2f2f2',
    sidebar: '#2b2b2b',
    card: '#413f4f',
    accent: '#00a97f',
    accentHover: '#008a68',
    text: '#2b2b2b',
    textOnDark: '#f2f2f2',
    muted: '#c5c5c5',
  },
};
