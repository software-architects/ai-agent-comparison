/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	root: __dirname,
	test: {
		globals: true,
		browser: {
			provider: playwright(),
			enabled: true,
			instances: [{ browser: "chromium" }],
		},
		exclude: ["**/node_modules/**", "**/e2e/**"],
	},
});
