import { describe, expect, it } from "vitest"
import { add } from "./add"

describe("math add function", () => {
  it("adds two positive numbers", () => {
    expect(add(2, 3)).toBe(5)
  })

  it("adds positive and negative numbers", () => {
    expect(add(5, -3)).toBe(2)
  })

  it("adds two negative numbers", () => {
    expect(add(-2, -3)).toBe(-5)
  })

  it("adds zero correctly", () => {
    expect(add(0, 5)).toBe(5)
    expect(add(5, 0)).toBe(5)
    expect(add(0, 0)).toBe(0)
  })

  it("adds decimal numbers", () => {
    expect(add(0.1, 0.2)).toBeCloseTo(0.3)
  })
})
