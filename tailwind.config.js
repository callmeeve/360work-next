/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': "#534FEB",
        'secondary': "#F4CE14",
        'danger': "#E84545",
        'success': "#58A399"
      },
    },
  },
  plugins: [],
};
