import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdditionVisualizer } from "./AdditionVisualizer";

describe("AdditionVisualizer", () => {
  it("renders without throwing", () => {
    render(<AdditionVisualizer />);

    expect(screen.getByRole("spinbutton", { name: "First operand" })).toBeInTheDocument();
  });

  it("shows the initial state correctly", () => {
    render(<AdditionVisualizer />);

    expect(screen.getByRole("spinbutton", { name: "First operand" })).toHaveValue(0);
    expect(screen.getByRole("spinbutton", { name: "Second operand" })).toHaveValue(0);
    expect(screen.getByText("+")).toBeInTheDocument();
    expect(screen.getByText("=")).toBeInTheDocument();
    expect(screen.getByLabelText("Result")).toHaveTextContent("0");
  });

  it("updates the result when typing into the first operand box", () => {
    render(<AdditionVisualizer />);

    fireEvent.change(screen.getByRole("spinbutton", { name: "First operand" }), {
      target: { value: "7" },
    });

    expect(screen.getByLabelText("Result")).toHaveTextContent("7");
  });

  it("updates the result when typing into the second operand box", () => {
    render(<AdditionVisualizer />);

    fireEvent.change(screen.getByRole("spinbutton", { name: "First operand" }), {
      target: { value: "7" },
    });
    fireEvent.change(screen.getByRole("spinbutton", { name: "Second operand" }), {
      target: { value: "5" },
    });

    expect(screen.getByLabelText("Result")).toHaveTextContent("12");
  });

  it("handles negative numbers", () => {
    render(<AdditionVisualizer />);

    fireEvent.change(screen.getByRole("spinbutton", { name: "First operand" }), {
      target: { value: "-3" },
    });
    fireEvent.change(screen.getByRole("spinbutton", { name: "Second operand" }), {
      target: { value: "5" },
    });

    expect(screen.getByLabelText("Result")).toHaveTextContent("2");
  });

  it("treats an empty operand as zero", () => {
    render(<AdditionVisualizer />);

    fireEvent.change(screen.getByRole("spinbutton", { name: "First operand" }), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByRole("spinbutton", { name: "Second operand" }), {
      target: { value: "4" },
    });

    expect(screen.getByLabelText("Result")).toHaveTextContent("4");
  });
});
