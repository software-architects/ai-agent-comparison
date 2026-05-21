import { describe, expect, it } from 'vitest'
import { add } from '../src/math'

describe('add', () => {
  it('adds two positive numbers', () => {
    expect(add(2, 3)).toBe(5)
  })

  it('adds a positive and a negative number', () => {
    expect(add(5, -3)).toBe(2)
  })

  it('adds two negative numbers', () => {
    expect(add(-1, -1)).toBe(-2)
  })

  it('adds zero', () => {
    expect(add(0, 5)).toBe(5)
    expect(add(5, 0)).toBe(5)
  })
})
