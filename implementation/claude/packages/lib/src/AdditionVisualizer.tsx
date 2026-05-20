"use client";

import { type CSSProperties, type ChangeEvent, useState } from "react";
import { add } from "./add";

function parseOperand(value: string): number {
  if (value === "" || value === "-") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function AdditionVisualizer() {
  const [a, setA] = useState("0");
  const [b, setB] = useState("0");

  const result = add(parseOperand(a), parseOperand(b));

  const handleA = (e: ChangeEvent<HTMLInputElement>) => setA(e.target.value);
  const handleB = (e: ChangeEvent<HTMLInputElement>) => setB(e.target.value);

  return (
    <div style={rowStyle}>
      <input
        type="number"
        aria-label="First operand"
        value={a}
        onChange={handleA}
        style={inputBoxStyle}
      />
      <span aria-hidden="true" style={operatorStyle}>
        +
      </span>
      <input
        type="number"
        aria-label="Second operand"
        value={b}
        onChange={handleB}
        style={inputBoxStyle}
      />
      <span aria-hidden="true" style={operatorStyle}>
        =
      </span>
      <output aria-label="Result" style={resultBoxStyle}>
        {result}
      </output>
    </div>
  );
}

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  fontSize: "1.5rem",
  fontFamily: "system-ui, sans-serif",
};

const boxBase: CSSProperties = {
  border: "2px solid #333",
  borderRadius: "0.5rem",
  padding: "0.5rem 0.75rem",
  minWidth: "4rem",
  fontSize: "1.5rem",
  textAlign: "center",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const inputBoxStyle: CSSProperties = {
  ...boxBase,
  background: "white",
  color: "#111",
};

const resultBoxStyle: CSSProperties = {
  ...boxBase,
  background: "#f3f4f6",
  color: "#111",
  display: "inline-block",
};

const operatorStyle: CSSProperties = {
  fontWeight: 600,
};
