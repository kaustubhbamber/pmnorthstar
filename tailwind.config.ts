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
        north: {
          bg: "#0A0A0F",
          surface: "#111118",
          card: "#16161F",
          border: "#1E1E2E",
          accent: "#6C63FF",
          "accent-hover": "#5A52E0",
          gold: "#F5C842",
          muted: "#3A3A52",
          text: "#E8E8F0",
          "text-muted": "#7A7A9A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.4s ease forwards",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(108, 99, 255, 0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(108, 99, 255, 0.35)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
