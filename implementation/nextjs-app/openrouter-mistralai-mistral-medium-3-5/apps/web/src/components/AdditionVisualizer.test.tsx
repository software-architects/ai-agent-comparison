import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import AdditionVisualizer from "../components/AdditionVisualizer"

describe("<AdditionVisualizer />", () => {
  it("renders the heading", () => {
    render(<AdditionVisualizer />)
    expect(screen.getByText("Add Two Numbers")).toBeInTheDocument()
  })

  it("shows result of 0 + 0 = 0 by default", () => {
    render(<AdditionVisualizer />)
    expect(screen.getByTestId("result")).toHaveTextContent("0")
    expect(screen.getByTestId("visualization")).toHaveTextContent("0 + 0 = 0")
  })

  it("updates result when first input changes", async () => {
    const user = userEvent.setup()
    render(<AdditionVisualizer />)

    const inputA = screen.getByLabelText(/First number/i)
    await user.clear(inputA)
    await user.type(inputA, "5")

    expect(screen.getByTestId("result")).toHaveTextContent("5")
    expect(screen.getByTestId("visualization")).toHaveTextContent("5 + 0 = 5")
  })

  it("updates result when second input changes", async () => {
    const user = userEvent.setup()
    render(<AdditionVisualizer />)

    const inputB = screen.getByLabelText(/Second number/i)
    await user.clear(inputB)
    await user.type(inputB, "3")

    expect(screen.getByTestId("result")).toHaveTextContent("3")
    expect(screen.getByTestId("visualization")).toHaveTextContent("0 + 3 = 3")
  })

  it("updates result when both inputs change", async () => {
    const user = userEvent.setup()
    render(<AdditionVisualizer />)

    const inputA = screen.getByLabelText(/First number/i)
    const inputB = screen.getByLabelText(/Second number/i)

    await user.clear(inputA)
    await user.type(inputA, "2")
    await user.clear(inputB)
    await user.type(inputB, "3")

    expect(screen.getByTestId("result")).toHaveTextContent("5")
    expect(screen.getByTestId("visualization")).toHaveTextContent("2 + 3 = 5")
  })

  it("handles decimal numbers", async () => {
    const user = userEvent.setup()
    render(<AdditionVisualizer />)

    const inputA = screen.getByLabelText(/First number/i)
    const inputB = screen.getByLabelText(/Second number/i)

    await user.clear(inputA)
    await user.type(inputA, "0.1")
    await user.clear(inputB)
    await user.type(inputB, "0.2")

    expect(screen.getByTestId("result")).toHaveTextContent("0.3")
    expect(screen.getByTestId("visualization")).toHaveTextContent("0.1 + 0.2 = 0.3")
  })

})
