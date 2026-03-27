import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes("node_modules")) return;
          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/react-router-dom/")
          ) {
            return "vendor-react";
          }
          if (
            id.includes("/i18next/") ||
            id.includes("/react-i18next/") ||
            id.includes("/i18next-browser-languagedetector/")
          ) {
            return "vendor-i18n";
          }
          if (id.includes("/@tanstack/react-query/")) return "vendor-query";
          if (
            id.includes("/@sito/dashboard-app/") ||
            id.includes("/@sito/dashboard/")
          ) {
            return "vendor-sito";
          }
          if (id.includes("/@fortawesome/")) return "vendor-icons";
          if (id.includes("/react-tooltip/")) return "vendor-tooltip";
          return;
        },
      },
    },
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, "./src/assets"),
      components: path.resolve(__dirname, "./src/components"),
      lib: path.resolve(__dirname, "./src/lib"),
      hooks: path.resolve(__dirname, "./src/hooks"),
      layouts: path.resolve(__dirname, "./src/layouts"),
      views: path.resolve(__dirname, "./src/views"),
      providers: path.resolve(__dirname, "./src/providers"),
      lang: path.resolve(__dirname, "./src/lang"),
    },
  },
});
