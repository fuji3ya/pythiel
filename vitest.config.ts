import { defineConfig } from "vitest/config";

// Unit tests target the pure-function libs (divination / synthesis / gate / progress).
// No React Native runtime — keep these modules free of native imports.
// AsyncStorage is vi.mock'd in store tests.
export default defineConfig({
  test: {
    include: [
      "lib/**/__tests__/**/*.test.ts",
      "store/__tests__/**/*.test.ts",
    ],
    environment: "node",
  },
});
