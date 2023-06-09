/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        "whatsapp-main": "#111b21",
        "whatsapp-light": "#202c33",
      },
      maxHeight: {
        500: "500px",
      },
    },
  },
  plugins: [],
};
