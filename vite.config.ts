import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ["**/*.svg", "**/*.csv"],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("node_modules")) {
            if (id.includes("motion")) return "vendor-framer";
            if (id.includes("recharts")) return "vendor-recharts";
            if (id.includes("lucide-react")) return "vendor-lucide";
            if (id.includes("@radix-ui")) return "vendor-radix";
            return "vendor-core";
          }
          return undefined;
        },
      },
    },
  },
});
