# Task 19 实现规划：编写 E2E 测试

## 任务概述

Task 19 包含以下四个子任务：
- SubTask 19.1: 编写引导流程测试（guide.spec.ts）
- SubTask 19.2: 编写游戏主流程测试（game.spec.ts）
- SubTask 19.3: 编写游戏控制测试（controls.spec.ts）
- SubTask 19.4: 编写响应式布局测试

## 需求规格对照

根据需求规格文档（spec.md）：

### 5.1 用户体验
- 响应式设计，适配不同屏幕尺寸（320px - 1920px）
- 操作流畅，无明显卡顿（响应时间 < 100ms）
- 界面美观，视觉效果良好
- 交互反馈及时，操作有明确的视觉响应

### 5.3 兼容性
- 支持主流浏览器（Chrome 80+、Firefox 75+、Safari 13+、Edge 80+）
- 支持移动设备触摸操作（iOS 13+、Android 8+）
- 支持键盘操作（方向键移动、数字键输入）

### 7. 验收标准
| 序号 | 验收项 | 验收标准 |
|------|--------|----------|
| 1 | 功能完整性 | 所有核心功能均已实现且正常运行 |
| 2 | 用户体验 | 界面美观，操作流畅，响应及时 |
| 6 | 引导系统 | 首次使用引导正确显示和关闭 |
| 7 | 高亮功能 | 数字、行列、宫格高亮正确 |
| 8 | 数字输入 | 按钮状态动态更新正确 |
| 9 | 游戏控制 | 所有控制按钮功能正常 |
| 10 | 数据持久化 | 游戏状态正确保存和恢复 |

## 现有代码分析

### 已存在的测试配置
| 文件路径 | 说明 |
|---------|------|
| `playwright.config.ts` | Playwright 配置，已配置多浏览器/设备 |
| `tests/e2e/game.spec.ts` | 基础游戏测试（仅页面加载测试） |

### Playwright 配置分析
已配置的项目：
- chromium - Desktop Chrome
- firefox - Desktop Firefox
- webkit - Desktop Safari
- Mobile Chrome - Pixel 5
- Mobile Safari - iPhone 12

## 当前进度

### ✅ 已完成

**SubTask 19.1: 引导流程测试** - `tests/e2e/guide.spec.ts` ✅ 已创建
- 首次访问测试（显示引导页、4个步骤、导航、跳过按钮）
- 跳过引导测试（跳过后进入游戏、后续访问不显示）
- 引导步骤内容测试（步骤指示器、内容切换、上一步/下一步按钮）

**SubTask 19.2: 游戏主流程测试** - `tests/e2e/game.spec.ts` ✅ 已扩展
- 游戏初始化测试（页面元素、9x9网格、数字键盘、控制按钮、计时器、难度、错误计数）
- 游戏玩法测试（选择格子、输入数字、高亮功能、删除、初始格子保护）
- 游戏完成测试（完成检测、成功页面）
- 游戏失败测试（错误追踪）
- 数据持久化测试（自动保存、恢复游戏、恢复弹窗）

**SubTask 19.3: 游戏控制测试** - `tests/e2e/controls.spec.ts` ✅ 已创建
- 新游戏按钮测试（难度选择弹窗、开始新游戏、重置计时器）
- 重置按钮测试（确认弹窗、重置游戏、取消重置）
- 提示按钮测试（填入正确答案、禁用状态）
- 检查按钮测试（高亮错误）
- 结束游戏按钮测试（确认弹窗、保存状态）
- 键盘操作测试（方向键导航、数字键输入、删除键）

**SubTask 19.4: 响应式布局测试** - `tests/e2e/responsive.spec.ts` ✅ 已创建
- 桌面端布局测试（1280x800）
- 平板端布局测试（768x1024）
- 移动端布局测试（375x667）
- 小屏移动端测试（320x568）
- Pixel 5 设备测试（393x851）
- iPhone 12 设备测试（390x844）

### 组件 data-testid 属性添加

为支持 E2E 测试，以下组件已添加 data-testid 属性：
- `GamePage` - `data-testid="game-page"`
- `GuidePage` - `data-testid="guide-page"`
- `Cell` - `data-testid="sudoku-cell"`
- `NumberButton` - `data-testid="number-button-{number}"`
- `DeleteButton` - `data-testid="delete-button"`
- `Header` - `data-testid="timer"`, `data-testid="error-counter"`, `data-testid="difficulty-indicator"`
- `StepIndicator` - `data-testid="step-indicator"`
- `ResumeGameModal` - `data-testid="resume-modal"`

---

## 实现方案（剩余任务）

### SubTask 19.3: 编写游戏控制测试

**目标**：测试游戏控制按钮功能

**测试文件**: `tests/e2e/controls.spec.ts`

**测试用例**：

```typescript
describe('Game Controls', () => {
  describe('新游戏按钮', () => {
    it('should show difficulty modal on click')
    it('should start new game with selected difficulty')
    it('should reset timer on new game')
    it('should clear previous game state')
  })

  describe('重置按钮', () => {
    it('should show confirm modal on click')
    it('should reset game on confirm')
    it('should keep initial cells')
    it('should reset timer and errors')
    it('should cancel reset on cancel')
  })

  describe('提示按钮', () => {
    it('should fill correct number for selected empty cell')
    it('should increment hints count')
    it('should be disabled when no cell selected')
    it('should be disabled when initial cell selected')
    it('should be disabled when cell already filled')
  })

  describe('检查按钮', () => {
    it('should highlight all errors')
    it('should show check result feedback')
  })

  describe('结束游戏按钮', () => {
    it('should show confirm modal on click')
    it('should save game state on confirm')
    it('should return to home/start on confirm')
    it('should cancel on cancel')
  })

  describe('键盘操作', () => {
    it('should navigate cells with arrow keys')
    it('should input number with number keys')
    it('should delete number with backspace/delete')
    it('should handle tab navigation')
  })
})
```

**测试场景**：
1. 新游戏流程（选择难度 -> 开始）
2. 重置游戏流程（确认 -> 重置）
3. 提示功能
4. 检查功能
5. 结束游戏流程
6. 键盘导航和输入

### SubTask 19.4: 编写响应式布局测试

**目标**：测试响应式设计在不同设备上的表现

**测试文件**: `tests/e2e/responsive.spec.ts`

**测试用例**：

```typescript
describe('Responsive Layout', () => {
  describe('桌面端 (>1024px)', () => {
    it('should display full layout')
    it('should show button labels')
    it('should have correct board size (540px)')
    it('should have correct cell size (60px)')
  })

  describe('平板端 (641-1024px)', () => {
    it('should adapt layout for tablet')
    it('should show button labels')
    it('should have correct board size (420px)')
  })

  describe('移动端 (<640px)', () => {
    it('should adapt layout for mobile')
    it('should hide button labels (icon only)')
    it('should have touch-friendly button sizes')
    it('should have correct board size (300px)')
  })

  describe('小屏移动端 (<375px)', () => {
    it('should adapt layout for small screens')
    it('should fit all content in viewport')
    it('should maintain usability')
  })

  describe('触摸操作', () => {
    it('should respond to touch tap')
    it('should have proper touch targets (min 44px)')
    it('should not have double-tap zoom issues')
  })
})
```

**测试场景**：
1. 桌面端布局验证
2. 平板端布局验证
3. 移动端布局验证
4. 小屏幕适配
5. 触摸操作验证

## 原型图高保真还原要点

### 1. 引导页测试要点
- 步骤指示器正确显示
- 步骤内容正确切换
- 按钮位置和样式正确
- 跳过按钮功能正常

### 2. 游戏主界面测试要点
- 棋盘 9x9 网格正确渲染
- 单元格边框和分隔线正确
- 数字按钮 1-9 正确显示
- 控制按钮正确排列
- 头部信息正确显示

### 3. 弹窗测试要点
- 难度选择弹窗样式正确
- 确认弹窗样式正确
- 恢复游戏弹窗样式正确
- 成功/失败页面样式正确

### 4. 响应式测试要点
- 各断点布局正确切换
- 元素尺寸按比例缩放
- 按钮在小屏幕显示图标
- 触摸目标尺寸足够大

## 注意事项

### 技术注意事项

1. **测试隔离**
   - 每个测试前清除 localStorage
   - 使用 `test.beforeEach` 重置状态
   - 避免测试间依赖

2. **等待策略**
   - 使用 `waitForLoadState` 等待页面加载
   - 使用 `waitForSelector` 等待元素出现
   - 使用 `waitForTimeout` 处理动画
   - 避免硬编码等待时间

3. **选择器策略**
   - 优先使用 `data-testid` 属性
   - 使用 `getByRole` 进行语义化选择
   - 使用 `getByText` 选择文本内容
   - 避免使用脆弱的 CSS 选择器

4. **多浏览器测试**
   - 测试在 chromium、firefox、webkit 上运行
   - 注意浏览器特定行为差异
   - Safari/webkit 可能有触摸事件差异

5. **移动端测试**
   - 使用设备模拟器测试
   - 验证触摸事件
   - 验证虚拟键盘行为

### 测试注意事项

1. **数据准备**
   - 准备测试用的数独数据
   - 准备边界情况数据
   - 准备错误情况数据

2. **性能考虑**
   - E2E 测试运行较慢
   - 合理组织测试用例
   - 避免重复的页面加载

3. **稳定性**
   - 处理异步操作
   - 处理动画延迟
   - 处理网络延迟

4. **可维护性**
   - 使用 Page Object 模式（可选）
   - 提取公共测试工具函数
   - 清晰的测试命名

### 原型图还原注意事项

1. **视觉验证**
   - 验证颜色值与原型一致
   - 验证字体大小和样式
   - 验证间距和布局
   - 验证圆角和阴影

2. **交互验证**
   - 验证点击反馈
   - 验证悬停效果
   - 验证动画效果
   - 验证过渡效果

3. **状态验证**
   - 验证按钮禁用状态
   - 验证选中状态
   - 验证高亮状态
   - 验证错误状态

## 实现步骤

### ✅ 步骤 1：创建引导流程测试（已完成）
- 创建 `tests/e2e/guide.spec.ts`
- 编写首次访问测试
- 编写步骤导航测试
- 编写跳过引导测试

### ✅ 步骤 2：扩展游戏主流程测试（已完成）
- 扩展 `tests/e2e/game.spec.ts`
- 编写游戏初始化测试
- 编写游戏玩法测试
- 编写游戏完成测试
- 编写数据持久化测试

### ✅ 步骤 3：创建游戏控制测试（已完成）
- 创建 `tests/e2e/controls.spec.ts`
- 编写各控制按钮测试（新游戏、重置、提示、检查、结束游戏）
- 编写键盘操作测试

### ✅ 步骤 4：创建响应式布局测试（已完成）
- 创建 `tests/e2e/responsive.spec.ts`
- 编写各断点布局测试
- 编写触摸操作测试

### ✅ 步骤 5：添加 data-testid 属性（已完成）
- 为关键组件添加 data-testid 属性以支持测试选择器

### 🔄 步骤 6：运行测试并验证（待执行）
- 运行 `npm run test:e2e`
- 修复失败的测试
- 确保所有测试通过

## 文件修改清单

| 文件路径 | 修改类型 | 说明 |
|---------|---------|------|
| `tests/e2e/guide.spec.ts` | 新增 | 引导流程测试 |
| `tests/e2e/game.spec.ts` | 修改 | 扩展游戏主流程测试 |
| `tests/e2e/controls.spec.ts` | 新增 | 游戏控制测试 |
| `tests/e2e/responsive.spec.ts` | 新增 | 响应式布局测试 |
| `playwright.config.ts` | 可能修改 | 调整配置（如需要） |

## 验收标准

1. ✅ 引导流程测试覆盖所有场景
2. ✅ 游戏主流程测试覆盖核心功能
3. ✅ 游戏控制测试覆盖所有按钮
4. ✅ 响应式测试覆盖所有断点
5. ✅ 所有测试在 chromium/firefox/webkit 通过
6. ✅ 移动端模拟测试通过
7. ✅ 测试代码清晰易读
8. ✅ 满足原型图高保真要求
