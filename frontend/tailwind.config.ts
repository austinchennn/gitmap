import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Inter',
          'sans-serif',
        ],
      },
      colors: {
        apple: {
          blue: '#007AFF',
          'blue-dark': '#0062CC',
          red: '#FF3B30',
          green: '#34C759',
          yellow: '#FFCC00',
          gray: {
            50: '#F5F5F7',
            100: '#E8E8ED',
            200: '#D1D1D6',
            300: '#C7C7CC',
            400: '#AEAEB2',
            500: '#8E8E93',
            600: '#636366',
            700: '#48484A',
            800: '#3A3A3C',
            900: '#2C2C2E',
            950: '#1C1C1E',
          },
        },
      },
      boxShadow: {
        'apple-sm': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'apple-md': '0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)',
        'apple-lg': '0 10px 15px rgba(0,0,0,0.05), 0 4px 6px rgba(0,0,0,0.03)',
        'apple-xl': '0 20px 25px rgba(0,0,0,0.06), 0 10px 10px rgba(0,0,0,0.04)',
        'apple-2xl': '0 25px 50px rgba(0,0,0,0.08)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
export default config
