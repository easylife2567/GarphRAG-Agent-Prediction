# GarphRAG-Agent-Prediction - 视觉设计规范与组件说明 (V2.0)

本文档概述了首页界面 (`index.vue`) 最新的**现代优雅专业风格 (Modern Elegant Professional Dashboard)** 的视觉设计规范和交互准则。

---

## 1. 核心设计理念 (Design Concept)

从深色赛博朋克风 (Dark Cyber) 转向**高质感的浅色玻璃拟态 (Light Glassmorphism)**。整体追求如同 Apple / Linear 等顶级 SaaS 产品的专业度与通透感，以干净的留白、柔和的渐变、精致的阴影和细腻的微交互，传递出 AI 预测引擎的高级感与可靠性。

## 2. 色彩系统 (Color Palette)

采用了低饱和度背景与高质感点缀色的组合：

| 颜色变量名 | 色值 (Hex / RGBA) | 用途说明 |
| :--- | :--- | :--- |
| `--bg-base` | `#fafafa` | 整体网页底色，带有极浅的灰度，避免纯白刺眼 |
| `--bg-card` | `rgba(255, 255, 255, 0.6)` | 玻璃拟态卡片默认背景，配合 `backdrop-filter: blur(20px)` |
| `--bg-card-hover`| `rgba(255, 255, 255, 0.8)` | 卡片悬停时的背景提亮 |
| `--text-primary`| `#111827` (Gray-900) | 大标题、强调文本、主要数值 |
| `--text-secondary`| `#4b5563` (Gray-600) | 辅助描述、次要标签、图标颜色 |
| `--accent-blue` | `#3b82f6` (Blue-500) | 核心品牌色，用于关键交互和渐变起点 |
| `--accent-purple`| `#8b5cf6` (Purple-500) | 渐变终点色，增加 AI 神秘感 |
| `--accent-green`| `#10b981` (Emerald-500) | 系统状态正常 (Online)、成功状态 |
| `--accent-orange`| `#f59e0b` (Amber-500) | 文件上传高亮、警告提示 |

### 2.1 背景质感 (Ambient Backgrounds)
- **Gradient Mesh**: 左上、右上、右下三个角落分别有蓝色、紫色、绿色的超大柔和径向渐变，奠定页面的色彩基调。
- **Noise Texture**: 叠加了透明度极低 (`0.05`) 的 SVG 噪点纹理 (`fractalNoise`)，打破纯色的单调，增加磨砂玻璃的物理真实感。

## 3. 字体排版规范 (Typography)

- **主字体 (Sans-serif)**: `Inter, -apple-system, BlinkMacSystemFont, sans-serif`
  用于绝大多数正文、按钮、卡片标题。字重分明：标题用 `600/800`，正文用 `400/500`。
- **等宽字体 (Monospace)**: `JetBrains Mono, monospace`
  仅用于数字指标、代码徽章 (Engine Badge) 和步骤序号，增强极客和数据专业感。

## 4. 组件样式与交互规范 (Components & Interactions)

### 4.1 玻璃拟态卡片 (Glass Cards)
所有的 Bento Grid 区块均采用统一的 `.glass-card` 样式：
- **阴影 (Shadow)**: 默认多层柔和阴影 (`--shadow-md`)，Hover 时阴影扩散 (`--shadow-lg`) 并轻微上浮 (`transform: translateY(-2px)`)。
- **边框 (Border)**: 1px 纯白边框，强化玻璃边缘的反光感。
- **卡片头部 (Card Header)**: 包含一个带底色背景的圆角图标框 (`icon-wrapper`) 和主标题，右侧可附加辅助标签 (`tag`)。

### 4.2 核心动效 (Hero Visual - Orb)
- **Orb Inner**: 中心的能量球采用蓝紫渐变，带有内外发光阴影，并执行 `pulse-core` 呼吸动画。
- **Satellites**: 外围三层轨道分别以 15s、25s、35s 的周期正反交替旋转，每条轨道上有一颗发光的“数据卫星”，象征多 Agent 的运算过程。

### 4.3 输入与按钮 (Inputs & Buttons)
- **文本域 (Textarea)**: 默认半透明背景，`focus-within` 状态下背景变为纯白，边框变为蓝色，并带有 `3px` 的蓝色光晕 (`box-shadow`)。
- **主按钮 (Primary Button)**: 默认深色 (`#111827`) 背景白字，Hover 时变为品牌蓝 (`#3b82f6`) 并伴随强烈的同色系发光阴影。点击后进入禁用状态，显示旋转的 SVG Spinner。

### 4.4 文件拖拽区 (Dropzone)
- 虚线边框 (`border-bright`)。
- Hover 或拖入文件 (`is-dragover`) 时，边框变为橙色，背景微亮，中间的上传图标放大 (`scale(1.1)`) 并产生阴影，提供极强的拖拽吸附暗示。
- 已上传文件列表采用圆角胶囊 (`file-item-pill`) 设计，带有图标和优雅的截断效果。

## 5. 响应式布局 (Responsive Grid)
- **大屏 (Desktop, >1024px)**: 维持 `1280px` 的最大安全宽度，三列网格布局，信息高度聚合。
- **小屏 (Mobile/Tablet, <=1024px)**:
  - 导航栏和主容器内边距缩小至 `24px`。
  - Hero 区域由左右布局改为上下居中对齐。
  - Bento Grid 强制转为单列 `1fr` 垂直瀑布流。
  - 内部双排结构（如流程图的步骤与详情）也转为上下垂直排列 (`flex-direction: column`)。

---
*设计方案确保在美观度提升的同时，所有原有 Vue 响应式数据绑定与表单提交流程保持 100% 兼容。*