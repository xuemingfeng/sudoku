# Task 10: 实现头部信息组件 - 实施计划

## 1. 任务概述

Task 10 需要实现完整的头部信息组件，包含游戏标题、计时器、错误次数和当前难度显示。当前 Header 组件已存在基础实现，但需要完善以符合需求规格和原型设计。

## 2. 需求规格对照

### 2.1 tasks.md 要求

| SubTask | 要求 | 当前状态 |
|---------|------|----------|
| 10.1 | 实现游戏标题显示 | ✅ 已实现，需优化样式 |
| 10.2 | 实现计时器显示 | ⚠️ 硬编码值，需接入 useTimer |
| 10.3 | 实现错误次数显示 | ⚠️ 硬编码值，需接入实际状态 |
| 10.4 | 实现当前难度显示 | ✅ 已实现，需优化样式 |

### 2.2 spec.md 要求 (2.1.6.1 界面布局设计)

- **上方提示区**：显示游戏标题、用时、错误次数、当前难度和功能控制按钮
- **状态显示**：
  - 计时器：格式 MM:SS，实时更新
  - 错误计数：显示 当前错误/最大错误（如 1/3）
  - 难度：显示当前游戏难度（简单/中等/困难）

## 3. 原型设计规格

### 3.1 头部信息区整体布局

```
┌─────────────────────────────────────────────────────────────────┐
│  🎮 数独游戏                    ⏱️ 05:23  ❌ 1/3  📊 中等       │
│  (标题区)                       (信息区: 计时 | 错误 | 难度)     │
└─────────────────────────────────────────────────────────────────┘
```

- 容器: `flex items-center justify-between w-full`
- 高度: 48px

### 3.2 左侧标题区

| 元素 | 规格 |
|------|------|
| 图标 | `ri-game-line`, fontSize: 32px, color: blue-600 (#2563eb) |
| 间距 | 12px (ml-3) |
| 标题 | "数独游戏", fontSize: 28px, fontFamily: SourceHanSans-Bold, color: slate-800 (#1e293b) |

### 3.3 右侧信息区

三个信息项水平排列，间距 24px (gap-6)：

#### 3.3.1 计时器

| 元素 | 规格 |
|------|------|
| 图标 | `ri-time-line`, fontSize: 20px, color: slate-500 (#6b7280) |
| 间距 | 8px (ml-2) |
| 文字 | MM:SS 格式, fontSize: 20px, fontFamily: SourceHanSans-SemiBold, color: slate-700 (#334155) |

#### 3.3.2 错误次数

| 元素 | 规格 |
|------|------|
| 图标 | `ri-close-circle-line`, fontSize: 20px, color: red-500 (#ef4444) |
| 间距 | 8px (ml-2) |
| 文字 | "当前/最大" 格式, fontSize: 20px, fontFamily: SourceHanSans-SemiBold, color: red-500 (#ef4444) |

#### 3.3.3 难度

| 元素 | 规格 |
|------|------|
| 图标 | `ri-bar-chart-line`, fontSize: 20px, color: purple-600 (#9333ea) |
| 间距 | 8px (ml-2) |
| 文字 | 难度名称, fontSize: 20px, fontFamily: SourceHanSans-SemiBold, color: purple-600 (#9333ea) |

难度映射：
- easy → "简单"
- medium → "中等"
- hard → "困难"

## 4. 实施计划

### SubTask 10.1: 优化游戏标题显示

**修改文件**: `src/components/game/Header/Header.tsx`

**修改内容**:
- 调整图标大小: `text-3xl` → `text-[32px]`
- 调整标题字体: 添加 `font-bold` (对应 SourceHanSans-Bold)
- 调整标题大小: `text-3xl` → `text-[28px]`

### SubTask 10.2: 实现计时器显示

**修改文件**: 
- `src/components/game/Header/Header.tsx`
- `src/App.tsx`

**修改内容**:

1. **Header.tsx**: 
   - Props 接收 `timer: number` (秒数)
   - 添加 `formatTime` 工具函数将秒数转为 MM:SS 格式
   - 显示实时计时

2. **App.tsx**:
   - 集成 `useTimer` hook
   - 将计时器状态传递给 Header

### SubTask 10.3: 实现错误次数显示

**修改文件**: 
- `src/components/game/Header/Header.tsx`
- `src/App.tsx`

**修改内容**:

1. **Header.tsx**:
   - Props 接收 `errors: number` 和 `maxErrors: number`
   - 显示格式: `{errors}/{maxErrors}`

2. **App.tsx**:
   - 添加 `errors` 状态
   - 在错误发生时更新状态
   - 传递给 Header

### SubTask 10.4: 实现当前难度显示

**修改文件**: `src/components/game/Header/Header.tsx`

**修改内容**:
- Props 接收 `difficulty: Difficulty`
- 内部维护难度映射表
- 显示对应中文标签

## 5. 详细实现规格

### 5.1 Header Props 接口

```typescript
type HeaderProps = {
  title?: string           // 游戏标题，默认 "数独游戏"
  timer: number            // 计时器秒数
  errors: number           // 当前错误次数
  maxErrors: number        // 最大错误次数
  difficulty: Difficulty   // 当前难度
}
```

### 5.2 时间格式化函数

```typescript
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
```

### 5.3 难度映射

```typescript
const difficultyLabels: Record<Difficulty, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
}
```

### 5.4 组件样式

```tsx
<div className="flex items-center justify-between w-full">
  {/* 左侧标题 */}
  <div className="flex items-center">
    <i className="ri-game-line text-[32px] text-blue-600" />
    <span className="ml-3 text-[28px] font-bold text-slate-800">{title}</span>
  </div>
  
  {/* 右侧信息 */}
  <div className="flex items-center gap-6">
    {/* 计时器 */}
    <div className="flex items-center">
      <i className="ri-time-line text-xl text-slate-500" />
      <span className="ml-2 text-xl font-semibold text-slate-700">{formatTime(timer)}</span>
    </div>
    
    {/* 错误次数 */}
    <div className="flex items-center">
      <i className="ri-close-circle-line text-xl text-red-500" />
      <span className="ml-2 text-xl font-semibold text-red-500">{errors}/{maxErrors}</span>
    </div>
    
    {/* 难度 */}
    <div className="flex items-center">
      <i className="ri-bar-chart-line text-xl text-purple-600" />
      <span className="ml-2 text-xl font-semibold text-purple-600">{difficultyLabels[difficulty]}</span>
    </div>
  </div>
</div>
```

## 6. App.tsx 集成

### 6.1 需要添加的状态

```typescript
const [timer, setTimer] = useState(0)
const [errors, setErrors] = useState(0)
const maxErrors = 3
```

### 6.2 useTimer 集成

```typescript
const { time, start, stop, reset } = useTimer(!isGameComplete, () => {
  setTimer(prev => prev + 1)
})
```

### 6.3 错误计数更新

在 `handleNumberClick` 中，当填入错误数字时：
```typescript
if (isError) {
  setErrors(prev => prev + 1)
}
```

### 6.4 Header 调用

```tsx
<Header 
  timer={timer}
  errors={errors}
  maxErrors={maxErrors}
  difficulty={difficulty}
/>
```

## 7. 注意事项

### 7.1 高保真还原要点

1. **字体大小精确匹配**:
   - 标题图标: 32px (text-[32px])
   - 标题文字: 28px (text-[28px])
   - 信息图标: 20px (text-xl)
   - 信息文字: 20px (text-xl)

2. **颜色精确匹配**:
   - 标题图标: blue-600 (#2563eb)
   - 标题文字: slate-800 (#1e293b)
   - 计时器图标: slate-500 (#6b7280)
   - 计时器文字: slate-700 (#334155)
   - 错误图标/文字: red-500 (#ef4444)
   - 难度图标/文字: purple-600 (#9333ea)

3. **间距精确匹配**:
   - 标题图标与文字: 12px (ml-3)
   - 信息项之间: 24px (gap-6)
   - 图标与文字: 8px (ml-2)

### 7.2 性能优化

1. 使用 `React.memo` 包装 Header 组件避免不必要的重渲染
2. 使用 `useCallback` 包装 `formatTime` 函数

### 7.3 测试要点

1. 计时器正确格式化 (00:00, 05:23, 120:00 等)
2. 错误次数正确显示和更新
3. 难度标签正确映射
4. 组件在 props 变化时正确更新

## 8. 文件修改清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/components/game/Header/Header.tsx` | 修改 | 重构组件，接入实际状态 |
| `src/App.tsx` | 修改 | 集成计时器和错误计数状态 |
| `tests/unit/components/Header.test.tsx` | 新建 | 添加单元测试 |

## 9. 验收标准

- [ ] 游戏标题正确显示，样式符合原型
- [ ] 计时器实时更新，格式为 MM:SS
- [ ] 错误次数正确显示和更新
- [ ] 难度标签正确映射显示
- [ ] 所有样式与原型高保真一致
- [ ] 单元测试覆盖核心功能
