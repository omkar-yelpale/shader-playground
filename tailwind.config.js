/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apple-inspired colors
        primary: {
          DEFAULT: '#007AFF', // iOS blue
          50: '#E5F1FF',
          100: '#CCE4FF',
          200: '#99C9FF',
          300: '#66ADFF',
          400: '#3392FF',
          500: '#007AFF',
          600: '#0062CC',
          700: '#004A99',
          800: '#003166',
          900: '#001933',
        },
        accent: {
          DEFAULT: '#FF375F', // Apple red/pink
          400: '#FF6B8A',
          500: '#FF375F',
          600: '#FF0336',
        },
        apple: {
          gray: {
            50: '#FBFBFD',
            100: '#F5F5F7',
            200: '#E8E8ED',
            300: '#D2D2D7',
            400: '#ADADB8',
            500: '#8E8E93',
            600: '#636366',
            700: '#48484A',
            800: '#363639',
            900: '#1C1C1E',
          },
          blue: '#007AFF',
          green: '#34C759',
          indigo: '#5856D6',
          orange: '#FF9500',
          pink: '#FF2D55',
          purple: '#AF52DE',
          red: '#FF3B30',
          teal: '#5AC8FA',
          yellow: '#FFCC00',
        }
      },
      backdropBlur: {
        xs: '2px',
        apple: '20px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'apple': '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'apple-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'apple-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.04), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}

