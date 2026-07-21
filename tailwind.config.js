/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blueprint: {
          bg: "#0E1F33",
          surface: "#16283F",
          grid: "#6E93B7",
          brass: "#C9A15D",
          paper: "#EDE8DC",
          muted: "#9FB0C4",
        },
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', "monospace"],
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
      },
      letterSpacing: {
        annotation: "0.18em",
      },
    },
  },
  plugins: [],
}
