import { expect, test } from "@playwright/test";

test.describe("Addition Visualizer", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3000");
	});

	test("shows heading and visualizer", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: "Add Two Numbers" }),
		).toBeVisible();
		await expect(page.getByTestId("operand-a")).toBeVisible();
		await expect(page.getByTestId("operand-b")).toBeVisible();
		await expect(page.getByTestId("result")).toHaveText("Result: 0");
	});

	test("updates result when typing operands", async ({ page }) => {
		const inputA = page.getByTestId("operand-a");
		const inputB = page.getByTestId("operand-b");
		const result = page.getByTestId("result");

		await inputA.fill("7");
		await expect(result).toHaveText("Result: 7");

		await inputB.fill("5");
		await expect(result).toHaveText("Result: 12");
	});
});
