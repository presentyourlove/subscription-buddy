import { expect, test } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Sub-Buddy/)
})

test('navigation to create group requires login', async ({ page }) => {
  // Navigate to create-group (a protected route)
  await page.goto('/create-group')

  // Since we require login, it should redirect to login.
  // Vue Router uses hash mode, so URL will be /#/login
  await expect(page).toHaveURL(/.*login.*/)

  // Check for submit button on login page
  await expect(page.locator('button[type="submit"]')).toBeVisible()
})

