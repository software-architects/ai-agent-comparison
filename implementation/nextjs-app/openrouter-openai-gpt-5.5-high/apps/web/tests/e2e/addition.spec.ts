import { expect, test } from "@playwright/test";

test("updates the addition result live", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Add Two Numbers" }),
  ).toBeVisible();
  await expect(
    page.getByRole("group", { name: "Addition visualization" }),
  ).toBeVisible();
  await expect(page.getByTestId("sum")).toHaveText("3");

  await page.getByLabel("First number").fill("10");
  await expect(page.getByTestId("sum")).toHaveText("12");

  await page.getByLabel("Second number").fill("5");
  await expect(page.getByTestId("sum")).toHaveText("15");
});
