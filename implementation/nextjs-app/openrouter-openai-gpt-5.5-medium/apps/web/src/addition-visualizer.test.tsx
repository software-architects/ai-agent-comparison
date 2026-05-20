import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { AdditionVisualizer } from "./addition-visualizer";

describe("AdditionVisualizer", () => {
  it("updates the result when either operand changes", async () => {
    const user = userEvent.setup();
    render(<AdditionVisualizer />);

    await user.clear(screen.getByLabelText("First number"));
    await user.type(screen.getByLabelText("First number"), "10");
    await user.clear(screen.getByLabelText("Second number"));
    await user.type(screen.getByLabelText("Second number"), "4");

    expect(screen.getByText("14")).toBeInTheDocument();
    expect(screen.getByLabelText("10 plus 4 equals 14")).toBeInTheDocument();
  });
});
