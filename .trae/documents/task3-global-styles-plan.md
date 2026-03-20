# Task 3 实现计划：配置全局样式和主题

## 任务概述

根据 `tasks.md` 和原型设计，配置项目的全局样式和主题系统，包括字体、图标、颜色、渐变、阴影等设计系统变量。

## 任务依赖

* Task 1 已完成 ✓

* Task 2 已完成 ✓

## 原型设计分析

从原型设计（<https://www.calicat.cn/design/2034809926826172416）中提取的设计规范：>

### 字体规范

| 用途   | 字体                     | 字重  |
| ---- | ---------------------- | --- |
| 标题   | SourceHanSans-Bold     | 700 |
| 副标题  | SourceHanSans-SemiBold | 600 |
| 正文   | SourceHanSans-Regular  | 400 |
| 辅助文字 | SourceHanSans-Light    | 300 |
| 图标   | remixicon              | -   |

### 颜色规范

| 用途     | 颜色值                 | Tailwind 对应 |
| ------ | ------------------- | ----------- |
| 主色调    | rgba(37,99,235,1)   | blue-600    |
| 紫色强调   | rgba(147,51,234,1)  | purple-600  |
| 背景渐变起点 | rgba(102,126,234,1) | 自定义         |
| 背景渐变终点 | rgba(118,75,162,1)  | 自定义         |
| 头部渐变起点 | rgba(59,130,246,1)  | blue-500    |
| 头部渐变终点 | rgba(147,51,234,1)  | purple-600  |
| 主文字    | rgba(30,41,59,1)    | slate-800   |
| 次要文字   | rgba(71,85,105,1)   | slate-600   |
| 辅助文字   | rgba(100,116,139,1) | slate-500   |
| 容器背景   | rgba(255,255,255,1) | white       |
| 次级背景   | rgba(249,250,251,1) | gray-50     |
| 高亮背景   | rgba(239,246,255,1) | blue-50     |
| 圆形标签背景 | rgba(219,234,254,1) | blue-100    |
| 未激活状态  | rgba(209,213,219,1) | gray-300    |

### 圆角规范

| 元素      | 圆角值           |
| ------- | ------------- |
| 容器/卡片   | 32px          |
| 按钮      | 12px          |
| 图标容器    | 16px          |
| 圆形按钮/标签 | 9999px (full) |

### 阴影规范

| 元素   | 阴影值                          |
| ---- | ---------------------------- |
| 卡片容器 | 0 25px 50px rgba(0,0,0,0.25) |

***

## 实现步骤

### Step 1: 引入 SourceHanSans（思源黑体）字体 - 本地方式

**方案：下载字体文件到本地**

1. 创建字体目录：`public/fonts/`

2. 下载思源黑体字体文件（从 GitHub 或其他可靠源）：

   * `SourceHanSansSC-Light.woff2` (300)

   * `SourceHanSansSC-Regular.woff2` (400)

   * `SourceHanSansSC-Medium.woff2` (500)

   * `SourceHanSansSC-SemiBold.woff2` (600)

   * `SourceHanSansSC-Bold.woff2` (700)

3. 创建字体定义文件 `src/styles/fonts.css`：

```css
/* 思源黑体字体定义 */
@font-face {
  font-family: 'Source Han Sans SC';
  src: url('/fonts/SourceHanSansSC-Light.woff2') format('woff2');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Source Han Sans SC';
  src: url('/fonts/SourceHanSansSC-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Source Han Sans SC';
  src: url('/fonts/SourceHanSansSC-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Source Han Sans SC';
  src: url('/fonts/SourceHanSansSC-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Source Han Sans SC';
  src: url('/fonts/SourceHanSansSC-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

**字体下载来源：**

* GitHub 官方：<https://github.com/adobe-fonts/source-han-sans/releases>

* 镜像站点：<https://mirrors.tuna.tsinghua.edu.cn/github-release/adobe-fonts/source-han-sans/>

**注意事项：**

* 使用 WOFF2 格式，体积更小

* `font-display: swap` 避免阻塞渲染

* 字体文件放在 `public/fonts/` 目录下

### Step 2: 引入 RemixIcon 图标字体库 - 本地方式

**方案：通过 npm 安装**

```bash
npm install remixicon
```

然后在 CSS 中引入：

```css
/* 在 src/index.css 中添加 */
@import 'remixicon/fonts/remixicon.css';
```

或者手动下载字体文件：

1. 创建目录：`public/fonts/remixicon/`

2. 下载文件：

   * `remixicon.woff2`

   * `remixicon.woff`

   * `remixicon.css`

3. 创建自定义 CSS 文件 `src/styles/icons.css`：

```css
/* RemixIcon 字体定义 */
@font-face {
  font-family: 'remixicon';
  src: url('/fonts/remixicon/remixicon.woff2') format('woff2'),
       url('/fonts/remixicon/remixicon.woff') format('woff');
  font-display: swap;
}

[class^="ri-"], [class*=" ri-"] {
  font-family: 'remixicon' !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**推荐使用 npm 安装方式**，更简单且便于更新。

### Step 3: 配置 Tailwind CSS 自定义主题

更新 `tailwind.config.js`：

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Source Han Sans SC', 'Noto Sans SC', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          purple: '#9333ea',
        },
        gradient: {
          start: '#667eea',
          end: '#764ba2',
        },
      },
      borderRadius: {
        'card': '32px',
        'button': '12px',
        'icon': '16px',
      },
      boxShadow: {
        'card': '0 25px 50px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}
```

**注意事项：**

* Tailwind CSS 4.x 使用新的配置方式

* 颜色命名要语义化，便于维护

* 圆角和阴影使用语义化命名

### Step 4: 创建全局 CSS 样式文件

更新 `src/index.css`：

```css
@import "tailwindcss";
@import './styles/fonts.css';
@import 'remixicon/fonts/remixicon.css';

/* 全局样式 */
:root {
  /* 渐变色变量 */
  --gradient-bg-start: #667eea;
  --gradient-bg-end: #764ba2;
  --gradient-header-start: #3b82f6;
  --gradient-header-end: #9333ea;
  
  /* 状态颜色 */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}

/* 基础样式 */
html {
  font-family: 'Source Han Sans SC', 'Noto Sans SC', sans-serif;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 背景渐变 */
.bg-gradient-main {
  background: linear-gradient(135deg, var(--gradient-bg-start), var(--gradient-bg-end));
}

/* 头部渐变 */
.bg-gradient-header {
  background: linear-gradient(90deg, var(--gradient-header-start), var(--gradient-header-end));
}

/* 卡片容器样式 */
.card-container {
  background: white;
  border-radius: 32px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

/* 按钮基础样式 */
.btn-primary {
  background: #2563eb;
  color: white;
  border-radius: 12px;
  padding: 12px 32px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-primary:active {
  transform: scale(0.98);
}
```

**注意事项：**

* 使用 CSS 变量定义可复用的设计值

* 渐变方向要与原型一致（背景 135deg，头部 90deg）

* 按钮需要添加交互状态样式

### Step 5: 定义设计系统变量

创建 `src/styles/variables.css`：

```css
/* 设计系统变量 */
:root {
  /* 字体 */
  --font-family: 'Source Han Sans SC', 'Noto Sans SC', sans-serif;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* 字号 */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 28px;
  --font-size-4xl: 36px;
  --font-size-5xl: 48px;
  
  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  
  /* 圆角 */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 32px;
  --radius-full: 9999px;
  
  /* 阴影 */
  --shadow-card: 0 25px 50px rgba(0, 0, 0, 0.25);
  --shadow-button: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  /* 过渡 */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;
}
```

**注意事项：**

* 变量命名要有规律，便于查找和使用

* 字号、间距遵循一定的比例关系

* 过渡时间要符合用户体验最佳实践

***

## 文件变更清单

| 操作 | 文件路径                                          |
| -- | --------------------------------------------- |
| 创建 | `public/fonts/` 目录                            |
| 创建 | `public/fonts/SourceHanSansSC-Light.woff2`    |
| 创建 | `public/fonts/SourceHanSansSC-Regular.woff2`  |
| 创建 | `public/fonts/SourceHanSansSC-Medium.woff2`   |
| 创建 | `public/fonts/SourceHanSansSC-SemiBold.woff2` |
| 创建 | `public/fonts/SourceHanSansSC-Bold.woff2`     |
| 创建 | `src/styles/fonts.css`                        |
| 创建 | `src/styles/variables.css`                    |
| 修改 | `tailwind.config.js` (扩展主题配置)                 |
| 修改 | `src/index.css` (添加全局样式)                      |
| 修改 | `package.json` (添加 remixicon 依赖)              |

***

## 注意事项

### 1. 字体文件获取

* 从 GitHub 官方或镜像站点下载思源黑体

* 只下载需要的字重（300/400/500/600/700）

* 使用 WOFF2 格式，体积最小

### 2. 字体加载优化

* 使用 `font-display: swap` 避免阻塞渲染

* 字体文件放在 `public/` 目录下，直接由服务器提供

* 考虑使用 `preload` 预加载关键字体

### 3. Tailwind CSS 4.x 兼容性

* Tailwind CSS 4.x 使用新的配置语法

* 部分配置可能需要在 CSS 中使用 `@theme` 指令

* 注意检查 Tailwind CSS 4.x 的文档更新

### 4. 渐变方向

* 背景渐变：从左上到右下 (135deg)

* 头部渐变：从左到右 (90deg)

* 严格按照原型设计实现

### 5. 颜色一致性

* 使用 CSS 变量确保颜色一致性

* 避免硬编码颜色值

* 与 Tailwind 颜色系统保持兼容

### 6. 响应式考虑

* 字体大小需要考虑移动端适配

* 间距在小屏幕上可能需要调整

* 圆角在不同设备上保持一致

***

## 验证步骤

1. 安装 remixicon：`npm install remixicon`
2. 下载思源黑体字体文件到 `public/fonts/`
3. 启动开发服务器 `npm run dev`
4. 检查字体是否正确加载（查看 Network 面板）
5. 检查图标是否正确显示
6. 验证颜色、渐变、阴影效果
7. 测试响应式布局

***

## 预期结果

* 思源黑体字体正确加载（本地文件）

* RemixIcon 图标正确显示（npm 包）

* 自定义主题配置生效

* 全局样式符合原型设计

* 设计系统变量可复用

* 不依赖外部 CDN，可离线使用

