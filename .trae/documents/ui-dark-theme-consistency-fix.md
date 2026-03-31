# UI 深度暗黑主题一致性修复计划 (UI Dark Theme Consistency Fix Plan)

## 1. 背景与目标 (Summary & Goal)
**问题描述**：在近期的界面风格向“暗黑极简 (Dark Linear)”迁移的过程中，尽管全局框架和部分容器已经适配了深色主题，但在具体的业务组件中（尤其是 `Step2EnvSetup.vue` 的各个子模块，如推理项、平台配置卡片、叙事方向模块、人设详情弹窗等），依然残留了大量硬编码的浅色色值（如 `#FFF`, `#F9F9F9`, `#333`, `#EAEAEA` 等）。这导致在暗色背景下出现高亮色块刺眼、文本对比度极低（如灰色背景配深灰色字体）等严重影响可读性和视觉一致性的问题。

**目标**：不引入新的主题切换逻辑，而是**彻底完善当前的暗黑主题**。对从 Step 1 到 Step 5 的所有核心模块进行全面排查，将残留的硬编码浅色色值统一替换为 `main.css` 中定义的全局深色 CSS 变量，确保全站的 UI 风格严丝合缝、文本清晰可读。

## 2. 核心修改原则 (Core Principles)
- **零逻辑修改**：所有的修改仅限于 `<style scoped>` 块中的 CSS 属性，以及可能需要的极少数类名调整，绝对不触碰任何 Vue 组件的 JavaScript 业务逻辑。
- **变量优先**：严格使用 `main.css` 中已有的全局变量：
  - **背景**：`var(--bg-base)` (最底层纯黑), `var(--bg-panel)` (面板底色), `var(--bg-panel-hover)` (悬浮底色)。
  - **边框**：`var(--border-dim)` (默认暗色边框), `var(--border-focus)` (高亮边框)。
  - **文本**：`var(--text-primary)` (主文本白色), `var(--text-secondary)` (次要文本灰白), `var(--text-muted)` (辅助文本暗灰)。
  - **强调色**：`var(--accent-primary)`, `var(--accent-success)`, `var(--accent-error)`。
- **高对比度适配**：对于特殊标签（如话题 Tag、MBTI 标签等），原有的亮色背景需改为半透明暗色背景配高亮文字，以适应深色模式。

## 3. 具体执行步骤 (Implementation Steps)

### 阶段一：重点修复 Step 2 (环境搭建)
**目标文件**：`frontend/src/components/Step2EnvSetup.vue`
**修改内容**：
- **平台与叙事卡片**：将 `.platform-card`, `.reasoning-item`, `.narrative-box`, `.timeline-content` 的背景色 `#F9F9F9` 和 `#FFFFFF` 替换为 `var(--bg-panel)`。边框替换为 `var(--border-dim)`。
- **人设详情弹窗 (Profile Modal)**：将弹窗的白底 `#FFF` 改为 `var(--bg-panel)`，弹窗标题和文本 `#000`, `#333` 改为 `var(--text-primary)`。将卡片化的简介区域 `.section-bio` 和属性区域 `.dimension-card` 的背景改为 `var(--bg-base)`，边框适配暗色。
- **时间轴与滑动条**：将时间轴的亮色轨道 `#E2E8F0`、背景 `#F8FAFC` 替换为深色轨道。
- **状态与数值**：修正 `.param-value` `#475569`, `.log-title` `#666`，统一使用 `var(--text-primary)` 和 `var(--text-secondary)`。
- **标签 (Tags)**：将话题标签 `#E3F2FD` 的底色改为暗色半透明色（例如 `rgba(255,255,255,0.1)` 或使用自带变量），字体改为亮色。

### 阶段二：排查并修复其他步骤组件
**目标文件**：
1. `frontend/src/components/Step1GraphBuild.vue`
   - 修复节点属性面板、边属性面板可能存在的白色底色。
   - 检查进度条、文件上传拖拽区域的高亮和背景色，确保没有 `#f5f5f5` 等亮色。
2. `frontend/src/components/Step3Simulation.vue`
   - 修复数据看板的指标卡片背景。
   - 确保推演进度条和内部控制台输出面板使用深色底色和高对比度文本。
3. `frontend/src/components/Step4Report.vue` & `Step5Interaction.vue`
   - 检查报告的 Markdown 渲染区域（如代码块、引用块的背景色）。
   - 检查图表容器的底色。
   - 修复互动界面侧边栏和任何其他子模块的硬编码色值。

### 阶段三：修复全局辅助组件
**目标文件**：
- `frontend/src/components/MockHealthPanel.vue` (如存在)
- `frontend/src/components/HistoryDatabase.vue`
- `frontend/src/components/GraphPanel.client.vue` (D3 图谱面板的 tooltip 弹窗样式适配)。
**修改内容**：全面搜索 `#[0-9a-fA-F]{3,6}`，筛选出所有不合理的亮色，进行针对性替换。

## 4. 验证标准 (Verification Criteria)
1. **视觉一致性**：在浏览器中打开页面并切换 1-5 步，所有模块、弹窗、滑动条、卡片均完美融入黑色（Black/Dark Linear）背景，无任何刺眼的“白块”或“灰块”。
2. **文本可读性**：所有标题、正文、辅助说明文本在暗色背景下对比度达标，不存在看不清的情况。
3. **功能完整性**：所有的按钮点击、图谱拖拽、模拟交互等业务逻辑依然能够正常运行。