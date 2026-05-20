"use client";

import { add } from "@workspace/lib";
import { type CSSProperties, useState } from "react";

import styles from "./addition-visualizer.module.css";

function toNumber(value: string): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function markerCount(value: number): number {
  return Math.min(12, Math.max(0, Math.trunc(Math.abs(value))));
}

type MarkerStripProps = {
  label: string;
  value: number;
};

function MarkerStrip({ label, value }: MarkerStripProps) {
  const markerStyle = {
    "--marker-count": markerCount(value),
  } as CSSProperties;

  return (
    <div className={styles.strip}>
      <span className={styles.stripLabel}>{label}</span>
      <div className={styles.markers} aria-hidden="true" style={markerStyle} />
    </div>
  );
}

export function AdditionVisualizer() {
  const [left, setLeft] = useState("2");
  const [right, setRight] = useState("3");
  const leftNumber = toNumber(left);
  const rightNumber = toNumber(right);
  const result = add(leftNumber, rightNumber);

  return (
    <section className={styles.card} aria-labelledby="addition-title">
      <p className={styles.eyebrow}>Shared library demo</p>
      <h1 id="addition-title">Add Two Numbers</h1>
      <div className={styles.inputs}>
        <label className={styles.field}>
          <span>First number</span>
          <input
            inputMode="decimal"
            onChange={(event) => setLeft(event.currentTarget.value)}
            type="number"
            value={left}
          />
        </label>
        <label className={styles.field}>
          <span>Second number</span>
          <input
            inputMode="decimal"
            onChange={(event) => setRight(event.currentTarget.value)}
            type="number"
            value={right}
          />
        </label>
      </div>
      <div className={styles.result} aria-live="polite">
        <span>Result</span>
        <strong>{result}</strong>
      </div>
      <div
        className={styles.visualizer}
        aria-label={`${leftNumber} plus ${rightNumber} equals ${result}`}
        role="img"
      >
        <MarkerStrip label="First" value={leftNumber} />
        <MarkerStrip label="Second" value={rightNumber} />
        <MarkerStrip label="Result" value={result} />
      </div>
    </section>
  );
}
