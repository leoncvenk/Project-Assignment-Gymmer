/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#f2f2f2',
        sidebar: '#2b2b2b',
        card: '#413f4f',
        accent: '#00a97f',
        accentHover: '#008a68',
        text: '#2b2b2b',
        textOnDark: '#f2f2f2',
        muted: '#c5c5c5',
        danger: '#ef4444',
        dangerHover: '#dc2626',
      },
    },
  },
  plugins: [],
};
