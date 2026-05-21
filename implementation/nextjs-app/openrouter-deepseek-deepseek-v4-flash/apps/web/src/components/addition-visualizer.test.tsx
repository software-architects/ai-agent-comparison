import { describe, expect, it } from "vitest"
import { render } from "vitest-browser-react"
import { AdditionVisualizer } from "./addition-visualizer"

describe("AdditionVisualizer", () => {
  it("renders the heading", async () => {
    const screen = await render(<AdditionVisualizer />)
    await expect.element(screen.getByText("+")).toBeVisible()
    await expect.element(screen.getByText("=")).toBeVisible()
  })

  it("displays 0 as default result", async () => {
    const screen = await render(<AdditionVisualizer />)
    const result = screen.getByTestId("result")
    await expect.element(result).toBeVisible()
  })

  it("updates result when typing numbers", async () => {
    const screen = await render(<AdditionVisualizer />)
    const firstInput = screen.getByLabelText("first operand")
    const secondInput = screen.getByLabelText("second operand")
    const result = screen.getByTestId("result")

    await expect.element(result).toBeVisible()
    await expect.element(firstInput).toBeVisible()
    await expect.element(secondInput).toBeVisible()
  })
})
