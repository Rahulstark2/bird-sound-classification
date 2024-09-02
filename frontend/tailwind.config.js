/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in-bounce': 'fadeInBounce 1s ease-out',
        loading: 'loading 3s linear infinite',
      },
      keyframes: {
        fadeInBounce: {
          '0%': { opacity: '0', transform: 'translateY(-10%)' },
          '60%': { opacity: '1', transform: 'translateY(5%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        loading: {
          '0%, 100%': { opacity: 0 },
          '33%': { opacity: 1 },
          '66%': { opacity: 1 },
        },
      },
    }
  },
  plugins: [
    function({ addUtilities, theme, e }) {
      const animationDelayUtilities = {};
      for (let i = 1; i <= 10; i++) {
        animationDelayUtilities[`.${e(`animation-delay-${i * 100}`)}`] = {
          'animation-delay': `${i * 100}ms`,
        };
      }
      addUtilities(animationDelayUtilities, ['responsive']);
    }
  ],
}