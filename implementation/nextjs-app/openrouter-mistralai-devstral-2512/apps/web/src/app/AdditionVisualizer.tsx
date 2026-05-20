"use client"

import { useState } from 'react'
import { add } from '@ai-agent-comparison/lib'

export default function AdditionVisualizer() {
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)
  const result = add(a, b)

  return (
    <div>
      <h1>Add Two Numbers</h1>
      <div>
        <input 
          type="number" 
          value={a} 
          onChange={(e) => setA(Number(e.target.value))}
          placeholder="First number"
        />
        <span> + </span>
        <input 
          type="number" 
          value={b} 
          onChange={(e) => setB(Number(e.target.value))}
          placeholder="Second number"
        />
        <span> = {result}</span>
      </div>
    </div>
  )
}
