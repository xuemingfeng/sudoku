# AGENTS.md - AI Agent 协作文档

本文档为数独游戏项目的 AI Agent 协作提供上下文说明和开发规范。

---

## 1. 项目概述

### 1.1 项目信息

- **项目名称**：数独游戏 (Sudoku Game)
- **项目类型**：Web 应用
- **原型设计**：https://www.calicat.cn/design/2034809926826172416

### 1.2 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.x | 前端框架 |
| TypeScript | 5.x | 类型安全 |
| Vite | 8.x | 构建工具 |
| Tailwind CSS | 4.x | 样式框架 |
| Vitest | - | 单元测试 |
| Playwright | - | E2E 测试 |

### 1.3 功能特性

- 🎮 完整的数独游戏体验
- 📱 响应式设计，支持移动端
- 🎯 多难度级别（简单/中等/困难）
- 💡 智能高亮和提示系统
- 📊 游戏统计和历史记录
- 🎓 新用户引导系统

---

## 2. 项目架构

### 2.1 目录结构

```
src/
├── algorithms/         # 数独核心算法
│   ├── sudokuGenerator.ts
│   ├── sudokuValidator.ts
│   └── difficultyController.ts
├── components/         # React 组件
│   ├── common/         # 通用组件（Button, Modal）
│   ├── game/           # 游戏组件（SudokuBoard, NumberPad, ControlPanel, Header）
│   └── pages/          # 页面组件（GuidePage, GamePage, SuccessPage, FailurePage）
├── constants/          # 常量定义
├── context/            # React Context 状态管理
├── hooks/              # 自定义 Hooks
│   ├── useGame.ts
│   ├── useTimer.ts
│   └── useLocalStorage.ts
├── types/              # TypeScript 类型定义
│   ├── game.ts
│   └── sudoku.ts
├── utils/              # 工具函数
│   ├── storage.ts
│   └── format.ts
├── App.tsx             # 应用入口组件
└── main.tsx            # 应用入口文件

tests/
├── unit/               # 单元测试
│   ├── algorithms/
│   ├── hooks/
│   └── utils/
└── e2e/                # 端到端测试
```

### 2.2 模块职责

| 模块 | 职责 |
|------|------|
| `algorithms/` | 数独生成、验证、难度控制等核心算法 |
| `components/common/` | 可复用的通用 UI 组件 |
| `components/game/` | 游戏特定的业务组件 |
| `components/pages/` | 页面级组件，对应不同路由 |
| `hooks/` | 封装可复用的 React 逻辑 |
| `context/` | 全局状态管理 |
| `types/` | TypeScript 类型定义 |
| `utils/` | 通用工具函数 |
| `constants/` | 应用常量 |

---

## 3. 编码规范

### 3.1 TypeScript 规范

- 使用严格模式 (`strict: true`)
- 所有变量、函数、组件都需要明确的类型定义
- 避免使用 `any`，优先使用具体类型或泛型
- 使用 `interface` 定义对象类型，`type` 定义联合类型

### 3.2 React 组件规范

- 使用函数组件和 Hooks
- 组件文件使用 PascalCase 命名（如 `SudokuBoard.tsx`）
- 每个组件目录包含 `index.ts` 导出文件
- 组件 Props 必须定义类型

```typescript
type SudokuBoardProps = {
  board: SudokuCell[][]
  selectedCell: Position | null
  onCellClick: (row: number, col: number) => void
}

export function SudokuBoard({ board, selectedCell, onCellClick }: SudokuBoardProps) {
  // ...
}
```

### 3.3 Tailwind CSS 规范

- 优先使用 Tailwind 工具类
- 避免自定义 CSS，除非 Tailwind 无法满足
- 响应式设计使用 Tailwind 断点前缀

---

## 4. Git 提交规范

### 4.1 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 4.2 提交类型 (type)

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(game): 实现数独棋盘组件` |
| `fix` | 修复 Bug | `fix(validation): 修复数独验证逻辑错误` |
| `docs` | 文档更新 | `docs(readme): 更新安装说明` |
| `style` | 代码格式调整（不影响功能） | `style: 格式化代码` |
| `refactor` | 重构代码 | `refactor(hooks): 重构 useGame Hook` |
| `test` | 测试相关 | `test(algorithms): 添加数独生成器单元测试` |
| `chore` | 构建/工具相关 | `chore(deps): 更新依赖版本` |
| `perf` | 性能优化 | `perf(board): 优化棋盘渲染性能` |
| `ci` | CI/CD 相关 | `ci: 配置 GitHub Actions` |

### 4.3 Scope 范围

常用 scope：

- `game` - 游戏核心功能
- `ui` - UI 组件
- `algorithms` - 算法相关
- `hooks` - Hooks 相关
- `types` - 类型定义
- `deps` - 依赖相关
- `config` - 配置相关

### 4.4 提交示例

```
feat(game): 实现数独棋盘组件

- 创建 SudokuBoard 组件
- 实现 9x9 网格布局
- 添加格子点击交互
- 实现行列宫格高亮功能

Closes #123
```

```
fix(validation): 修复数独验证逻辑错误

修复了验证算法中宫格边界计算错误的问题

Fixes #456
```

### 4.5 分支命名规范

| 分支类型 | 命名格式 | 示例 |
|----------|----------|------|
| 功能分支 | `feature/<feature-name>` | `feature/sudoku-board` |
| 修复分支 | `fix/<bug-name>` | `fix/validation-error` |
| 发布分支 | `release/<version>` | `release/v1.0.0` |
| 热修复分支 | `hotfix/<version>` | `hotfix/v1.0.1` |

---

## 5. 开发注意事项

### 5.1 高保真还原原则

**重要：研发过程中，需要按照原型图开发，做到高保真还原。**

原型设计地址：https://www.calicat.cn/design/2034809926826172416

开发要求：

- 严格按照原型图的布局、颜色、字体、间距进行开发
- 所有交互效果需与原型设计一致
- 响应式设计需覆盖原型中定义的各种屏幕尺寸
- 动画效果需与原型中的动效说明一致

### 5.2 测试优先级

| 优先级 | 测试内容 |
|--------|----------|
| 高 | 核心算法（数独生成、验证） |
| 高 | 游戏主流程 |
| 中 | 游戏控制功能 |
| 中 | 状态管理 |
| 低 | UI 组件 |

### 5.3 性能要求

- 游戏加载时间 < 2 秒
- 数独生成算法执行时间 < 500ms
- 用户交互响应时间 < 100ms
- 内存占用 < 50MB

---

## 6. 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 代码检查
npm run lint
npm run lint:fix

# 格式化
npm run format

# 测试
npm run test
npm run test:coverage
npm run test:e2e
```

---

## 7. 相关文档

- [需求规格文档](./.trae/specs/sudoku-game/spec.md)
- [任务列表](./.trae/specs/sudoku-game/tasks.md)
- [技术架构规格](./.trae/specs/tech-architecture/spec.md)
