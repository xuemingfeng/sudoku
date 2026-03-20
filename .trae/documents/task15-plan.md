# Task 15 实现计划：页面路由和导航

## 1. 任务概述

### 1.1 任务内容

根据 tasks.md，Task 15 包含以下子任务：

| 子任务 | 内容 |
|--------|------|
| SubTask 15.1 | 配置页面路由（引导页、游戏页、成功页、失败页） |
| SubTask 15.2 | 实现页面间导航逻辑 |
| SubTask 15.3 | 实现页面切换动画 |
| SubTask 15.4 | 实现页面状态管理 |

### 1.2 依赖关系

- Task 15 依赖 Task 11, Task 12, Task 13, Task 14
- 所有依赖任务已完成，可以开始执行

### 1.3 已有资源

| 资源 | 状态 |
|------|------|
| GuidePage 组件 | ✅ 已完成 |
| SuccessPage 组件 | ✅ 已完成 |
| FailurePage 组件 | ✅ 已完成 |
| Modal 组件 | ✅ 已完成 |
| useFirstVisit Hook | ✅ 已完成 |
| GameContext | ✅ 已完成 |
| App.tsx（游戏主逻辑） | ✅ 已完成 |

## 2. 需求规格文档要求

### 2.1 页面关系图

```
┌─────────────┐     首次访问      ┌─────────────┐
│   引导页    │ ───────────────→ │  游戏界面   │
└─────────────┘                  └──────┬──────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    ↓                   ↓                   ↓
            ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
            │  成功界面   │     │  失败界面   │     │  难度选择   │
            └─────────────┘     └─────────────┘     └─────────────┘
                    │                   │                   │
                    └───────────────────┴───────────────────┘
                                        │
                                        ↓
                                ┌─────────────┐
                                │  游戏界面   │
                                └─────────────┘
```

### 2.2 页面触发条件

| 页面 | 触发条件 |
|------|----------|
| 引导页 | 用户首次访问游戏时自动显示 |
| 游戏界面 | 引导页结束或跳过后进入，或从其他页面返回 |
| 成功界面 | 用户正确完成数独所有格子 |
| 失败界面 | 错误次数达到上限（默认3次） |

### 2.3 页面交互行为

| 页面 | 交互行为 |
|------|----------|
| 引导页 | 点击"开始游戏"或"跳过"进入游戏界面 |
| 成功界面 | 点击"再来一局"显示难度选择，点击"返回主页"返回游戏界面 |
| 失败界面 | 点击"重新开始"以相同难度重新开始，点击"选择难度"显示难度选择弹窗 |

## 3. 技术方案

### 3.1 路由方案选择

**方案分析：**

| 方案 | 优点 | 缺点 |
|------|------|------|
| React Router | 功能完整，支持浏览器历史记录 | 需要额外依赖，对于单页应用可能过重 |
| 状态管理路由 | 轻量，无额外依赖，适合简单页面切换 | 不支持浏览器历史记录 |

**决策：采用状态管理路由**

理由：
1. 项目页面数量少（4个主要页面）
2. 不需要浏览器历史记录功能
3. 保持项目轻量化
4. 已有 GameContext 可扩展管理页面状态

### 3.2 页面状态定义

```typescript
type PageRoute = 'guide' | 'game' | 'success' | 'failure'

type PageState = {
  currentRoute: PageRoute
  previousRoute: PageRoute | null
  isTransitioning: boolean
}
```

### 3.3 页面切换动画

使用 CSS 动画实现页面切换效果：

```css
/* 页面进入动画 */
@keyframes page-enter {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 页面退出动画 */
@keyframes page-exit {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-20px);
  }
}
```

## 4. 实现步骤

### Step 1: 创建页面路由类型定义

**文件**: `src/types/navigation.ts`

定义页面路由类型和导航状态类型。

### Step 2: 创建导航 Context

**文件**: `src/context/NavigationContext.tsx`

创建 NavigationContext 管理页面状态：
- currentRoute: 当前页面路由
- navigateTo: 导航函数
- goBack: 返回上一页函数

### Step 3: 创建 GamePage 组件

**文件**: `src/components/pages/GamePage/GamePage.tsx`

将 App.tsx 中的游戏逻辑封装为 GamePage 组件：
- 包含 Header、ControlPanel、SudokuBoard、NumberPad
- 接收导航回调函数作为 props
- 处理游戏完成和游戏失败的导航

### Step 4: 创建 AppRouter 组件

**文件**: `src/components/AppRouter.tsx`

创建路由组件：
- 根据 currentRoute 渲染对应页面
- 处理页面切换动画
- 管理页面过渡状态

### Step 5: 更新 App.tsx

**文件**: `src/App.tsx`

重构 App.tsx：
- 使用 NavigationProvider 包裹应用
- 使用 GameProvider 包裹应用
- 渲染 AppRouter 组件

### Step 6: 添加页面切换动画样式

**文件**: `src/index.css`

添加页面切换动画 CSS 类。

### Step 7: 更新页面组件

更新 GuidePage、SuccessPage、FailurePage 组件：
- 使用 NavigationContext 进行导航
- 确保导航回调正确触发

## 5. 文件变更清单

| 操作 | 文件路径 | 说明 |
|------|----------|------|
| 新建 | `src/types/navigation.ts` | 导航类型定义 |
| 新建 | `src/context/NavigationContext.tsx` | 导航 Context |
| 新建 | `src/components/pages/GamePage/GamePage.tsx` | 游戏页面组件 |
| 新建 | `src/components/pages/GamePage/index.ts` | 导出文件 |
| 新建 | `src/components/AppRouter.tsx` | 路由组件 |
| 修改 | `src/App.tsx` | 重构为使用路由系统 |
| 修改 | `src/index.css` | 添加页面切换动画 |
| 修改 | `src/components/pages/index.ts` | 导出 GamePage |
| 修改 | `src/context/index.ts` | 导出 NavigationContext |
| 修改 | `src/types/index.ts` | 导出导航类型 |

## 6. 注意事项

### 6.1 高保真还原要求

- 页面切换动画需与原型设计一致
- 确保页面切换流畅，无闪烁
- 动画时长控制在合理范围（200-300ms）

### 6.2 状态管理注意事项

- 导航状态与游戏状态分离
- 页面切换时正确保存/恢复游戏状态
- 首次访问检测在应用初始化时完成

### 6.3 性能注意事项

- 使用 React.memo 避免不必要的重渲染
- 页面切换时暂停计时器
- 使用 CSS 动画而非 JS 动画提高性能

### 6.4 用户体验注意事项

- 页面切换时有明确的视觉反馈
- 防止快速连续点击导致的多次导航
- 确保页面切换动画完成后才允许下一次导航

### 6.5 兼容性注意事项

- 确保页面切换动画在各浏览器中表现一致
- 移动端触摸操作不影响页面切换
- 考虑低端设备的动画性能

## 7. 验收标准

| 序号 | 验收项 | 验收标准 |
|------|--------|----------|
| 1 | 首次访问 | 首次访问用户能看到引导页 |
| 2 | 引导页导航 | 点击"开始游戏"或"跳过"正确进入游戏界面 |
| 3 | 游戏完成 | 正确完成数独后显示成功界面 |
| 4 | 游戏失败 | 错误次数达到上限后显示失败界面 |
| 5 | 成功界面导航 | "再来一局"和"返回主页"功能正常 |
| 6 | 失败界面导航 | "重新开始"和"选择难度"功能正常 |
| 7 | 页面切换动画 | 页面切换动画流畅，无闪烁 |
| 8 | 状态持久化 | 页面切换后游戏状态正确保持 |
| 9 | 性能要求 | 页面切换响应时间 < 100ms |
| 10 | 测试通过 | 所有单元测试通过 |

## 8. 风险评估

| 风险项 | 风险等级 | 应对措施 |
|--------|----------|----------|
| 状态管理复杂度 | 中 | 使用独立的 NavigationContext，与 GameContext 分离 |
| 动画性能 | 低 | 使用 CSS 动画，避免 JS 动画 |
| 页面切换时机 | 中 | 明确定义各页面的进入和退出条件 |
