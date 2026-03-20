import { test, expect } from '@playwright/test'

test.describe('Guide Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.clear()
    })
  })

  test.describe('首次访问', () => {
    test('should show guide page for first-time visitors', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await expect(page.locator('[data-testid="guide-page"]')).toBeVisible()
    })

    test('should display 4 guide steps', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      const stepIndicators = page.locator('[data-testid="step-indicator"]')
      await expect(stepIndicators).toHaveCount(4)
    })

    test('should navigate through all steps', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      for (let i = 0; i < 3; i++) {
        const nextButton = page.locator('button:has-text("下一步")')
        await expect(nextButton).toBeVisible()
        await nextButton.click()
        await page.waitForTimeout(300)
      }
      
      const completeButton = page.locator('button:has-text("开始游戏")')
      await expect(completeButton).toBeVisible()
    })

    test('should show skip button', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      const skipButton = page.locator('button:has-text("跳过")')
      await expect(skipButton).toBeVisible()
    })

    test('should complete guide and navigate to game', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      for (let i = 0; i < 3; i++) {
        await page.locator('button:has-text("下一步")').click()
        await page.waitForTimeout(300)
      }
      
      await page.locator('button:has-text("开始游戏")').click()
      await page.waitForTimeout(500)
      
      await expect(page.locator('[data-testid="game-page"]')).toBeVisible()
    })
  })

  test.describe('跳过引导', () => {
    test('should skip guide and go to game', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.locator('button:has-text("跳过")').click()
      await page.waitForTimeout(500)
      
      await expect(page.locator('[data-testid="game-page"]')).toBeVisible()
    })

    test('should not show guide on subsequent visits', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.locator('button:has-text("跳过")').click()
      await page.waitForTimeout(500)
      
      await page.reload()
      await page.waitForLoadState('networkidle')
      
      await expect(page.locator('[data-testid="guide-page"]')).not.toBeVisible()
      await expect(page.locator('[data-testid="game-page"]')).toBeVisible()
    })
  })

  test.describe('引导步骤内容', () => {
    test('should show step indicators', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      const stepIndicators = page.locator('[data-testid="step-indicator"]')
      await expect(stepIndicators).toHaveCount(4)
      
      const activeIndicator = page.locator('[data-testid="step-indicator"].active')
      await expect(activeIndicator).toHaveCount(1)
    })

    test('should show correct content for each step', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      const stepContents = [
        '游戏规则',
        '操作方式',
        '游戏技巧',
        '开始挑战'
      ]
      
      for (let i = 0; i < stepContents.length; i++) {
        const content = page.locator(`text=${stepContents[i]}`)
        await expect(content).toBeVisible()
        
        if (i < stepContents.length - 1) {
          await page.locator('button:has-text("下一步")').click()
          await page.waitForTimeout(300)
        }
      }
    })

    test('should show previous button on step 2+', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      const prevButton = page.locator('button:has-text("上一步")')
      await expect(prevButton).not.toBeVisible()
      
      await page.locator('button:has-text("下一步")').click()
      await page.waitForTimeout(300)
      
      await expect(prevButton).toBeVisible()
    })

    test('should show next/complete button', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await expect(page.locator('button:has-text("下一步")')).toBeVisible()
      
      for (let i = 0; i < 3; i++) {
        await page.locator('button:has-text("下一步")').click()
        await page.waitForTimeout(300)
      }
      
      await expect(page.locator('button:has-text("开始游戏")')).toBeVisible()
    })

    test('should navigate back with previous button', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.locator('button:has-text("下一步")').click()
      await page.waitForTimeout(300)
      
      await page.locator('button:has-text("上一步")').click()
      await page.waitForTimeout(300)
      
      await expect(page.locator('button:has-text("下一步")')).toBeVisible()
      await expect(page.locator('button:has-text("上一步")')).not.toBeVisible()
    })
  })
})
