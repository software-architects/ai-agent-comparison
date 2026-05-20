import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AdditionVisualizer } from "./AdditionVisualizer";

function getFirstOperand() {
  return screen.getByRole("spinbutton", { name: "First operand" }) as HTMLInputElement;
}

function getSecondOperand() {
  return screen.getByRole("spinbutton", { name: "Second operand" }) as HTMLInputElement;
}

function getResult() {
  return screen.getByLabelText("Result");
}

describe("<AdditionVisualizer />", () => {
  it("renders without throwing", () => {
    render(<AdditionVisualizer />);
    expect(getFirstOperand()).toBeInTheDocument();
    expect(getSecondOperand()).toBeInTheDocument();
    expect(getResult()).toBeInTheDocument();
  });

  it("shows the initial state with both operands and result at 0", () => {
    render(<AdditionVisualizer />);
    expect(getFirstOperand()).toHaveValue(0);
    expect(getSecondOperand()).toHaveValue(0);
    expect(getResult()).toHaveTextContent("0");
    expect(screen.getByText("+")).toBeInTheDocument();
    expect(screen.getByText("=")).toBeInTheDocument();
  });

  it("updates the result when the first operand changes", async () => {
    const user = userEvent.setup();
    render(<AdditionVisualizer />);
    const first = getFirstOperand();
    await user.clear(first);
    await user.type(first, "7");
    expect(getResult()).toHaveTextContent("7");
  });

  it("updates the result when the second operand changes", async () => {
    const user = userEvent.setup();
    render(<AdditionVisualizer />);
    const first = getFirstOperand();
    const second = getSecondOperand();
    await user.clear(first);
    await user.type(first, "7");
    await user.clear(second);
    await user.type(second, "5");
    expect(getResult()).toHaveTextContent("12");
  });

  it("handles negative numbers", async () => {
    const user = userEvent.setup();
    render(<AdditionVisualizer />);
    const first = getFirstOperand();
    const second = getSecondOperand();
    await user.clear(first);
    await user.type(first, "-3");
    await user.clear(second);
    await user.type(second, "5");
    expect(getResult()).toHaveTextContent("2");
  });

  it("treats an empty operand as 0 (never NaN)", async () => {
    const user = userEvent.setup();
    render(<AdditionVisualizer />);
    const first = getFirstOperand();
    const second = getSecondOperand();
    await user.clear(first);
    await user.clear(second);
    await user.type(second, "4");
    expect(getResult()).toHaveTextContent("4");
    expect(getResult().textContent).not.toMatch(/NaN/);
  });
});
