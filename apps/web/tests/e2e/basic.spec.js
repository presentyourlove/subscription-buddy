import { expect, test } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Sub-Buddy/)
})

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/')

  // Verify the page loaded by checking for visible content
  await expect(page.locator('body')).toBeVisible()
})


