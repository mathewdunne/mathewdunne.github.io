/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#8ccce6',
          dark: '#1e337a',
        },
        background: {
          main: '#0a0a0f',
          card: '#13131a',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #8ccce6 0%, #1e337a 100%)',
      },
    },
  },
  plugins: [],
}
