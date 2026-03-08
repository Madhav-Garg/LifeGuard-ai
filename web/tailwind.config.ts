import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0f172a",
        neon: "#00f5ff",
        purple: "#7c3aed",
        cyan: "#06b6d4"
      },
      fontFamily: {
        display: ["Space Grotesk", ...fontFamily.sans],
        sans: ["Inter", ...fontFamily.sans]
      },
      boxShadow: {
        glow: "0 0 30px rgba(0, 245, 255, 0.35)",
        card: "0 20px 80px rgba(0,0,0,0.35)"
      },
      backgroundImage: {
        'radial-glow': "radial-gradient(circle at 20% 20%, rgba(0,245,255,0.12), transparent 35%), radial-gradient(circle at 80% 0%, rgba(124,58,237,0.18), transparent 30%), radial-gradient(circle at 50% 50%, rgba(6,182,212,0.12), transparent 40%)"
      }
    }
  },
  plugins: []
};

export default config;
