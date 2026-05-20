import { expect, test } from "@playwright/test";

test("renders the heading, computes the sum, and updates live", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Add Two Numbers" })).toBeVisible();

  const firstOperand = page.getByLabel("First operand");
  const secondOperand = page.getByLabel("Second operand");
  const result = page.getByLabel("Result");

  await firstOperand.fill("7");
  await secondOperand.fill("5");
  await expect(result).toHaveText("12");

  await firstOperand.fill("10");
  await expect(result).toHaveText("15");
});
