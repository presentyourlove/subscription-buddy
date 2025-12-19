import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Sub-Buddy/)
})

test('navigation to create group', async ({ page }) => {
  await page.goto('/')

  // Click the create group link (assuming there's a link or button)
  // Since we require login, it might redirect to login.
  // Expect redirect to login
  await expect(page).toHaveURL(/.*login/)

  // Check for submit button
  await expect(page.locator('button[type="submit"]')).toBeVisible()
})
