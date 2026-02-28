/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cabinet Grotesk', 'Satoshi', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
      },
      colors: {
        ink: '#0f0f1a',
        'ink-light': '#6b6b80',
        surface: '#ffffff',
        bg: '#f4f3ff',
        border: '#e4e3f0',
        applied: { DEFAULT: '#6366f1', pale: '#eef2ff', text: '#4338ca' },
        interview: { DEFAULT: '#f59e0b', pale: '#fffbeb', text: '#b45309' },
        offer: { DEFAULT: '#10b981', pale: '#ecfdf5', text: '#065f46' },
        rejected: { DEFAULT: '#ef4444', pale: '#fef2f2', text: '#991b1b' },
        ai: { DEFAULT: '#8b5cf6', pale: '#f5f3ff', text: '#6d28d9' },
      },
    },
  },
  plugins: [],
}
