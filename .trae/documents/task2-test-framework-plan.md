# Task 2 实现计划：配置测试框架

## 任务概述

根据 `tasks.md` 和 `tech-architecture/spec.md` 的要求，配置项目的测试框架，包括单元测试（Vitest）和端到端测试（Playwright）。

## 任务依赖

- Task 1 已完成 ✓
- 项目已初始化，基础配置已就绪

## 实现步骤

### Step 1: 安装 Vitest 和相关依赖

安装单元测试所需的依赖包：

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom @testing-library/user-event
```

依赖说明：
- `vitest`: 单元测试框架核心
- `@vitest/ui`: Vitest 可视化界面
- `@testing-library/react`: React 组件测试工具
- `@testing-library/jest-dom`: Jest DOM 匹配器扩展
- `jsdom`: DOM 环境模拟
- `@testing-library/user-event`: 用户交互模拟

### Step 2: 创建 Vitest 配置文件

创建 `vitest.config.ts`，参考 tech-architecture/spec.md 的配置：

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.ts', 'tests/unit/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Step 3: 创建测试设置文件

创建 `tests/setup.ts`：

```typescript
import '@testing-library/jest-dom'
```

同时创建测试目录结构：

```
tests/
├── setup.ts
├── unit/
│   ├── algorithms/
│   ├── hooks/
│   └── utils/
└── e2e/
```

### Step 4: 安装 Playwright 和相关依赖

安装端到端测试所需的依赖包：

```bash
npm install -D @playwright/test
```

安装后需要初始化 Playwright 浏览器：

```bash
npx playwright install
```

### Step 5: 创建 Playwright 配置文件

创建 `playwright.config.ts`，参考 tech-architecture/spec.md 的配置：

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Step 6: 配置 package.json 测试脚本

在 `package.json` 的 `scripts` 中添加测试命令：

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:all": "npm run test:coverage && npm run test:e2e"
  }
}
```

### Step 7: 创建示例测试文件

创建占位测试文件以验证配置正确：

**tests/unit/algorithms/sudokuGenerator.test.ts**
```typescript
import { describe, it, expect } from 'vitest'

describe('sudokuGenerator', () => {
  it('placeholder test', () => {
    expect(true).toBe(true)
  })
})
```

**tests/e2e/game.spec.ts**
```typescript
import { test, expect } from '@playwright/test'

test.describe('Game Flow', () => {
  test('should load the page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
  })
})
```

### Step 8: 更新 .gitignore

添加测试相关忽略项：

```
# Test coverage
coverage/

# Playwright
test-results/
playwright-report/
playwright/.cache/
```

## 验证步骤

1. 运行 `npm run test` 验证 Vitest 配置
2. 运行 `npm run test:ui` 验证 Vitest UI 界面
3. 运行 `npm run test:e2e` 验证 Playwright 配置
4. 运行 `npm run test:coverage` 验证覆盖率报告生成

## 文件变更清单

| 操作 | 文件路径 |
|------|----------|
| 创建 | `vitest.config.ts` |
| 创建 | `playwright.config.ts` |
| 创建 | `tests/setup.ts` |
| 创建 | `tests/unit/algorithms/.gitkeep` |
| 创建 | `tests/unit/hooks/.gitkeep` |
| 创建 | `tests/unit/utils/.gitkeep` |
| 创建 | `tests/e2e/.gitkeep` |
| 创建 | `tests/unit/algorithms/sudokuGenerator.test.ts` |
| 创建 | `tests/e2e/game.spec.ts` |
| 修改 | `package.json` (添加依赖和脚本) |
| 修改 | `.gitignore` (添加测试忽略项) |

## 预期结果

- Vitest 单元测试框架配置完成
- Playwright E2E 测试框架配置完成
- 测试脚本命令可用
- 示例测试通过
- 符合 tech-architecture/spec.md 的配置规范
