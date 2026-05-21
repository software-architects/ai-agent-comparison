import { expect, test } from "@playwright/test"

test("adds two numbers and displays result", async ({ page }) => {
  await page.goto("/")

  await expect(page.getByRole("heading", { name: "Add Two Numbers" })).toBeVisible()

  const firstInput = page.getByLabel("first operand")
  const secondInput = page.getByLabel("second operand")

  await firstInput.fill("7")
  await secondInput.fill("5")

  await expect(page.getByTestId("result")).toHaveText("12")
})
