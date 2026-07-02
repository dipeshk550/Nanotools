/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: "#7F77DD",
        "brand-light": "#EEEDFE",
        "brand-mid": "#534AB7",
        "brand-dark": "#3C3489",
        accent: "#1D9E75",
        "accent-light": "#E1F5EE",
      },
      fontFamily: { sans: ["Inter", "sans-serif"] },
      animation: {
        "fade-in": "fadeIn .3s ease",
        "slide-up": "slideUp .3s ease",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: { "0%": { opacity: 0, transform: "translateY(12px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};
