import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-bricolage-grotesk)'],
        sans: ['var(--font-space-grotesk)'],
        mono: ['var(--font-ibm-plex-mono)']
      },
      colors: {
        canvas: 'rgb(var(--mbm-canvas) / <alpha-value>)',
        ink: 'rgb(var(--mbm-ink) / <alpha-value>)',
        mist: 'rgb(var(--mbm-mist) / <alpha-value>)',
        signal: 'rgb(var(--mbm-signal) / <alpha-value>)',
        electric: 'rgb(var(--mbm-electric) / <alpha-value>)',
        warning: 'rgb(var(--mbm-warning) / <alpha-value>)',
        ember: 'rgb(var(--mbm-ember) / <alpha-value>)'
      },
      boxShadow: {
        panel: '0 10px 40px rgba(10, 30, 70, 0.35)',
        soft: '0 4px 24px rgba(5, 15, 35, 0.28)'
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at 10% 20%, rgba(29,143,255,.2), transparent 40%), radial-gradient(circle at 80% 0%, rgba(54,217,164,.22), transparent 35%), linear-gradient(160deg, #04101b 0%, #07182a 45%, #0b1321 100%)'
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseLine: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' }
        }
      },
      animation: {
        rise: 'rise 0.7s ease-out both',
        pulseLine: 'pulseLine 2.5s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

export default config;
