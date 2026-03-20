# Task 5 规划：实现数独生成算法

## 任务概述

Task 5 是数独游戏核心功能开发的第一步，需要实现数独生成、难度控制和验证算法。这些算法是整个游戏的基础，必须保证正确性和性能。

## 子任务清单

| 子任务 | 描述           | 优先级 |
| --- | ------------ | --- |
| 5.1 | 实现数独生成器（回溯法） | 高   |
| 5.2 | 实现难度控制逻辑     | 高   |
| 5.3 | 实现数独验证算法     | 高   |
| 5.4 | 编写算法单元测试     | 高   |

## 详细实现步骤

### SubTask 5.1: 实现数独生成器

**文件**: `src/algorithms/sudokuGenerator.ts`

**核心算法**: 回溯法（Backtracking）

**实现步骤**:

1. **生成完整数独解**

   * 创建 9x9 空网格

   * 使用回溯法填充数字

   * 每个位置随机尝试 1-9 数字

   * 检查数字是否符合数独规则（行、列、宫格唯一）

   * 递归填充直到完成

2. **算法优化**

   * 随机打乱数字尝试顺序，确保生成不同的数独

   * 添加最大递归深度限制，防止无限循环

   * 使用位运算优化候选数字检查

3. **导出函数**

   ```typescript
   // 生成完整的数独解
   export function generateCompleteSudoku(): SudokuGrid

   // 根据难度生成数独谜题
   export function generateSudokuPuzzle(difficulty: Difficulty): {
     puzzle: SudokuGrid
     solution: SudokuGrid
   }
   ```

### SubTask 5.2: 实现难度控制逻辑

**文件**: `src/algorithms/difficultyController.ts`

**难度配置** (已在 `constants/game.ts` 定义):

```typescript
export const DIFFICULTY_CONFIG = {
  easy: { minHoles: 30, maxHoles: 35, label: '简单' },
  medium: { minHoles: 40, maxHoles: 45, label: '中等' },
  hard: { minHoles: 50, maxHoles: 55, label: '困难' },
}
```

**实现步骤**:

1. **挖空算法**

   * 根据难度配置确定挖空数量

   * 随机选择位置进行挖空

   * 确保挖空后数独仍有唯一解（可选优化）

2. **导出函数**

   ```typescript
   // 根据难度挖空数独
   export function createPuzzleFromSolution(
     solution: SudokuGrid, 
     difficulty: Difficulty
   ): SudokuGrid

   // 获取挖空数量
   export function getHolesCount(difficulty: Difficulty): number
   ```

### SubTask 5.3: 实现数独验证算法

**文件**: `src/algorithms/sudokuValidator.ts`

**实现步骤**:

1. **基础验证**

   * 验证单个数字是否在有效范围内 (1-9)

   * 验证位置是否在有效范围内 (0-8)

2. **规则验证**

   * 验证行唯一性

   * 验证列唯一性

   * 验证 3x3 宫格唯一性

3. **完整验证**

   * 验证整个数独是否完成

   * 检查所有已填数字是否符合规则

4. **导出函数**

   ```typescript
   // 检查数字是否可以放置在指定位置
   export function isValidPlacement(
     grid: SudokuGrid, 
     row: number, 
     col: number, 
     num: number
   ): boolean

   // 验证整个数独是否有效
   export function isValidSudoku(grid: SudokuGrid): boolean

   // 检查数独是否已完成
   export function isSudokuComplete(grid: SudokuGrid): boolean

   // 获取指定位置的所有冲突
   export function getConflicts(
     grid: SudokuGrid, 
     row: number, 
     col: number
   ): Position[]
   ```

### SubTask 5.4: 编写算法单元测试

**文件**:

* `tests/unit/algorithms/sudokuGenerator.test.ts`

* `tests/unit/algorithms/sudokuValidator.test.ts`

* `tests/unit/algorithms/difficultyController.test.ts`

**测试用例**:

1. **sudokuGenerator.test.ts**

   * 生成的数独是否为 9x9 网格

   * 生成的完整数独是否有效

   * 每次生成的数独是否不同（随机性）

   * 生成时间是否在 500ms 内

2. **sudokuValidator.test.ts**

   * 有效放置检测

   * 无效放置检测（行冲突、列冲突、宫格冲突）

   * 完整数独检测

   * 冲突位置获取

3. **difficultyController.test.ts**

   * 各难度的挖空数量是否正确

   * 挖空后的谜题是否有正确格式

   * 谜题和解答的对应关系

## 注意事项

### 1. 性能要求

* 数独生成算法执行时间 < 500ms

* 使用优化的回溯算法

* 避免不必要的深拷贝操作

### 2. 类型安全

* 使用已定义的类型 `SudokuGrid`, `SudokuCell`, `Position`, `Difficulty`

* 所有函数都需要明确的类型定义

* 避免使用 `any` 类型

### 3. 算法正确性

* 确保生成的数独有且仅有一个解

* 验证算法必须覆盖所有边界情况

* 挖空位置要随机分布

### 4. 代码规范

* 遵循项目编码规范（参考 AGENTS.md）

* 函数单一职责原则

* 添加必要的注释说明算法逻辑

### 5. 测试覆盖

* 核心算法测试覆盖率 > 90%

* 包含边界情况测试

* 包含性能测试

## 文件结构

```
src/algorithms/
├── index.ts              # 导出所有算法
├── sudokuGenerator.ts    # 数独生成器
├── sudokuValidator.ts    # 数独验证器
└── difficultyController.ts # 难度控制器

tests/unit/algorithms/
├── sudokuGenerator.test.ts
├── sudokuValidator.test.ts
└── difficultyController.test.ts
```

## 依赖关系

```
sudokuGenerator.ts
    ├── types/sudoku.ts (SudokuGrid, Difficulty)
    └── constants/game.ts (GRID_SIZE, DIFFICULTY_CONFIG)

difficultyController.ts
    ├── types/sudoku.ts (SudokuGrid, Difficulty)
    ├── constants/game.ts (DIFFICULTY_CONFIG)
    └── sudokuValidator.ts (isValidPlacement)

sudokuValidator.ts
    ├── types/sudoku.ts (SudokuGrid, Position)
    └── constants/game.ts (GRID_SIZE, BOX_SIZE)
```

## 验收标准

| 序号 | 验收项  | 验收标准               |
| -- | ---- | ------------------ |
| 1  | 数独生成 | 能正确生成有效的 9x9 数独    |
| 2  | 难度控制 | 各难度的挖空数量符合配置       |
| 3  | 验证算法 | 能正确检测冲突和验证完成       |
| 4  | 性能   | 生成时间 < 500ms       |
| 5  | 测试   | 单元测试全部通过，覆盖率 > 90% |
| 6  | 类型   | TypeScript 编译无错误   |

## 执行顺序

1. 实现 `sudokuValidator.ts`（其他模块依赖）
2. 实现 `sudokuGenerator.ts`
3. 实现 `difficultyController.ts`
4. 更新 `algorithms/index.ts` 导出
5. 编写单元测试
6. 运行测试验证

