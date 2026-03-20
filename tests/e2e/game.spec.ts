import { test, expect } from '@playwright/test'

test.describe('Game Flow', () => {
  test('should load the page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toContainText('数独游戏')
  })
})
