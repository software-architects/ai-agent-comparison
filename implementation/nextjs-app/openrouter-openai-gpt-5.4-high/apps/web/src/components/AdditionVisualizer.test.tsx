import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import AdditionVisualizer from "./AdditionVisualizer";

test("updates the live result when either operand changes", async () => {
  const screen = await render(<AdditionVisualizer />);

  await expect
    .element(screen.getByRole("heading", { name: "Add Two Numbers" }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByTestId("addition-result"))
    .toHaveTextContent("5");

  await screen.getByLabelText("First number").fill("7");
  await screen.getByLabelText("Second number").fill("8");

  await expect
    .element(screen.getByTestId("addition-result"))
    .toHaveTextContent("15");
});
