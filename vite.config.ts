import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    tanstackRouter(),
    viteReact(),
    tailwindcss(),
    tsConfigPaths(),
    tanstackStart({
      server: {
        entry: "src/server.ts",
      },
    }),
    nitro({
      preset: "vercel",
    }),
  ],
});
