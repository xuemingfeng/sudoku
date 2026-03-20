# Task 16 实现规划：游戏辅助功能

## 任务概述

Task 16 包含以下四个子任务：
- SubTask 16.1: 实现游戏自动保存
- SubTask 16.2: 实现游戏恢复功能
- SubTask 16.3: 实现历史记录功能
- SubTask 16.4: 实现游戏完成检测

## 需求规格对照

根据需求规格文档（spec.md）2.2 辅助功能章节：

### 2.2.3 保存游戏
- 自动保存当前游戏状态到本地存储
- 支持后续继续游戏
- 保存内容包括：当前棋盘状态、用时、错误次数、难度

### 2.2.4 历史记录
- 记录用户游戏历史
- 显示最佳成绩（最短用时）
- 按难度分类记录

## 现有代码分析

### 已实现的功能
1. **storage.ts** 已有完整的存储函数：
   - `saveGameState()` / `loadGameState()` / `clearGameState()`
   - `saveBestRecord()` / `getBestRecord()` / `getBestRecords()`
   - `saveGameHistory()` / `getGameHistory()`
   
2. **GameContext.tsx** 有基本的状态管理框架

3. **gameReducer.ts** 有 `LOAD_GAME` action

### 需要修复/增强的问题
1. **GamePage 组件未使用 GameContext**：当前 GamePage 自己管理所有状态，未与 GameContext 集成
2. **缺少游戏恢复 UI**：没有检测和恢复保存游戏的界面
3. **历史记录未完整集成**：`saveGameHistory` 未在游戏完成时正确调用
4. **缺少提示次数持久化**：GameState 类型中没有 hints 字段

## 实现方案

### SubTask 16.1: 实现游戏自动保存

**目标**：在游戏进行中自动保存状态，确保用户关闭页面后可以恢复

**修改内容**：

1. **扩展 GameState 类型** (`src/types/game.ts`)
   ```typescript
   export type GameState = {
     board: CellState[][]
     difficulty: Difficulty
     timer: number
     errors: number
     maxErrors: number
     isComplete: boolean
     isPaused: boolean
     hints: number          // 新增：提示次数
     solution: (number | null)[][]  // 新增：答案（用于恢复后验证）
   }
   ```

2. **重构 GamePage 组件**
   - 移除 GamePage 内部的状态管理
   - 使用 GameContext 提供的状态和 dispatch
   - 在每次状态变更时自动触发保存

3. **增强 GameContext** (`src/context/GameContext.tsx`)
   - 添加自动保存的防抖处理（避免频繁写入）
   - 确保在游戏进行中持续保存

### SubTask 16.2: 实现游戏恢复功能

**目标**：在用户重新打开应用时，检测是否有未完成的游戏并提供恢复选项

**新增组件**：

1. **ResumeGameModal** (`src/components/game/ControlPanel/ResumeGameModal.tsx`)
   - 弹窗询问用户是否恢复上次游戏
   - 显示上次游戏信息（难度、用时、错误次数）
   - 提供"恢复游戏"和"开始新游戏"选项

**修改内容**：

1. **AppRouter.tsx**
   - 在进入游戏页面前检测是否有保存的游戏状态
   - 如果有，显示 ResumeGameModal

2. **storage.ts**
   - 添加 `hasSavedGame()` 函数检测是否有保存的游戏

### SubTask 16.3: 实现历史记录功能

**目标**：记录并展示用户的游戏历史

**修改内容**：

1. **GamePage.tsx / AppRouter.tsx**
   - 在游戏成功完成时调用 `saveGameHistory()`
   - 记录完整信息：难度、用时、错误次数、提示次数、日期

2. **SuccessPage.tsx**
   - 已有最佳记录显示，确保正确获取和显示

**注意**：历史记录列表展示功能可作为后续扩展，当前任务确保数据正确记录即可

### SubTask 16.4: 实现游戏完成检测

**目标**：准确检测游戏完成状态

**现有实现分析**：
- `sudokuValidator.ts` 中的 `isSudokuComplete()` 已实现正确逻辑
- GamePage 中的 `checkGameComplete()` 函数存在逻辑问题

**修改内容**：

1. **修复 GamePage 中的完成检测逻辑**
   ```typescript
   // 当前逻辑：检查所有格子是否有值且无错误
   // 正确逻辑：使用 isSudokuComplete() 验证
   ```

2. **确保在以下时机检测游戏完成**：
   - 用户填入数字后
   - 使用提示填入后

## 原型图高保真还原要点

根据原型设计，需要确保：

1. **恢复游戏弹窗样式**
   - 参考 ConfirmModal 的设计风格
   - 圆角：32px
   - 阴影：shadow-xl
   - 动画：animate-scale-in

2. **成功页面统计信息**
   - 用时、错误、提示、难度显示
   - 最佳记录显示
   - 按钮样式一致

## 注意事项

### 技术注意事项

1. **状态同步问题**
   - GamePage 当前使用本地状态，需要迁移到 GameContext
   - 确保状态变更后立即保存

2. **防抖处理**
   - 自动保存应使用防抖，避免频繁写入 localStorage
   - 建议延迟 500ms-1000ms

3. **数据完整性**
   - 保存时需要包含 solution（答案），否则恢复后无法验证
   - 考虑 localStorage 容量限制（通常 5-10MB）

4. **类型安全**
   - 所有新增字段需要更新类型定义
   - 避免使用 any

### 用户体验注意事项

1. **恢复游戏弹窗时机**
   - 仅在首次进入游戏页面时显示
   - 如果用户选择"开始新游戏"，清除保存的状态

2. **保存失败处理**
   - localStorage 可能不可用（隐私模式、容量满）
   - 需要优雅降级，不影响游戏体验

3. **游戏完成后的处理**
   - 清除保存的游戏状态
   - 保存最佳记录
   - 记录历史

### 测试注意事项

1. **单元测试**
   - 测试 `hasSavedGame()` 函数
   - 测试自动保存逻辑
   - 测试游戏完成检测

2. **集成测试**
   - 测试完整的保存-恢复流程
   - 测试游戏完成后的状态清理

## 实现步骤

### 步骤 1：扩展类型定义
- 更新 `GameState` 类型，添加 `hints` 和 `solution` 字段
- 更新 `gameReducer` 的初始状态和相关 action

### 步骤 2：重构 GamePage 组件
- 移除本地状态管理
- 使用 GameContext 提供的状态
- 实现自动保存逻辑

### 步骤 3：实现游戏恢复功能
- 创建 `ResumeGameModal` 组件
- 在 `AppRouter` 中添加恢复逻辑
- 添加 `hasSavedGame()` 工具函数

### 步骤 4：完善历史记录功能
- 确保游戏完成时正确保存历史
- 验证最佳记录保存逻辑

### 步骤 5：修复游戏完成检测
- 使用 `isSudokuComplete()` 替代当前逻辑
- 确保在正确时机触发检测

### 步骤 6：测试验证
- 运行 lint 和类型检查
- 手动测试保存-恢复流程
- 测试游戏完成检测

## 文件修改清单

| 文件路径 | 修改类型 | 说明 |
|---------|---------|------|
| `src/types/game.ts` | 修改 | 扩展 GameState 类型 |
| `src/context/gameReducer.ts` | 修改 | 更新初始状态和 action |
| `src/context/GameContext.tsx` | 修改 | 添加防抖保存逻辑 |
| `src/hooks/useGame.ts` | 修改 | 添加 hints 管理 |
| `src/utils/storage.ts` | 修改 | 添加 hasSavedGame 函数 |
| `src/components/game/ControlPanel/ResumeGameModal.tsx` | 新增 | 恢复游戏弹窗组件 |
| `src/components/game/ControlPanel/index.ts` | 修改 | 导出新组件 |
| `src/components/pages/GamePage/GamePage.tsx` | 重构 | 使用 GameContext |
| `src/components/AppRouter.tsx` | 修改 | 添加恢复游戏逻辑 |
| `src/constants/game.ts` | 修改 | 添加防抖常量 |

## 验收标准

1. ✅ 游戏进行中自动保存状态到 localStorage
2. ✅ 关闭页面后重新打开，可以恢复上次游戏
3. ✅ 恢复游戏时显示上次游戏信息
4. ✅ 游戏完成后正确记录历史
5. ✅ 最佳记录正确保存和显示
6. ✅ 游戏完成检测准确无误
7. ✅ 所有代码通过 lint 和类型检查
