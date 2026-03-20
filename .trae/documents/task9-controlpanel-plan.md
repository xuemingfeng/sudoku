# Task 9: 控制面板组件实现计划

## 1. 任务概述

实现数独游戏的控制面板组件（ControlPanel），提供新游戏、重置、提示、检查、结束游戏等功能按钮。

## 2. 需求规格映射

| 需求项 | spec.md 章节 | 具体要求 |
|--------|-------------|----------|
| 新游戏按钮 | 2.1.5 | 生成新的数独谜题，支持选择难度（简单、中等、困难） |
| 重置按钮 | 2.1.5 | 将当前游戏恢复到初始状态，清除所有用户填写的内容 |
| 提示按钮 | 2.1.5 | 为用户提供一个正确答案，自动填入选中格子 |
| 检查按钮 | 2.1.5 | 验证当前填写是否正确，错误位置高亮显示 |
| 结束游戏按钮 | 2.1.5 | 点击后显示确认对话框，防止误操作 |
| 确认对话框 | 2.1.5 | 确认对话框正确显示 |
| 按钮布局 | 2.1.6.5 | 功能控制按钮位于上方提示区，便于用户快速访问 |

## 3. 原型设计规格

### 3.1 按钮布局
```
┌─────────────────────────────────────────────────────────────────────────┐
│ [新游戏] [重置] [提示] [检查] [结束游戏]                                  │
│    ↑        ↑       ↑       ↑        ↑                                  │
│  蓝色    灰色    琥珀色   绿色     红色                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 按钮样式规格
| 按钮 | 背景色 | 图标 | 文字 |
|------|--------|------|------|
| 新游戏 | bg-blue-600 (#2563eb) | ri-add-line | 新游戏 |
| 重置 | bg-slate-600 (#475569) | ri-refresh-line | 重置 |
| 提示 | bg-amber-500 (#f59e0b) | ri-lightbulb-line | 提示 |
| 检查 | bg-green-600 (#16a34a) | ri-check-line | 检查 |
| 结束游戏 | bg-red-600 (#dc2626) | ri-close-line | 结束游戏 |

### 3.3 按钮通用样式
| 属性 | 数值 | 说明 |
|------|------|------|
| 高度 | 51px | 原型设计高度 |
| 圆角 | 12px (rounded-xl) | 与设计系统一致 |
| 字体 | 16px, SourceHanSans-SemiBold | 按钮文字 |
| 图标 | 18px, remixicon | RemixIcon 图标 |
| 图标与文字间距 | 8px | gap-2 |
| 按钮间距 | 12px | gap-3 |
| 悬停效果 | 颜色加深 | hover:bg-{color}-700 |
| 点击效果 | scale-98 | active:scale-98 |

### 3.4 弹窗规格
| 弹窗 | 用途 | 内容 |
|------|------|------|
| DifficultyModal | 难度选择 | 简单/中等/困难 三个选项 |
| ConfirmModal | 操作确认 | 确认/取消 按钮 |

## 4. 实现步骤

### SubTask 9.1: 实现新游戏按钮和难度选择

**目标**: 点击新游戏按钮显示难度选择弹窗，选择后生成新游戏

**实现内容**:
1. 创建 ControlButton 组件
   - 可复用的按钮组件
   - 支持不同颜色主题
   - 支持图标和文字

2. 创建 DifficultyModal 组件
   - 显示三个难度选项：简单、中等、困难
   - 每个选项显示难度说明
   - 点击选项后关闭弹窗并开始新游戏

3. 实现新游戏逻辑
   - 调用 generateSudokuPuzzle 生成谜题
   - dispatch NEW_GAME action 更新状态

**文件变更**:
- `src/components/game/ControlPanel/ControlButton.tsx` - 新建
- `src/components/game/ControlPanel/DifficultyModal.tsx` - 新建
- `src/components/game/ControlPanel/ControlPanel.tsx` - 修改

### SubTask 9.2: 实现重置按钮

**目标**: 点击重置按钮显示确认弹窗，确认后重置游戏

**实现内容**:
1. 创建 ConfirmModal 组件
   - 显示确认信息
   - 确认/取消按钮
   - 支持自定义提示文字

2. 实现重置逻辑
   - dispatch RESET_GAME action
   - 清除所有用户填写的内容
   - 重置计时器和错误计数

**文件变更**:
- `src/components/game/ControlPanel/ConfirmModal.tsx` - 新建
- `src/components/game/ControlPanel/ControlPanel.tsx` - 修改

### SubTask 9.3: 实现提示按钮

**目标**: 为选中格子填入正确答案

**实现内容**:
1. 提示逻辑
   - 检查是否选中了空格子
   - 获取该格子的正确答案
   - 填入答案并更新状态

2. 边界情况处理
   - 未选中格子时禁用按钮
   - 选中初始数字格子时禁用按钮
   - 选中已填写格子时禁用按钮

**需要新增状态**:
- solution（正确答案）需要在 GameState 中保存

**文件变更**:
- `src/types/game.ts` - 修改，添加 solution 字段
- `src/context/gameReducer.ts` - 修改，处理 solution
- `src/components/game/ControlPanel/ControlPanel.tsx` - 修改

### SubTask 9.4: 实现检查按钮

**目标**: 验证当前填写是否正确，错误位置高亮显示

**实现内容**:
1. 检查逻辑
   - 遍历所有已填写的格子
   - 比较用户填写值与正确答案
   - 标记错误的格子

2. 高亮显示
   - 错误格子设置 isError = true
   - 更新棋盘状态

**文件变更**:
- `src/context/gameReducer.ts` - 添加 CHECK_GAME action
- `src/types/game.ts` - 添加 CHECK_GAME action 类型
- `src/components/game/ControlPanel/ControlPanel.tsx` - 修改

### SubTask 9.5: 实现结束游戏按钮

**目标**: 点击后显示确认对话框，确认后结束游戏

**实现内容**:
1. 结束游戏逻辑
   - 显示确认弹窗
   - 确认后保存当前进度
   - 返回主界面或显示游戏统计

2. 确认弹窗内容
   - 提示：确定要结束当前游戏吗？当前进度将被保存。

**文件变更**:
- `src/components/game/ControlPanel/ControlPanel.tsx` - 修改

## 5. 组件接口设计

### 5.1 ControlButton Props
```typescript
type ControlButtonProps = {
  icon: string
  label: string
  color: 'blue' | 'slate' | 'amber' | 'green' | 'red'
  onClick: () => void
  disabled?: boolean
}
```

### 5.2 DifficultyModal Props
```typescript
type DifficultyModalProps = {
  isOpen: boolean
  onClose: () => void
  onSelect: (difficulty: Difficulty) => void
}
```

### 5.3 ConfirmModal Props
```typescript
type ConfirmModalProps = {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}
```

### 5.4 ControlPanel Props
```typescript
type ControlPanelProps = {
  selectedCell: Position | null
  board: CellState[][]
  solution: SudokuGrid
  isGameComplete: boolean
  onNewGame: (difficulty: Difficulty) => void
  onReset: () => void
  onHint: () => void
  onCheck: () => void
  onEndGame: () => void
}
```

## 6. 状态管理更新

### 6.1 GameState 新增字段
```typescript
type GameState = {
  // ... 现有字段
  solution: SudokuGrid  // 正确答案
}
```

### 6.2 GameAction 新增
```typescript
type GameAction =
  // ... 现有 actions
  | { type: 'CHECK_GAME' }
  | { type: 'HINT_CELL'; payload: { row: number; col: number; value: number } }
```

## 7. 注意事项

### 7.1 弹窗管理
- 使用 isOpen 状态控制弹窗显示
- 点击弹窗外部区域关闭弹窗
- ESC 键关闭弹窗

### 7.2 按钮禁用逻辑
| 按钮 | 禁用条件 |
|------|----------|
| 新游戏 | 无 |
| 重置 | 游戏已完成 |
| 提示 | 未选中格子 / 选中初始格子 / 选中已填写格子 / 游戏已完成 |
| 检查 | 游戏已完成 |
| 结束游戏 | 游戏已完成 |

### 7.3 性能优化
- 使用 React.memo 优化 ControlButton
- 使用 useCallback 包装事件处理函数
- 弹窗使用 lazy loading

### 7.4 可访问性
- 按钮添加 aria-label
- 弹窗添加 aria-modal
- 支持键盘操作

## 8. 文件清单

| 文件路径 | 操作 | 说明 |
|----------|------|------|
| `src/components/game/ControlPanel/ControlButton.tsx` | 新建 | 可复用按钮组件 |
| `src/components/game/ControlPanel/DifficultyModal.tsx` | 新建 | 难度选择弹窗 |
| `src/components/game/ControlPanel/ConfirmModal.tsx` | 新建 | 确认弹窗 |
| `src/components/game/ControlPanel/ControlPanel.tsx` | 修改 | 重构主组件 |
| `src/components/game/ControlPanel/index.ts` | 修改 | 更新导出 |
| `src/types/game.ts` | 修改 | 添加 solution 字段和 action 类型 |
| `src/context/gameReducer.ts` | 修改 | 添加 CHECK_GAME、HINT_CELL 处理 |
| `tests/unit/components/ControlPanel.test.tsx` | 新建 | 单元测试 |

## 9. 风险评估

| 风险项 | 风险等级 | 应对措施 |
|--------|----------|----------|
| 弹窗层级管理 | 低 | 使用 Portal 渲染弹窗 |
| 状态同步 | 低 | 从 GameContext 获取状态 |
| 性能问题 | 低 | 使用 React.memo 优化 |

## 10. 验收标准

- [ ] 新游戏按钮显示难度选择弹窗
- [ ] 选择难度后正确生成新游戏
- [ ] 重置按钮显示确认弹窗
- [ ] 重置后清除用户填写内容
- [ ] 提示按钮正确填入答案
- [ ] 检查按钮正确高亮错误
- [ ] 结束游戏按钮显示确认弹窗
- [ ] 所有按钮样式符合原型设计
- [ ] 单元测试通过
- [ ] 构建无错误
