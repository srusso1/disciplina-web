/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        trujillo: {
          navy: '#1E3A8A',
          'navy-dark': '#172554',
          'navy-light': '#1E40AF',
          sky: '#38BDF8',
          'sky-light': '#BAE6FD',
          ice: '#F0F9FF',
          gold: '#EAB308',
          laurel: '#15803D',
          earth: '#854D0E',
          dark: '#0F172A',
        },
        convivencia: {
          tipo1: {
            DEFAULT: '#FEF9C3',
            text: '#854D0E',
            border: '#FACC15',
          },
          tipo2: {
            DEFAULT: '#FFEDD5',
            text: '#C2410C',
            border: '#FB923C',
          },
          tipo3: {
            DEFAULT: '#FEE2E2',
            text: '#B91C1C',
            border: '#F87171',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'elevated': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
      }
    },
  },
  plugins: [],
}
