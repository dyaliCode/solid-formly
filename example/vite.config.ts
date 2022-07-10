import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  ssr: {
    noExternal: ["solid-formly"]
  },
  build: {
    target: "esnext",
    polyfillDynamicImport: false
  }
});
