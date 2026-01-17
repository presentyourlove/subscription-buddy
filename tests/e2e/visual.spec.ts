import { expect, test } from '@playwright/test'

test.describe('Visual Regression Tests', () => {
    test.describe.configure({ mode: 'serial' })

    test('Login page visual', async ({ page }) => {
        await page.goto('/login')

        // 使用 domcontentloaded 避免 Firebase 背景請求導致超時
        await page.waitForLoadState('domcontentloaded')
        // 等待頁面關鍵元素出現
        await page.waitForTimeout(1000)

        // 截取登入頁面截圖並與 baseline 比對
        await expect(page).toHaveScreenshot('login-page.png', {
            fullPage: true,
        })
    })

    test('Home page visual (unauthenticated)', async ({ page }) => {
        await page.goto('/')

        await page.waitForLoadState('domcontentloaded')
        await page.waitForTimeout(1000)

        // 未登入會重導向到 login，截取該狀態
        await expect(page).toHaveScreenshot('home-redirect.png', {
            fullPage: true,
        })
    })

    test('Login form elements', async ({ page }) => {
        await page.goto('/login')

        await page.waitForLoadState('domcontentloaded')
        await page.waitForTimeout(1000)

        // 針對特定元素截圖 (表單區域)
        const form = page.locator('form')
        if (await form.count() > 0) {
            await expect(form.first()).toHaveScreenshot('login-form.png')
        }
    })
})
