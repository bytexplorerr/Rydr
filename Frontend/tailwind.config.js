/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        screens: {
          xs: "540px", // Custom breakpoint for 540px
        },
      },
    },
    plugins: [],
  };
  