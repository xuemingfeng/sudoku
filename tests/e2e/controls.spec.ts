import { test, expect } from '@playwright/test'

test.describe('Game Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.clear()
    })
    await page.waitForLoadState('networkidle')
    
    try {
      const skipButton = page.locator('button:has-text("跳过")')
      if (await skipButton.isVisible({ timeout: 2000 })) {
        await skipButton.click()
        await page.waitForTimeout(500)
      }
    } catch {
      // Guide already skipped
    }
    
    await page.waitForSelector('[data-testid="game-page"]', { timeout: 10000 })
  })

  test.describe('新游戏按钮', () => {
    test('should show difficulty modal on click', async ({ page }) => {
      const newGameButton = page.getByRole('button', { name: '新游戏' })
      await newGameButton.click()
      
      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()
      await expect(modal.locator('h2:has-text("选择难度")')).toBeVisible()
    })

    test('should start new game with selected difficulty', async ({ page }) => {
      const newGameButton = page.getByRole('button', { name: '新游戏' })
      await newGameButton.click()
      
      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()
      
      const easyButton = modal.locator('button:has-text("简单")')
      await easyButton.click()
      await page.waitForTimeout(500)
      
      await expect(modal).not.toBeVisible()
      await expect(page.locator('[data-testid="game-page"]')).toBeVisible()
    })

    test('should reset timer on new game', async ({ page }) => {
      await page.waitForTimeout(2000)
      
      const newGameButton = page.getByRole('button', { name: '新游戏' })
      await newGameButton.click()
      
      const modal = page.locator('[role="dialog"]')
      await modal.locator('button:has-text("简单")').click()
      await page.waitForTimeout(500)
      
      const timerAfter = await page.locator('[data-testid="timer"]').textContent()
      expect(timerAfter).toBe('00:00')
    })

    test('should close modal on cancel', async ({ page }) => {
      const newGameButton = page.getByRole('button', { name: '新游戏' })
      await newGameButton.click()
      
      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()
      
      const cancelButton = modal.locator('button:has-text("取消")')
      await cancelButton.click()
      await page.waitForTimeout(300)
      
      await expect(modal).not.toBeVisible()
    })

    test('should close modal on escape key', async ({ page }) => {
      const newGameButton = page.getByRole('button', { name: '新游戏' })
      await newGameButton.click()
      
      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()
      
      await page.keyboard.press('Escape')
      await page.waitForTimeout(300)
      
      await expect(modal).not.toBeVisible()
    })

    test('should close modal on backdrop click', async ({ page }) => {
      const newGameButton = page.getByRole('button', { name: '新游戏' })
      await newGameButton.click()
      
      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()
      
      await modal.click({ position: { x: 10, y: 10 } })
      await page.waitForTimeout(300)
      
      await expect(modal).not.toBeVisible()
    })
  })

  test.describe('重置按钮', () => {
    test('should show confirm modal on click', async ({ page }) => {
      const resetButton = page.getByRole('button', { name: '重置' })
      await resetButton.click()
      
      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()
      await expect(modal.locator('h2:has-text("确认重置")')).toBeVisible()
    })

    test('should reset game on confirm', async ({ page }) => {
      const emptyCell = page.locator('[data-testid="sudoku-cell"]:not([data-initial="true"])').first()
      await emptyCell.click()
      await page.locator('[data-testid="number-button-5"]').click()
      await page.waitForTimeout(300)
      
      await expect(emptyCell).toContainText('5')
      
      const resetButton = page.getByRole('button', { name: '重置' })
      await resetButton.click()
      
      const modal = page.locator('[role="dialog"]')
      await modal.locator('button:has-text("确认")').click()
      await page.waitForTimeout(500)
      
      const timer = page.locator('[data-testid="timer"]')
      await expect(timer).toContainText('00:00')
      
      const errorCounter = page.locator('[data-testid="error-counter"]')
      await expect(errorCounter).toContainText('0/3')
    })

    test('should keep initial cells after reset', async ({ page }) => {
      const initialCell = page.locator('[data-testid="sudoku-cell"][data-initial="true"]').first()
      const initialValue = await initialCell.getAttribute('data-value')
      
      const resetButton = page.getByRole('button', { name: '重置' })
      await resetButton.click()
      
      const modal = page.locator('[role="dialog"]')
      await modal.locator('button:has-text("确认")').click()
      await page.waitForTimeout(500)
      
      const sameCell = page.locator('[data-testid="sudoku-cell"][data-initial="true"]').first()
      await expect(sameCell).toHaveAttribute('data-value', initialValue || '')
    })

    test('should cancel reset on cancel button', async ({ page }) => {
      const emptyCell = page.locator('[data-testid="sudoku-cell"]:not([data-initial="true"])').first()
      await emptyCell.click()
      await page.locator('[data-testid="number-button-5"]').click()
      await page.waitForTimeout(300)
      
      const resetButton = page.getByRole('button', { name: '重置' })
      await resetButton.click()
      
      const modal = page.locator('[role="dialog"]')
      await modal.locator('button:has-text("取消")').click()
      await page.waitForTimeout(300)
      
      await expect(modal).not.toBeVisible()
      await expect(emptyCell).toContainText('5')
    })
  })

  test.describe('提示按钮', () => {
    test('should fill correct number for selected empty cell', async ({ page }) => {
      const emptyCell = page.locator('[data-testid="sudoku-cell"]:not([data-initial="true"])').first()
      await emptyCell.click()
      
      const hintButton = page.getByRole('button', { name: '提示' })
      await hintButton.click()
      await page.waitForTimeout(300)
      
      const cellValue = await emptyCell.getAttribute('data-value')
      expect(cellValue).not.toBe('')
    })

    test('should be disabled when no cell selected', async ({ page }) => {
      const hintButton = page.getByRole('button', { name: '提示' })
      await expect(hintButton).toBeDisabled()
    })

    test('should be disabled when initial cell selected', async ({ page }) => {
      const initialCell = page.locator('[data-testid="sudoku-cell"][data-initial="true"]').first()
      await initialCell.click()
      
      const hintButton = page.getByRole('button', { name: '提示' })
      await expect(hintButton).toBeDisabled()
    })

    test('should be disabled when cell already filled', async ({ page }) => {
      const emptyCell = page.locator('[data-testid="sudoku-cell"]:not([data-initial="true"])').first()
      await emptyCell.click()
      await page.locator('[data-testid="number-button-5"]').click()
      await page.waitForTimeout(300)
      
      await emptyCell.click()
      const hintButton = page.getByRole('button', { name: '提示' })
      await expect(hintButton).toBeDisabled()
    })
  })

  test.describe('检查按钮', () => {
    test('should be visible and clickable', async ({ page }) => {
      const checkButton = page.getByRole('button', { name: '检查' })
      await expect(checkButton).toBeVisible()
      await expect(checkButton).toBeEnabled()
    })

    test('should highlight errors when wrong numbers exist', async ({ page }) => {
      const emptyCell = page.locator('[data-testid="sudoku-cell"]:not([data-initial="true"])').first()
      await emptyCell.click()
      
      const initialCell = page.locator('[data-testid="sudoku-cell"][data-initial="true"]').first()
      const existingValue = await initialCell.getAttribute('data-value')
      
      const wrongNumber = existingValue === '1' ? '2' : '1'
      await page.locator(`[data-testid="number-button-${wrongNumber}"]`).click()
      await page.waitForTimeout(300)
      
      const checkButton = page.getByRole('button', { name: '检查' })
      await checkButton.click()
      await page.waitForTimeout(300)
    })
  })

  test.describe('结束游戏按钮', () => {
    test('should show confirm modal on click', async ({ page }) => {
      const endGameButton = page.getByRole('button', { name: '结束游戏' })
      await endGameButton.click()
      
      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()
      await expect(modal.locator('h2:has-text("确认结束")')).toBeVisible()
    })

    test('should save game state on confirm', async ({ page }) => {
      const emptyCell = page.locator('[data-testid="sudoku-cell"]:not([data-initial="true"])').first()
      await emptyCell.click()
      await page.locator('[data-testid="number-button-5"]').click()
      await page.waitForTimeout(1000)
      
      const endGameButton = page.getByRole('button', { name: '结束游戏' })
      await endGameButton.click()
      
      const modal = page.locator('[role="dialog"]')
      await modal.locator('button:has-text("确认")').click()
      await page.waitForTimeout(500)
      
      const savedState = await page.evaluate(() => {
        return localStorage.getItem('sudoku-game-state')
      })
      
      expect(savedState).not.toBeNull()
    })

    test('should cancel on cancel button', async ({ page }) => {
      const endGameButton = page.getByRole('button', { name: '结束游戏' })
      await endGameButton.click()
      
      const modal = page.locator('[role="dialog"]')
      await modal.locator('button:has-text("取消")').click()
      await page.waitForTimeout(300)
      
      await expect(modal).not.toBeVisible()
      await expect(page.locator('[data-testid="game-page"]')).toBeVisible()
    })
  })

  test.describe('键盘操作', () => {
    test('should navigate cells with arrow keys', async ({ page }) => {
      const firstCell = page.locator('[data-testid="sudoku-cell"]').first()
      await firstCell.click()
      await page.waitForTimeout(100)
      
      await page.keyboard.press('ArrowRight')
      await page.waitForTimeout(100)
      
      const secondCell = page.locator('[data-testid="sudoku-cell"][data-col="1"][data-row="0"]')
      await expect(secondCell).toHaveClass(/selected|bg-blue-200/)
    })

    test('should input number with number keys', async ({ page }) => {
      const emptyCell = page.locator('[data-testid="sudoku-cell"]:not([data-initial="true"])').first()
      await emptyCell.click()
      await page.waitForTimeout(100)
      
      await page.keyboard.press('5')
      await page.waitForTimeout(300)
      
      await expect(emptyCell).toContainText('5')
    })

    test('should delete number with backspace', async ({ page }) => {
      const emptyCell = page.locator('[data-testid="sudoku-cell"]:not([data-initial="true"])').first()
      await emptyCell.click()
      await page.keyboard.press('5')
      await page.waitForTimeout(300)
      
      await expect(emptyCell).toContainText('5')
      
      await page.keyboard.press('Backspace')
      await page.waitForTimeout(300)
      
      const cellValue = await emptyCell.getAttribute('data-value')
      expect(cellValue).toBe('')
    })

    test('should delete number with delete key', async ({ page }) => {
      const emptyCell = page.locator('[data-testid="sudoku-cell"]:not([data-initial="true"])').first()
      await emptyCell.click()
      await page.keyboard.press('5')
      await page.waitForTimeout(300)
      
      await expect(emptyCell).toContainText('5')
      
      await page.keyboard.press('Delete')
      await page.waitForTimeout(300)
      
      const cellValue = await emptyCell.getAttribute('data-value')
      expect(cellValue).toBe('')
    })

    test('should navigate down with arrow key', async ({ page }) => {
      const firstCell = page.locator('[data-testid="sudoku-cell"][data-row="0"][data-col="0"]')
      await firstCell.click()
      await page.waitForTimeout(100)
      
      await page.keyboard.press('ArrowDown')
      await page.waitForTimeout(100)
      
      const secondRowCell = page.locator('[data-testid="sudoku-cell"][data-row="1"][data-col="0"]')
      await expect(secondRowCell).toHaveClass(/selected|bg-blue-200/)
    })

    test('should navigate up with arrow key', async ({ page }) => {
      const secondRowCell = page.locator('[data-testid="sudoku-cell"][data-row="1"][data-col="0"]')
      await secondRowCell.click()
      await page.waitForTimeout(100)
      
      await page.keyboard.press('ArrowUp')
      await page.waitForTimeout(100)
      
      const firstCell = page.locator('[data-testid="sudoku-cell"][data-row="0"][data-col="0"]')
      await expect(firstCell).toHaveClass(/selected|bg-blue-200/)
    })

    test('should navigate left with arrow key', async ({ page }) => {
      const secondColCell = page.locator('[data-testid="sudoku-cell"][data-row="0"][data-col="1"]')
      await secondColCell.click()
      await page.waitForTimeout(100)
      
      await page.keyboard.press('ArrowLeft')
      await page.waitForTimeout(100)
      
      const firstCell = page.locator('[data-testid="sudoku-cell"][data-row="0"][data-col="0"]')
      await expect(firstCell).toHaveClass(/selected|bg-blue-200/)
    })
  })
})
