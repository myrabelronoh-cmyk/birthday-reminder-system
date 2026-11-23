 /** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Primary: blue (hue ~220°)
        brand: { 50: '#eff6ff', 100: '#dbeafe', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 900: '#1e3a8a' },
        // Accent: amber (hue ~40°), the complement of blue on the colour wheel
        accent: { 100: '#fef3c7', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' },
      },
    },
  },
  plugins: [],
};
