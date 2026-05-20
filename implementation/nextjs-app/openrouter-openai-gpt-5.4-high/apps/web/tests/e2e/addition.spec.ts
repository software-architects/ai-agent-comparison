import { expect, test } from "@playwright/test";

test("updates the result while typing", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Add Two Numbers" }),
  ).toBeVisible();
  await expect(page.getByTestId("addition-result")).toHaveText("5");

  await page.getByLabel("First number").fill("11");
  await page.getByLabel("Second number").fill("9");

  await expect(page.getByTestId("addition-result")).toHaveText("20");
});
