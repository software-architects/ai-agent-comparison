import { expect, test } from '@playwright/test'

test('has heading Add Two Numbers', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Add Two Numbers' })).toBeVisible()
})

test('adds two numbers entered in the inputs', async ({ page }) => {
  await page.goto('/')

  await page.getByLabel('First number:').fill('3')
  await page.getByLabel('Second number:').fill('4')

  await expect(page.getByTestId('result')).toHaveText('7')
})
