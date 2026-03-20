# Task 7: 数独棋盘组件实现计划

## 1. 任务概述

实现数独棋盘组件（SudokuBoard），包括 9x9 网格布局、格子组件、高亮功能和冲突提示功能。

## 2. 需求规格对照

### 2.1 需求规格文档要求

| 需求项 | 规格要求 | 实现方案 |
|--------|----------|----------|
| 网格布局 | 9x9 标准数独网格布局 | 使用 CSS Grid 实现 9x9 布局 |
| 格子大小 | 最小触摸目标 44x44px | 原型设计 60x60px，满足要求 |
| 视觉层次 | 区分已填写数字和空白格子 | 初始数字使用 blue-50 背景 |
| 宫格边界 | 3x3 宫格用粗边框区分 | 使用 border-r-2/border-b-2 实现 |
| 数字高亮 | 选择某个数字时，所有相同数字高亮显示 | 实现相同数字高亮逻辑 |
| 行列高亮 | 选中格子所在的行和列高亮显示 | 实现行列高亮逻辑 |
| 宫格高亮 | 选中格子所在的 3x3 宫格高亮显示 | 实现宫格高亮逻辑 |
| 冲突提示 | 冲突位置红色高亮显示 | 使用红色背景/边框提示冲突 |

### 2.2 原型设计高保真还原

从原型设计数据提取的关键样式参数：

```
棋盘容器:
- 尺寸: 540x540px
- 边框: 1.6px solid rgba(55,65,81,1) (slate-600)
- 背景: rgba(255,255,255,1) (white)

单元格:
- 尺寸: 60x60px
- 边框: 1.6px solid rgba(71,85,105,1) (slate-500)
- 初始数字背景: rgba(239,246,255,1) (blue-50)
- 空白格子背景: rgba(255,255,255,1) (white)
- 数字字体: SourceHanSans-Bold, 28px
- 数字颜色: rgba(30,41,59,1) (slate-800)

宫格边界:
- 每 3 列右侧: border-r-2 border-r-slate-600
- 每 3 行底部: border-b-2 border-b-slate-600
```

## 3. 技术架构符合性

### 3.1 目录结构

```
src/components/game/SudokuBoard/
├── SudokuBoard.tsx      # 主组件
├── Cell.tsx             # 单元格组件
├── index.ts             # 导出文件
└── types.ts             # 类型定义（如需要）
```

### 3.2 依赖关系

- 依赖 `@/types/sudoku` 中的类型定义
- 依赖 `@/types/game` 中的 CellState 类型
- 依赖 `@/context/GameContext` 获取游戏状态
- 依赖 `@/algorithms/sudokuValidator` 中的 getConflicts 函数
- 依赖 `@/hooks/useGame` 获取游戏操作方法

### 3.3 组件接口设计

```typescript
type CellProps = {
  row: number
  col: number
  value: number | null
  isInitial: boolean
  isError: boolean
  isSelected: boolean
  isHighlighted: boolean
  isSameNumber: boolean
  isConflict: boolean
  onClick: () => void
}

type SudokuBoardProps = {
  board: CellState[][]
  selectedCell: Position | null
  onCellClick: (row: number, col: number) => void
}
```

## 4. 实现步骤

### SubTask 7.1: 实现 9x9 网格布局

**工作内容：**
1. 更新 SudokuBoard 组件，使用 CSS Grid 实现 9x9 布局
2. 设置正确的尺寸（540x540px）和边框样式
3. 实现宫格边界的粗边框效果

**关键代码：**
```tsx
<div 
  className="grid grid-cols-9 border border-slate-600 bg-white"
  style={{ width: '540px', height: '540px' }}
>
```

**验收标准：**
- [ ] 网格正确显示为 9x9 布局
- [ ] 棋盘尺寸为 540x540px
- [ ] 宫格边界清晰可见（粗边框）

### SubTask 7.2: 实现格子组件（Cell）

**工作内容：**
1. 创建独立的 Cell 组件
2. 实现单元格的基本样式（60x60px）
3. 区分初始数字和用户填写数字的视觉样式
4. 实现选中状态的视觉反馈

**样式参数：**
- 尺寸: 60x60px
- 字体: text-3xl font-bold (28px)
- 初始数字背景: bg-blue-50
- 用户填写背景: bg-white
- 选中状态: bg-blue-100

**验收标准：**
- [ ] 单元格尺寸正确（60x60px）
- [ ] 初始数字有明显的蓝色背景
- [ ] 选中状态有明显的视觉反馈

### SubTask 7.3: 实现行列宫格高亮功能

**工作内容：**
1. 实现选中格子所在行的高亮
2. 实现选中格子所在列的高亮
3. 实现选中格子所在 3x3 宫格的高亮
4. 计算高亮状态的逻辑

**高亮逻辑：**
```typescript
const isHighlighted = useMemo(() => {
  if (!selectedCell) return false
  const sameRow = selectedCell.row === row
  const sameCol = selectedCell.col === col
  const sameBox = 
    Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
    Math.floor(selectedCell.col / 3) === Math.floor(col / 3)
  return sameRow || sameCol || sameBox
}, [selectedCell, row, col])
```

**验收标准：**
- [ ] 选中格子后，同行格子高亮
- [ ] 选中格子后，同列格子高亮
- [ ] 选中格子后，同宫格格子高亮

### SubTask 7.4: 实现相同数字高亮功能

**工作内容：**
1. 实现选中数字时，所有相同数字高亮
2. 高亮效果应与行列宫格高亮区分

**高亮逻辑：**
```typescript
const isSameNumber = useMemo(() => {
  if (!selectedCell || value === null) return false
  const selectedValue = board[selectedCell.row][selectedCell.col].value
  return selectedValue !== null && selectedValue === value
}, [selectedCell, value, board])
```

**验收标准：**
- [ ] 选中数字后，所有相同数字高亮
- [ ] 高亮效果明显但不刺眼

### SubTask 7.5: 实现冲突提示功能

**工作内容：**
1. 使用 getConflicts 函数检测冲突
2. 实现冲突格子的红色高亮
3. 冲突提示应优先于其他高亮

**冲突检测：**
```typescript
const conflicts = useMemo(() => {
  if (!selectedCell) return []
  const grid = board.map(row => row.map(cell => cell.value))
  return getConflicts(grid, selectedCell.row, selectedCell.col)
}, [board, selectedCell])
```

**验收标准：**
- [ ] 填入冲突数字时，冲突位置红色高亮
- [ ] 冲突提示准确无误
- [ ] 冲突提示视觉效果明显

## 5. 注意事项

### 5.1 高保真还原注意事项

1. **尺寸精确性**
   - 棋盘尺寸必须精确为 540x540px
   - 单元格尺寸必须精确为 60x60px
   - 边框宽度必须精确为 1.6px（Tailwind border 默认 1px，需要自定义）

2. **颜色一致性**
   - 使用 Tailwind 颜色变量，确保与设计系统一致
   - slate-600: rgba(55,65,81,1)
   - slate-500: rgba(71,85,105,1)
   - blue-50: rgba(239,246,255,1)

3. **字体规范**
   - 使用 SourceHanSans-Bold 字体
   - 字号 28px (text-3xl 对应 30px，可能需要自定义)

4. **宫格边界**
   - 每 3 列右侧使用 border-r-2
   - 每 3 行底部使用 border-b-2
   - 最后一行/列不需要额外边框

### 5.2 响应式设计注意事项

1. **移动端适配**
   - 在小屏幕上需要缩小棋盘尺寸
   - 保持格子可点击（最小 44x44px）
   - 使用 Tailwind 响应式前缀

2. **触摸友好**
   - 确保触摸目标足够大
   - 添加适当的点击反馈

### 5.3 性能优化注意事项

1. **避免不必要的重渲染**
   - 使用 React.memo 包装 Cell 组件
   - 使用 useMemo 缓存计算结果

2. **高亮计算优化**
   - 高亮状态计算应在 SudokuBoard 层面进行
   - 避免每个 Cell 重复计算

### 5.4 可访问性注意事项

1. **键盘导航**
   - 支持方向键移动选中格子
   - 支持数字键直接输入

2. **焦点指示**
   - 提供清晰的焦点样式
   - 确保焦点可见

3. **颜色对比度**
   - 确保文字与背景对比度符合 WCAG 2.1 AA 标准
   - 不只依赖颜色传达信息

### 5.5 状态管理注意事项

1. **状态来源**
   - 棋盘数据从 GameContext 获取
   - 选中格子状态由父组件管理

2. **事件处理**
   - 点击格子时调用 onCellClick
   - 由父组件决定后续操作

## 6. 测试要点

### 6.1 单元测试

- [ ] Cell 组件渲染正确
- [ ] 高亮状态计算正确
- [ ] 冲突检测正确

### 6.2 集成测试

- [ ] 棋盘与游戏状态正确同步
- [ ] 点击交互正确触发

### 6.3 视觉测试

- [ ] 与原型设计对比，确保高保真还原
- [ ] 不同屏幕尺寸下的响应式表现

## 7. 文件变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/components/game/SudokuBoard/SudokuBoard.tsx` | 修改 | 更新主组件实现 |
| `src/components/game/SudokuBoard/Cell.tsx` | 新建 | 创建单元格组件 |
| `src/components/game/SudokuBoard/index.ts` | 修改 | 更新导出 |
| `tests/unit/components/SudokuBoard.test.tsx` | 新建 | 创建单元测试 |

## 8. 依赖检查

- [x] `@/types/sudoku` 已存在
- [x] `@/types/game` 已存在
- [x] `@/context/GameContext` 已存在
- [x] `@/algorithms/sudokuValidator` 已存在
- [x] `@/hooks/useGame` 已存在
- [x] `@/constants/game` 已存在

## 9. 风险评估

| 风险项 | 风险等级 | 应对措施 |
|--------|----------|----------|
| 边框宽度不精确 | 低 | 使用 Tailwind 自定义配置或内联样式 |
| 高亮逻辑复杂 | 中 | 拆分为独立函数，添加单元测试 |
| 性能问题 | 低 | 使用 React.memo 和 useMemo 优化 |
| 响应式适配 | 中 | 使用 Tailwind 响应式类，测试多种屏幕尺寸 |
