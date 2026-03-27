import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        crimson: ['Crimson Text', 'serif'],
      },
      colors: {
        primary: 'var(--primary-color)',
        background: 'var(--background)',
      },
    },
  },
  plugins: [],
};

export default config;
