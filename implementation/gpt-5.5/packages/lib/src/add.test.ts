import { describe, expect, it } from "vitest";
import { add } from "./add";

describe("add", () => {
  it("adds positive numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("adds negative and positive numbers", () => {
    expect(add(-2, 3)).toBe(1);
  });

  it("adds zero values", () => {
    expect(add(0, 0)).toBe(0);
  });

  it("adds negative numbers", () => {
    expect(add(-5, -5)).toBe(-10);
  });
});
