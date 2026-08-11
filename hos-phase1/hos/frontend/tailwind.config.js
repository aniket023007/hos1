/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#101828',
        slate: {
          950: '#0b1220',
        },
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#b3ccff',
          300: '#80a8ff',
          400: '#4d7dff',
          500: '#2955f5', // primary
          600: '#1e40d1',
          700: '#1a34a8',
          800: '#182c84',
          900: '#17296b',
        },
        accent: {
          500: '#0ea672', // status/success — hostel "green campus" note
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Lexend"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(16, 24, 40, 0.06), 0 1px 3px 0 rgba(16, 24, 40, 0.08)',
      },
    },
  },
  plugins: [],
};
