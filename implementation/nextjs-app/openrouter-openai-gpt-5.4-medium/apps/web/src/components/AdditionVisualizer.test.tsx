import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { AdditionVisualizer } from "./AdditionVisualizer";

describe("AdditionVisualizer", () => {
  test("updates the result when either operand changes", () => {
    render(<AdditionVisualizer />);

    fireEvent.change(screen.getByLabelText("First number"), {
      target: { value: "20" },
    });
    fireEvent.change(screen.getByLabelText("Second number"), {
      target: { value: "22" },
    });

    expect(screen.getByTestId("result-value").textContent).toBe("42");
  });
});
