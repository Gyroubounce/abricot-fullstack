// tailwind.config.ts
import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
    "./src/hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          dark: "#D3590B",   // boutons, accents
          light: "#FFE8D9",  // backgrounds, badges
        },
        text: {
          primary: "#1F1F1F",
          secondary: "#6B7280",
          white: "#FFFFFF",
        },
        bg: {
          dashboard: "#F9FAFB",
          content: "#FFFFFF",
          greyLight: "#F3F4F6",
        },
        system: {
          success: "#22C55E",
          error: "#EF4444",
          warning: "#F59E0B",
          info: "#3B82F6",
          neutral: "#E5E7EB",
        },
      },
      borderRadius: {
        card: "8px",
      },
      boxShadow: {
        card: "0px 1px 2px rgba(0,0,0,0.05)",
        modal: "0px 10px 25px rgba(0,0,0,0.1)",
        focus: "0 0 0 3px rgba(211,89,11,0.4)",
      },
      spacing: {
        4.5: "1.125rem",
      },
    },
  },

  plugins: [forms, typography],
} satisfies Config; // ✅ vérification TypeScript

export default config;