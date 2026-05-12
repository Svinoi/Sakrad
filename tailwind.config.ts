import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#E8F0FA',
          100: '#C5D5EE',
          200: '#8AAAD8',
          400: '#2E5F9E',
          600: '#1A3D6B',
          800: '#0F2240',
          900: '#091628',
        },
        gold: {
          50:  '#FEF6E4',
          100: '#FDECC0',
          300: '#F5C842',
          500: '#E8A020',
          700: '#B87A10',
          900: '#7A4E08',
        },
        cream: {
          50:  '#FDFBF7',
          100: '#F5F0E8',
          200: '#EDE4D4',
        },
        danger: {
          50:  '#FDF0EC',
          500: '#D94F2B',
          700: '#A83520',
        },
        success: {
          50:  '#E8F5EE',
          500: '#2A7A50',
          700: '#1D5638',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans:  ['system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
export default config
