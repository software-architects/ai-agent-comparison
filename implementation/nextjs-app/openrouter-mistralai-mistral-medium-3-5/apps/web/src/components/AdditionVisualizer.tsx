"use client"

import { add } from "@ai-agent/lib"
import { useState } from "react"

export default function AdditionVisualizer() {
  const [a, setA] = useState<number>(0)
  const [b, setB] = useState<number>(0)

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Add Two Numbers
      </h1>
      <div className="max-w-md space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="a"
            className="block text-sm font-medium text-gray-700"
          >
            First number (A)
          </label>
          <input
            id="a"
            type="number"
            value={a}
            onChange={(e) => setA(e.target.value === '' ? 0 : parseFloat(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="b"
            className="block text-sm font-medium text-gray-700"
          >
            Second number (B)
          </label>
          <input
            id="b"
            type="number"
            value={b}
            onChange={(e) => setB(e.target.value === '' ? 0 : parseFloat(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-md">
          <p className="text-lg">
            <span className="font-semibold">Result:</span>{' '}
            <span data-testid="result">{add(a, b)}</span>
          </p>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-lg">
            <span className="font-semibold">Visualization:</span>{' '}
            <span data-testid="visualization">
              {a} + {b} = {add(a, b)}
            </span>
          </p>
        </div>
      </div>
    </main>
  )
}
