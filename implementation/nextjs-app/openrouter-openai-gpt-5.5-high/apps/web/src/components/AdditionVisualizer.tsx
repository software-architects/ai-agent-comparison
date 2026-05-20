"use client";

import { add } from "@demo/lib";
import { useState } from "react";

function toDisplayNumber(value: string): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function toUnits(value: number): number[] {
  const bounded = Math.min(Math.max(Math.trunc(value), 0), 24);

  return Array.from({ length: bounded }, (_, index) => index);
}

export function AdditionVisualizer() {
  const [left, setLeft] = useState("1");
  const [right, setRight] = useState("2");
  const leftNumber = toDisplayNumber(left);
  const rightNumber = toDisplayNumber(right);
  const sum = add(leftNumber, rightNumber);

  return (
    <section className="addition-card" aria-labelledby="addition-heading">
      <h1 id="addition-heading">Add Two Numbers</h1>
      <p>
        Enter two operands to see the shared math package calculate the result
        and render the same value as a compact unit visualization.
      </p>

      <div className="addition-controls">
        <label htmlFor="left-operand">
          First number
          <input
            id="left-operand"
            inputMode="decimal"
            onChange={(event) => setLeft(event.currentTarget.value)}
            type="number"
            value={left}
          />
        </label>
        <label htmlFor="right-operand">
          Second number
          <input
            id="right-operand"
            inputMode="decimal"
            onChange={(event) => setRight(event.currentTarget.value)}
            type="number"
            value={right}
          />
        </label>
      </div>

      <div className="addition-result" aria-live="polite">
        <span>Current result</span>
        <span data-testid="sum">{sum}</span>
      </div>

      <fieldset className="addition-visual">
        <legend>Addition visualization</legend>
        <VisualizerRow
          label="First"
          units={toUnits(leftNumber)}
          tone="primary"
        />
        <VisualizerRow
          label="Second"
          units={toUnits(rightNumber)}
          tone="secondary"
        />
        <VisualizerRow label="Result" units={toUnits(sum)} tone="result" />
      </fieldset>
    </section>
  );
}

function VisualizerRow({
  label,
  tone,
  units,
}: Readonly<{
  label: string;
  tone: "primary" | "secondary" | "result";
  units: number[];
}>) {
  return (
    <div className="addition-row">
      <strong>{label}</strong>
      <div className="addition-units">
        {units.map((unit) => (
          <span
            aria-hidden="true"
            className={
              tone === "primary" ? "addition-unit" : `addition-unit ${tone}`
            }
            key={unit}
          />
        ))}
      </div>
    </div>
  );
}
