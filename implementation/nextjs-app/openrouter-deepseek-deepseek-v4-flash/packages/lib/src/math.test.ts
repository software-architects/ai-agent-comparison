import { describe, expect, it } from "vitest"
import { add } from "./math.ts"

describe("add", () => {
  it("adds two positive numbers", () => {
    expect(add(2, 3)).toBe(5)
  })

  it("adds a positive and a negative number", () => {
    expect(add(5, -3)).toBe(2)
  })

  it("adds zero", () => {
    expect(add(0, 0)).toBe(0)
  })
})
