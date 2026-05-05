import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: "#F4F2ED",
          100: "#E8E4DA",
          200: "#D8CFC4",
          300: "#C4B8A8",
          400: "#B8ADA3",
          500: "#8B9A6D",
          600: "#7A8A5E",
          700: "#4F5B3A",
          800: "#3D4A2D",
          900: "#2A3320",
        },
        stone: {
          50: "#FAF9F7",
          100: "#F5F3F0",
          200: "#E8E5DF",
          300: "#D4CFC6",
          400: "#B8ADA3",
          500: "#9E9083",
          600: "#6B6560",
          700: "#4A4540",
          800: "#3D3D3D",
          900: "#2C2C2C",
        },
        charcoal: "#2C2C2C",
        forest: { DEFAULT: "#2d4a3e", light: "#3a5e50", dark: "#1f3329", 50: "#f0f5f3", 100: "#d6e6df", 200: "#acc9bb", 300: "#7faa96", 400: "#578c75", 500: "#2d4a3e", 600: "#1f3329" },
        cream: { DEFAULT: "#f7f3ee", light: "#fdfbf8", dark: "#ede7dc", 50: "#fdfbf8", 100: "#f7f3ee", 200: "#ede7dc", 300: "#e0d6c8" },
        terracotta: { DEFAULT: "#c0623a", light: "#d4795a", dark: "#a04d2c" },
        ink: { DEFAULT: "#1a1a18", light: "#2e2e2a", muted: "#5a5a54", subtle: "#8a8a82" },
        gold: "#c9a84c",
        silver: "#9a9a96",
        brass: "#b8a050",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["Courier Prime", "Courier New", "monospace"],
        urdu: ["Noto Nastaliq Urdu", "serif"],
      },
      fontSize: {
        "display-xl": ["5rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        display: ["3rem", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        headline: ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        subheadline: ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.005em" }],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { transform: "translateY(20px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
      },
    },
  },
  plugins: [],
};
export default config;
