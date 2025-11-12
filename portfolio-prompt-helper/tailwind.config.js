/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Light mode colors
        primary: '#3B82F6',
        secondary: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',

        // Dark mode specific colors
        dark: {
          bg: {
            primary: '#1F2937',   // Gray-800
            secondary: '#111827', // Gray-900
            tertiary: '#374151',  // Gray-700
          },
          text: {
            primary: '#F9FAFB',   // Gray-50
            secondary: '#D1D5DB', // Gray-300
            tertiary: '#9CA3AF',  // Gray-400
          },
          border: '#374151',      // Gray-700
        },
      },
    },
  },
  plugins: [],
}

