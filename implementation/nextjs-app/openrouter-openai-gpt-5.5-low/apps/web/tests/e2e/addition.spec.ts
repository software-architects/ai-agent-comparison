import { expect, test } from "@playwright/test";

test("visualizes addition", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Add Two Numbers" })).toBeVisible();

  await page.getByLabel("First operand").fill("10");
  await page.getByLabel("Second operand").fill("5");

  await expect(page.getByRole("status", { name: "Addition result" })).toContainText("15");
});
