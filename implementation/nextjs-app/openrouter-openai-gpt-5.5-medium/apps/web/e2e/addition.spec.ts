import { expect, test } from "@playwright/test";

test("updates the addition result live", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Add Two Numbers" }),
  ).toBeVisible();

  await page.getByLabel("First number").fill("7");
  await page.getByLabel("Second number").fill("8");

  await expect(page.getByText("15", { exact: true })).toBeVisible();
  await expect(page.getByLabel("7 plus 8 equals 15")).toBeVisible();
});
