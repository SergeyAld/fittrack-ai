/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#06110b',
          900: '#0a1810',
          800: '#0f2218',
          700: '#162e21',
          600: '#1e3d2c',
          500: '#27543d',
          400: '#32694e',
        },
        lime: {
          50: '#f4ffe8',
          100: '#e5ffba',
          200: '#ccff85',
          300: '#aef84f',
          400: '#8fe620',
          500: '#6cc40c',
          600: '#509c06',
          700: '#3c7509',
          800: '#315c0c',
          900: '#294c10',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-lime': '0 0 0 1px rgba(174, 248, 79, 0.15), 0 8px 30px -8px rgba(174, 248, 79, 0.25)',
        card: '0 2px 12px -2px rgba(0, 0, 0, 0.4), 0 1px 3px -1px rgba(0, 0, 0, 0.5)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-up': 'slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
