/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Warm, minimal palette
        cream: "#F7F1E8",
        sand: "#EFE4D3",
        clay: "#C1673F",
        rust: "#9C4A2B",
        ink: "#2E2620",
        taupe: "#8A7B6C",
        sage: "#7A8C6F",
      },
      fontFamily: {
        display: ["Lora", "serif"],
        body: ["Source Sans 3", "sans-serif"],
      },
    },
  },
  plugins: [],
};
