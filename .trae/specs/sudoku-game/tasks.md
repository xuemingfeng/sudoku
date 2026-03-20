# Tasks

## Phase 1: 项目初始化与基础架构

- [x] Task 1: 初始化 React 项目
  - [x] SubTask 1.1: 使用 Vite 创建 React 项目
  - [x] SubTask 1.2: 配置 Tailwind CSS
  - [x] SubTask 1.3: 配置项目目录结构
  - [x] SubTask 1.4: 设置 ESLint 和 Prettier
  - [x] SubTask 1.5: 配置路径别名（@/ 指向 src/）

- [x] Task 2: 配置测试框架
  - [x] SubTask 2.1: 安装 Vitest 和相关依赖（@vitest/ui, @testing-library/react, jsdom）
  - [x] SubTask 2.2: 创建 vitest.config.ts 配置文件
  - [x] SubTask 2.3: 创建测试设置文件 tests/setup.ts
  - [x] SubTask 2.4: 安装 Playwright 和相关依赖
  - [x] SubTask 2.5: 创建 playwright.config.ts 配置文件
  - [x] SubTask 2.6: 配置 package.json 测试脚本命令

- [x] Task 3: 配置全局样式和主题
  - [x] SubTask 3.1: 引入 SourceHanSans（思源黑体）字体
  - [x] SubTask 3.2: 引入 RemixIcon 图标字体库
  - [x] SubTask 3.3: 配置 Tailwind CSS 自定义主题（颜色、渐变、阴影、圆角）
  - [x] SubTask 3.4: 创建全局 CSS 样式文件（背景渐变、基础样式）
  - [x] SubTask 3.5: 定义设计系统变量（主色调、按钮颜色、状态颜色）

- [x] Task 4: 创建基础组件结构
  - [x] SubTask 4.1: 创建 App 根组件
  - [x] SubTask 4.2: 创建 GameContainer 游戏容器组件
  - [x] SubTask 4.3: 创建 Header 头部组件
  - [x] SubTask 4.4: 创建 SudokuBoard 数独棋盘组件
  - [x] SubTask 4.5: 创建 NumberPad 数字输入组件
  - [x] SubTask 4.6: 创建 ControlPanel 控制面板组件

## Phase 2: 数独核心功能

- [x] Task 5: 实现数独生成算法
  - [x] SubTask 5.1: 实现数独生成器（回溯法）
  - [x] SubTask 5.2: 实现难度控制逻辑
  - [x] SubTask 5.3: 实现数独验证算法
  - [x] SubTask 5.4: 编写算法单元测试（sudokuGenerator.test.ts, sudokuValidator.test.ts）

- [x] Task 6: 实现游戏状态管理
  - [x] SubTask 6.1: 创建 GameContext 上下文
  - [x] SubTask 6.2: 实现游戏状态 Reducer
  - [x] SubTask 6.3: 实现游戏状态持久化（localStorage）
  - [x] SubTask 6.4: 实现计时器功能

## Phase 3: UI 组件开发

- [x] Task 7: 实现数独棋盘组件
  - [x] SubTask 7.1: 实现 9x9 网格布局
  - [x] SubTask 7.2: 实现格子组件
  - [x] SubTask 7.3: 实现行列宫格高亮功能
  - [x] SubTask 7.4: 实现相同数字高亮功能
  - [x] SubTask 7.5: 实现冲突提示功能

- [x] Task 8: 实现数字输入组件
  - [x] SubTask 8.1: 实现数字按钮布局（1-9）
  - [x] SubTask 8.2: 实现剩余数量显示
  - [x] SubTask 8.3: 实现按钮动态禁用逻辑
  - [x] SubTask 8.4: 实现删除按钮功能

- [x] Task 9: 实现控制面板组件
  - [x] SubTask 9.1: 实现新游戏按钮和难度选择
  - [x] SubTask 9.2: 实现重置按钮
  - [x] SubTask 9.3: 实现提示按钮
  - [x] SubTask 9.4: 实现检查按钮
  - [x] SubTask 9.5: 实现结束游戏按钮

- [x] Task 10: 实现头部信息组件
  - [x] SubTask 10.1: 实现游戏标题显示
  - [x] SubTask 10.2: 实现计时器显示
  - [x] SubTask 10.3: 实现错误次数显示
  - [x] SubTask 10.4: 实现当前难度显示

## Phase 4: 页面组件开发

- [x] Task 11: 实现引导页组件（GuidePage）
  - [x] SubTask 11.1: 创建引导页容器组件
  - [x] SubTask 11.2: 实现引导步骤指示器
  - [x] SubTask 11.3: 实现引导步骤内容（规则、操作、高亮、按钮）
  - [x] SubTask 11.4: 实现上一步/下一步/开始游戏按钮
  - [x] SubTask 11.5: 实现跳过引导功能
  - [x] SubTask 11.6: 实现首次访问检测和状态持久化

- [x] Task 12: 实现成功界面组件（SuccessPage）
  - [x] SubTask 12.1: 创建成功界面容器组件
  - [x] SubTask 12.2: 实现祝贺信息和动画效果
  - [x] SubTask 12.3: 实现游戏统计展示（用时、错误、提示、难度）
  - [x] SubTask 12.4: 实现最佳记录显示
  - [x] SubTask 12.5: 实现再来一局和返回主页按钮

- [x] Task 13: 实现失败界面组件（FailurePage）
  - [x] SubTask 13.1: 创建失败界面容器组件
  - [x] SubTask 13.2: 实现失败提示信息
  - [x] SubTask 13.3: 实现游戏统计展示
  - [x] SubTask 13.4: 实现重新开始和选择难度按钮

- [x] Task 14: 实现弹窗组件
  - [x] SubTask 14.1: 创建 Modal 基础弹窗组件
  - [x] SubTask 14.2: 实现难度选择弹窗（DifficultyModal）
  - [x] SubTask 14.3: 实现确认弹窗（ConfirmModal）
  - [x] SubTask 14.4: 实现弹窗动画效果

## Phase 5: 路由与页面导航

- [x] Task 15: 实现页面路由和导航
  - [x] SubTask 15.1: 配置页面路由（引导页、游戏页、成功页、失败页）
  - [x] SubTask 15.2: 实现页面间导航逻辑
  - [x] SubTask 15.3: 实现页面切换动画
  - [x] SubTask 15.4: 实现页面状态管理

## Phase 6: 辅助功能

- [x] Task 16: 实现游戏辅助功能
  - [x] SubTask 16.1: 实现游戏自动保存
  - [x] SubTask 16.2: 实现游戏恢复功能
  - [x] SubTask 16.3: 实现历史记录功能
  - [x] SubTask 16.4: 实现游戏完成检测

## Phase 7: 样式与响应式

- [x] Task 17: 实现响应式设计和主题
  - [x] SubTask 17.1: 实现响应式布局适配
  - [x] SubTask 17.2: 实现渐变色背景和阴影效果
  - [x] SubTask 17.3: 实现动画效果
  - [x] SubTask 17.4: 实现触摸友好的按钮尺寸

## Phase 8: 测试与优化

- [x] Task 18: 编写单元测试
  - [x] SubTask 18.1: 编写 hooks 单元测试（useGame.test.ts, useTimer.test.ts）
  - [x] SubTask 18.2: 编写 utils 单元测试（storage.test.ts, format.test.ts）
  - [x] SubTask 18.3: 编写组件单元测试（SudokuBoard, NumberPad, ControlPanel）
  - [x] SubTask 18.4: 生成测试覆盖率报告

- [x] Task 19: 编写 E2E 测试
  - [x] SubTask 19.1: 编写引导流程测试（guide.spec.ts）
  - [x] SubTask 19.2: 编写游戏主流程测试（game.spec.ts）
  - [x] SubTask 19.3: 编写游戏控制测试（controls.spec.ts）
  - [x] SubTask 19.4: 编写响应式布局测试

- [ ] Task 20: 优化与验收
  - [ ] SubTask 20.1: 进行跨浏览器兼容性测试
  - [ ] SubTask 20.2: 进行移动设备测试
  - [ ] SubTask 20.3: 性能优化（加载时间、响应速度）
  - [ ] SubTask 20.4: 最终验收测试

# Task Dependencies

- Task 2 depends on Task 1
- Task 3 depends on Task 1
- Task 4 depends on Task 1, Task 2, Task 3
- Task 5 depends on Task 1
- Task 6 depends on Task 5
- Task 7 depends on Task 4, Task 6
- Task 8 depends on Task 4, Task 6
- Task 9 depends on Task 4, Task 6
- Task 10 depends on Task 4, Task 6
- Task 11 depends on Task 4
- Task 12 depends on Task 6
- Task 13 depends on Task 6
- Task 14 depends on Task 4
- Task 15 depends on Task 11, Task 12, Task 13, Task 14
- Task 16 depends on Task 6
- Task 17 depends on Task 7, Task 8, Task 9, Task 10, Task 11, Task 12, Task 13, Task 14
- Task 18 depends on Task 6, Task 7, Task 8, Task 9, Task 10
- Task 19 depends on Task 15, Task 17
- Task 20 depends on Task 18, Task 19

# Parallel Execution Opportunities

以下任务可以并行执行：
- Task 2, Task 3, Task 5 可以并行
- Task 4 依赖 Task 2, Task 3，可与其他任务并行
- Task 7, Task 8, Task 9, Task 10 可以并行
- Task 11, Task 12, Task 13, Task 14 可以并行
- Task 18, Task 19 可以并行
