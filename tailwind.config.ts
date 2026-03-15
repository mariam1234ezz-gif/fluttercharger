import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#00d4ff',
        'primary-dark': '#0099cc',
        'success': '#10b981',
        'warning': '#f59e0b',
        'danger': '#ef4444',
        'dark-bg': '#0f172a',
        'dark-card': '#1e293b',
        'dark-border': '#334155',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
        'gradient-solar': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        'gradient-grid': 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
export default config
