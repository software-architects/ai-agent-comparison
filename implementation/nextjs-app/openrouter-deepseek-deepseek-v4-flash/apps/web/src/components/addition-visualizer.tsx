"use client"

import { add } from "@repo/lib"
import { useState } from "react"

export function AdditionVisualizer() {
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)
  const result = add(a, b)

  return (
    <div>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "1rem" }}>
        <input
          type="number"
          value={a}
          onChange={(e) => setA(Number(e.target.value))}
          aria-label="first operand"
          style={{ width: "80px", padding: "0.25rem" }}
        />
        <span>+</span>
        <input
          type="number"
          value={b}
          onChange={(e) => setB(Number(e.target.value))}
          aria-label="second operand"
          style={{ width: "80px", padding: "0.25rem" }}
        />
        <span>=</span>
        <span data-testid="result" style={{ fontWeight: "bold" }}>
          {result}
        </span>
      </div>
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          gap: "0.25rem",
          alignItems: "flex-end",
          height: "60px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: `${Math.max(Math.abs(a), 4)}px`,
            backgroundColor: "cornflowerblue",
            transition: "height 0.2s",
          }}
          data-testid="bar-a"
        />
        <div
          style={{
            width: "40px",
            height: `${Math.max(Math.abs(b), 4)}px`,
            backgroundColor: "tomato",
            transition: "height 0.2s",
          }}
          data-testid="bar-b"
        />
      </div>
    </div>
  )
}
