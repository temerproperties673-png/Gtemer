import { defineConfig } from "vite";
import { nitro } from "nitro/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tanstackStart(), viteReact(), tailwindcss(), nitro()],
  resolve: {
    // Vite 8 natively supports tsconfig paths
    tsconfigPaths: true,
  },
  server: {
    port: 8080,
  },
});
