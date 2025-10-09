import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Ottoman Theme Colors
        ottoman: {
          black: '#0A0A0A',
          'black-light': '#1A1A1A',
          'black-lighter': '#2A2A2A',
          gold: '#D4AF37',
          'gold-light': '#FFD700',
          'gold-dark': '#B8960F',
          red: '#8B0000',
          'red-light': '#A52A2A',
          'red-dark': '#660000',
          cream: '#F5F5DC',
          'cream-dark': '#E5E5CC',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'ottoman-pattern': "url('/patterns/ottoman-pattern.svg')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gold-shimmer': 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.5)',
        'gold-glow-lg': '0 0 40px rgba(212, 175, 55, 0.7)',
        'ottoman': '0 10px 40px rgba(0, 0, 0, 0.8)',
      },
    },
  },
  plugins: [],
}
export default config
