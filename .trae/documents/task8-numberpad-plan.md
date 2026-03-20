# Task 8: 数字输入组件实现计划

## 1. 任务概述

实现数独游戏的数字输入组件（NumberPad），提供数字 1-9 的输入按钮、剩余数量显示、动态禁用逻辑和删除功能。

## 2. 需求规格映射

| 需求项 | spec.md 章节 | 具体要求 |
|--------|-------------|----------|
| 数字按钮布局 | 2.1.4 | 提供数字 1-9 的输入按钮，一排显示 |
| 剩余数量显示 | 2.1.4 | 每个数字按钮显示未填写的剩余数量 |
| 动态禁用逻辑 | 2.1.4 | 不符合数独规则的数字按钮不可用（置灰）；剩余数量为0时自动禁用 |
| 删除功能 | 2.1.4 | 支持删除功能，清除已填写的数字 |
| 响应式设计 | 2.1.6.3 | 支持横向滚动，确保在小屏幕设备上也能完整显示 |
| 触摸友好 | 2.1.6.3 | 触摸友好的按钮尺寸，适合移动设备操作 |

## 3. 原型设计规格

### 3.1 布局结构
```
┌─────────────────────────────────────────────────────────────────┐
│  [1:5] [2:4] [3:3] [4:4] [5:3] [6:3] [7:3] [8:2] [9:2]  [删除]  │
│    ↑     ↑     ↑     ↑     ↑     ↑     ↑     ↑     ↑      ↑     │
│  数字按钮（显示数字和剩余数量）                          删除按钮  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 按钮样式规格
| 属性 | 数值 | 说明 |
|------|------|------|
| 按钮尺寸 | 60x60px | 满足最小触摸目标 44x44px |
| 圆角 | 12px (rounded-xl) | 与设计系统一致 |
| 数字字体 | 28px, SourceHanSans-Bold | 主数字显示 |
| 剩余数量字体 | 14px, SourceHanSans-SemiBold | 剩余数量显示 |
| 可用状态背景 | bg-blue-50 | 浅蓝色背景 |
| 可用状态文字 | text-blue-600 | 蓝色文字 |
| 禁用状态背景 | bg-slate-100 | 灰色背景 |
| 禁用状态文字 | text-slate-300 | 浅灰色文字 |
| 删除按钮背景 | bg-slate-100 | 灰色背景 |
| 删除按钮图标 | ri-delete-back-line | RemixIcon 图标 |
| 按钮间距 | 8px (gap-2) | 按钮之间间距 |

### 3.3 交互状态
| 状态 | 样式 |
|------|------|
| 默认（可用） | bg-blue-50 text-blue-600 |
| 悬停 | bg-blue-100 |
| 点击 | scale-95 |
| 禁用 | bg-slate-100 text-slate-300 cursor-not-allowed |

## 4. 实现步骤

### SubTask 8.1: 实现数字按钮布局（1-9）

**目标**: 创建符合原型设计的高保真数字按钮布局

**实现内容**:
1. 修改 NumberPad 组件布局
   - 使用 flex 布局，横向排列
   - 9 个数字按钮 + 1 个删除按钮
   - 按钮尺寸 60x60px
   - 按钮间距 8px

2. 创建 NumberButton 子组件
   - 显示数字（大字体）
   - 显示剩余数量（小字体，位于数字下方）
   - 支持禁用状态样式
   - 支持悬停和点击动画

**文件变更**:
- `src/components/game/NumberPad/NumberPad.tsx` - 重构布局
- `src/components/game/NumberPad/NumberButton.tsx` - 新建数字按钮组件
- `src/components/game/NumberPad/index.ts` - 更新导出

### SubTask 8.2: 实现剩余数量显示

**目标**: 计算并显示每个数字的剩余填写数量

**实现内容**:
1. 创建 `useRemainingCounts` Hook
   - 接收当前棋盘状态
   - 计算每个数字（1-9）已填写数量
   - 返回剩余数量（9 - 已填写数量）

2. 计算逻辑
   ```typescript
   // 每个数字最多出现 9 次
   // 剩余数量 = 9 - 当前棋盘中该数字出现次数
   ```

**文件变更**:
- `src/hooks/useRemainingCounts.ts` - 新建 Hook
- `src/hooks/index.ts` - 更新导出

### SubTask 8.3: 实现按钮动态禁用逻辑

**目标**: 根据选中格子和数独规则动态禁用按钮

**实现内容**:
1. 创建 `useDisabledNumbers` Hook
   - 接收选中格子位置、当前棋盘状态
   - 使用 `getValidNumbers` 函数计算有效数字
   - 结合剩余数量判断禁用状态

2. 禁用条件（满足任一即禁用）:
   - 剩余数量为 0（该数字已全部填完）
   - 选中格子为初始数字（不可修改）
   - 该数字在当前格子不合法（行/列/宫格冲突）

3. 特殊情况处理
   - 未选中格子时，仅根据剩余数量禁用
   - 选中初始数字格子时，所有数字按钮禁用

**文件变更**:
- `src/hooks/useDisabledNumbers.ts` - 新建 Hook
- `src/hooks/index.ts` - 更新导出

### SubTask 8.4: 实现删除按钮功能

**目标**: 实现删除按钮，清除选中格子的数字

**实现内容**:
1. 删除按钮样式
   - 使用 RemixIcon 图标 `ri-delete-back-line`
   - 灰色背景，与其他按钮区分
   - 支持悬停和点击动画

2. 删除逻辑
   - 仅当选中非初始格子时可用
   - 点击后清除选中格子的数字
   - 更新剩余数量显示

3. 禁用条件
   - 未选中格子
   - 选中的是初始数字格子
   - 选中的格子为空

**文件变更**:
- `src/components/game/NumberPad/NumberPad.tsx` - 完善删除逻辑
- `src/components/game/NumberPad/DeleteButton.tsx` - 新建删除按钮组件

## 5. 组件接口设计

### 5.1 NumberPad Props
```typescript
type NumberPadProps = {
  selectedCell: Position | null
  onNumberClick: (number: number) => void
  onDeleteClick: () => void
}
```

### 5.2 NumberButton Props
```typescript
type NumberButtonProps = {
  number: number
  remainingCount: number
  isDisabled: boolean
  onClick: (number: number) => void
}
```

### 5.3 DeleteButton Props
```typescript
type DeleteButtonProps = {
  isDisabled: boolean
  onClick: () => void
}
```

## 6. 响应式设计

### 6.1 桌面端（>= 640px）
- 按钮尺寸 60x60px
- 横向排列，居中显示
- 按钮间距 8px

### 6.2 移动端（< 640px）
- 按钮尺寸自适应（min-w-[44px]）
- 支持横向滚动
- 保持触摸友好

## 7. 注意事项

### 7.1 性能优化
- 使用 `useMemo` 缓存剩余数量计算
- 使用 `useCallback` 包装事件处理函数
- 使用 `React.memo` 优化子组件渲染

### 7.2 可访问性
- 按钮添加 `aria-label` 属性
- 禁用按钮添加 `aria-disabled` 属性
- 支持键盘操作（数字键 1-9，Delete/Backspace）

### 7.3 边界情况
- 未选中格子时，数字按钮可用但无效果（或显示提示）
- 选中初始数字格子时，所有按钮禁用
- 游戏完成时，所有按钮禁用

### 7.4 测试覆盖
- 数字按钮渲染测试
- 剩余数量计算测试
- 动态禁用逻辑测试
- 删除功能测试
- 响应式布局测试

## 8. 文件清单

| 文件路径 | 操作 | 说明 |
|----------|------|------|
| `src/components/game/NumberPad/NumberPad.tsx` | 修改 | 重构主组件 |
| `src/components/game/NumberPad/NumberButton.tsx` | 新建 | 数字按钮组件 |
| `src/components/game/NumberPad/DeleteButton.tsx` | 新建 | 删除按钮组件 |
| `src/components/game/NumberPad/index.ts` | 修改 | 更新导出 |
| `src/hooks/useRemainingCounts.ts` | 新建 | 剩余数量 Hook |
| `src/hooks/useDisabledNumbers.ts` | 新建 | 禁用数字 Hook |
| `src/hooks/index.ts` | 修改 | 更新导出 |
| `tests/unit/components/NumberPad.test.tsx` | 新建 | 单元测试 |

## 9. 风险评估

| 风险项 | 风险等级 | 应对措施 |
|--------|----------|----------|
| 性能问题 | 低 | 使用 useMemo 和 React.memo 优化 |
| 响应式适配 | 中 | 使用 Tailwind 响应式类，测试多种屏幕尺寸 |
| 状态同步 | 低 | 从 GameContext 获取状态，确保数据一致性 |

## 10. 验收标准

- [ ] 数字按钮 1-9 正确渲染
- [ ] 剩余数量正确显示
- [ ] 动态禁用逻辑正确（剩余为0、不合法数字）
- [ ] 删除按钮功能正常
- [ ] 样式符合原型设计
- [ ] 响应式布局正常
- [ ] 单元测试通过
- [ ] 构建无错误
