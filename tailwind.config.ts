import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        none: '0px',
        xs: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '0px',
      },
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        border: '#27272a',
        primary: {
          DEFAULT: '#ffffff',
          dark: '#000000',
        },
        slate: {
          900: '#09090b',
          800: '#18181b',
          700: '#27272a',
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        'geometric-sm': '4px',
        'geometric-md': '8px',
        'geometric-lg': '16px',
        'geometric-xl': '24px',
      }
    },
  },
  plugins: [],
} satisfies Config;
