import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.ts"],
    restoreMocks: true,
    clearMocks: true,
    unstubGlobals: true,
    coverage: {
      provider: "v8",
      include: [
        "src/lib/**",
        "src/hooks/**",
        "src/components/**",
        "scripts/lib/**",
      ],
      // Topic visualizations and shadcn primitives are visual; the shared
      // logic they build on is what the suite covers.
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/test/**",
        "src/components/visualizations/**",
        "src/components/ui/**",
      ],
    },
  },
});
