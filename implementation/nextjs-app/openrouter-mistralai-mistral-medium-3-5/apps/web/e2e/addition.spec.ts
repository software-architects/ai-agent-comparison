import { expect, test } from "@playwright/test"

test.describe("Addition Visualizer E2E", () => {
  test("page loads and shows heading", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { name: "Add Two Numbers" })).toBeVisible()
  })

  test("shows default result", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByTestId("result")).toHaveText("0")
    await expect(page.getByTestId("visualization")).toHaveText("0 + 0 = 0")
  })

  test("updates result when typing first number", async ({ page }) => {
    await page.goto("/")
    const inputA = page.getByLabel("First number (A)")
    await inputA.fill("5")
    await expect(page.getByTestId("result")).toHaveText("5")
    await expect(page.getByTestId("visualization")).toHaveText("5 + 0 = 5")
  })

  test("updates result when typing second number", async ({ page }) => {
    await page.goto("/")
    const inputB = page.getByLabel("Second number (B)")
    await inputB.fill("7")
    await expect(page.getByTestId("result")).toHaveText("7")
    await expect(page.getByTestId("visualization")).toHaveText("0 + 7 = 7")
  })

  test("updates result when typing both numbers", async ({ page }) => {
    await page.goto("/")
    const inputA = page.getByLabel("First number (A)")
    const inputB = page.getByLabel("Second number (B)")
    await inputA.fill("10")
    await inputB.fill("20")
    await expect(page.getByTestId("result")).toHaveText("30")
    await expect(page.getByTestId("visualization")).toHaveText("10 + 20 = 30")
  })

  test("handles negative numbers", async ({ page }) => {
    await page.goto("/")
    const inputA = page.getByLabel("First number (A)")
    const inputB = page.getByLabel("Second number (B)")
    await inputA.fill("-5")
    await inputB.fill("3")
    await expect(page.getByTestId("result")).toHaveText("-2")
    await expect(page.getByTestId("visualization")).toHaveText("-5 + 3 = -2")
  })

  test("handles decimal numbers", async ({ page }) => {
    await page.goto("/")
    const inputA = page.getByLabel("First number (A)")
    const inputB = page.getByLabel("Second number (B)")
    await inputA.fill("0.1")
    await inputB.fill("0.2")
    await expect(page.getByTestId("result")).toHaveText("0.3")
    await expect(page.getByTestId("visualization")).toHaveText("0.1 + 0.2 = 0.3")
  })
})
