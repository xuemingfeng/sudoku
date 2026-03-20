# Task 18 实现规划：编写单元测试

## 任务概述

Task 18 包含以下四个子任务：
- SubTask 18.1: 编写 hooks 单元测试
- SubTask 18.2: 编写 utils 单元测试
- SubTask 18.3: 编写组件单元测试
- SubTask 18.4: 生成测试覆盖率报告

## 需求规格对照

根据需求规格文档（spec.md）：

### 5.1 用户体验
- 操作流畅，无明显卡顿（响应时间 < 100ms）

### 5.2 性能要求
- 游戏加载时间 < 2秒
- 数独生成算法执行时间 < 500ms
- 内存占用 < 50MB
- 运行稳定，无内存泄漏

### 7. 验收标准
| 序号 | 验收项 | 验收标准 |
|------|--------|----------|
| 1 | 功能完整性 | 所有核心功能均已实现且正常运行 |
| 3 | 功能正确性 | 数独生成、验证算法正确无误 |

## 现有测试分析

### 已存在的测试文件
| 文件路径 | 状态 | 说明 |
|---------|------|------|
| `tests/unit/algorithms/sudokuGenerator.test.ts` | ✅ 已存在 | 数独生成器测试 |
| `tests/unit/algorithms/sudokuValidator.test.ts` | ✅ 已存在 | 数独验证器测试 |
| `tests/unit/algorithms/difficultyController.test.ts` | ✅ 已存在 | 难度控制器测试 |
| `tests/unit/utils/storage.test.ts` | ✅ 已存在 | 存储工具测试 |
| `tests/unit/utils/format.test.ts` | ✅ 已存在 | 格式化工具测试 |
| `tests/unit/context/gameReducer.test.ts` | ✅ 已存在 | 游戏状态管理测试 |

### 需要新增的测试

#### Hooks 测试
| Hook | 优先级 | 说明 |
|------|--------|------|
| `useGame` | 高 | 核心游戏逻辑 hook |
| `useTimer` | 高 | 计时器 hook |
| `useRemainingCounts` | 中 | 剩余数字计数 |
| `useDisabledNumbers` | 中 | 禁用数字计算 |
| `useLocalStorage` | 低 | 本地存储 hook |
| `useFirstVisit` | 低 | 首次访问检测 |

#### 组件测试
| 组件 | 优先级 | 说明 |
|------|--------|------|
| `SudokuBoard` | 高 | 棋盘组件 |
| `Cell` | 高 | 单元格组件 |
| `NumberPad` | 高 | 数字键盘组件 |
| `NumberButton` | 中 | 数字按钮组件 |
| `DeleteButton` | 中 | 删除按钮组件 |
| `ControlPanel` | 高 | 控制面板组件 |
| `ControlButton` | 中 | 控制按钮组件 |
| `Header` | 低 | 头部组件 |

## 实现方案

### SubTask 18.1: 编写 hooks 单元测试

**目标**：为核心 hooks 编写完整的单元测试

#### 1. useGame Hook 测试 (`tests/unit/hooks/useGame.test.ts`)

测试用例：
```typescript
describe('useGame', () => {
  describe('startNewGame', () => {
    it('should generate a new game with correct difficulty')
    it('should clear previous game state')
    it('should set initial cells correctly')
  })

  describe('setCell', () => {
    it('should not modify initial cells')
    it('should update cell value correctly')
    it('should detect conflicts')
    it('should increment errors on conflict')
    it('should complete game when solved')
  })

  describe('resetGame', () => {
    it('should reset timer to 0')
    it('should clear user inputs')
    it('should keep initial cells')
  })

  describe('applyHint', () => {
    it('should fill correct value')
    it('should increment hints count')
    it('should not work on initial cells')
    it('should not work on filled cells')
  })
})
```

#### 2. useTimer Hook 测试 (`tests/unit/hooks/useTimer.test.ts`)

测试用例：
```typescript
describe('useTimer', () => {
  describe('basic functionality', () => {
    it('should start with time 0')
    it('should increment time when running')
    it('should not increment when stopped')
  })

  describe('controls', () => {
    it('should start timer')
    it('should stop timer')
    it('should reset timer to 0')
    it('should set time to specific value')
  })

  describe('cleanup', () => {
    it('should clear interval on unmount')
    it('should handle rapid start/stop')
  })
})
```

#### 3. useRemainingCounts Hook 测试 (`tests/unit/hooks/useRemainingCounts.test.ts`)

测试用例：
```typescript
describe('useRemainingCounts', () => {
  it('should return 9 for all numbers on empty board')
  it('should decrement count when number is placed')
  it('should return 0 when all 9 of a number are placed')
  it('should memoize results')
})
```

#### 4. useDisabledNumbers Hook 测试 (`tests/unit/hooks/useDisabledNumbers.test.ts`)

测试用例：
```typescript
describe('useDisabledNumbers', () => {
  it('should disable numbers with 0 remaining count')
  it('should disable all numbers when initial cell selected')
  it('should disable invalid numbers for selected cell')
  it('should return empty set when no cell selected')
})
```

### SubTask 18.2: 编写 utils 单元测试

**目标**：确保 utils 函数已完整测试（大部分已存在）

#### 需要补充的测试

1. **storage.test.ts** - 已存在，需要更新以支持新字段
   - 添加 `hints` 字段测试
   - 添加 `solution` 字段测试
   - 添加 `hasSavedGame` 函数测试

### SubTask 18.3: 编写组件单元测试

**目标**：为核心 UI 组件编写测试

#### 1. SudokuBoard 组件测试 (`tests/unit/components/SudokuBoard.test.tsx`)

```typescript
describe('SudokuBoard', () => {
  it('should render 9x9 grid')
  it('should highlight selected cell')
  it('should highlight same row, col, and box')
  it('should highlight same numbers')
  it('should show conflicts')
  it('should call onCellClick when cell clicked')
})
```

#### 2. Cell 组件测试 (`tests/unit/components/Cell.test.tsx`)

```typescript
describe('Cell', () => {
  it('should display value when filled')
  it('should be empty when value is null')
  it('should show initial cell style')
  it('should show error style')
  it('should show selected style')
  it('should show highlighted style')
  it('should be disabled when initial')
  it('should have correct aria-label')
})
```

#### 3. NumberPad 组件测试 (`tests/unit/components/NumberPad.test.tsx`)

```typescript
describe('NumberPad', () => {
  it('should render 9 number buttons')
  it('should render delete button')
  it('should show remaining counts')
  it('should disable numbers with 0 remaining')
  it('should disable all when game complete')
  it('should call onNumberClick')
  it('should call onDeleteClick')
})
```

#### 4. NumberButton 组件测试 (`tests/unit/components/NumberButton.test.tsx`)

```typescript
describe('NumberButton', () => {
  it('should display number')
  it('should display remaining count')
  it('should be disabled when isDisabled is true')
  it('should call onClick with number')
  it('should have correct aria-label')
})
```

#### 5. ControlPanel 组件测试 (`tests/unit/components/ControlPanel.test.tsx`)

```typescript
describe('ControlPanel', () => {
  it('should render all control buttons')
  it('should show difficulty modal on new game')
  it('should show confirm modal on reset')
  it('should show confirm modal on end game')
  it('should disable hint when no cell selected')
  it('should disable buttons when game complete')
})
```

#### 6. ControlButton 组件测试 (`tests/unit/components/ControlButton.test.tsx`)

```typescript
describe('ControlButton', () => {
  it('should display icon and label')
  it('should apply correct color class')
  it('should be disabled when disabled prop is true')
  it('should call onClick')
  it('should have hover animation')
})
```

### SubTask 18.4: 生成测试覆盖率报告

**目标**：确保测试覆盖率达到要求

覆盖率目标：
| 类型 | 目标 |
|------|------|
| Statements | ≥ 80% |
| Branches | ≥ 75% |
| Functions | ≥ 80% |
| Lines | ≥ 80% |

执行命令：
```bash
npm run test:coverage
```

## 注意事项

### 技术注意事项

1. **测试环境配置**
   - 使用 Vitest 作为测试框架
   - 使用 @testing-library/react 测试组件
   - 使用 jsdom 模拟浏览器环境

2. **Mock 策略**
   - Mock localStorage
   - Mock React Context
   - Mock timers (useTimer)
   - Mock Math.random (for puzzle generation)

3. **测试隔离**
   - 每个测试用例独立运行
   - 使用 beforeEach/afterEach 清理状态
   - 避免测试间依赖

4. **性能考虑**
   - 算法测试应验证执行时间
   - 避免过长的测试运行时间

### 测试注意事项

1. **边界条件**
   - 测试空值、边界值
   - 测试错误情况
   - 测试极端情况

2. **可访问性**
   - 验证 aria-label
   - 验证键盘操作
   - 验证焦点管理

3. **异步操作**
   - 正确处理 Promise
   - 使用 waitFor 处理状态更新
   - 使用 fake timers 处理定时器

## 实现步骤

### 步骤 1：创建 hooks 测试目录和文件
- 创建 `tests/unit/hooks/` 目录
- 创建 `useGame.test.ts`
- 创建 `useTimer.test.ts`
- 创建 `useRemainingCounts.test.ts`
- 创建 `useDisabledNumbers.test.ts`

### 步骤 2：创建组件测试目录和文件
- 创建 `tests/unit/components/` 目录
- 创建 `SudokuBoard.test.tsx`
- 创建 `Cell.test.tsx`
- 创建 `NumberPad.test.tsx`
- 创建 `NumberButton.test.tsx`
- 创建 `ControlPanel.test.tsx`
- 创建 `ControlButton.test.tsx`

### 步骤 3：更新现有测试
- 更新 `storage.test.ts` 添加新字段测试
- 更新 `gameReducer.test.ts` 添加新 action 测试

### 步骤 4：运行测试并修复问题
- 运行 `npm run test`
- 修复失败的测试
- 确保所有测试通过

### 步骤 5：生成覆盖率报告
- 运行 `npm run test:coverage`
- 分析覆盖率报告
- 补充缺失的测试用例

### 步骤 6：验证
- 确保覆盖率达标
- 确保所有测试通过
- 确保没有 lint 错误

## 文件修改清单

| 文件路径 | 修改类型 | 说明 |
|---------|---------|------|
| `tests/unit/hooks/useGame.test.ts` | 新增 | useGame hook 测试 |
| `tests/unit/hooks/useTimer.test.ts` | 新增 | useTimer hook 测试 |
| `tests/unit/hooks/useRemainingCounts.test.ts` | 新增 | useRemainingCounts hook 测试 |
| `tests/unit/hooks/useDisabledNumbers.test.ts` | 新增 | useDisabledNumbers hook 测试 |
| `tests/unit/components/SudokuBoard.test.tsx` | 新增 | SudokuBoard 组件测试 |
| `tests/unit/components/Cell.test.tsx` | 新增 | Cell 组件测试 |
| `tests/unit/components/NumberPad.test.tsx` | 新增 | NumberPad 组件测试 |
| `tests/unit/components/NumberButton.test.tsx` | 新增 | NumberButton 组件测试 |
| `tests/unit/components/ControlPanel.test.tsx` | 新增 | ControlPanel 组件测试 |
| `tests/unit/components/ControlButton.test.tsx` | 新增 | ControlButton 组件测试 |
| `tests/unit/utils/storage.test.ts` | 修改 | 添加新字段测试 |
| `tests/unit/context/gameReducer.test.ts` | 修改 | 添加新 action 测试 |

## 验收标准

1. ✅ 所有 hooks 测试通过
2. ✅ 所有组件测试通过
3. ✅ 测试覆盖率达标（≥80%）
4. ✅ 所有测试运行时间 < 30秒
5. ✅ 没有 lint 错误
6. ✅ 测试代码清晰易读
