import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        coal: "#1e293b",
        linen: "#eff6ff",
        paper: "#ffffff",
        gold: "#2563eb",
        moss: "#2563eb",
        coral: "#0ea5e9",
        skydeep: "#1d4ed8"
      },
      boxShadow: {
        soft: "0 18px 48px rgba(15, 23, 42, 0.08)",
        glow: "0 24px 80px rgba(37, 99, 235, 0.18)"
      },
      animation: {
        rise: "rise 560ms ease-out both",
        "fade-in": "fade-in 400ms ease-out both"
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      }
    }
  },
  plugins: []
};

export default config;
