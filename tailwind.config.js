/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts}"],
  theme: {
    extend: {
      colors: {
        ink: "#201F1D",
        steel: "#6B675F",
        paper: "#FAFAF7",
        line: "#DEDAD2",
        accent: "#B5502F",
      },
      fontFamily: {
        display: ["'Big Shoulders'", "system-ui", "sans-serif"],
        sans: ["'IBM Plex Sans'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};
