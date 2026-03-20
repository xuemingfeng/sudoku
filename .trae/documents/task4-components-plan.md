# Task 4 实现计划：创建基础组件结构

## 任务概述

根据 `tasks.md` 和原型设计，创建项目的基础组件结构，包括 App 根组件、GameContainer、Header、SudokuBoard、NumberPad 和 ControlPanel 组件。

## 任务依赖

* Task 1 已完成 ✓

* Task 2 已完成 ✓

* Task 3 已完成 ✓

***

## 原型设计分析

从原型设计（<https://www.calicat.cn/design/2034809926826172416?node-id=4b15897c-1586-4604-9ac3-691a6a28934b）中提取的组件结构：>

### 容器组件规范

| 属性  | 值                            |
| --- | ---------------------------- |
| 宽度  | 800px（桌面）/ 100%（移动端）         |
| 背景  | 白色 rgba(255,255,255,1)       |
| 圆角  | 32px                         |
| 阴影  | 0 25px 50px rgba(0,0,0,0.25) |
| 内边距 | 32px                         |

***

## 实现步骤

### Step 1: 创建 App 根组件

更新 `src/App.tsx`：

```typescript
import { GameContainer } from '@/components/game/GameContainer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-main flex items-center justify-center p-4">
      <GameContainer />
    </div>
  )
}

export default App
```

**注意事项：**

* 使用 `bg-gradient-main` 类（已在 Task 3 定义）

* 响应式布局：移动端添加 padding

* 作为应用的入口点，保持简洁

### Step 2: 创建 GameContainer 游戏容器组件

创建 `src/components/game/GameContainer/GameContainer.tsx`：

```typescript
type GameContainerProps = {
  children?: React.ReactNode
}

export function GameContainer({ children }: GameContainerProps) {
  return (
    <div className="card-container w-full max-w-[800px]">
      {children}
    </div>
  )
}
```

**注意事项：**

* 使用 `card-container` 类（已在 Task 3 定义）

* 最大宽度 800px，符合原型设计

* 使用 children 实现组件组合

### Step 3: 创建 Header 头部组件

创建 `src/components/game/Header/Header.tsx`：

```typescript
type HeaderProps = {
  title?: string
  timer?: string
  errors?: string
  difficulty?: string
}

export function Header({ 
  title = '数独游戏',
  timer = '00:00',
  errors = '0/3',
  difficulty = '中等'
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        <i className="ri-game-line text-3xl text-primary-600" />
        <span className="ml-3 text-3xl font-bold text-slate-800">{title}</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center">
          <i className="ri-time-line text-xl text-slate-500" />
          <span className="ml-2 text-xl font-semibold text-slate-700">{timer}</span>
        </div>
        <div className="flex items-center">
          <i className="ri-close-circle-line text-xl text-red-500" />
          <span className="ml-2 text-xl font-semibold text-red-500">{errors}</span>
        </div>
        <div className="flex items-center">
          <i className="ri-bar-chart-line text-xl text-purple-600" />
          <span className="ml-2 text-xl font-semibold text-purple-600">{difficulty}</span>
        </div>
      </div>
    </div>
  )
}
```

**注意事项：**

* 左侧：游戏图标 + 标题

* 右侧：计时器、错误次数、难度

* 使用 RemixIcon 图标

### Step 4: 创建 SudokuBoard 数独棋盘组件

创建 `src/components/game/SudokuBoard/SudokuBoard.tsx`：

```typescript
import type { SudokuCell, Position } from '@/types/sudoku'

type SudokuBoardProps = {
  board: SudokuCell[][]
  selectedCell: Position | null
  onCellClick: (row: number, col: number) => void
}

export function SudokuBoard({ board, selectedCell, onCellClick }: SudokuBoardProps) {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-9 gap-0 border-2 border-slate-600 bg-white" style={{ width: '540px', height: '540px' }}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`
                w-full h-full flex items-center justify-center text-3xl font-bold
                border border-slate-500
                ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex 
                  ? 'bg-blue-100' : ''}
                ${cell.isInitial ? 'bg-blue-50' : 'bg-white'}
                ${cell.isError ? 'text-red-500' : 'text-slate-800'}
                ${colIndex % 3 === 2 && colIndex !== 8 ? 'border-r-2 border-r-slate-600' : ''}
                ${rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-b-2 border-b-slate-600' : ''}
                hover:bg-blue-50 transition-colors
              `}
              onClick={() => onCellClick(rowIndex, colIndex)}
            >
              {cell.value || ''}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
```

**注意事项：**

* 9x9 网格布局，固定尺寸 540x540px

* 3x3 宫格边界加粗（2px）

* 初始数字背景色为浅蓝色

* 选中状态高亮

* 错误状态红色显示

### Step 5: 创建 NumberPad 数字输入组件

创建 `src/components/game/NumberPad/NumberPad.tsx`：

```typescript
type NumberPadProps = {
  onNumberClick: (number: number) => void
  onDeleteClick: () => void
  remainingCounts: Record<number, number>
  disabledNumbers?: number[]
}

export function NumberPad({ 
  onNumberClick, 
  onDeleteClick, 
  remainingCounts,
  disabledNumbers = []
}: NumberPadProps) {
  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
        <button
          key={number}
          className={`
            w-12 h-12 flex flex-col items-center justify-center
            rounded-xl text-xl font-semibold
            transition-all duration-200
            ${disabledNumbers.includes(number) 
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-95'}
          `}
          onClick={() => onNumberClick(number)}
          disabled={disabledNumbers.includes(number)}
        >
          <span>{number}</span>
          <span className="text-xs text-slate-400">{remainingCounts[number] || 0}</span>
        </button>
      ))}
      <button
        className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
        onClick={onDeleteClick}
      >
        <i className="ri-delete-back-line text-xl" />
      </button>
    </div>
  )
}
```

**注意事项：**

* 水平排列：1-9 数字 + 删除按钮

* 显示每个数字的剩余数量

* 禁用已用完的数字

* 删除按钮使用图标

### Step 6: 创建 ControlPanel 控制面板组件

创建 `src/components/game/ControlPanel/ControlPanel.tsx`：

```typescript
type ControlPanelProps = {
  onNewGame: () => void
  onReset: () => void
  onHint: () => void
  onCheck: () => void
  onEndGame: () => void
}

export function ControlPanel({
  onNewGame,
  onReset,
  onHint,
  onCheck,
  onEndGame
}: ControlPanelProps) {
  return (
    <div className="flex gap-3 w-full">
      <button 
        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 active:scale-98 transition-all"
        onClick={onNewGame}
      >
        <i className="ri-add-line text-lg" />
        新游戏
      </button>
      <button 
        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-slate-600 text-white font-semibold hover:bg-slate-700 active:scale-98 transition-all"
        onClick={onReset}
      >
        <i className="ri-refresh-line text-lg" />
        重置
      </button>
      <button 
        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 active:scale-98 transition-all"
        onClick={onHint}
      >
        <i className="ri-lightbulb-line text-lg" />
        提示
      </button>
      <button 
        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 active:scale-98 transition-all"
        onClick={onCheck}
      >
        <i className="ri-check-line text-lg" />
        检查
      </button>
      <button 
        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 active:scale-98 transition-all"
        onClick={onEndGame}
      >
        <i className="ri-close-line text-lg" />
        结束游戏
      </button>
    </div>
  )
}
```

**注意事项：**

* 5 个按钮水平排列，等宽

* 每个按钮包含图标 + 文字

* 按钮颜色：蓝色、灰色、黄色、绿色、红色

* 高度 51px（约 h-12）

***

## 文件变更清单

| 操作 | 文件路径                                                  |
| -- | ----------------------------------------------------- |
| 修改 | `src/App.tsx`                                         |
| 创建 | `src/components/game/GameContainer/GameContainer.tsx` |
| 创建 | `src/components/game/GameContainer/index.ts`          |
| 创建 | `src/components/game/Header/Header.tsx`               |
| 创建 | `src/components/game/Header/index.ts`                 |
| 创建 | `src/components/game/SudokuBoard/SudokuBoard.tsx`     |
| 创建 | `src/components/game/SudokuBoard/index.ts`            |
| 创建 | `src/components/game/NumberPad/NumberPad.tsx`         |
| 创建 | `src/components/game/NumberPad/index.ts`              |
| 创建 | `src/components/game/ControlPanel/ControlPanel.tsx`   |
| 创建 | `src/components/game/ControlPanel/index.ts`           |
| 修改 | `src/components/game/index.ts`                        |

***

## 注意事项

### 1. 布局要求（符合原型图）

#### 页面整体布局（重要：按顺序）

```
┌─────────────────────────────────────────────────────────┐
│                    背景（渐变色）                          │
│   ┌─────────────────────────────────────────────────┐   │
│   │              卡片容器（白色背景）                    │   │
│   │  ┌─────────────────────────────────────────────┐│   │
│   │  │        头部信息栏（图标+标题 | 计时+错误+难度）   ││   │
│   │  ├─────────────────────────────────────────────┤│   │
│   │  │        功能按钮区（新游戏|重置|提示|检查|结束）  ││   │
│   │  ├─────────────────────────────────────────────┤│   │
│   │  │              数独棋盘（540x540）               ││   │
│   │  │           9x9 网格                            ││   │
│   │  ├─────────────────────────────────────────────┤│   │
│   │  │              数字键盘                          ││   │
│   │  │         1-9 数字 + 删除按钮（水平排列）         ││   │
│   │  └─────────────────────────────────────────────┘│   │
│   └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**重要：布局顺序**

1. 头部信息栏
2. 功能按钮区（控制面板）← 在棋盘上方！
3. 数独棋盘
4. 数字键盘

#### 容器布局规范

| 元素   | 属性  | 值                                    |
| ---- | --- | ------------------------------------ |
| 外层容器 | 宽度  | 100%（移动端）/ 800px（桌面）                 |
| 外层容器 | 居中  | flex + items-center + justify-center |
| 外层容器 | 内边距 | p-4（移动端）                             |
| 卡片容器 | 背景  | 白色 rgba(255,255,255,1)               |
| 卡片容器 | 圆角  | 32px                                 |
| 卡片容器 | 阴影  | 0 25px 50px rgba(0,0,0,0.25)         |
| 卡片容器 | 内边距 | 32px                                 |

#### 头部信息栏布局规范

| 元素   | 属性 | 值                      |
| ---- | -- | ---------------------- |
| 头部区域 | 布局 | flex + justify-between |
| 头部区域 | 高度 | 48px                   |
| 左侧   | 内容 | 图标 + 标题                |
| 图标   | 大小 | 32px                   |
| 图标   | 颜色 | #2563eb                |
| 标题   | 字号 | 28px                   |
| 标题   | 字重 | Bold                   |
| 右侧   | 内容 | 计时 + 错误 + 难度           |
| 右侧   | 间距 | 24px                   |
| 计时图标 | 颜色 | #4b5563                |
| 错误图标 | 颜色 | #ef4444                |
| 难度图标 | 颜色 | #9333ea                |

#### 功能按钮区布局规范（控制面板）

| 元素   | 属性  | 值            |
| ---- | --- | ------------ |
| 按钮区  | 布局  | flex + gap-3 |
| 按钮区  | 位置  | 头部信息栏下方、棋盘上方 |
| 按钮   | 宽度  | flex-1（等宽）   |
| 按钮   | 高度  | 51px         |
| 按钮   | 圆角  | 12px         |
| 按钮   | 内边距 | 12px 0       |
| 新游戏  | 背景  | #2563eb      |
| 重置   | 背景  | #4b5563      |
| 提示   | 背景  | #f59e0b      |
| 检查   | 背景  | #16a34a      |
| 结束游戏 | 背景  | #dc2626      |

#### 数独棋盘布局规范

| 元素    | 属性 | 值                 |
| ----- | -- | ----------------- |
| 棋盘    | 尺寸 | 540x540px         |
| 棋盘    | 布局 | 9x9 Grid          |
| 棋盘    | 边框 | 2px solid #4b5563 |
| 格子    | 尺寸 | 60x60px           |
| 格子    | 边框 | 1px solid #64748b |
| 格子    | 字号 | 28px              |
| 格子    | 字重 | Bold              |
| 3x3宫格 | 边框 | 2px solid #4b5563 |
| 初始数字  | 背景 | #eff6ff           |
| 选中格子  | 背景 | #dbeafe           |
| 错误格子  | 文字 | #ef4444           |

#### 数字键盘布局规范

| 元素   | 属性 | 值                     |
| ---- | -- | --------------------- |
| 键盘   | 布局 | flex + justify-center |
| 键盘   | 间距 | 8px                   |
| 数字按钮 | 尺寸 | 48x48px               |
| 数字按钮 | 圆角 | 12px                  |
| 数字按钮 | 背景 | #eff6ff               |
| 数字按钮 | 文字 | #2563eb               |
| 数字按钮 | 字号 | 20px                  |
| 剩余数量 | 字号 | 12px                  |
| 剩余数量 | 颜色 | #94a3b8               |
| 删除按钮 | 背景 | #f1f5f9               |
| 删除按钮 | 文字 | #475569               |

### 2. 组件设计原则

* **单一职责**：每个组件只负责一个功能

* **Props 类型安全**：所有 Props 必须定义 TypeScript 类型

* **可复用性**：组件应支持自定义配置

### 3. 样式规范

* 使用 Tailwind CSS 工具类

* 使用 Task 3 定义的全局样式类

* 颜色使用 Tailwind 默认色板或自定义主题色

### 4. 响应式设计

* 移动端优先

* 容器最大宽度 800px

* 棋盘在小屏幕上可能需要缩放

### 5. 无障碍支持

* 按钮使用 `<button>` 元素

* 图标按钮添加 `aria-label`

* 禁用状态使用 `disabled` 属性

### 6. 性能优化

* 使用 `React.memo` 优化频繁渲染的组件

* 避免内联函数创建

* 使用 CSS 过渡代替 JS 动画

### 7. 高保真还原

* 严格按照原型设计的布局顺序

* 控制面板在棋盘上方

* 颜色、字体、间距与原型一致

***

## 验证步骤

1. 创建所有组件文件
2. 更新 index.ts 导出文件
3. 运行 `npm run build` 检查编译
4. 运行 `npm run dev` 查看效果
5. 检查组件渲染是否正确
6. 对比原型图验证布局顺序

***

## 预期结果

* 6 个基础组件创建完成

* 组件 Props 类型定义完整

* 布局顺序符合原型：头部 → 控制面板 → 棋盘 → 数字键盘

* 样式符合原型设计

* 编译无错误

