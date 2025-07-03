import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-ocean': '#03045e',
        'ocean-surface': '#0077b6',
        'aqua-blue': '#00b4d8',
        'light-blue': '#90e0ef',
        'bright-cyan': '#caf0f8',
        'glow-accent': '#80ffdb',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': {
            textShadow: '0 0 10px rgba(128, 255, 219, 0.7), 0 0 20px rgba(128, 255, 219, 0.7)',
          },
          '50%': {
            textShadow: '0 0 20px rgba(128, 255, 219, 1), 0 0 30px rgba(128, 255, 219, 1)',
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
