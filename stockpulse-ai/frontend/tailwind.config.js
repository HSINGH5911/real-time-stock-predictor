/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "!**/node_modules/**",
  ],
  theme: {
    extend: {
      colors: {
        term: {
          bg: "#080A0D",
          surface: "#0D1117",
          card: "#11161D",
          border: "#202630",
          "border-subtle": "#161C24",
          text: "#E6EAF0",
          muted: "#8B95A5",
          dim: "#4E5766",
          accent: "#2563EB",
          "accent-hover": "#3B82F6",
          green: "#10B981",
          red: "#EF4444",
          amber: "#F59E0B",
          blue: "#3B82F6",
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Geist Mono', 'Consolas', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '8px',
      }
    },
  },
  plugins: [],
};
