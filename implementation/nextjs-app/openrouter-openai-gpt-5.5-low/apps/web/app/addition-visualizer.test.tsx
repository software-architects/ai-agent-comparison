import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { AdditionVisualizer } from "./addition-visualizer";

test("updates the result when operands change", async () => {
  const screen = await render(<AdditionVisualizer />);

  await expect.element(screen.getByRole("heading", { name: "Add Two Numbers" })).toBeVisible();
  await expect.element(screen.getByText("Result:")).toBeVisible();

  await screen.getByLabelText("First operand").fill("7");
  await screen.getByLabelText("Second operand").fill("8");

  await expect
    .element(screen.getByRole("status", { name: "Addition result" }))
    .toHaveTextContent("15");
});
