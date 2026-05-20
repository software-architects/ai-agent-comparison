"use client";

import { createAdditionVisualization } from "@workspace/lib";
import { useId, useState } from "react";

function parseOperand(value: string): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatValue(value: number): string {
  return value.toString();
}

type DotPanelProps = {
  dots: string[];
  label: string;
  value: number;
};

function DotPanel({ dots, label, value }: DotPanelProps) {
  return (
    <section className="panel-card">
      <span className="panel-label">{label}</span>
      <div className="panel-value">{formatValue(value)}</div>
      <div className="dot-row">
        {dots.length > 0 ? (
          dots.map((dot) => (
            <span aria-hidden="true" className="dot" key={dot} />
          ))
        ) : (
          <span className="dot-empty">No dots for this value yet.</span>
        )}
      </div>
    </section>
  );
}

export default function AdditionVisualizer() {
  const firstInputId = useId();
  const secondInputId = useId();
  const [firstValue, setFirstValue] = useState("2");
  const [secondValue, setSecondValue] = useState("3");

  const visualization = createAdditionVisualization(
    parseOperand(firstValue),
    parseOperand(secondValue),
  );

  return (
    <section className="visualizer-shell">
      <h1 className="visualizer-title">Add Two Numbers</h1>
      <p className="visualizer-copy">
        Shared workspace logic powers this live calculator and the three dot
        panels below.
      </p>

      <div className="visualizer-grid">
        <div className="field-grid">
          <section className="field-card">
            <label className="field-label" htmlFor={firstInputId}>
              First number
            </label>
            <input
              className="field-input"
              id={firstInputId}
              inputMode="decimal"
              onChange={(event) => setFirstValue(event.currentTarget.value)}
              type="number"
              value={firstValue}
            />
          </section>

          <section className="field-card">
            <label className="field-label" htmlFor={secondInputId}>
              Second number
            </label>
            <input
              className="field-input"
              id={secondInputId}
              inputMode="decimal"
              onChange={(event) => setSecondValue(event.currentTarget.value)}
              type="number"
              value={secondValue}
            />
          </section>
        </div>

        <div className="results-grid">
          <section className="result-card">
            <span className="panel-label">Live result</span>
            <output
              aria-live="polite"
              className="result-value"
              data-testid="addition-result"
            >
              {formatValue(visualization.result.value)}
            </output>
          </section>

          <div className="panel-row">
            <DotPanel {...visualization.left} />
            <DotPanel {...visualization.right} />
            <DotPanel {...visualization.result} />
          </div>
        </div>
      </div>
    </section>
  );
}
