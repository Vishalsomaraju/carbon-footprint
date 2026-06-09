/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        carbon: {
          50: '#f4f6f8',
          100: '#e3e8ec',
          200: '#c7d3db',
          300: '#9eb4c2',
          400: '#6f8ea1',
          500: '#527387',
          600: '#40596a',
          700: '#354857',
          800: '#2e3d4a',
          900: '#293540',
          950: '#1b242e',
        },
        'deep-void': '#020617',
        'charcoal-core': '#0F172A',
        'canvas-white': '#F8FAFC',
        'muted-steel': '#94A3B8',
        'whisper-border': '#1E293B',
        'bio-emerald': '#10B981',
        'alert-amber': '#F59E0B',
        'critical-crimson': '#EF4444',
        'surface': '#0c1324',
        'on-surface': '#dce1fb',
        'surface-container-high': '#23293c',
        'surface-container-highest': '#2e3447',
        'surface-variant': '#2e3447',
        'on-surface-variant': '#bbcabf',
        primary: '#4edea3',
        secondary: '#bec6e0',
      },
      fontFamily: {
        'headline-lg': ['Outfit'],
        'headline-md': ['Outfit'],
        'display-lg': ['Outfit'],
        'body-lg': ['Outfit'],
        'body-md': ['Outfit'],
        'mono-metrics': ['JetBrains Mono'],
        'label-sm': ['JetBrains Mono'],
      },
      fontSize: {
        'headline-lg': ['32px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'display-lg': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'mono-metrics': ['14px', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '600' }],
      },
      borderRadius: {
        '2xl': '24px',
      },
      spacing: {
        'container-max': '1280px',
        'gutter-md': '24px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
