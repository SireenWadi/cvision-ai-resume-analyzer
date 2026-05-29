/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        dm: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        blue: {
          50: '#EBF2FF',
          100: '#BFCFFF',
          200: '#93ABFF',
          400: '#4066F5',
          500: '#2A4FE8',
          600: '#1A3AC8',
          700: '#0F28A0',
        },
        indigo: {
          400: '#7F77DD',
          500: '#534AB7',
        },
        slate: {
          50: '#F8F9FC',
          100: '#EEF0F6',
          200: '#DDE1EE',
          300: '#C3C8DA',
          400: '#8B92AA',
          500: '#5A6278',
          600: '#3B4260',
          700: '#252B45',
          800: '#161B30',
          900: '#0B0E1A',
        },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out infinite -3s',
        'fade-up': 'fadeUp 0.5s ease forwards',
        spin: 'spin 0.8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        sm: '0 1px 3px rgba(64,102,245,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        md: '0 4px 16px rgba(64,102,245,0.08), 0 2px 8px rgba(0,0,0,0.04)',
        lg: '0 12px 40px rgba(64,102,245,0.12), 0 4px 16px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
