# Task 1: 初始化 React 项目 - 实施计划

## 概述

Task 1 的目标是创建 React 项目的基础架构，包括项目初始化、Tailwind CSS 配置、目录结构搭建、代码规范配置和路径别名设置。

## 当前状态

- 项目目录已存在，但 src 目录为空
- 需要从头开始初始化项目

---

## SubTask 1.1: 使用 Vite 创建 React 项目

### 操作步骤

1. **使用 Vite 创建 React + TypeScript 项目**
   ```bash
   npm init vite@latest . -- --template react-ts
   ```
   - 选择 "Ignore files and continue"（忽略现有文件继续）
   - 选择框架 "React"
   - 选择变体 "TypeScript"
   - 选择 "Yes" 安装依赖并启动

2. **验证项目创建成功**
   - 检查 `package.json` 是否存在
   - 检查 `src/main.tsx` 和 `src/App.tsx` 是否存在
   - 运行 `npm run dev` 验证开发服务器是否正常启动

### 产出文件

| 文件 | 说明 |
|------|------|
| `package.json` | 项目配置文件 |
| `package-lock.json` | 依赖锁定文件 |
| `tsconfig.json` | TypeScript 主配置 |
| `tsconfig.app.json` | 应用 TypeScript 配置 |
| `tsconfig.node.json` | Node TypeScript 配置 |
| `vite.config.ts` | Vite 配置文件 |
| `index.html` | HTML 入口文件 |
| `src/main.tsx` | 应用入口文件 |
| `src/App.tsx` | 根组件 |
| `src/index.css` | 全局样式 |
| `src/App.css` | 组件样式（后续删除） |
| `src/assets/` | 静态资源目录 |
| `public/` | 公共资源目录 |

---

## SubTask 1.2: 配置 Tailwind CSS

### 操作步骤

1. **安装 Tailwind CSS 及相关依赖**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   ```

2. **创建 Tailwind 配置文件** `tailwind.config.js`
   ```javascript
   /** @type {import('tailwindcss').Config} */
   export default {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

3. **创建 PostCSS 配置文件** `postcss.config.js`
   ```javascript
   export default {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   }
   ```

4. **更新全局样式文件** `src/index.css`
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

5. **删除不需要的文件**
   - 删除 `src/App.css`

### 产出文件

| 文件 | 说明 |
|------|------|
| `tailwind.config.js` | Tailwind 配置 |
| `postcss.config.js` | PostCSS 配置 |
| `src/index.css` | 更新后的全局样式 |

---

## SubTask 1.3: 配置项目目录结构

### 操作步骤

1. **创建源代码目录结构**
   ```
   src/
   ├── components/
   │   ├── common/           # 通用组件
   │   │   └── index.ts
   │   ├── game/             # 游戏组件
   │   │   └── index.ts
   │   ├── pages/            # 页面组件
   │   │   └── index.ts
   │   └── index.ts
   ├── hooks/                # 自定义 Hooks
   │   └── index.ts
   ├── context/              # React Context
   │   └── index.ts
   ├── algorithms/           # 数独算法
   │   └── index.ts
   ├── types/                # TypeScript 类型
   │   └── index.ts
   ├── utils/                # 工具函数
   │   └── index.ts
   ├── constants/            # 常量定义
   │   └── index.ts
   └── styles/               # 样式文件
       └── globals.css
   ```

2. **创建测试目录结构**
   ```
   tests/
   ├── unit/                 # 单元测试
   │   ├── algorithms/
   │   ├── hooks/
   │   └── utils/
   └── e2e/                  # 端到端测试
   ```

3. **创建基础类型定义**
   - `src/types/game.ts` - 游戏相关类型
   - `src/types/sudoku.ts` - 数独相关类型

4. **创建基础常量定义**
   - `src/constants/game.ts` - 游戏常量

### 产出文件

| 文件 | 说明 |
|------|------|
| `src/components/index.ts` | 组件导出 |
| `src/components/common/index.ts` | 通用组件导出 |
| `src/components/game/index.ts` | 游戏组件导出 |
| `src/components/pages/index.ts` | 页面组件导出 |
| `src/hooks/index.ts` | Hooks 导出 |
| `src/context/index.ts` | Context 导出 |
| `src/algorithms/index.ts` | 算法导出 |
| `src/types/index.ts` | 类型导出 |
| `src/types/game.ts` | 游戏类型定义 |
| `src/types/sudoku.ts` | 数独类型定义 |
| `src/utils/index.ts` | 工具函数导出 |
| `src/constants/index.ts` | 常量导出 |
| `src/constants/game.ts` | 游戏常量定义 |
| `src/styles/globals.css` | 全局样式 |

---

## SubTask 1.4: 设置 ESLint 和 Prettier

### 操作步骤

1. **安装 Prettier 相关依赖**
   ```bash
   npm install -D prettier eslint-config-prettier
   ```

2. **创建 Prettier 配置文件** `.prettierrc`
   ```json
   {
     "semi": false,
     "singleQuote": true,
     "tabWidth": 2,
     "trailingComma": "es5",
     "printWidth": 100
   }
   ```

3. **创建 Prettier 忽略文件** `.prettierignore`
   ```
   dist
   node_modules
   .trae
   coverage
   ```

4. **更新 ESLint 配置** `eslint.config.js`
   - 添加 prettier 配置
   - 添加自定义规则

5. **更新 package.json 添加脚本**
   ```json
   {
     "scripts": {
       "lint": "eslint .",
       "lint:fix": "eslint . --fix",
       "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
       "format:check": "prettier --check \"src/**/*.{ts,tsx,css}\""
     }
   }
   ```

### 产出文件

| 文件 | 说明 |
|------|------|
| `.prettierrc` | Prettier 配置 |
| `.prettierignore` | Prettier 忽略文件 |
| `eslint.config.js` | 更新后的 ESLint 配置 |
| `package.json` | 更新后的脚本配置 |

---

## SubTask 1.5: 配置路径别名

### 操作步骤

1. **更新 Vite 配置** `vite.config.ts`
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import path from 'path'

   export default defineConfig({
     plugins: [react()],
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src'),
       },
     },
   })
   ```

2. **更新 TypeScript 配置** `tsconfig.app.json`
   - 添加 `baseUrl` 和 `paths` 配置
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["src/*"]
       }
     }
   }
   ```

3. **验证路径别名**
   - 在 `src/App.tsx` 中使用 `@/` 导入测试

### 产出文件

| 文件 | 说明 |
|------|------|
| `vite.config.ts` | 更新后的 Vite 配置 |
| `tsconfig.app.json` | 更新后的 TypeScript 配置 |

---

## 执行顺序

```
1.1 创建项目
    ↓
1.2 配置 Tailwind CSS
    ↓
1.3 创建目录结构
    ↓
1.4 配置 ESLint/Prettier
    ↓
1.5 配置路径别名
    ↓
验证：npm run lint && npm run dev
```

---

## 验收标准

完成后应满足以下条件：

- [ ] 项目可以通过 `npm run dev` 正常启动
- [ ] Tailwind CSS 样式正常生效
- [ ] 路径别名 `@/` 正常工作
- [ ] ESLint 检查通过 (`npm run lint`)
- [ ] Prettier 格式化正常
- [ ] 所有目录和索引文件已创建
- [ ] 类型定义文件已创建

---

## 预计产出文件清单

| 序号 | 文件路径 | 说明 |
|------|---------|------|
| 1 | `package.json` | 项目配置 |
| 2 | `tsconfig.json` | TypeScript 主配置 |
| 3 | `tsconfig.app.json` | 应用 TypeScript 配置 |
| 4 | `vite.config.ts` | Vite 配置 |
| 5 | `tailwind.config.js` | Tailwind 配置 |
| 6 | `postcss.config.js` | PostCSS 配置 |
| 7 | `eslint.config.js` | ESLint 配置 |
| 8 | `.prettierrc` | Prettier 配置 |
| 9 | `.prettierignore` | Prettier 忽略文件 |
| 10 | `src/index.css` | 全局样式 |
| 11 | `src/App.tsx` | 根组件 |
| 12 | `src/main.tsx` | 应用入口 |
| 13 | `src/types/index.ts` | 类型导出 |
| 14 | `src/types/game.ts` | 游戏类型定义 |
| 15 | `src/types/sudoku.ts` | 数独类型定义 |
| 16 | `src/constants/index.ts` | 常量导出 |
| 17 | `src/constants/game.ts` | 游戏常量定义 |
| 18 | `src/components/index.ts` | 组件导出 |
| 19 | `src/components/common/index.ts` | 通用组件导出 |
| 20 | `src/components/game/index.ts` | 游戏组件导出 |
| 21 | `src/components/pages/index.ts` | 页面组件导出 |
| 22 | `src/hooks/index.ts` | Hooks 导出 |
| 23 | `src/context/index.ts` | Context 导出 |
| 24 | `src/algorithms/index.ts` | 算法导出 |
| 25 | `src/utils/index.ts` | 工具函数导出 |
