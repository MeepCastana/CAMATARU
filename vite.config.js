import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "https://camataru.ro",
      "/auth": "https://camataru.ro",
    },
  },
  alias: {
    "react-router-dom": "react-router-dom/web",
  },
});
