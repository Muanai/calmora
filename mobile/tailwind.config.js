/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cream: "#FFFDF0",
        pink: {
          DEFAULT: "#D7385E",
          light: "#FBEBEF",
        },
        purple: {
          DEFAULT: "#806DE3",
          light: "#D9D4F8",
          lighter: "#ECE9FB",
        },
        grey: {
          DEFAULT: "#999999",
          stroke: "#999999",
        },
        link: "#357BF7",
      },
      fontFamily: {
        "jakarta-bold": ["PlusJakartaSans_700Bold"],
        "jakarta-semibold": ["PlusJakartaSans_600SemiBold"],
        "jakarta-regular": ["PlusJakartaSans_400Regular"],
        "rubik-regular": ["Rubik_400Regular"],
      },
      borderRadius: {
        sheet: "60px",
        btn: "16px",
        card: "20px",
      },
    },
  },
  plugins: [],
};
