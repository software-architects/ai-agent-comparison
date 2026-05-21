import react from "@vitejs/plugin-react"
import { playwright } from "@vitest/browser-playwright"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    browser: {
      enabled: true,
      provider: playwright({ launchOptions: { headless: true } }),
      instances: [{ browser: "chromium" }],
    },
  },
})
