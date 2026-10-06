/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        sheet: 'var(--sheet)',
        ink: 'var(--ink)',
        soft: 'var(--ink-soft)',
        line: 'var(--line)',
        brand: 'var(--brand)',
      },
      fontFamily: {
        display: ['"Young Serif"', 'Georgia', 'serif'],
        sans: ['Figtree', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
