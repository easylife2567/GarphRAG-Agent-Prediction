<template>
    <div class="system-container">
        <!-- Main Content -->
        <main class="system-main">
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="hero-content">
                    <div class="status-indicator">
                        <span class="status-dot live"></span>
                        <span class="status-text">System Online & Ready</span>
                    </div>

                    <h1 class="hero-title">
                        Inject Reality.<br />
                        <span class="text-highlight">Simulate Future.</span>
                    </h1>

                    <p class="hero-desc">
                        基于核心认知图谱提取现实种子，毫秒级构建
                        <strong>百万级 Agent 平行世界</strong
                        >。通过全知视角注入变量干扰，在复杂的高维群体博弈中，动态坍缩出最优决策路径。
                    </p>
                </div>
            </section>

            <!-- Main Control Panel (Structured Layout) -->
            <section class="control-panel">
                <!-- Left: Execution Steps -->
                <aside class="panel-sidebar panel-steps">
                    <div class="panel-header">
                        <div class="icon-box">
                            <svg
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                stroke="currentColor"
                                stroke-width="2"
                                fill="none"
                            >
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                        </div>
                        <h3>Execution Pipeline</h3>
                    </div>
                    <div class="panel-body">
                        <div class="stepper-system">
                            <div
                                v-for="(step, i) in steps"
                                :key="i"
                                class="step-item"
                                :class="{
                                    active: activeStep === i,
                                    completed: activeStep > i,
                                    pending: activeStep < i,
                                }"
                            >
                                <div class="step-marker">
                                    <div class="marker-icon">
                                        <svg
                                            v-if="activeStep > i"
                                            viewBox="0 0 24 24"
                                            width="14"
                                            height="14"
                                            stroke="currentColor"
                                            stroke-width="3"
                                            fill="none"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        >
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        <span v-else>{{ i + 1 }}</span>
                                    </div>
                                    <div class="marker-line" v-if="i < steps.length - 1"></div>
                                </div>
                                <div class="step-content">
                                    <h4 class="step-title">{{ step.title }}</h4>
                                    <p class="step-desc" v-show="activeStep === i">
                                        {{ step.desc }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <!-- Center: Simulation Input (MAIN FOCUS) -->
                <div class="panel-main panel-input">
                    <div class="panel-header border-bottom">
                        <div class="icon-box">
                            <svg
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                stroke="currentColor"
                                stroke-width="2"
                                fill="none"
                            >
                                <polyline points="4 17 10 11 4 5"></polyline>
                                <line x1="12" y1="19" x2="20" y2="19"></line>
                            </svg>
                        </div>
                        <h3>Define Scenario</h3>
                        <span class="tag-engine">Engine: V1.0</span>
                    </div>
                    <div class="panel-body input-container">
                        <label class="input-label">Simulation Variables</label>
                        <div class="textarea-wrapper" :class="{ 'is-focused': isInputFocused }">
                            <textarea
                                v-model="formData.simulationRequirement"
                                class="system-textarea"
                                placeholder="Enter prediction variables here...&#10;e.g., 'If the university issues an announcement revoking the disciplinary action, what will be the trend of public opinion?'"
                                rows="6"
                                :disabled="loading"
                                @focus="isInputFocused = true"
                                @blur="isInputFocused = false"
                            ></textarea>
                            <div class="input-glow"></div>
                        </div>

                        <div class="action-footer">
                            <button
                                class="btn-primary-large"
                                @click="startSimulation"
                                :disabled="!canSubmit || loading"
                            >
                                <span class="btn-content" v-if="!loading">
                                    Initialize Simulation
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="18"
                                        height="18"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        fill="none"
                                    >
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </span>
                                <span class="btn-content" v-else>
                                    <svg
                                        class="spinner"
                                        viewBox="0 0 24 24"
                                        width="18"
                                        height="18"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        fill="none"
                                    >
                                        <line x1="12" y1="2" x2="12" y2="6"></line>
                                        <line x1="12" y1="18" x2="12" y2="22"></line>
                                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                                        <line x1="2" y1="12" x2="6" y2="12"></line>
                                        <line x1="18" y1="12" x2="22" y2="12"></line>
                                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                                    </svg>
                                    Processing...
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Right: Metrics & Upload -->
                <aside class="panel-sidebar panel-right">
                    <!-- System Metrics -->
                    <div class="panel panel-metrics">
                        <div class="panel-header border-bottom">
                            <div class="icon-box">
                                <svg
                                    viewBox="0 0 24 24"
                                    width="16"
                                    height="16"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    fill="none"
                                >
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="3" y1="9" x2="21" y2="9"></line>
                                    <line x1="9" y1="21" x2="9" y2="9"></line>
                                </svg>
                            </div>
                            <h3>System Metrics</h3>
                        </div>
                        <div class="panel-body">
                            <div class="metrics-grid">
                                <div class="metric-item">
                                    <div class="metric-label">Graph Nodes (Entities)</div>
                                    <div class="metric-value">
                                        {{ metrics.nodes.toLocaleString() }}
                                        <span class="trend up">↑ Live</span>
                                    </div>
                                </div>
                                <div class="metric-item">
                                    <div class="metric-label">Parallel Agents</div>
                                    <div class="metric-value">
                                        {{ (metrics.agents / 1000000).toFixed(3) }}M
                                        <span class="trend up">↑</span>
                                    </div>
                                </div>
                                <div class="metric-item">
                                    <div class="metric-label">Inference Latency</div>
                                    <div class="metric-value highlight">
                                        ~{{ metrics.latency.toFixed(1) }}ms
                                        <span class="trend down">Optimal</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Knowledge Base Upload -->
                    <div class="panel panel-upload">
                        <div class="panel-header border-bottom">
                            <div class="icon-box">
                                <svg
                                    viewBox="0 0 24 24"
                                    width="16"
                                    height="16"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    fill="none"
                                >
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                            </div>
                            <h3>Knowledge Base</h3>
                        </div>
                        <div class="panel-body">
                            <div
                                class="system-dropzone"
                                :class="{
                                    'is-dragover': isDragOver,
                                    'has-files': files.length > 0,
                                }"
                                @dragover.prevent="handleDragOver"
                                @dragleave.prevent="handleDragLeave"
                                @drop.prevent="handleDrop"
                                @click="triggerFileInput"
                            >
                                <input
                                    ref="fileInput"
                                    type="file"
                                    multiple
                                    accept=".pdf,.md,.txt"
                                    @change="handleFileSelect"
                                    style="display: none"
                                    :disabled="loading"
                                />

                                <div v-if="files.length === 0" class="drop-state-empty">
                                    <div class="upload-icon">
                                        <svg
                                            viewBox="0 0 24 24"
                                            width="20"
                                            height="20"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            fill="none"
                                        >
                                            <rect
                                                x="3"
                                                y="3"
                                                width="18"
                                                height="18"
                                                rx="2"
                                                ry="2"
                                            ></rect>
                                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                            <polyline points="21 15 16 10 5 21"></polyline>
                                        </svg>
                                    </div>
                                    <span class="drop-text">Click or drag files</span>
                                    <span class="drop-hint">PDF, MD, TXT</span>
                                </div>

                                <div v-else class="file-list">
                                    <div
                                        v-for="(file, index) in files"
                                        :key="index"
                                        class="file-item"
                                    >
                                        <svg
                                            class="file-icon"
                                            viewBox="0 0 24 24"
                                            width="14"
                                            height="14"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            fill="none"
                                        >
                                            <path
                                                d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
                                            ></path>
                                            <polyline points="13 2 13 9 20 9"></polyline>
                                        </svg>
                                        <span class="file-name" :title="file.name">{{
                                            file.name
                                        }}</span>
                                        <button @click.stop="removeFile(index)" class="btn-remove">
                                            <svg
                                                viewBox="0 0 24 24"
                                                width="14"
                                                height="14"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                fill="none"
                                            >
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </section>

            <!-- History Database -->
            <HistoryDatabase class="history-section" />
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from '#app';
import HistoryDatabase from '~/components/HistoryDatabase.vue';

const router = useRouter();

const steps = [
    { title: 'Knowledge Graph', desc: '提取现实种子并构建 GraphRAG 底层网络。' },
    { title: 'Environment Setup', desc: '抽取实体关系并配置高维仿真环境参数。' },
    { title: 'Parallel Simulate', desc: '双平台高并发推演，实时更新时序记忆。' },
    { title: 'Report Generate', desc: 'ReportAgent 多维度数据收敛与归因分析。' },
    { title: 'Deep Interaction', desc: '开启上帝视角与推演节点建立直接对话。' },
];

const activeStep = ref(0);
const isInputFocused = ref(false);

const metrics = ref({
    nodes: 8432,
    agents: 1205000,
    latency: 5.2,
});

// Simulate stepper progression and dynamic metrics
onMounted(() => {
    // Stepper carousel
    setInterval(() => {
        activeStep.value = (activeStep.value + 1) % steps.length;
    }, 3000);

    // Metrics fluctuation to simulate live system
    setInterval(() => {
        metrics.value.nodes += Math.floor(Math.random() * 5) + 1; // gradually increases
        metrics.value.agents += Math.floor(Math.random() * 200) + 50;
        metrics.value.latency = +(5 + (Math.random() * 0.8 - 0.4)).toFixed(1); // fluctuates around 5.0
    }, 1500);
});

const formData = ref({
    simulationRequirement: '',
});

const files = ref([]);
const loading = ref(false);
const isDragOver = ref(false);
const fileInput = ref(null);

const canSubmit = computed(() => {
    return formData.value.simulationRequirement.trim() !== '' && files.value.length > 0;
});

const triggerFileInput = () => {
    if (!loading.value) fileInput.value?.click();
};

const handleFileSelect = (event) => {
    addFiles(Array.from(event.target.files));
};

const handleDragOver = () => {
    if (!loading.value) isDragOver.value = true;
};
const handleDragLeave = () => {
    isDragOver.value = false;
};
const handleDrop = (e) => {
    isDragOver.value = false;
    if (!loading.value) addFiles(Array.from(e.dataTransfer.files));
};

const addFiles = (newFiles) => {
    const validFiles = newFiles.filter((file) => {
        const ext = file.name.split('.').pop().toLowerCase();
        return ['pdf', 'md', 'txt'].includes(ext);
    });
    files.value.push(...validFiles);
};

const removeFile = (index) => {
    files.value.splice(index, 1);
};

const startSimulation = () => {
    if (!canSubmit.value || loading.value) return;
    loading.value = true;
    activeStep.value = 2; // Jump stepper to running phase

    import('~/stores/project').then(({ useProjectStore }) => {
        const projectStore = useProjectStore();
        projectStore.setPendingUpload([...files.value], formData.value.simulationRequirement);

        setTimeout(() => {
            router.push({ path: '/process/new', query: { t: Date.now() } });
        }, 800);
    });
};
</script>

<style scoped>
/* Base System Styles */
.system-container {
    min-height: calc(100vh - 64px);
    background-color: transparent;
    color: var(--text-primary);
    font-family: var(--font-sans);
    position: relative;
    overflow-x: hidden;
}

/* Main Content */
.system-main {
    position: relative;
    z-index: 10;
    max-width: 1440px;
    margin: 0 auto;
    padding: 64px 32px;
    display: flex;
    flex-direction: column;
    gap: 64px;
}

/* Hero Section */
.hero-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.hero-content {
    max-width: 720px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.status-indicator {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 4px 12px;
    background: var(--bg-panel);
    border: 1px solid var(--border-dim);
    border-radius: 999px;
    margin-bottom: 24px;
}

.status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--text-muted);
}

.status-dot.live {
    background: var(--accent-success);
    box-shadow: 0 0 8px rgba(23, 201, 100, 0.4);
}

.status-text {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-secondary);
}

.hero-title {
    font-size: 3.5rem;
    line-height: 1.1;
    font-weight: 700;
    letter-spacing: -0.04em;
    margin: 0 0 24px 0;
    color: var(--text-secondary);
}

.text-highlight {
    color: var(--text-primary);
}

.hero-desc {
    font-size: 1.1rem;
    line-height: 1.6;
    color: var(--text-secondary);
    margin: 0;
}

.hero-desc strong {
    color: var(--text-primary);
    font-weight: 500;
}

/* Control Panel (Structured Layout) */
.control-panel {
    display: grid;
    grid-template-columns: 280px 1fr 320px;
    gap: 24px;
    align-items: start;
}

/* Panels */
.panel,
.panel-sidebar,
.panel-main {
    background: var(--bg-panel);
    border: 1px solid var(--border-dim);
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

.panel-main {
    min-height: 500px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    border-color: var(--border-bright);
}

.panel-right {
    background: transparent;
    border: none;
    box-shadow: none;
    gap: 24px;
}

.panel-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
}

.panel-header.border-bottom {
    border-bottom: 1px solid var(--border-dim);
}

.icon-box {
    color: var(--text-secondary);
    display: flex;
}

.panel-header h3 {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    flex: 1;
}

.tag-engine {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-secondary);
    background: var(--bg-base);
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid var(--border-dim);
}

.panel-body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
}

/* Left: Stepper System */
.stepper-system {
    display: flex;
    flex-direction: column;
    gap: 0;
}

.step-item {
    display: flex;
    gap: 16px;
    position: relative;
    padding-bottom: 24px;
}

.step-item:last-child {
    padding-bottom: 0;
}

.step-marker {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 24px;
}

.marker-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--bg-base);
    border: 1px solid var(--border-dim);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-secondary);
    z-index: 2;
    transition: var(--transition-smooth);
}

.marker-line {
    position: absolute;
    top: 24px;
    bottom: 0;
    left: 11.5px;
    width: 1px;
    background: var(--border-dim);
    z-index: 1;
}

.step-content {
    flex: 1;
    padding-top: 2px;
}

.step-title {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-secondary);
    margin: 0 0 4px 0;
    transition: var(--transition-smooth);
}

.step-desc {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin: 0;
    line-height: 1.5;
}

/* Stepper States */
.step-item.active .marker-icon {
    background: var(--text-primary);
    border-color: var(--text-primary);
    color: var(--bg-base);
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.2);
}

.step-item.active .step-title {
    color: var(--text-primary);
}

.step-item.completed .marker-icon {
    background: var(--bg-panel);
    border-color: var(--text-secondary);
    color: var(--text-primary);
}

.step-item.completed .step-title {
    color: var(--text-secondary);
}

.step-item.pending .marker-icon {
    opacity: 0.5;
}

/* Center: Simulation Input */
.input-container {
    gap: 16px;
}

.input-label {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-secondary);
}

.textarea-wrapper {
    position: relative;
    flex: 1;
    background: var(--bg-input);
    border: 1px solid var(--border-dim);
    border-radius: var(--radius-md);
    transition: var(--transition-smooth);
    display: flex;
    flex-direction: column;
}

.textarea-wrapper.is-focused {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 1px var(--border-focus);
}

.system-textarea {
    flex: 1;
    width: 100%;
    background: transparent;
    border: none;
    padding: 16px;
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: 0.9rem;
    line-height: 1.6;
    resize: none;
    outline: none;
}

.system-textarea::placeholder {
    color: var(--text-muted);
}

.action-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: auto;
}

.btn-primary-large {
    background: var(--accent-primary);
    color: var(--bg-base);
    border: none;
    border-radius: var(--radius-sm);
    padding: 12px 24px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-primary-large:not(:disabled):hover {
    background: var(--accent-primary-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

.btn-primary-large:disabled {
    background: var(--border-dim);
    color: var(--text-muted);
    cursor: not-allowed;
}

.btn-content {
    display: flex;
    align-items: center;
    gap: 8px;
}

/* Right: Metrics & Upload */
.metrics-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.metric-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.metric-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.metric-value {
    font-family: var(--font-mono);
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--text-primary);
    display: flex;
    align-items: baseline;
    gap: 8px;
}

.metric-value.highlight {
    color: var(--text-primary);
}

.trend {
    font-family: var(--font-sans);
    font-size: 0.75rem;
    font-weight: 500;
    padding: 2px 6px;
    border-radius: 4px;
}

.trend.up {
    color: var(--accent-success);
    background: rgba(23, 201, 100, 0.1);
}

.trend.down {
    color: var(--text-primary);
    background: var(--border-dim);
}

/* Dropzone */
.system-dropzone {
    border: 1px dashed var(--border-bright);
    border-radius: var(--radius-md);
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--transition-fast);
    background: var(--bg-base);
    min-height: 120px;
}

.system-dropzone:hover,
.system-dropzone.is-dragover {
    border-color: var(--border-focus);
    background: var(--bg-panel-hover);
}

.drop-state-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
}

.upload-icon {
    color: var(--text-secondary);
    margin-bottom: 4px;
}

.drop-text {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-primary);
}

.drop-hint {
    font-size: 0.75rem;
    color: var(--text-muted);
}

.file-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.file-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: var(--bg-panel);
    border: 1px solid var(--border-dim);
    border-radius: var(--radius-sm);
    gap: 8px;
}

.file-icon {
    color: var(--text-secondary);
}

.file-name {
    flex: 1;
    font-size: 0.8rem;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.btn-remove {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
}

.btn-remove:hover {
    color: var(--text-primary);
    background: var(--border-dim);
}

/* Utilities */
.spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

/* Responsive */
@media (max-width: 1024px) {
    .control-panel {
        grid-template-columns: 1fr;
    }
    .panel-sidebar {
        display: none; /* Simplify on mobile */
    }
    .panel-right {
        gap: 16px;
    }
    .hero-title {
        font-size: 2.5rem;
    }
}
</style>
