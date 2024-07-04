/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
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
      },
      maxWidth: {
        '75rem': '75rem',
      },
      width: {
        '90%': '90%',
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
