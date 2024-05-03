/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily:{
      "markazi": '"Markazi Text", serif',
      "changa": '"Changa", sans-serif',
      "noto": '"Noto", serif',
      "inter": '"Inter", sans-serif',
      "poppins": '"Poppins", sans-serif',
    },
    extend: {
      gridAutoColumns:{
        '2fr': 'minmax(0, 2fr)',
        '1fr': 'minmax(0, 1fr)',
      },
      colors:{
        'main': '#014b76',
        'primary': "#A8DADC",
        'primary-dark': "#457B9D",
        'secondary': "#E63946",
        'highlight': "#F1FAEE",
        'loginForm': "rgba(255, 255, 255, .13)",
        "loginInput": 'rgba(8, 7, 16, .07)',
        "layout": 'rgba(0, 0, 0, .7)',
      },
      boxShadow: {
        hardInner: 'inset 0 2px 4px 0 rgb(0 0 0/.5)',
        small: "2px 2px 20px  rgb(0 0 0 / .7)",
        heading: "2px 2px 1px  rgb(0 0 0 )",
        large: "0px 2px 14px rgb(0 0 0 / .3)",
        loginForm: "0 0 40px rgba(8,7,16,0.6)"
      },
      animation:{
        alert: "alert 5s ease-in-out infinite"
      },
      keyframes:{
        alert: {
          "0% 20%":{transform: "translatey(150px)"},
          "80% 100%":{transform: "translatey(0px)"},
        }
      }
    },
  },
  plugins: [],
}

