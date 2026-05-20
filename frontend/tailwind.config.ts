import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211f",
        pine: "#23483f",
        moss: "#6e7f45",
        linen: "#f4eadb",
        chalk: "#fffaf0",
        clay: "#c66f4c",
        marigold: "#ebb94f",
        tide: "#5f8ea3"
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Sora", "Avenir Next", "Verdana", "sans-serif"]
      },
      boxShadow: {
        lifted: "0 24px 70px rgba(23, 33, 31, 0.18)"
      }
    }
  },
  plugins: []
} satisfies Config;
