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
        // 🎨 Paleta principal
        creme: {
          50: "#FEFBF7",
          100: "#FDF7F0",
          200: "#F9EDE1",
          300: "#F5E3D1",
          DEFAULT: "#FDF7F0"
        },
        bege: {
          100: "#F8EFE4",
          200: "#F2E3D5",
          300: "#E9D3BD",
          400: "#DDBE9E",
          DEFAULT: "#F2E3D5"
        },
        terracota: {
          100: "#F7DDD0",
          200: "#EFB9A1",
          300: "#E8A288",
          400: "#DB8A6D",
          500: "#C96F4A",  // primário
          600: "#A85737",
          700: "#84432A",
          800: "#5E2F1D",
          DEFAULT: "#C96F4A"
        },
        marrom: {
          50: "#F6F0EC",
          100: "#E6D8CE",
          200: "#C9B0A0",
          300: "#A78873",
          400: "#7A5A45",
          500: "#5C3D2E",
          600: "#4A2E1F",  // principal
          700: "#3A2317",
          800: "#2B1A10",
          900: "#1C100A",
          DEFAULT: "#4A2E1F"
        },
        gold: "#D4A574"  // acento quente
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(74, 46, 31, 0.18)",
        "soft-lg": "0 12px 40px -12px rgba(74, 46, 31, 0.25)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      // Melhor controle de altura em mobile (evita 100vh bugs no Android)
      height: {
        screen: "100dvh",
        "screen-safe": "calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom))"
      },
      minHeight: {
        screen: "100dvh"
      }
    }
  },
  plugins: []
};
export default config;