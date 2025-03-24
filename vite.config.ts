import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    proxy: {
      "/socket.io": {
        target: isProduction ? "https://healthx.live" : "http://localhost:5006",
        ws: true,
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 3000,
    allowedHosts: ["healthx.live"], // Added to allow the host
  },
});
