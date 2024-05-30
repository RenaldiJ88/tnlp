/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'exo': ['Exo 2']
      },
      screens: {
        '3xl': '1920px'
      },
      colors: {
        'black-tnlp': '#1A1A1A',
        'pink-tnlp': '#FF0080',
        'pink-hover-tnlp': '#F4C2C2',
      },
    },
  },
  plugins: [],
};
