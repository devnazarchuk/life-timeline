import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // or 'media' if you prefer
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'], // Example sans-serif
        serif: ['var(--font-lora)', 'Georgia', 'serif'], // Example serif
      },
      colors: {
        'pastel-blue': '#A7C7E7',
        'pastel-pink': '#FFB6C1',
        'pastel-green': '#C1E1C1',
        'dark-bg': '#1a1a1a',
        'dark-surface': '#2a2a2a',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
