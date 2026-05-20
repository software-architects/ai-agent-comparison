"use client";

import { add } from "@workspace/lib";
import { useId, useState } from "react";

import styles from "./AdditionVisualizer.module.css";

function parseOperand(value: string): number {
  if (value.trim() === "") {
    return 0;
  }

  return Number(value);
}

export function AdditionVisualizer() {
  const firstId = useId();
  const secondId = useId();
  const [firstValue, setFirstValue] = useState("0");
  const [secondValue, setSecondValue] = useState("0");

  const left = parseOperand(firstValue);
  const right = parseOperand(secondValue);
  const result = add(left, right);

  return (
    <section className={styles.shell}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Workspace plumbing demo</p>
        <h1 className={styles.title}>Add Two Numbers</h1>
        <p className={styles.copy}>
          The inputs live in the Next.js app, and the math comes from the shared
          workspace library.
        </p>

        <div className={styles.formGrid}>
          <label className={styles.field} htmlFor={firstId}>
            <span>First number</span>
            <input
              id={firstId}
              inputMode="decimal"
              name="firstNumber"
              onChange={(event) => setFirstValue(event.target.value)}
              type="number"
              value={firstValue}
            />
          </label>

          <label className={styles.field} htmlFor={secondId}>
            <span>Second number</span>
            <input
              id={secondId}
              inputMode="decimal"
              name="secondNumber"
              onChange={(event) => setSecondValue(event.target.value)}
              type="number"
              value={secondValue}
            />
          </label>
        </div>

        <section aria-label="Addition summary" className={styles.visualizer}>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>First</span>
            <strong>{left}</strong>
          </article>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>Second</span>
            <strong>{right}</strong>
          </article>
          <article className={styles.resultCard}>
            <span className={styles.statLabel}>Result</span>
            <strong data-testid="result-value">{result}</strong>
          </article>
        </section>
      </div>
    </section>
  );
}
