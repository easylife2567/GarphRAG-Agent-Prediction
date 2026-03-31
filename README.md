# GarphRAG-Agent-Prediction

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Version: 1.0.0](https://img.shields.io/badge/Version-1.0.0-green.svg)
![Vue 3](https://img.shields.io/badge/Vue.js-3.x-4FC08D.svg)
![Nuxt 3](https://img.shields.io/badge/Nuxt-3.x-00DC82.svg)
![Python 3.12](https://img.shields.io/badge/Python-3.12-3776AB.svg)

## 📖 简介 | Introduction

**GarphRAG-Agent-Prediction** 是一个简洁通用的群体智能预测引擎。只需上传包含现实背景信息的文本或文档（如 PDF、Markdown），系统即可自动提取其中的关键实体、构建知识图谱（GraphRAG），并在此基础上生成数十至数百万级具备特定角色特征的智能体（Agent）。
通过让这些 Agent 在模拟环境中进行多轮次的自由交互，系统能够推演出事件在特定条件下的未来走向，帮助决策者寻找动态环境下的“局部最优解”。

---

## ✨ 核心特性 | Key Features

- **全自动化图谱构建 (GraphRAG)**：自动解析长文本，提取实体关系，构建实时可视化的知识图谱。
- **群体智能模拟 (Agent Simulation)**：基于大语言模型 (LLM)，一键生成具备个性化背景与记忆的 Agent，支持高并发多轮互动推演。
- **上帝视角干预 (God Mode Interventions)**：在模拟过程中动态注入变量或环境因素，观测事件走向的变化。
- **深度分析与报告 (Analytical Reporting)**：推演结束后，自动整理 Agent 交互日志，并利用 ReACT 模式生成深度的多维度分析报告。
- **实时可视化追踪 (Real-time Visualization)**：内置基于 D3.js 的交互式图谱面板，以及完整的控制台状态追踪。

---

## 🛠️ 技术栈 | Tech Stack

- **前端 (Frontend)**：Vue 3 (Composition API), Nuxt 3, Pinia, D3.js
- **后端 (Backend)**：Python 3.12, Flask, LangChain, Zep (Memory Management)
- **其他依赖**：SQLite/PostgreSQL, Redis (可选用于任务队列)

---

## 🚀 快速开始 | Quick Start

### 环境要求
- Node.js (>= 18.x)
- Python (>= 3.12)
- [uv](https://github.com/astral-sh/uv) (Python 包管理器)

### 1. 克隆项目
\`\`\`bash
git clone git@github.com:easylife2567/GarphRAG-Agent-Prediction.git
cd GarphRAG-Agent-Prediction
\`\`\`

### 2. 后端服务启动
\`\`\`bash
# 进入后端目录
cd backend

# 复制环境变量配置并填写您的 LLM API Key
cp .env.example .env

# 安装依赖并启动 Flask 服务 (默认端口 5001)
uv run python run.py
\`\`\`

### 3. 前端服务启动
\`\`\`bash
# 进入前端目录 (新开一个终端)
cd frontend

# 安装依赖
npm install

# 启动 Nuxt 开发服务器 (默认端口 3000)
npm run dev
\`\`\`

打开浏览器访问 \`http://localhost:3000\` 即可开始体验。

---

## 📂 项目结构 | Project Structure

\`\`\`text
GarphRAG-Agent-Prediction/
├── backend/                  # Python 后端服务
│   ├── app/
│   │   ├── api/              # Flask 路由和控制器
│   │   ├── services/         # 核心业务逻辑 (GraphRAG, Agent 模拟等)
│   │   └── utils/            # 工具类与辅助函数
│   └── run.py                # 后端入口文件
├── frontend/                 # Nuxt.js 前端应用
│   ├── src/
│   │   ├── api/              # 前端接口请求定义
│   │   ├── components/       # Vue 组件 (Step1-5, GraphPanel 等)
│   │   ├── composables/      # Vue 组合式函数 (状态轮询等)
│   │   └── pages/            # Nuxt 路由页面
│   └── nuxt.config.ts        # Nuxt 配置文件
└── docker-compose.yml        # Docker 容器编排文件
\`\`\`

---

## 🤝 贡献指南 | Contributing

欢迎提交 Issue 和 Pull Request。在提交 PR 之前，请确保您的代码通过了现有的测试用例并符合项目的代码风格规范。

1. Fork 本仓库
2. 创建您的特性分支 (\`git checkout -b feature/AmazingFeature\`)
3. 提交您的修改 (\`git commit -m 'Add some AmazingFeature'\`)
4. 推送到分支 (\`git push origin feature/AmazingFeature\`)
5. 开启一个 Pull Request

---

## 📜 开源协议 | License

本项目基于 [MIT License](./LICENSE) 协议开源。

*注：本项目的核心架构基于 GitHub 用户 \`666ghj\` 的开源作品 \`MiroFish\` 进行二次开发与重构。感谢原作者的贡献。*
