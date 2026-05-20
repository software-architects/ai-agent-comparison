"use client";

import { add } from "myapp-lib";
import { useState } from "react";

export function AdditionVisualizer() {
	const [a, setA] = useState(0);
	const [b, setB] = useState(0);

	const result = add(a, b);

	return (
		<div>
			<label>
				Operand A:
				<input
					type="number"
					value={a}
					onChange={(e) => setA(Number(e.target.value))}
					data-testid="operand-a"
				/>
			</label>
			<label>
				Operand B:
				<input
					type="number"
					value={b}
					onChange={(e) => setB(Number(e.target.value))}
					data-testid="operand-b"
				/>
			</label>
			<div data-testid="result">Result: {result}</div>
		</div>
	);
}
