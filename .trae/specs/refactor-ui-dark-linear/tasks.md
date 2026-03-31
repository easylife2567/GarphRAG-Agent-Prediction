# Tasks
- [x] Task 1: 建立全局暗黑极简设计系统 (Design System Foundation)
  - [x] SubTask 1.1: 提取 `index.vue` 中的核心 CSS 变量，创建 `frontend/src/assets/css/main.css`，并在 `nuxt.config.ts` 或 `app.vue` 中全局引入。
  - [x] SubTask 1.2: 借助 `ui-ux-pro-max` skill 指导，确保全局排版（字体、字号）、颜色和阴影系统的定义准确且符合 Linear/Vercel 美学规范。
- [x] Task 2: 重构全局布局与基础页面 (Global Layout Refactoring)
  - [x] SubTask 2.1: 修改 `frontend/src/app.vue` 的全局样式，将背景统一为纯黑 `#000000`，调整全局滚动条样式为暗黑风格。
  - [x] SubTask 2.2: 重构 `frontend/src/layouts/default.vue`，应用全局暗黑背景、动态网格及光晕，更新顶部导航栏 (Nav) 的样式，使其匹配 `index.vue` 的 `.system-nav` 风格。
- [x] Task 3: 改造通用组件 (Common Components Refactoring)
  - [x] SubTask 3.1: 调整图谱相关组件（如存在 `GraphPanel`），修改 D3.js 渲染的背景色为透明或 `#0a0a0a`，节点和连线颜色适配暗黑高对比度模式。
  - [x] SubTask 3.2: 梳理并统一样式类，如将所有基础卡片替换为 `.panel`, 标题区域为 `.panel-header`，并使用标准化的按钮样式。
- [x] Task 4: 逐个重写子路由页面 UI (Sub-pages UI Overhaul)
  - [x] SubTask 4.1: 重写 `pages/process/[projectId].vue`（流程编排页），将上传与任务控制流卡片替换为 1px 细线边框的暗黑面板。
  - [x] SubTask 4.2: 重写 `pages/simulation/` 和 `pages/report/` 目录下相关页面的 UI，包括系统运行进度条、日志终端控制台样式、Markdown 渲染的极简适配。
  - [x] SubTask 4.3: 重写 `pages/interaction/` (深度互动页)，对话窗口彻底摒弃气泡感，采用类似终端命令行的极简控制台风格。

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 1
- Task 4 depends on Task 1 and Task 2