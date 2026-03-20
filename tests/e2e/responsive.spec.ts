import { test, expect } from '@playwright/test'

const skipGuide = async (page: import('@playwright/test').Page) => {
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
  
  const gamePage = page.locator('[data-testid="game-page"]')
  const guidePage = page.locator('[data-testid="guide-page"]')
  
  const isGameVisible = await gamePage.isVisible().catch(() => false)
  const isGuideVisible = await guidePage.isVisible().catch(() => false)
  
  if (!isGameVisible && !isGuideVisible) {
    await gamePage.waitFor({ timeout: 10000 })
  }
}

test('桌面端 - 显示完整布局', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await skipGuide(page)
  
  await expect(page.locator('[data-testid="game-page"]')).toBeVisible()
  await expect(page.locator('[data-testid="sudoku-cell"]').first()).toBeVisible()
  
  for (let num = 1; num <= 9; num++) {
    await expect(page.locator(`[data-testid="number-button-${num}"]`)).toBeVisible()
  }
})

test('桌面端 - 显示按钮标签', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await skipGuide(page)
  
  const newGameButton = page.getByRole('button', { name: '新游戏' })
  await expect(newGameButton).toBeVisible()
  
  const buttonText = newGameButton.locator('span')
  await expect(buttonText).toBeVisible()
})

test('桌面端 - 棋盘尺寸正确', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await skipGuide(page)
  
  const board = page.locator('.board-container')
  const boundingBox = await board.boundingBox()
  
  expect(boundingBox).not.toBeNull()
  expect(boundingBox!.width).toBeCloseTo(540, 0)
  expect(boundingBox!.height).toBeCloseTo(540, 0)
})

test('桌面端 - 单元格尺寸正确', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await skipGuide(page)
  
  const cell = page.locator('[data-testid="sudoku-cell"]').first()
  const boundingBox = await cell.boundingBox()
  
  expect(boundingBox).not.toBeNull()
  expect(boundingBox!.width).toBeCloseTo(60, 0)
  expect(boundingBox!.height).toBeCloseTo(60, 0)
})

test('桌面端 - 显示所有控制按钮', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await skipGuide(page)
  
  await expect(page.getByRole('button', { name: '新游戏' })).toBeVisible()
  await expect(page.getByRole('button', { name: '重置' })).toBeVisible()
  await expect(page.getByRole('button', { name: '提示' })).toBeVisible()
  await expect(page.getByRole('button', { name: '检查' })).toBeVisible()
  await expect(page.getByRole('button', { name: '结束游戏' })).toBeVisible()
})

test('平板端 - 布局适配', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 })
  await skipGuide(page)
  
  await expect(page.locator('[data-testid="game-page"]')).toBeVisible()
  await expect(page.locator('[data-testid="sudoku-cell"]').first()).toBeVisible()
})

test('平板端 - 显示按钮标签', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 })
  await skipGuide(page)
  
  const newGameButton = page.getByRole('button', { name: '新游戏' })
  const buttonText = newGameButton.locator('span')
  await expect(buttonText).toBeVisible()
})

test('平板端 - 棋盘尺寸正确', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 })
  await skipGuide(page)
  
  const board = page.locator('.board-container')
  const boundingBox = await board.boundingBox()
  
  expect(boundingBox).not.toBeNull()
  expect(boundingBox!.width).toBeLessThan(500)
  expect(boundingBox!.width).toBeGreaterThan(350)
})

test('平板端 - 数字键盘显示正确', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 })
  await skipGuide(page)
  
  for (let num = 1; num <= 9; num++) {
    const button = page.locator(`[data-testid="number-button-${num}"]`)
    await expect(button).toBeVisible()
  }
})

test('移动端 - 布局适配', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await skipGuide(page)
  
  await expect(page.locator('[data-testid="game-page"]')).toBeVisible()
  await expect(page.locator('[data-testid="sudoku-cell"]').first()).toBeVisible()
})

test('移动端 - 触摸友好按钮尺寸', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await skipGuide(page)
  
  const numberButton = page.locator('[data-testid="number-button-1"]')
  const boundingBox = await numberButton.boundingBox()
  
  expect(boundingBox).not.toBeNull()
  expect(boundingBox!.width).toBeGreaterThanOrEqual(44)
  expect(boundingBox!.height).toBeGreaterThanOrEqual(44)
})

test('移动端 - 棋盘尺寸正确', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await skipGuide(page)
  
  const board = page.locator('.board-container')
  const boundingBox = await board.boundingBox()
  
  expect(boundingBox).not.toBeNull()
  expect(boundingBox!.width).toBeLessThan(350)
  expect(boundingBox!.width).toBeGreaterThan(250)
})

test('移动端 - 显示所有数字按钮', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await skipGuide(page)
  
  for (let num = 1; num <= 9; num++) {
    const button = page.locator(`[data-testid="number-button-${num}"]`)
    await expect(button).toBeVisible()
  }
})

test('移动端 - 显示控制按钮', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await skipGuide(page)
  
  await expect(page.getByRole('button', { name: '新游戏' })).toBeVisible()
  await expect(page.getByRole('button', { name: '重置' })).toBeVisible()
  await expect(page.getByRole('button', { name: '提示' })).toBeVisible()
  await expect(page.getByRole('button', { name: '检查' })).toBeVisible()
  await expect(page.getByRole('button', { name: '结束游戏' })).toBeVisible()
})

test('小屏移动端 - 布局适配', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await skipGuide(page)
  
  await expect(page.locator('[data-testid="game-page"]')).toBeVisible()
  await expect(page.locator('[data-testid="sudoku-cell"]').first()).toBeVisible()
})

test('小屏移动端 - 内容适应视口', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await skipGuide(page)
  
  const board = page.locator('.board-container')
  const boundingBox = await board.boundingBox()
  
  expect(boundingBox).not.toBeNull()
  expect(boundingBox!.width).toBeLessThanOrEqual(320)
})

test('小屏移动端 - 保持可用性', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await skipGuide(page)
  
  const cell = page.locator('[data-testid="sudoku-cell"]').first()
  const boundingBox = await cell.boundingBox()
  
  expect(boundingBox).not.toBeNull()
  expect(Math.min(boundingBox!.width, boundingBox!.height)).toBeGreaterThanOrEqual(30)
})

test('小屏移动端 - 触摸友好数字按钮', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await skipGuide(page)
  
  const numberButton = page.locator('[data-testid="number-button-1"]')
  const boundingBox = await numberButton.boundingBox()
  
  expect(boundingBox).not.toBeNull()
  expect(boundingBox!.width).toBeGreaterThanOrEqual(44)
  expect(boundingBox!.height).toBeGreaterThanOrEqual(44)
})

test('Pixel 5 - 响应触摸点击', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 851 })
  await skipGuide(page)
  
  const cell = page.locator('[data-testid="sudoku-cell"]:not([data-initial="true"])').first()
  await cell.tap()
  
  await expect(cell).toHaveClass(/selected|bg-blue-200/)
})

test('Pixel 5 - 触摸目标尺寸正确', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 851 })
  await skipGuide(page)
  
  const controlButtons = [
    page.getByRole('button', { name: '新游戏' }),
    page.getByRole('button', { name: '重置' }),
    page.getByRole('button', { name: '提示' }),
    page.getByRole('button', { name: '检查' }),
    page.getByRole('button', { name: '结束游戏' }),
  ]
  
  for (const button of controlButtons) {
    const boundingBox = await button.boundingBox()
    expect(boundingBox).not.toBeNull()
    expect(Math.min(boundingBox!.width, boundingBox!.height)).toBeGreaterThanOrEqual(44)
  }
})

test('Pixel 5 - 触摸输入数字', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 851 })
  await skipGuide(page)
  
  const emptyCell = page.locator('[data-testid="sudoku-cell"]:not([data-initial="true"])').first()
  await emptyCell.tap()
  
  const numberButton = page.locator('[data-testid="number-button-5"]')
  await numberButton.tap()
  await page.waitForTimeout(300)
  
  await expect(emptyCell).toContainText('5')
})

test('Pixel 5 - 触摸删除数字', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 851 })
  await skipGuide(page)
  
  const emptyCell = page.locator('[data-testid="sudoku-cell"]:not([data-initial="true"])').first()
  await emptyCell.tap()
  await page.locator('[data-testid="number-button-5"]').tap()
  await page.waitForTimeout(300)
  
  await expect(emptyCell).toContainText('5')
  
  await page.locator('[data-testid="delete-button"]').tap()
  await page.waitForTimeout(300)
  
  const cellValue = await emptyCell.getAttribute('data-value')
  expect(cellValue).toBe('')
})

test('iPhone 12 - 正确显示', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await skipGuide(page)
  
  await expect(page.locator('[data-testid="game-page"]')).toBeVisible()
  await expect(page.locator('[data-testid="sudoku-cell"]').first()).toBeVisible()
  
  for (let num = 1; num <= 9; num++) {
    await expect(page.locator(`[data-testid="number-button-${num}"]`)).toBeVisible()
  }
})

test('iPhone 12 - 触摸目标尺寸正确', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await skipGuide(page)
  
  const numberButton = page.locator('[data-testid="number-button-1"]')
  const boundingBox = await numberButton.boundingBox()
  
  expect(boundingBox).not.toBeNull()
  expect(boundingBox!.width).toBeGreaterThanOrEqual(44)
  expect(boundingBox!.height).toBeGreaterThanOrEqual(44)
})
