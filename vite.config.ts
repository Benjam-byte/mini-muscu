import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const appBaseName = "/mini-muscu";

export default defineConfig(({ mode }) => ({
  plugins: [tailwindcss(), reactRouter()],
  base: mode === "development" ? appBaseName : `${appBaseName}/`,
}));
