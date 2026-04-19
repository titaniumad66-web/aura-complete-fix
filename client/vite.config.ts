import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { metaImagesPlugin } from "./vite-plugin-meta-images";

export default defineConfig({
  plugins: [
    react(),
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
    outDir: "dist",
  },
});