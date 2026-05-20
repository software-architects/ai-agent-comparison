import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdditionVisualizer } from "./AdditionVisualizer";

describe("AdditionVisualizer", () => {
	it("renders with default values", () => {
		render(<AdditionVisualizer />);
		const inputA = screen.getByTestId("operand-a");
		const inputB = screen.getByTestId("operand-b");
		const result = screen.getByTestId("result");

		expect((inputA as HTMLInputElement).value).toBe("0");
		expect((inputB as HTMLInputElement).value).toBe("0");
		expect(result.textContent).toBe("Result: 0");
	});

	it("updates result when operands change", async () => {
		render(<AdditionVisualizer />);
		const inputA = screen.getByTestId("operand-a");
		const inputB = screen.getByTestId("operand-b");

		fireEvent.change(inputA, { target: { value: "5" } });
		fireEvent.change(inputB, { target: { value: "3" } });

		const result = screen.getByTestId("result");
		expect(result.textContent).toBe("Result: 8");
	});
});
