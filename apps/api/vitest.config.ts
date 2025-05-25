import path from "path";
import { defineWorkersProject } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersProject({
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
  test: {
    typecheck: {
      tsconfig: "./tsconfig.test.json",
    },
    globals: true,
    include: ["./src/**/*.test.ts"],
    poolOptions: {
      workers: { wrangler: { configPath: "./wrangler.jsonc" } },
    },
  },
});
