import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        imeesdm: {
          dark: "#1e3a2f", // Color institucional (verde oscuro/sobrio militar)
          gold: "#bda050",  // Detalles o botones principales (oro)
          light: "#f8fafc",
          gray: "#3f4652"
        }
      }
    },
  },
  plugins: [],
};
export default config;
