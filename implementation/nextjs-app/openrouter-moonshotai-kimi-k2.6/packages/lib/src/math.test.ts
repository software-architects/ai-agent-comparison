import { describe, expect, it } from "vitest";
import { add } from "./math";

describe("add", () => {
	it("returns the sum of two numbers", () => {
		expect(add(2, 3)).toBe(5);
		expect(add(0, 0)).toBe(0);
		expect(add(-1, 1)).toBe(0);
	});
});
