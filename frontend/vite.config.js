import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// In development the Vite server proxies /api to WildFly, so the browser sees a single
// origin and no CORS setup is needed. Override the target with VITE_BACKEND_URL.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: env.VITE_BACKEND_URL || "http://localhost:8080",
          changeOrigin: true,
          rewrite: (path) => `/edugateway${path}`,
        },
      },
    },
  };
});
