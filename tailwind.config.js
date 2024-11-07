/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      letterSpacing: {
        wider: '3px', // Agrega una clase personalizada para letter-spacing
      },
      fontSize: {
        'custom-lg': '18px', // Agrega una clase personalizada para font-size
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)"],
        inter: ["var(--font-inter)"],
        roboto: ["Roboto Condensed", "sans-serif"]
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
