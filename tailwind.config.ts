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
        cinzel: ['Cinzel', 'Georgia', 'serif'],
        crimson: ['Crimson Text', 'Georgia', 'serif'],
        fredoka: ['Fredoka One', 'Arial Rounded MT Bold', 'sans-serif'],
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
