import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"]
      },
      colors: {
        cream: "#faf6f0",
        beige: "#f0e6d6",
        brown: {
          50: "#f9f5f0",
          100: "#efe4d5",
          200: "#dcc5a7",
          300: "#c7a377",
          400: "#b08952",
          500: "#8b6b3e",
          600: "#6f5230",
          700: "#573f26",
          800: "#3e2c1a",
          900: "#261a0f"
        },
        gold: "#c9a227"
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(87, 63, 38, 0.15)"
      }
    }
  },
  plugins: []
};
export default config;