import { describe, expect, test } from "vitest";

import { add } from "./math";

describe("add", () => {
  test("returns the sum of two numbers", () => {
    expect(add(20, 22)).toBe(42);
  });
});
