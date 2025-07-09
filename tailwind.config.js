// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // 关键：启用 class 策略
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: []
}
