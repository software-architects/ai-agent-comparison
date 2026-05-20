"use client";

import { add } from "@skeleton/lib";
import { useState } from "react";

export function AdditionVisualizer() {
  const [left, setLeft] = useState(2);
  const [right, setRight] = useState(3);
  const result = add(left, right);
  const bars = [left, right, result];
  const readNumber = (value: string) => (value === "" ? 0 : Number(value));

  return (
    <section className="visualizer" aria-labelledby="addition-heading">
      <div className="intro">
        <p className="eyebrow">Workspace plumbing demo</p>
        <h1 id="addition-heading">Add Two Numbers</h1>
        <p>Shared TypeScript logic powers this client component and the console app.</p>
      </div>

      <div className="controls">
        <label>
          First operand
          <input
            aria-label="First operand"
            type="number"
            value={left}
            onChange={(event) => setLeft(readNumber(event.currentTarget.value))}
          />
        </label>
        <label>
          Second operand
          <input
            aria-label="Second operand"
            type="number"
            value={right}
            onChange={(event) => setRight(readNumber(event.currentTarget.value))}
          />
        </label>
      </div>

      <div className="result" role="status" aria-label="Addition result">
        Result: <strong>{result}</strong>
      </div>

      <div className="bars">
        {bars.map((value, index) => (
          <div className="bar" key={index} style={{ height: `${Math.max(value, 1) * 1.5}rem` }}>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
