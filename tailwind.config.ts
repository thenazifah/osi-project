import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        border: "var(--border)",
        ink: "var(--ink)",
        "ink-muted": "var(--ink-muted)",
        accent: "var(--accent)",
        "accent-2": "var(--accent-2)",
        sea: "var(--sea)",
        "sea-light": "var(--sea-light)",
        export: "var(--export)",
        "tag-bg": "var(--tag-bg)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Poppins", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "Poppins", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "ui-monospace", "monospace"],
      },
      maxWidth: {
        page: "1440px",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        sm: "0.375rem",
        md: "var(--radius)",
        lg: "var(--radius-lg)",
        tag: "var(--radius)",
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "fade-up": "fadeUp 400ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
