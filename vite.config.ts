import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 3000,
    proxy: {
      "/socket.io": {
        target: "http://localhost:5006", // Your WebSocket backend
        ws: true, // Enable WebSocket proxying
        changeOrigin: true,
      },
    },
  },
});
