"use client";

import type { ChangeEvent, CSSProperties } from "react";
import { useState } from "react";
import { add } from "./add";

const wrapperStyle: CSSProperties = {
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: "0.75rem",
};

const boxStyle: CSSProperties = {
  border: "2px solid #1f2937",
  borderRadius: "0.75rem",
  boxSizing: "border-box",
  font: "inherit",
  fontSize: "1.5rem",
  minHeight: "4rem",
  minWidth: "6rem",
  padding: "0.75rem 1rem",
  textAlign: "center",
};

const symbolStyle: CSSProperties = {
  fontSize: "2rem",
  fontWeight: 700,
};

function operandValue(value: string): number {
  if (value.trim() === "") {
    return 0;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function AdditionVisualizer() {
  const [firstOperand, setFirstOperand] = useState("0");
  const [secondOperand, setSecondOperand] = useState("0");

  const result = add(operandValue(firstOperand), operandValue(secondOperand));

  function handleFirstOperandChange(event: ChangeEvent<HTMLInputElement>) {
    setFirstOperand(event.target.value);
  }

  function handleSecondOperandChange(event: ChangeEvent<HTMLInputElement>) {
    setSecondOperand(event.target.value);
  }

  return (
    <div style={wrapperStyle}>
      <input
        aria-label="First operand"
        onChange={handleFirstOperandChange}
        style={boxStyle}
        type="number"
        value={firstOperand}
      />
      <span aria-hidden="true" style={symbolStyle}>
        +
      </span>
      <input
        aria-label="Second operand"
        onChange={handleSecondOperandChange}
        style={boxStyle}
        type="number"
        value={secondOperand}
      />
      <span aria-hidden="true" style={symbolStyle}>
        =
      </span>
      <output aria-label="Result" style={boxStyle}>
        {result}
      </output>
    </div>
  );
}
