import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  platform: "node",
  target: "node22",
  sourcemap: true,
  clean: true,
  // bundle the workspace package so the Render build only needs `npm ci` + `npm run build`
  noExternal: ["@diner/shared"],
});
