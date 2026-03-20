# 技术架构规格文档

## Why
确定项目的技术架构、目录结构、测试策略和文档规范，为后续开发提供清晰的技术指导，确保代码质量和可维护性。

## What Changes
- 确定项目目录结构
- 确定 README.md 和 AGENTS.md 的必要性
- 规划单元测试策略
- 规划端到端测试策略

## Impact
- Affected specs: 影响数独游戏项目的整体架构
- Affected code: 项目初始化和配置文件

---

# 详细规格

## 1. 项目目录结构

### 1.1 推荐目录结构

```
sudoku-v2/
├── .trae/                          # Trae 配置目录
│   └── specs/                      # 规格文档目录
│       └── sudoku-game/
│           ├── spec.md
│           ├── tasks.md
│           └── checklist.md
├── public/                         # 静态资源目录
│   └── favicon.ico
├── src/                            # 源代码目录
│   ├── components/                 # React 组件目录
│   │   ├── common/                 # 通用组件
│   │   │   ├── Button/
│   │   │   ├── Modal/
│   │   │   └── index.ts
│   │   ├── game/                   # 游戏相关组件
│   │   │   ├── SudokuBoard/
│   │   │   ├── NumberPad/
│   │   │   ├── ControlPanel/
│   │   │   ├── Header/
│   │   │   └── index.ts
│   │   ├── pages/                  # 页面组件
│   │   │   ├── GuidePage/
│   │   │   ├── GamePage/
│   │   │   ├── SuccessPage/
│   │   │   ├── FailurePage/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── hooks/                      # 自定义 Hooks
│   │   ├── useGame.ts
│   │   ├── useTimer.ts
│   │   ├── useLocalStorage.ts
│   │   └── index.ts
│   ├── context/                    # React Context
│   │   ├── GameContext.tsx
│   │   └── index.ts
│   ├── algorithms/                 # 数独算法
│   │   ├── sudokuGenerator.ts
│   │   ├── sudokuValidator.ts
│   │   ├── difficultyController.ts
│   │   └── index.ts
│   ├── types/                      # TypeScript 类型定义
│   │   ├── game.ts
│   │   ├── sudoku.ts
│   │   └── index.ts
│   ├── utils/                      # 工具函数
│   │   ├── storage.ts
│   │   ├── format.ts
│   │   └── index.ts
│   ├── constants/                  # 常量定义
│   │   ├── game.ts
│   │   └── index.ts
│   ├── styles/                     # 全局样式
│   │   └── globals.css
│   ├── App.tsx                     # 应用入口组件
│   ├── main.tsx                    # 应用入口文件
│   └── vite-env.d.ts               # Vite 类型声明
├── tests/                          # 测试目录
│   ├── unit/                       # 单元测试
│   │   ├── algorithms/
│   │   │   ├── sudokuGenerator.test.ts
│   │   │   ├── sudokuValidator.test.ts
│   │   │   └── difficultyController.test.ts
│   │   ├── hooks/
│   │   │   ├── useGame.test.ts
│   │   │   └── useTimer.test.ts
│   │   └── utils/
│   │       ├── storage.test.ts
│   │       └── format.test.ts
│   └── e2e/                        # 端到端测试
│       ├── game.spec.ts
│       ├── guide.spec.ts
│       └── controls.spec.ts
├── .gitignore                      # Git 忽略配置
├── .eslintrc.cjs                   # ESLint 配置
├── .prettierrc                     # Prettier 配置
├── index.html                      # HTML 入口文件
├── package.json                    # 项目配置
├── postcss.config.js               # PostCSS 配置
├── tailwind.config.js              # Tailwind 配置
├── tsconfig.json                   # TypeScript 配置
├── tsconfig.node.json              # Node TypeScript 配置
├── vite.config.ts                  # Vite 配置
├── vitest.config.ts                # Vitest 单元测试配置
├── playwright.config.ts            # Playwright E2E 测试配置
├── README.md                       # 项目说明文档
└── AGENTS.md                       # AI Agent 协作文档
```

### 1.2 目录结构说明

| 目录/文件 | 用途说明 |
|-----------|----------|
| `src/components/common/` | 可复用的通用 UI 组件，如按钮、弹窗等 |
| `src/components/game/` | 游戏特定的业务组件 |
| `src/components/pages/` | 页面级组件，对应不同的路由 |
| `src/hooks/` | 自定义 React Hooks，封装可复用逻辑 |
| `src/context/` | React Context 状态管理 |
| `src/algorithms/` | 数独核心算法，与 UI 解耦 |
| `src/types/` | TypeScript 类型定义 |
| `src/utils/` | 通用工具函数 |
| `src/constants/` | 应用常量 |
| `tests/unit/` | 单元测试，与源码结构对应 |
| `tests/e2e/` | 端到端测试 |

## 2. 文档文件讨论

### 2.1 README.md

**建议：需要创建**

README.md 是项目的门面，对于任何项目都是必要的。应包含以下内容：

```markdown
# 数独游戏 (Sudoku Game)

一个基于 React + Vite + Tailwind CSS 的数独游戏。

## 功能特性

- 🎮 完整的数独游戏体验
- 📱 响应式设计，支持移动端
- 🎯 多难度级别（简单/中等/困难）
- 💡 智能高亮和提示系统
- 📊 游戏统计和历史记录

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Vitest (单元测试)
- Playwright (E2E 测试)

## 快速开始

### 安装依赖
npm install

### 启动开发服务器
npm run dev

### 运行测试
npm run test

### 构建生产版本
npm run build

## 项目结构

[简要说明目录结构]

## 许可证

MIT
```

### 2.2 AGENTS.md

**建议：可选创建**

AGENTS.md 主要用于 AI Agent 协作开发时的上下文说明。如果项目主要由 AI 辅助开发，建议创建，包含：

- 项目架构概述
- 关键设计决策
- 编码规范
- AI Agent 协作注意事项

如果项目主要由人工开发，可以不创建此文件。

## 3. 测试策略

### 3.1 单元测试

**测试框架：Vitest**

选择理由：
- 与 Vite 原生集成，配置简单
- 速度快，支持热更新
- API 与 Jest 兼容
- 支持 TypeScript

**测试范围：**

| 模块 | 测试内容 | 优先级 |
|------|----------|--------|
| `algorithms/sudokuGenerator.ts` | 数独生成正确性、唯一解验证 | 高 |
| `algorithms/sudokuValidator.ts` | 行/列/宫格验证逻辑 | 高 |
| `algorithms/difficultyController.ts` | 难度控制逻辑 | 高 |
| `hooks/useGame.ts` | 游戏状态管理逻辑 | 中 |
| `hooks/useTimer.ts` | 计时器逻辑 | 中 |
| `utils/storage.ts` | 本地存储读写 | 中 |
| `utils/format.ts` | 格式化函数 | 低 |

**单元测试示例：**

```typescript
// tests/unit/algorithms/sudokuGenerator.test.ts
import { describe, it, expect } from 'vitest'
import { generateSudoku, solveSudoku } from '@/algorithms/sudokuGenerator'

describe('sudokuGenerator', () => {
  describe('generateSudoku', () => {
    it('should generate a valid 9x9 sudoku', () => {
      const sudoku = generateSudoku()
      expect(sudoku.length).toBe(9)
      sudoku.forEach(row => {
        expect(row.length).toBe(9)
      })
    })

    it('should generate a sudoku with unique solution', () => {
      const sudoku = generateSudoku('medium')
      const solutions = countSolutions(sudoku)
      expect(solutions).toBe(1)
    })
  })

  describe('solveSudoku', () => {
    it('should solve a valid sudoku puzzle', () => {
      const puzzle = generateSudoku('easy')
      const solution = solveSudoku(puzzle)
      expect(validateSolution(solution)).toBe(true)
    })
  })
})
```

### 3.2 端到端测试

**测试框架：Playwright**

选择理由：
- 跨浏览器支持（Chrome、Firefox、Safari）
- 支持移动端模拟
- 强大的选择器和断言
- 支持视觉回归测试
- 优秀的调试工具

**测试场景：**

| 场景 | 测试内容 | 优先级 |
|------|----------|--------|
| 引导流程 | 首次访问显示引导、跳过引导、完成引导 | 高 |
| 游戏主流程 | 选择格子、输入数字、完成游戏 | 高 |
| 游戏控制 | 新游戏、重置、提示、检查、结束游戏 | 高 |
| 难度选择 | 三种难度的选择和验证 | 中 |
| 游戏状态 | 自动保存、恢复游戏 | 中 |
| 错误处理 | 错误计数、游戏失败 | 中 |
| 响应式 | 不同屏幕尺寸的布局 | 低 |

**E2E 测试示例：**

```typescript
// tests/e2e/game.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // 跳过引导（如果存在）
    const skipButton = page.getByRole('button', { name: /跳过/i })
    if (await skipButton.isVisible()) {
      await skipButton.click()
    }
  })

  test('should display sudoku board', async ({ page }) => {
    const cells = page.locator('[data-testid="sudoku-cell"]')
    await expect(cells).toHaveCount(81)
  })

  test('should input number correctly', async ({ page }) => {
    // 选择第一个空白格子
    const emptyCell = page.locator('[data-testid="sudoku-cell"][data-empty="true"]').first()
    await emptyCell.click()

    // 点击数字按钮
    await page.getByRole('button', { name: '1' }).click()

    // 验证数字已填入
    await expect(emptyCell).toHaveText('1')
  })

  test('should complete game successfully', async ({ page }) => {
    // 使用提示完成游戏
    for (let i = 0; i < 81; i++) {
      const emptyCell = page.locator('[data-testid="sudoku-cell"][data-empty="true"]').first()
      if (await emptyCell.count() === 0) break

      await emptyCell.click()
      await page.getByRole('button', { name: /提示/i }).click()
    }

    // 验证成功页面显示
    await expect(page.getByText(/恭喜/i)).toBeVisible()
  })
})
```

### 3.3 测试配置

**Vitest 配置 (vitest.config.ts)：**

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

**Playwright 配置 (playwright.config.ts)：**

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

## 4. 测试脚本命令

在 `package.json` 中添加以下脚本：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm run test:coverage && npm run test:e2e"
  }
}
```

## 5. 决策总结（已确认）

| 项目 | 决策 | 理由 |
|------|------|------|
| 项目目录结构 | **确认推荐结构** | 包含 components、hooks、context、algorithms、types、utils、constants 等模块，结构清晰，职责分明 |
| README.md | **需要创建** | 项目必备文档，提供快速入门指南 |
| AGENTS.md | **需要创建** | 本项目使用 AI 辅助开发，创建 AGENTS.md 有助于 AI 理解项目上下文 |
| 单元测试框架 | **Vitest** | 与 Vite 原生集成，速度快 |
| E2E 测试框架 | **Playwright** | 跨浏览器支持，功能强大 |
| 测试优先级 | **算法 > 业务逻辑 > UI** | 核心算法正确性最重要 |

## 6. 开发规范

### 6.1 高保真还原原则

**重要：研发过程中，需要按照原型图开发，做到高保真还原。**

原型设计地址：https://www.calicat.cn/design/2034809926826172416

开发要求：
- 严格按照原型图的布局、颜色、字体、间距进行开发
- 所有交互效果需与原型设计一致
- 响应式设计需覆盖原型中定义的各种屏幕尺寸
- 动画效果需与原型中的动效说明一致

## 7. 下一步行动

- [x] 确认项目目录结构
- [x] 确认是否需要 AGENTS.md
- [x] 确认测试框架选择
- [x] 开始项目初始化
- [x] 创建 AGENTS.md 文件
