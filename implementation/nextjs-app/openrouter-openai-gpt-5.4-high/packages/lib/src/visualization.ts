import { add } from "./math";

type AdditionDots = {
  dots: string[];
  label: string;
  value: number;
};

export type AdditionVisualization = {
  left: AdditionDots;
  right: AdditionDots;
  result: AdditionDots;
};

function sanitize(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function toDotCount(value: number): number {
  return Math.max(0, Math.min(12, Math.round(Math.abs(value))));
}

function createDots(prefix: string, value: number): string[] {
  return Array.from(
    { length: toDotCount(value) },
    (_, index) => `${prefix}-${index}`,
  );
}

function createSection(
  label: string,
  prefix: string,
  value: number,
): AdditionDots {
  return {
    dots: createDots(prefix, value),
    label,
    value,
  };
}

export function createAdditionVisualization(
  leftOperand: number,
  rightOperand: number,
): AdditionVisualization {
  const left = sanitize(leftOperand);
  const right = sanitize(rightOperand);
  const result = add(left, right);

  return {
    left: createSection("First number", "left", left),
    right: createSection("Second number", "right", right),
    result: createSection("Result", "result", result),
  };
}
