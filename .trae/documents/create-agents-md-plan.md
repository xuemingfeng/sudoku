# 创建 AGENTS.md 文件计划

## 任务目标

根据技术架构规格要求，创建 AGENTS.md 文件，用于 AI 辅助开发的上下文说明。

## 文件内容规划

### AGENTS.md 应包含以下内容

1. **项目概述**
   - 项目名称：数独游戏
   - 技术栈：React + TypeScript + Vite + Tailwind CSS
   - 原型设计链接

2. **项目架构**
   - 目录结构说明
   - 模块职责划分

3. **编码规范**
   - TypeScript 规范
   - React 组件规范
   - Tailwind CSS 使用规范

4. **Git 提交规范**（重点）
   - 提交信息格式
   - 分支命名规范
   - 提交类型说明

5. **开发注意事项**
   - 高保真还原原则
   - 测试优先级

---

## Git 提交规范内容

### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 提交类型 (type)

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 Bug |
| `docs` | 文档更新 |
| `style` | 代码格式调整（不影响功能） |
| `refactor` | 重构代码 |
| `test` | 测试相关 |
| `chore` | 构建/工具相关 |
| `perf` | 性能优化 |
| `ci` | CI/CD 相关 |

### 示例

```
feat(game): 实现数独棋盘组件

- 创建 SudokuBoard 组件
- 实现 9x9 网格布局
- 添加格子点击交互

Closes #123
```

---

## 执行步骤

1. 创建 `e:\ai\sudoku-v2\AGENTS.md` 文件
2. 写入完整内容，包含 Git 提交规范
