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
        'ocean-deep': '#0D1B2A',
        'ocean-light': '#1B263B',
        'glow-blue': '#E0E1DD',
        'accent-blue': '#778DA9',
      },
      animation: {
        blob: "blob 7s infinite",
        "pulse-glow": "pulse-glow 2s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            textShadow: "0 0 5px rgba(224, 225, 221, 0.7), 0 0 10px rgba(224, 225, 221, 0.5)",
          },
          "50%": {
            opacity: "0.7",
            textShadow: "0 0 10px rgba(224, 225, 221, 1), 0 0 20px rgba(224, 225, 221, 0.8)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;