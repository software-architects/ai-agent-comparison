import { add } from "myapp-lib";
import { describe, expect, it } from "vitest";

describe("console integration", () => {
	it("imports add from lib", () => {
		expect(add(2, 3)).toBe(5);
	});
});
