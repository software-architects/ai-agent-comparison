import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AdditionVisualizer from '../src/app/AdditionVisualizer'

describe('AdditionVisualizer', () => {
  it('should render and calculate addition correctly', () => {
    render(<AdditionVisualizer />)
    
    const inputA = screen.getByPlaceholderText('First number')
    const inputB = screen.getByPlaceholderText('Second number')
    
    fireEvent.change(inputA, { target: { value: '5' } })
    fireEvent.change(inputB, { target: { value: '7' } })
    
    expect(screen.getByText('= 12')).toBeInTheDocument()
  })
})
