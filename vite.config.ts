import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

const projectRoot = path.resolve(__dirname);
const appReactRoot = path.resolve(projectRoot, "node_modules/react");
const appReactDomRoot = path.resolve(projectRoot, "node_modules/react-dom");

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "prompt",
      injectRegister: "auto",
      includeAssets: [
        "favicon.svg",
        "apple-touch-icon.png",
        "pwa-192x192.png",
        "pwa-512x512.png",
      ],
      manifest: {
        name: "Period Calendar",
        short_name: "Period",
        description: "Track period cycles, daily logs, and predictions offline.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#fff5fa",
        theme_color: "#d4477a",
        lang: "es",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        navigateFallback: "index.html",
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: false,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
      },
    }),
  ],
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
    preserveSymlinks: true,
    dedupe: ["react", "react-dom"],
    alias: [
      { find: /^react$/, replacement: appReactRoot },
      { find: /^react\/(.*)$/, replacement: `${appReactRoot}/$1` },
      { find: /^react-dom$/, replacement: appReactDomRoot },
      { find: /^react-dom\/(.*)$/, replacement: `${appReactDomRoot}/$1` },
      { find: "assets", replacement: path.resolve(__dirname, "./src/assets") },
      {
        find: "components",
        replacement: path.resolve(__dirname, "./src/components"),
      },
      { find: "lib", replacement: path.resolve(__dirname, "./src/lib") },
      { find: "hooks", replacement: path.resolve(__dirname, "./src/hooks") },
      {
        find: "layouts",
        replacement: path.resolve(__dirname, "./src/layouts"),
      },
      { find: "views", replacement: path.resolve(__dirname, "./src/views") },
      {
        find: "providers",
        replacement: path.resolve(__dirname, "./src/providers"),
      },
      { find: "lang", replacement: path.resolve(__dirname, "./src/lang") },
    ],
  },
});
