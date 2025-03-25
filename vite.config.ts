import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    plugins: [react()],
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
    server: {
      host: true,
      port: 3000,
      proxy: {
        "/socket.io": {
          target: isProduction ? "https://healthx.live" : "http://localhost:5000",
          ws: true,
          changeOrigin: true,
        },
      },
    },
    preview: {
      port: 3000,
      allowedHosts: ["healthx.live"], // Added to allow the host
    },
  };
});
