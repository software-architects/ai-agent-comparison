'use client'

import { add } from '@repo/lib'
import { useState } from 'react'

export function AdditionVisualizer() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')

  const numA = Number.parseFloat(a) || 0
  const numB = Number.parseFloat(b) || 0
  const result = add(numA, numB)

  return (
    <div>
      <label htmlFor="operand-a">
        First number:
        <input
          id="operand-a"
          type="number"
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="0"
        />
      </label>
      <span> + </span>
      <label htmlFor="operand-b">
        Second number:
        <input
          id="operand-b"
          type="number"
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder="0"
        />
      </label>
      <span> = </span>
      <output data-testid="result">{result}</output>
    </div>
  )
}
