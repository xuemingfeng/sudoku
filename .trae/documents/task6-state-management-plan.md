# Task 6 规划：实现游戏状态管理

## 任务概述

Task 6 是数独游戏核心功能的第二步，需要实现游戏状态管理、持久化和计时器功能。这些功能是游戏运行的基础，为 UI 组件提供状态支持。

**技术架构依据**: 本计划严格遵循 `.trae/specs/tech-architecture/spec.md` 中定义的目录结构和测试策略。

## 子任务清单

| 子任务 | 描述 | 优先级 |
|--------|------|--------|
| 6.1 | 创建 GameContext 上下文 | 高 |
| 6.2 | 实现游戏状态 Reducer | 高 |
| 6.3 | 实现游戏状态持久化（localStorage） | 高 |
| 6.4 | 实现计时器功能 | 高 |

## 技术架构符合性

### 目录结构符合性

根据 `tech-architecture/spec.md` 定义的目录结构：

```
src/
├── hooks/                      # 自定义 Hooks
│   ├── useGame.ts             ✅ 符合
│   ├── useTimer.ts            ✅ 符合
│   ├── useLocalStorage.ts     ✅ 符合
│   └── index.ts
├── context/                    # React Context
│   ├── GameContext.tsx        ✅ 符合
│   └── index.ts
├── utils/                      # 工具函数
│   ├── storage.ts             ✅ 符合
│   ├── format.ts              ✅ 符合
│   └── index.ts

tests/unit/
├── hooks/
│   ├── useGame.test.ts        ✅ 符合
│   └── useTimer.test.ts       ✅ 符合
└── utils/
    ├── storage.test.ts        ✅ 符合
    └── format.test.ts         ✅ 符合
```

### 测试策略符合性

根据 `tech-architecture/spec.md` 定义的测试优先级：

| 模块 | 测试内容 | 技术架构优先级 | 本计划 |
|------|----------|----------------|--------|
| `hooks/useGame.ts` | 游戏状态管理逻辑 | 中 | ✅ |
| `hooks/useTimer.ts` | 计时器逻辑 | 中 | ✅ |
| `utils/storage.ts` | 本地存储读写 | 中 | ✅ |
| `utils/format.ts` | 格式化函数 | 低 | ✅ |

## 详细实现步骤

### SubTask 6.1: 创建 GameContext 上下文

**文件**: `src/context/GameContext.tsx`

**实现步骤**:

1. **定义 Context 类型**
   ```typescript
   type GameContextType = {
     state: GameState
     dispatch: React.Dispatch<GameAction>
     startNewGame: (difficulty: Difficulty) => void
     resetGame: () => void
     pauseGame: () => void
     resumeGame: () => void
     setCell: (row: number, col: number, value: number | null) => void
     getRemainingCounts: () => Record<number, number>
   }
   ```

2. **创建 Context 和 Provider**
   - 使用 React.createContext 创建上下文
   - 创建 GameProvider 组件包装应用
   - 使用 useReducer 管理状态

3. **导出**
   ```typescript
   export const GameContext = createContext<GameContextType | null>(null)
   export function GameProvider({ children }: { children: React.ReactNode })
   export function useGameContext(): GameContextType
   ```

### SubTask 6.2: 实现游戏状态 Reducer

**文件**: `src/context/gameReducer.ts`

**已有 Action 类型** (来自 `types/game.ts`):
```typescript
export type GameAction =
  | { type: 'SET_BOARD'; payload: CellState[][] }
  | { type: 'SET_CELL'; payload: { row: number; col: number; value: number | null } }
  | { type: 'SET_DIFFICULTY'; payload: Difficulty }
  | { type: 'INCREMENT_TIMER' }
  | { type: 'INCREMENT_ERRORS' }
  | { type: 'COMPLETE_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'RESET_GAME' }
```

**需要扩展的 Action**:
```typescript
| { type: 'NEW_GAME'; payload: { board: CellState[][]; difficulty: Difficulty } }
| { type: 'LOAD_GAME'; payload: GameState }
```

**Reducer 实现**:
```typescript
export function gameReducer(state: GameState, action: GameAction): GameState
```

**初始状态**:
```typescript
export const initialGameState: GameState = {
  board: createEmptyBoard(),
  difficulty: 'medium',
  timer: 0,
  errors: 0,
  maxErrors: MAX_ERRORS,
  isComplete: false,
  isPaused: false,
}
```

### SubTask 6.3: 实现游戏状态持久化

**文件**: `src/utils/storage.ts`

**存储键** (已在 `constants/game.ts` 定义):
```typescript
export const STORAGE_KEYS = {
  GAME_STATE: 'sudoku_game_state',
  GUIDE_SHOWN: 'sudoku_guide_shown',
  BEST_RECORDS: 'sudoku_best_records',
  GAME_HISTORY: 'sudoku_game_history',
}
```

**导出函数**:
```typescript
// 保存游戏状态
export function saveGameState(state: GameState): void

// 加载游戏状态
export function loadGameState(): GameState | null

// 清除游戏状态
export function clearGameState(): void

// 保存最佳记录
export function saveBestRecord(difficulty: Difficulty, time: number): void

// 获取最佳记录
export function getBestRecord(difficulty: Difficulty): number | null

// 保存历史记录
export function saveGameHistory(record: GameRecord): void

// 获取历史记录
export function getGameHistory(): GameRecord[]

// 检查是否首次访问
export function isGuideShown(): boolean

// 标记引导已显示
export function setGuideShown(): void
```

**类型定义**:
```typescript
export type GameRecord = {
  difficulty: Difficulty
  time: number
  errors: number
  date: string
  isComplete: boolean
}
```

**文件**: `src/hooks/useLocalStorage.ts`

**通用 localStorage Hook**:
```typescript
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void]
```

### SubTask 6.4: 实现计时器功能

**文件**: `src/hooks/useTimer.ts`

**导出**:
```typescript
export function useTimer(
  isRunning: boolean,
  onTick: () => void
): {
  time: number
  start: () => void
  stop: () => void
  reset: () => void
}
```

**文件**: `src/utils/format.ts`

**格式化函数**:
```typescript
// 格式化时间为 MM:SS
export function formatTime(seconds: number): string

// 格式化日期
export function formatDate(date: Date | string): string
```

### SubTask 6.5: 创建 useGame Hook

**文件**: `src/hooks/useGame.ts`

**整合所有功能**:
```typescript
export function useGame(): {
  state: GameState
  startNewGame: (difficulty: Difficulty) => void
  resetGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  setCell: (row: number, col: number, value: number | null) => void
  getRemainingCounts: () => Record<number, number>
  checkCell: (row: number, col: number) => boolean
  getHint: () => Position | null
}
```

## 注意事项

### 1. 类型安全
- 使用已定义的类型 `GameState`, `GameAction`, `CellState`, `Difficulty`
- 所有函数都需要明确的类型定义
- 避免使用 `any` 类型

### 2. 性能优化
- 使用 `useCallback` 包装回调函数
- 使用 `useMemo` 缓存计算结果
- 避免不必要的 Context 重渲染
- 使用 `React.memo` 优化子组件

### 3. 数据持久化
- 每次状态变化自动保存
- 页面加载时自动恢复
- 处理 localStorage 不可用情况（隐私模式）
- 数据版本控制（防止旧版本数据兼容问题）

### 4. 计时器管理
- 使用 `setInterval` 实现计时
- 正确处理组件卸载时清理定时器
- 暂停时停止计时，恢复时继续
- 页面不可见时暂停计时（可选优化）

### 5. 错误处理
- localStorage 操作需要 try-catch
- 处理数据解析错误
- 提供默认值回退

### 6. 测试覆盖（遵循技术架构优先级）

根据 `tech-architecture/spec.md` 定义的测试优先级：

| 模块 | 测试内容 | 优先级 |
|------|----------|--------|
| `hooks/useGame.ts` | 游戏状态管理逻辑 | 中 |
| `hooks/useTimer.ts` | 计时器逻辑 | 中 |
| `utils/storage.ts` | 本地存储读写 | 中 |
| `utils/format.ts` | 格式化函数 | 低 |

**测试框架**: Vitest（与技术架构一致）

## 文件结构

```
src/
├── context/
│   ├── index.ts
│   ├── GameContext.tsx
│   └── gameReducer.ts
├── hooks/
│   ├── index.ts
│   ├── useGame.ts
│   ├── useTimer.ts
│   └── useLocalStorage.ts
├── utils/
│   ├── index.ts
│   ├── storage.ts
│   └── format.ts
└── types/
    └── game.ts (已存在，可能需要扩展)

tests/unit/
├── hooks/
│   ├── useGame.test.ts
│   ├── useTimer.test.ts
│   └── useLocalStorage.test.ts
├── utils/
│   ├── storage.test.ts
│   └── format.test.ts
└── context/
    └── gameReducer.test.ts
```

## 依赖关系

```
GameContext.tsx
    ├── gameReducer.ts
    ├── useTimer (hook)
    ├── storage.ts (utils)
    └── types/game.ts

useGame.ts
    ├── GameContext
    ├── sudokuGenerator (algorithms)
    ├── sudokuValidator (algorithms)
    └── storage.ts (utils)

useTimer.ts
    └── React hooks (useState, useEffect, useRef, useCallback)

useLocalStorage.ts
    └── React hooks (useState, useEffect)

storage.ts
    ├── constants/game.ts (STORAGE_KEYS)
    └── types/game.ts

format.ts
    └── 无外部依赖
```

## 验收标准

| 序号 | 验收项 | 验收标准 |
|------|--------|----------|
| 1 | Context 创建 | GameContext 正确创建并可使用 |
| 2 | Reducer 功能 | 所有 Action 正确处理状态变化 |
| 3 | 持久化 | 游戏状态正确保存和恢复 |
| 4 | 计时器 | 计时器正确运行、暂停、恢复 |
| 5 | 类型安全 | TypeScript 编译无错误 |
| 6 | 测试覆盖 | 单元测试全部通过 |
| 7 | 架构符合 | 目录结构和测试策略符合技术架构规格 |

## 执行顺序

1. 实现 `utils/format.ts` - 格式化工具函数
2. 实现 `utils/storage.ts` - 存储工具函数
3. 实现 `context/gameReducer.ts` - 游戏状态 Reducer
4. 实现 `hooks/useLocalStorage.ts` - localStorage Hook
5. 实现 `hooks/useTimer.ts` - 计时器 Hook
6. 实现 `hooks/useGame.ts` - 游戏状态 Hook
7. 实现 `context/GameContext.tsx` - 游戏上下文
8. 更新导出文件 (`index.ts`)
9. 编写单元测试
10. 运行测试验证
