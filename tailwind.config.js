/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      colors: {
        // Sugestão de paleta similar à Invenio/Robbu
        primary: {
            DEFAULT: '#2563EB', // blue-600
            dark: '#1D4ED8',    // blue-700
        },
        sidebar: {
            DEFAULT: '#111827', // slate-900 / gray-900
            hover: '#1F2937',   // gray-800
        }
        },
      
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
    },
  },
  plugins: [],
}