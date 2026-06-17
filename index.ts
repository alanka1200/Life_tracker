/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#f5f3ed',
          2: '#edeae0',
          3: '#e4e0d4',
        },
        card: '#ffffff',
        green: {
          DEFAULT: '#4a7c59',
          dark: '#2d4a2b',
          light: '#d4e8da',
          xs: '#edf7f0',
        },
        sage: '#7d8471',
        olive: '#a4ac86',
        gold: {
          DEFAULT: '#f9a620',
          light: '#fef3d7',
        },
        terra: {
          DEFAULT: '#b7472a',
          light: '#f5e0d9',
        },
        blue: {
          DEFAULT: '#3a7bd5',
          light: '#ddeaff',
        },
        txt: {
          DEFAULT: '#2a2c28',
          2: '#6b7260',
          3: '#a4ac86',
        },
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '18px',
        btn: '13px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(45,74,43,0.07)',
        'card-lg': '0 4px 24px rgba(45,74,43,0.12)',
      },
    },
  },
  plugins: [],
}
