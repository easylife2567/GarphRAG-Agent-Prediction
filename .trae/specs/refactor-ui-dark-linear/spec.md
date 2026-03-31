# Global UI Refactor (Dark Linear/Vercel Aesthetic) Spec

## Why
目前项目的 UI 风格不统一。主页 (`index.vue`) 和历史记录组件 (`HistoryDatabase.vue`) 已更新为“暗黑极简科技风 (Dark Linear/Vercel Aesthetic)”，但其他页面（如流程编排、模拟、报告等）仍残留旧的亮色或玻璃拟物化风格。为了提供专业、沉浸的 AI 控制台体验，需要全局统一 UI 风格，同时通过 `.trae/skills` 进行设计辅助，保证规范落地。

## What Changes
- 提取 `index.vue` 中的核心 CSS 变量至全局样式文件。
- 重构 `app.vue` 和 `layouts/default.vue`，统一暗色背景、动态光晕和顶部导航栏。
- 借助 `.trae/skills/ui-ux-pro-max` 提供的设计规范思想，重写图谱组件、流程页、模拟页、报告页及深度互动页的 UI。
- 统一组件质感（1px 细线边框、去除高斯模糊、扁平化高对比度按钮、等宽字体）。
- **所有修改仅限 CSS/HTML 层面的类名和样式调整，绝对禁止修改任何业务逻辑 (JS/TS 脚本、状态绑定、API 调用等)**。

## Impact
- Affected specs: 页面视觉呈现、全局 CSS 变量系统。
- Affected code:
  - `frontend/src/app.vue`
  - `frontend/src/layouts/default.vue`
  - `frontend/src/assets/css/main.css` (新建)
  - `frontend/nuxt.config.ts` (注册全局 CSS)
  - `frontend/src/components/` 下的通用组件 (如 GraphPanel 等)
  - `frontend/src/pages/` 下的所有业务子页面。

## ADDED Requirements
### Requirement: 全局 CSS 变量支持
The system SHALL provide 一套全局可用的 CSS 变量 (如 `--bg-base`, `--bg-panel`, `--text-primary`)。
#### Scenario: 页面加载
- **WHEN** 任意子页面或组件加载
- **THEN** 能够继承并正确渲染暗黑主题相关的背景、边框和文本颜色。

## MODIFIED Requirements
### Requirement: 统一布局与导航栏
The system SHALL 修改 `layouts/default.vue` 适配暗黑模式，背景改为 `#000000`，带有动态模糊光晕，且导航条采用高斯模糊暗色半透明风格。

### Requirement: 子页面 UI 适配
The system SHALL 确保所有业务页面（上传、环境配置、报告生成等）的卡片和面板统一使用 `.panel` 和 `.panel-header` 风格，使用高对比度色调，输入框和按钮拥有统一的聚焦态和悬浮交互。