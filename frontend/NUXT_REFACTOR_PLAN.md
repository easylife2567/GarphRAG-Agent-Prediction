# MiroFish 前端 Nuxt.js 重构落地蓝图与测试降本方案

## 1. 背景与现状分析

### 1.1 现有前端工程痛点
- **路由与状态耦合**：目前使用 Vue3 + Vite + vue-router，核心页面如 `MainView.vue`、`Process.vue` 承担了过多的职责（UI渲染、轮询逻辑、API请求、状态流转），导致文件庞大且难以维护。
- **全局状态管理缺失**：依赖临时 `reactive`（如 `pendingUpload.js`）或路由传参，缺乏规范的全局状态管理（如 Pinia），导致组件间通信困难。
- **工程化基础设施薄弱**：缺乏 ESLint、Prettier、Vitest 等代码质量和自动化测试工具。
- **API 层抽象不足**：虽然有基础的 axios 封装，但缺乏统一的类型定义、错误边界处理和重试机制的深度整合。

### 1.2 重构目标
- **引入 Nuxt.js 3**：利用其约定式路由、自动导入（Components、Composables）和布局系统，降低心智负担，提升开发效率。
- **解耦业务与 UI**：将轮询、API 调用抽离为独立的 `composables`，将全局状态交由 Pinia 管理。
- **补齐工程化短板**：引入 Linting、Formatting 和基础测试框架，提升代码质量。
- **测试降本增效**：通过引入 Mock 机制，解决迁移过程中因频繁调用后端大模型 API 导致的 Token 浪费问题。

---

## 2. 目标架构与目录映射

### 2.1 目录结构对比与映射
将现有的 `src` 结构映射到 Nuxt 的约定式目录：

| 原有结构 (`src/`) | Nuxt 3 目标结构 | 说明 |
| :--- | :--- | :--- |
| `router/index.js` | `pages/` 目录 | Nuxt 自动根据目录结构生成路由 |
| `views/Home.vue` | `pages/index.vue` | 首页 |
| `views/MainView.vue` (Process) | `pages/process/[projectId].vue` | 流程编排页（提取业务逻辑后） |
| `views/SimulationView.vue` | `pages/simulation/[simulationId]/index.vue` | 模拟环境搭建页 |
| `views/SimulationRunView.vue`| `pages/simulation/[simulationId]/start.vue` | 模拟运行页 |
| `views/ReportView.vue` | `pages/report/[reportId].vue` | 报告生成页 |
| `views/InteractionView.vue` | `pages/interaction/[reportId].vue`| 深度互动页 |
| `components/` | `components/` | 保持不变，Nuxt 会自动导入 |
| `api/` | `plugins/api.ts` + `composables/`| 将 axios 替换为 Nuxt 自带的 `$fetch`，并在 plugin 中统一拦截 |
| `store/pendingUpload.js` | `stores/project.ts` (Pinia) | 引入 Pinia 管理全局状态 |
| 新增 | `composables/` | 存放可复用的业务逻辑（如 `usePolling`, `useGraph` 等） |
| 新增 | `layouts/default.vue` | 提取原 `MainView` 中的 Header 和通用布局 |
| 新增 | `server/api/mock/` | 用于存放 Mock 数据的 Nitro 路由（详见第4节） |

---

## 3. 分阶段实施路径

建议采用**渐进式迁移**策略，保证在重构期间项目仍可运行。

### 阶段一：基建与环境搭建（预计 1 天）
1. **初始化 Nuxt 3 项目**：配置 `nuxt.config.ts`。
2. **配置工程化工具**：集成 ESLint、Prettier、TypeScript（可选但强烈建议）。
3. **集成基础库**：安装 Pinia、配置 `$fetch` 拦截器（替代原 `axios` 拦截器，保留重试逻辑）。
4. **环境变量迁移**：将 `.env` 中的 `VITE_API_BASE_URL` 迁移至 Nuxt 的 `runtimeConfig`。

### 阶段二：布局与状态管理（预计 1-2 天）
1. **提取 Layout**：创建 `layouts/default.vue`，将 `MainView.vue` 中的导航栏和状态指示器抽离。
2. **初始化 Pinia Store**：
   - `useProjectStore`：管理当前 projectId、文件列表、需求描述。
   - `useSimulationStore`：管理模拟状态、日志流。
3. **实现 Mock 层**：搭建基础的 Mock 开关和数据结构（详见第4节）。

### 阶段三：核心页面与逻辑拆解（预计 3-5 天）
这是重构的核心，重点是**逻辑解耦**。
1. **迁移首页 (`Home.vue`)**：直接迁移至 `pages/index.vue`。
2. **拆解 `MainView.vue` (Process页)**：
   - 将原有的 `pollTaskStatus`、`startBuildGraph` 等长轮询和业务逻辑抽离到 `composables/useTaskPolling.ts`。
   - 页面组件仅负责调用 composable 并渲染 UI。
3. **迁移模拟与报告页**：依次迁移 `SimulationView`、`SimulationRunView`、`ReportView` 等，复用抽离的轮询逻辑。

### 阶段四：联调、测试与验收（预计 2 天）
1. **Mock 环境联调**：开启 Mock 模式，走通从上传到报告生成的完整 UI 流程，确保路由跳转和状态更新正确。
2. **真实环境冒烟测试**：关闭 Mock，连接真实 Flask 后端，跑通核心链路。
3. **修复边界问题**：处理样式丢失、图谱组件 (`d3.js`) 在 Nuxt 环境下的挂载问题（需使用 `<ClientOnly>` 包裹图谱组件）。

---

## 4. 测试降本方案：分层 Mock 机制

为了在迁移期间频繁测试 UI 状态流转而不消耗大模型 Token，引入基于 Nuxt Nitro 的 Mock 层。

### 4.1 方案设计
在 `nuxt.config.ts` 或 `.env` 中增加一个全局开关 `NUXT_PUBLIC_MOCK_MODE=true`。
当开启时，前端所有的 API 请求不再发往真实后端（`http://localhost:5001`），而是被拦截并返回本地的 Mock 数据。

### 4.2 核心高成本接口的 Mock 策略

我们需要模拟**异步任务的进度变化**，以测试前端的轮询逻辑（如 `pending -> processing -> completed`）。

#### 1. 图谱构建与本体生成
- **拦截目标**：`/api/graph/ontology/generate`, `/api/graph/build`, `/api/graph/task/:id`
- **Mock 行为**：
  - 触发构建时，立即返回一个固定的 `task_id`（如 `mock_task_001`）。
  - 前端轮询 `/api/graph/task/mock_task_001` 时，Mock 接口根据请求次数或时间戳动态返回进度（例如：第1次请求返回 10%，第3次返回 100% 并附带伪造的 `graph_id`）。

#### 2. Agent 模拟准备与运行
- **拦截目标**：`/api/simulation/prepare`, `/api/simulation/start`, `/api/simulation/run-status`
- **Mock 行为**：
  - 准备阶段直接返回成功。
  - 运行阶段，预先录制一段真实的 `run-status` 响应数据（包含几个虚拟的 Agent 动作和轮次更新），Mock 接口按顺序或定时播放这些数据，驱动前端时间线和日志的更新。

#### 3. 报告生成
- **拦截目标**：`/api/report/generate`, `/api/report/generate/status`
- **Mock 行为**：同上，模拟大纲生成 -> 章节生成 -> 完成的过程。

### 4.3 实施示例 (基于 Nuxt 服务端路由)

可以在 Nuxt 项目的 `server/api/` 目录下创建拦截器：

```typescript
// server/api/graph/task/[id].ts
let requestCount = 0;

export default defineEventHandler((event) => {
  const taskId = getRouterParam(event, 'id');
  requestCount++;

  // 模拟进度变化
  if (requestCount < 3) {
    return {
      success: true,
      data: {
        task_id: taskId,
        status: 'processing',
        progress: requestCount * 30,
        message: '正在构建图谱中...'
      }
    };
  } else {
    // 重置计数器以便下次测试
    requestCount = 0;
    return {
      success: true,
      data: {
        task_id: taskId,
        status: 'completed',
        progress: 100,
        message: '构建完成',
        result: { graph_id: 'mock_graph_id_123' }
      }
    };
  }
});
```

在统一的请求插件 (`plugins/api.ts`) 中，根据环境变量决定是请求 `/api/xxx`（转发到后端）还是请求内部的 `/api/mock/xxx`。

---

## 5. 关键注意事项

1. **图谱渲染组件 (`GraphPanel.vue`)**：
   - D3.js 操作 DOM，在 SSR 环境下会报错。
   - **对策**：在 Nuxt 中使用该组件时，必须使用 `<ClientOnly>` 标签包裹，或在配置中将该组件设为 `.client.vue` 后缀。
2. **状态持久化**：
   - 刷新页面可能导致临时状态丢失。建议在 Pinia 中配合 `@pinia/plugin-persistedstate`，将 `projectId` 等关键 ID 存入 `sessionStorage`。
3. **Error Handling**：
   - 摒弃当前直接展示 `traceback` 的做法。在 Nuxt 的请求拦截层，统一捕获错误并转换为用户友好的提示，控制台打印详细错误。

## 6. 总结

该蓝图通过**目录映射**和**逻辑解耦**指导代码迁移，通过**Pinia + Composables**解决状态混乱问题，并通过**Nitro Mock**完美解决了迁移期间测试大模型 API 耗费 Token 的痛点。建议按照“基建 -> 路由/状态 -> 核心逻辑提取 -> 联调”的步骤稳步推进。
