import { expect, test } from "@playwright/test";

test("shows the addition visualizer and updates the result live", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Add Two Numbers" }),
  ).toBeVisible();

  await page.getByLabel("First number").fill("20");
  await page.getByLabel("Second number").fill("22");

  await expect(page.getByTestId("result-value")).toHaveText("42");
});
