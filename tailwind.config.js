/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {},
    extend: {
      colors: {
        details: {
          50: 'var(--color-details-50)',
          100: 'var(--color-details-100)',
          200: 'var(--color-details-200)',
          300: 'var(--color-details-300)',
          400: 'var(--color-details-400)',
          500: 'var(--color-details-500)',
          600: 'var(--color-details-600)',
          700: 'var(--color-details-700)',
          800: 'var(--color-details-800)',
          900: 'var(--color-details-900)',
        },
        background: 'var(--color-bg)',
        dark: 'var(--color-dark)',
      },
      maxWidth: {
        '75rem': '75rem',
      },
      width: {
        '90%': '90%',
      },
      boxShadow: {
        player: '0px -2px 4px 0px rgba(34, 60, 80, 0.2)',
      },
    },
  },
  plugins: [
    ({ addUtilities }) => {
      addUtilities({
        '.l-container': {
          maxWidth: '75rem',
          width: '90%',
          margin: '0 auto',
        },
      });
    },
  ],
};
