/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#F7F9FC',
          50: '#FFFFFF',
          100: '#F7F9FC',
          200: '#EEF2F6',
          300: '#E6EAF0',
        },
        card: '#FFFFFF',
        main: '#172033',
        muted: '#68758A',
        line: '#E6EAF0',
        primary: {
          DEFAULT: '#315CF5',
          50: '#F0F4FE',
          100: '#DBE4FD',
          200: '#BDCEFC',
          300: '#94B0FA',
          400: '#648BF7',
          500: '#315CF5',
          600: '#1F47DC',
          700: '#1736AC',
          800: '#142C87',
          900: '#15286E',
        },
        brand: {
          50: '#F0F4FE',
          100: '#DBE4FD',
          200: '#BDCEFC',
          300: '#94B0FA',
          400: '#648BF7',
          500: '#315CF5',
          600: '#315CF5',
          700: '#1F47DC',
          800: '#1736AC',
          900: '#142C87',
          950: '#0F1D57',
        },
        teal: {
          DEFAULT: '#16A6A0',
          50: '#F0FAF9',
          100: '#D5F3F1',
          500: '#16A6A0',
          600: '#118883',
          700: '#0E6C68',
        },
        risk: {
          low: '#159B70',
          moderate: '#E9A23B',
          high: '#F97316',
          critical: '#E05252',
        },
        accent: {
          success: '#159B70',
          warning: '#E9A23B',
          danger: '#E05252',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
        'card': '0 1px 3px 0 rgba(16, 24, 40, 0.06), 0 1px 2px 0 rgba(16, 24, 40, 0.04)',
        'card-hover': '0 4px 12px 0 rgba(16, 24, 40, 0.08), 0 2px 4px 0 rgba(16, 24, 40, 0.04)',
        'subtle': '0 8px 24px -4px rgba(16, 24, 40, 0.06)',
      }
    },
  },
  plugins: [],
}
