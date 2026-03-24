/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {

        // ── Primary brand — cyan
        primary: {
          50:  '#e6f9fe',
          100: '#b3eefb',
          200: '#67ddf8',
          300: '#1ecef4',
          400: '#02bcf0',   // ← main accent = var(--accent)
          500: '#029ac5',
          600: '#0179a0',
          700: '#01688a',
          800: '#014d65',
          900: '#003347',
        },

        // ── Ink — cool neutral (replaces slate-*)
        ink: {
          50:  '#f5fbfe',
          100: '#e0f0f8',
          200: '#c0d8e8',
          300: '#a0c0d8',
          400: '#8aa8be',
          500: '#4d6a7e',
          600: '#354d5e',
          700: '#1e3448',
          800: '#0d1520',
          900: '#0a0f14',
        },

      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};