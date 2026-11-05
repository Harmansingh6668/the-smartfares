import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // CTA / discount-badge color (matches thesmartfares.online's accent-600 "Get Code" buttons)
        primary: {
          DEFAULT: "#C93900",
          dark: "#A83300",
          light: "#FFE9DD",
        },
        // verified / success green
        secondary: {
          DEFAULT: "#15803D",
          dark: "#166534",
          light: "#DCFCE7",
        },
        // logo mark, links, category icons, headline accent (matches brand-600)
        brand: {
          50: "#EEF5FF",
          100: "#D9E7FF",
          200: "#BCD4FF",
          300: "#8EB8FF",
          500: "#2F5BFF",
          DEFAULT: "#1C3EF0",
          600: "#1C3EF0",
          700: "#162FD6",
          900: "#182887",
        },
        surface: "#F7F9FC",
        ink: {
          DEFAULT: "#0F172A",
          muted: "#64748B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
export default config;
