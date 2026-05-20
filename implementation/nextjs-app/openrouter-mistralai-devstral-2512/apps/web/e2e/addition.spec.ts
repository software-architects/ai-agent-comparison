import { test, expect } from '@playwright/test'

test('AdditionVisualizer E2E test', async ({ page }) => {
  await page.goto('http://localhost:3000')
  
  // Check if the page has the heading
  await expect(page.getByRole('heading', { name: 'Add Two Numbers' })).toBeVisible()
  
  // Fill in the inputs
  const inputA = page.getByPlaceholder('First number')
  const inputB = page.getByPlaceholder('Second number')
  
  await inputA.fill('15')
  await inputB.fill('25')
  
  // Check if the result is displayed correctly
  await expect(page.getByText('= 40')).toBeVisible()
})
