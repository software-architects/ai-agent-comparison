import { expect, test } from 'vitest'
import { render } from 'vitest-browser-react'
import { AdditionVisualizer } from '../app/components/AdditionVisualizer'

test('renders heading and input fields', async () => {
  const screen = await render(<AdditionVisualizer />)

  await expect.element(screen.getByLabelText(/first number/i)).toBeInTheDocument()
  await expect.element(screen.getByLabelText(/second number/i)).toBeInTheDocument()
  await expect.element(screen.getByTestId('result')).toHaveTextContent('0')
})

test('updates result when typing numbers', async () => {
  const screen = await render(<AdditionVisualizer />)

  const firstInput = screen.getByLabelText(/first number/i)
  const secondInput = screen.getByLabelText(/second number/i)

  await firstInput.fill('3')
  await secondInput.fill('4')

  await expect.element(screen.getByTestId('result')).toHaveTextContent('7')
})
