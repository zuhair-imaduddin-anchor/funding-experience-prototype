/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0C14',
        surface: '#12131F',
        card: '#1A1C2E',
        border: '#252840',
        primary: '#6366F1',
        'primary-hover': '#4F51D8',
        'primary-dim': '#1E2059',
        success: '#22C55E',
        'success-dim': '#14532D',
        warning: '#F59E0B',
        'warning-dim': '#451A03',
        danger: '#EF4444',
        'danger-dim': '#450A0A',
        muted: '#8B8FA8',
        subtle: '#4A4D6A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
