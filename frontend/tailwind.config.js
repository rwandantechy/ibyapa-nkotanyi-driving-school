/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        // primary: {
        //   50: "#eff6ff",
        //   100: "#dbeafe",
        //   200: "#bfdbfe",
        //   300: "#93c5fd",
        //   400: "#60a5fa",
        //   500: "#3b82f6",
        //   600: "#2563eb",
        //   700: "#034694",
        //   800: "#1e40af",
        //   900: "#1e3a8a",
        // },
        primary: {
          50: "#eff6ff",  // Lightest blue
          100: "#dbeafe", // Very light blue
          200: "#bfdbfe", // Light blue
          300: "#93c5fd", // Medium light blue
          400: "#60a5fa", // Medium blue
          500: "#3b82f6", // Blue
          600: "#2563eb", // Dark blue
          700: "#034694", // Darker blue
          800: "#1e40af", // Very dark blue
          900: "#1e3a8a", // Darkest blue
        },
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
