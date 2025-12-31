/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        canvas: "#0f172a",
        panel: "#0b1224",
        accent: "#7c3aed",
        accent2: "#22d3ee",
      },
      boxShadow: {
        card: "0 15px 35px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};
