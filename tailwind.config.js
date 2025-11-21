/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        chainprinter: ['"chainprinter"', 'sans-serif'],
        veneertwo: ['"veneer-two"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
