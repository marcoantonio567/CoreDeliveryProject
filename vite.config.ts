import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    tanstackStart({
      server: {
        entry: "src/server.ts",
      },
    }),
    viteReact(),
    tailwindcss(),
    tsConfigPaths(),
    process.env.NODE_ENV === "production" ? nitro({
      preset: "vercel",
    }) : null,
  ].filter(Boolean),
  ssr: {
    noExternal: ["tslib"],
  },
  build: {
    target: "esnext",
  },
});
