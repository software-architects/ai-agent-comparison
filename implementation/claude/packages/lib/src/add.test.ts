import { describe, expect, it } from "vitest";
import { add } from "./add";

describe("add", () => {
  it("adds two positive numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("adds a negative and a positive number", () => {
    expect(add(-2, 3)).toBe(1);
  });

  it("returns 0 when both operands are 0", () => {
    expect(add(0, 0)).toBe(0);
  });

  it("adds two negative numbers", () => {
    expect(add(-5, -5)).toBe(-10);
  });
});
