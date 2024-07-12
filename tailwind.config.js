/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {},
    extend: {
      colors: {
        details: {
          1: 'var(--color-details-1)',
          10: 'var(--color-details-10)',
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
        items: {
          DEFAULT: 'var(--color-items)',
          hovered: 'var(--color-items-hovered)',
        },
        folders: {
          DEFAULT: 'var(--color-folders)',
          hovered: 'var(--color-folders-hovered)',
        },
        background: 'var(--color-bg)',
        dark: 'var(--color-dark)',
        error: 'var(--color-error)',
      },
    },
  },
  plugins: [
    ({ addUtilities, addVariant }) => {
      addUtilities({
        '.l-container': {
          maxWidth: '75rem',
          width: '90%',
          margin: '0 auto',
        },
      });

      addUtilities({
        '.on-focus': {
          outline: 'var(--color-dark) solid 1px',
          'outline-offset': '0px',
        },
      });

      addVariant('with-hover', ['@media (any-hover: hover) { &:hover }']);
    },
  ],
};
