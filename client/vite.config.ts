import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { metaImagesPlugin } from "./vite-plugin-meta-images";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    tailwindcss(),
    metaImagesPlugin(),
  ],

  resolve: {
    alias: {
      "@": "/src",
      "@shared": "/shared",
      "@assets": "/attached_assets",
    },
  },

  build: {
    outDir: "dist",   // VERY IMPORTANT
  },
});