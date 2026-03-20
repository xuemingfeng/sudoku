# Task 11-14 并行执行分析与实施计划

## 1. 并行执行可行性分析

### 1.1 依赖关系检查

根据 tasks.md 的 Task Dependencies：

| Task | 依赖项 | 依赖状态 | 可执行 |
|------|--------|----------|--------|
| Task 11 | Task 4 | ✅ 已完成 | ✅ |
| Task 12 | Task 6 | ✅ 已完成 | ✅ |
| Task 13 | Task 6 | ✅ 已完成 | ✅ |
| Task 14 | Task 4 | ✅ 已完成 | ✅ |

**结论：所有依赖项已满足，Task 11、12、13、14 可以并行执行。**

### 1.2 任务间资源共享分析

| Task | 共享资源 | 冲突风险 |
|------|----------|----------|
| Task 11 | `src/components/pages/GuidePage/` | 无冲突 |
| Task 12 | `src/components/pages/SuccessPage/` | 无冲突 |
| Task 13 | `src/components/pages/FailurePage/` | 无冲突 |
| Task 14 | `src/components/common/Modal/` | ⚠️ 部分已实现 |

**Task 14 特殊情况：**
- SubTask 14.2 (DifficultyModal) 已在 Task 9 中实现
- SubTask 14.3 (ConfirmModal) 已在 Task 9 中实现
- 仅需创建通用 Modal 基础组件和动画效果

### 1.3 并行执行策略

```
┌─────────────────────────────────────────────────────────────────┐
│                    并行执行计划                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Task 11 (GuidePage)     Task 12 (SuccessPage)                 │
│       ↓                       ↓                                 │
│  ┌─────────┐            ┌─────────┐                            │
│  │ 11.1    │            │ 12.1    │                            │
│  │ 11.2    │            │ 12.2    │                            │
│  │ 11.3    │            │ 12.3    │                            │
│  │ 11.4    │            │ 12.4    │                            │
│  │ 11.5    │            │ 12.5    │                            │
│  │ 11.6    │            │         │                            │
│  └─────────┘            └─────────┘                            │
│                                                                 │
│  Task 13 (FailurePage)   Task 14 (Modal组件)                   │
│       ↓                       ↓                                 │
│  ┌─────────┐            ┌─────────┐                            │
│  │ 13.1    │            │ 14.1    │ ← 创建通用Modal             │
│  │ 13.2    │            │ 14.2    │ ← 已完成(重构)              │
│  │ 13.3    │            │ 14.3    │ ← 已完成(重构)              │
│  │ 13.4    │            │ 14.4    │ ← 添加动画                  │
│  └─────────┘            └─────────┘                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Task 11: 引导页组件 (GuidePage)

### 2.1 需求规格对照 (spec.md 4.1)

| 需求项 | 要求 |
|--------|------|
| 触发条件 | 用户首次访问游戏时自动显示 |
| 步骤指示器 | ● ○ ○ ○ 格式 |
| 引导步骤 | 4步：数独规则、操作方法、高亮功能、功能按钮 |
| 交互行为 | 上一步/下一步/开始游戏/跳过引导 |
| 状态持久化 | localStorage 保存已查看状态 |

### 2.2 SubTask 实施计划

#### SubTask 11.1: 创建引导页容器组件

**文件**: `src/components/pages/GuidePage/GuidePage.tsx`

**Props 接口**:
```typescript
type GuidePageProps = {
  onComplete: () => void
  onSkip: () => void
}
```

**布局结构**:
- 容器: 白色背景, 圆角 32px, 阴影
- 居中显示, 最大宽度 800px

#### SubTask 11.2: 实现引导步骤指示器

**文件**: `src/components/pages/GuidePage/StepIndicator.tsx`

**Props 接口**:
```typescript
type StepIndicatorProps = {
  currentStep: number
  totalSteps: number
}
```

**样式**:
- 当前步骤: 实心圆点 (blue-600)
- 其他步骤: 空心圆点 (slate-300)
- 间距: 12px

#### SubTask 11.3: 实现引导步骤内容

**文件**: `src/components/pages/GuidePage/StepContent.tsx`

**步骤内容**:

| 步骤 | 标题 | 图标 | 内容项 |
|------|------|------|--------|
| 1 | 数独规则 | 📋 | 3条规则说明 |
| 2 | 操作方法 | 👆 | 4条操作说明 |
| 3 | 高亮功能 | ✨ | 4条高亮说明 |
| 4 | 功能按钮 | 🎮 | 5个按钮说明 |

#### SubTask 11.4: 实现导航按钮

**文件**: `src/components/pages/GuidePage/GuideButtons.tsx`

**按钮逻辑**:
- 第一步: 隐藏"上一步"，显示"下一步"
- 中间步骤: 显示"上一步"和"下一步"
- 最后一步: 显示"上一步"和"开始游戏"

#### SubTask 11.5: 实现跳过引导功能

**文件**: `src/components/pages/GuidePage/GuidePage.tsx`

**功能**:
- 底部显示"跳过引导"链接
- 点击后调用 `onSkip` 回调

#### SubTask 11.6: 实现首次访问检测

**文件**: `src/hooks/useFirstVisit.ts`

**功能**:
- 检查 localStorage 中的 `guide_completed` 标记
- 提供设置已完成的方法

### 2.3 高保真样式规格

| 元素 | 规格 |
|------|------|
| 容器 | bg-white, rounded-[32px], shadow-xl |
| 标题 | text-[28px], font-bold, text-slate-800 |
| 步骤指示器 | 圆点 12px, 间距 12px |
| 内容区域 | padding 32px |
| 按钮 | height 48px, rounded-xl |

---

## 3. Task 12: 成功界面组件 (SuccessPage)

### 3.1 需求规格对照 (spec.md 4.3)

| 需求项 | 要求 |
|--------|------|
| 触发条件 | 用户正确完成数独所有格子 |
| 显示内容 | 祝贺信息、游戏统计、最佳记录 |
| 交互行为 | 再来一局、返回主页 |

### 3.2 SubTask 实施计划

#### SubTask 12.1: 创建成功界面容器组件

**文件**: `src/components/pages/SuccessPage/SuccessPage.tsx`

**Props 接口**:
```typescript
type SuccessPageProps = {
  stats: {
    time: number
    errors: number
    hints: number
    difficulty: Difficulty
  }
  bestRecord: number | null
  onPlayAgain: () => void
  onReturnHome: () => void
}
```

#### SubTask 12.2: 实现祝贺信息和动画效果

**文件**: `src/components/pages/SuccessPage/SuccessHeader.tsx`

**内容**:
- 🎉 emoji (大尺寸)
- "恭喜你完成了！" 标题

**动画**:
- 入场动画: fade-in + scale-up
- emoji 旋转动画

#### SubTask 12.3: 实现游戏统计展示

**文件**: `src/components/pages/SuccessPage/GameStats.tsx`

**显示项**:
| 项目 | 图标 | 格式 |
|------|------|------|
| 用时 | ⏱️ | MM:SS |
| 错误 | ❌ | X 次 |
| 提示 | 💡 | X 次 |
| 难度 | 📈 | 中文标签 |

#### SubTask 12.4: 实现最佳记录显示

**文件**: `src/components/pages/SuccessPage/BestRecord.tsx`

**逻辑**:
- 如果当前成绩是最佳: 显示 "🏆 新纪录！"
- 否则显示: "🏆 最佳记录: MM:SS"

#### SubTask 12.5: 实现操作按钮

**文件**: `src/components/pages/SuccessPage/SuccessButtons.tsx`

**按钮**:
- 再来一局: blue-600, 点击显示难度选择
- 返回主页: slate-600, 返回游戏界面

### 3.3 高保真样式规格

| 元素 | 规格 |
|------|------|
| 容器 | bg-white, rounded-[32px], shadow-xl |
| emoji | text-6xl |
| 标题 | text-2xl, font-bold, text-slate-800 |
| 统计项 | flex, gap-4, text-lg |
| 按钮 | height 48px, rounded-xl |

---

## 4. Task 13: 失败界面组件 (FailurePage)

### 4.1 需求规格对照 (spec.md 4.4)

| 需求项 | 要求 |
|--------|------|
| 触发条件 | 错误次数达到上限（默认3次） |
| 显示内容 | 失败提示、游戏统计 |
| 交互行为 | 重新开始、选择难度 |

### 4.2 SubTask 实施计划

#### SubTask 13.1: 创建失败界面容器组件

**文件**: `src/components/pages/FailurePage/FailurePage.tsx`

**Props 接口**:
```typescript
type FailurePageProps = {
  stats: {
    time: number
    errors: number
    hints: number
    difficulty: Difficulty
  }
  maxErrors: number
  onRestart: () => void
  onSelectDifficulty: () => void
}
```

#### SubTask 13.2: 实现失败提示信息

**文件**: `src/components/pages/FailurePage/FailureHeader.tsx`

**内容**:
- 😢 emoji (大尺寸)
- "游戏结束了" 标题
- "错误次数已达上限" 副标题

#### SubTask 13.3: 实现游戏统计展示

**文件**: `src/components/pages/FailurePage/GameStats.tsx`

**显示项**:
| 项目 | 图标 | 格式 |
|------|------|------|
| 用时 | ⏱️ | MM:SS |
| 错误 | ❌ | X 次（已达上限）|
| 提示 | 💡 | X 次 |
| 难度 | 📈 | 中文标签 |

#### SubTask 13.4: 实现操作按钮

**文件**: `src/components/pages/FailurePage/FailureButtons.tsx`

**按钮**:
- 重新开始: blue-600, 相同难度重新开始
- 选择难度: slate-600, 显示难度选择弹窗

### 4.3 高保真样式规格

| 元素 | 规格 |
|------|------|
| 容器 | bg-white, rounded-[32px], shadow-xl |
| emoji | text-6xl |
| 标题 | text-2xl, font-bold, text-slate-800 |
| 错误提示 | text-red-500 |

---

## 5. Task 14: 弹窗组件

### 5.1 当前状态分析

| SubTask | 状态 | 说明 |
|---------|------|------|
| 14.1 Modal 基础组件 | ❌ 未实现 | 需创建通用 Modal |
| 14.2 DifficultyModal | ✅ 已实现 | 在 ControlPanel 中 |
| 14.3 ConfirmModal | ✅ 已实现 | 在 ControlPanel 中 |
| 14.4 弹窗动画效果 | ⚠️ 部分实现 | 需添加入场/退场动画 |

### 5.2 SubTask 实施计划

#### SubTask 14.1: 创建 Modal 基础弹窗组件

**文件**: `src/components/common/Modal/Modal.tsx`

**Props 接口**:
```typescript
type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  showCloseButton?: boolean
  size?: 'sm' | 'md' | 'lg'
}
```

**功能**:
- ESC 键关闭
- 点击背景关闭
- 阻止 body 滚动
- 焦点管理

#### SubTask 14.2-14.3: 重构现有弹窗

**操作**:
- 将 `ControlPanel/DifficultyModal.tsx` 重构为使用通用 Modal
- 将 `ControlPanel/ConfirmModal.tsx` 重构为使用通用 Modal
- 保持现有 API 兼容

#### SubTask 14.4: 实现弹窗动画效果

**动画规格**:
- 入场: fade-in + scale(0.95 → 1)
- 退场: fade-out + scale(1 → 0.95)
- 持续时间: 200ms
- 缓动函数: ease-out

**实现方式**:
- 使用 CSS transition 或 Tailwind animate

---

## 6. 文件结构规划

```
src/components/
├── common/
│   ├── Modal/
│   │   ├── Modal.tsx          # Task 14.1
│   │   └── index.ts
│   └── index.ts               # 更新导出
├── pages/
│   ├── GuidePage/
│   │   ├── GuidePage.tsx      # Task 11.1
│   │   ├── StepIndicator.tsx  # Task 11.2
│   │   ├── StepContent.tsx    # Task 11.3
│   │   ├── GuideButtons.tsx   # Task 11.4
│   │   └── index.ts
│   ├── SuccessPage/
│   │   ├── SuccessPage.tsx    # Task 12.1
│   │   ├── SuccessHeader.tsx  # Task 12.2
│   │   ├── GameStats.tsx      # Task 12.3
│   │   ├── BestRecord.tsx     # Task 12.4
│   │   ├── SuccessButtons.tsx # Task 12.5
│   │   └── index.ts
│   ├── FailurePage/
│   │   ├── FailurePage.tsx    # Task 13.1
│   │   ├── FailureHeader.tsx  # Task 13.2
│   │   ├── GameStats.tsx      # Task 13.3 (可复用 SuccessPage)
│   │   ├── FailureButtons.tsx # Task 13.4
│   │   └── index.ts
│   └── index.ts               # 更新导出

src/hooks/
├── useFirstVisit.ts           # Task 11.6
└── index.ts                   # 更新导出

tests/unit/components/
├── GuidePage.test.tsx         # Task 11 测试
├── SuccessPage.test.tsx       # Task 12 测试
├── FailurePage.test.tsx       # Task 13 测试
└── Modal.test.tsx             # Task 14 测试
```

---

## 7. 注意事项

### 7.1 高保真还原要点

1. **字体和颜色**
   - 使用 SourceHanSans 字体系列
   - 颜色严格遵循设计系统

2. **间距和圆角**
   - 容器圆角: 32px
   - 按钮圆角: 12px
   - 内边距: 32px

3. **动画效果**
   - 使用平滑过渡
   - 避免过度动画

### 7.2 代码复用

1. **GameStats 组件**
   - SuccessPage 和 FailurePage 可共享
   - 通过 props 控制显示差异

2. **Modal 组件**
   - 作为通用基础组件
   - DifficultyModal 和 ConfirmModal 基于它构建

### 7.3 状态管理

1. **引导页状态**
   - 使用 localStorage 持久化
   - 键名: `sudoku_guide_completed`

2. **游戏统计**
   - 从 App.tsx 传递
   - 包含: time, errors, hints, difficulty

### 7.4 测试要点

1. **引导页**
   - 步骤切换正确
   - 跳过功能正常
   - 状态持久化正确

2. **成功/失败页**
   - 统计数据正确显示
   - 按钮功能正常
   - 最佳记录逻辑正确

3. **Modal**
   - ESC 关闭
   - 背景点击关闭
   - 焦点管理正确

---

## 8. 执行顺序建议

虽然可以并行执行，但建议按以下顺序以最大化代码复用：

1. **Task 14** - 先创建通用 Modal 组件
2. **Task 11** - 引导页（独立组件）
3. **Task 12** - 成功页（创建可复用的 GameStats）
4. **Task 13** - 失败页（复用 GameStats）

或者完全并行执行，后续再进行代码重构优化。
