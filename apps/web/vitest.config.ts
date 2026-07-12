import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": import.meta.dirname,
    },
  },
  test: {
    environment: "jsdom",
    execArgv: ["--no-experimental-webstorage"],
    globals: true,
    include: ["**/*.test.{ts,tsx}"],
  },
});
