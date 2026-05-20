import type { ReactNode } from "react";
import { flushSync } from "react-dom";
import { createRoot, type Root } from "react-dom/client";
import { userEvent } from "vitest/browser";
import { afterEach, describe, expect, it } from "vitest";

import { AdditionVisualizer } from "./AdditionVisualizer";

let root: Root | undefined;

function renderInBrowser(children: ReactNode) {
  const container = document.createElement("div");
  document.body.append(container);

  root = createRoot(container);
  flushSync(() => {
    root?.render(children);
  });
}

afterEach(() => {
  root?.unmount();
  root = undefined;
  document.body.replaceChildren();
});

describe("AdditionVisualizer", () => {
  it("renders the addition demo and updates the result", async () => {
    renderInBrowser(<AdditionVisualizer />);

    expect(document.querySelector("h1")?.textContent).toBe("Add Two Numbers");
    expect(document.querySelector('[data-testid="sum"]')?.textContent).toBe(
      "3",
    );

    const first = document.querySelector<HTMLInputElement>("#left-operand");
    const second = document.querySelector<HTMLInputElement>("#right-operand");

    expect(first).not.toBeNull();
    expect(second).not.toBeNull();

    await userEvent.fill(first as HTMLInputElement, "7");
    await userEvent.fill(second as HTMLInputElement, "5");

    expect(document.querySelector('[data-testid="sum"]')?.textContent).toBe(
      "12",
    );
  });
});
