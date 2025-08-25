import Aura from "@primeuix/themes/aura";

const host = process.env.TAURI_DEV_HOST;

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: false,
  srcDir: "src/app",
  serverDir: "src/server",
  dir: {
    public: "src/public",
  },
  devServer: {
    host: host || "localhost",
    port: 1420,
  },
  vite: {
    clearScreen: false,
    envPrefix: ["VITE_", "TAURI_"],
    server: {
      strictPort: true,
      hmr: host ? { protocol: "ws", host, port: 1420 } : undefined,
      watch: {
        ignored: ["**/src-tauri/**"],
      },
    },
  },
  modules: ["@primevue/nuxt-module", "@nuxtjs/tailwindcss"],
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  },
});
