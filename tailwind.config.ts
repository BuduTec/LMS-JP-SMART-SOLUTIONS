import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        jpblue: {
          DEFAULT: '#0B63CE',
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#B8DBFF',
          300: '#85BFFF',
          400: '#489CFF',
          500: '#0B63CE',
          600: '#0952AC',
          700: '#073F85',
          800: '#063065',
          900: '#05244C',
        },
        jpdark: {
          DEFAULT: '#071525',
          50: '#F2F5F8',
          100: '#E1E7EE',
          200: '#C0CDDC',
          500: '#1B3554',
          800: '#0B1E34',
          900: '#071525',
        },
        jpmuted: {
          DEFAULT: '#607086',
          light: '#8898AA',
        },
        jplight: {
          DEFAULT: '#F3F7FC',
          alt: '#FFFFFF',
        },
        jpcyan: {
          DEFAULT: '#14B8D4',
          light: '#E6FAFD',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#0B63CE',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#071525',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F3F7FC',
          foreground: '#607086',
        },
        accent: {
          DEFAULT: '#14B8D4',
          foreground: '#071525',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        jp: '22px',
        pill: '999px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        jpcard: '0 12px 35px rgba(7, 21, 37, 0.06)',
        jphover: '0 20px 45px rgba(7, 21, 37, 0.12)',
        jpblue: '0 8px 24px rgba(11, 99, 206, 0.25)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #071525 0%, #0b2d55 55%, #0B63CE 100%)',
        'card-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFD 100%)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
