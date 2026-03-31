<template>
    <div class="main-view">
        <!-- 我们将内容注入到 default layout 的插槽中 -->
        <ClientOnly>
            <Teleport v-if="isMounted" to="#header-center">
                <div class="view-switcher">
                    <button
                        v-for="mode in ['graph', 'split', 'workbench']"
                        :key="mode"
                        class="switch-btn"
                        :class="{ active: viewMode === mode }"
                        @click="viewMode = mode"
                    >
                        {{ { graph: '图谱', split: '双栏', workbench: '工作台' }[mode] }}
                    </button>
                </div>
            </Teleport>

            <Teleport v-if="isMounted" to="#header-right">
                <div class="workflow-step">
                    <span class="step-num">Step {{ currentStep }}/5</span>
                    <span class="step-name">{{ stepNames[currentStep - 1] }}</span>
                </div>
                <div class="step-divider"></div>
                <span class="status-indicator" :class="statusClass">
                    <span class="dot"></span>
                    {{ statusText }}
                </span>
            </Teleport>
        </ClientOnly>

        <!-- Main Content Area -->
        <main class="content-area" :style="{ gap: viewMode === 'split' ? '16px' : '0px' }">
            <!-- Left Panel: Graph -->
            <div class="panel-wrapper panel left" :style="leftPanelStyle">
                <GraphPanel
                    :graphData="graphData"
                    :loading="graphLoading"
                    :currentPhase="currentPhase"
                    @refresh="refreshGraph"
                    @toggle-maximize="toggleMaximize('graph')"
                />
            </div>

            <!-- Right Panel: Step Components -->
            <div class="panel-wrapper panel right" :style="rightPanelStyle">
                <!-- Step 1: 图谱构建 -->
                <Step1GraphBuild
                    v-if="currentStep === 1"
                    :currentPhase="currentPhase"
                    :projectData="projectData"
                    :ontologyProgress="ontologyProgress"
                    :buildProgress="buildProgress"
                    :graphData="graphData"
                    :systemLogs="systemLogs"
                    @next-step="handleNextStep"
                />
                <!-- Step 2: 环境搭建 -->
                <Step2EnvSetup
                    v-else-if="currentStep === 2"
                    :simulationId="currentSimulationId"
                    :projectData="projectData"
                    :graphData="graphData"
                    :systemLogs="systemLogs"
                    @go-back="handleGoBack"
                    @next-step="handleNextStep"
                    @add-log="addLog"
                />
                <Step3Simulation
                    v-else-if="currentStep === 3"
                    :simulationId="currentSimulationId"
                    :maxRounds="selectedMaxRounds"
                    :projectData="projectData"
                    :graphData="graphData"
                    :systemLogs="systemLogs"
                    @go-back="handleGoBack"
                    @next-step="handleNextStep"
                    @add-log="addLog"
                />
                <Step4Report
                    v-else-if="currentStep === 4"
                    :reportId="currentReportId"
                    :simulationId="currentSimulationId"
                    :systemLogs="systemLogs"
                    @next-step="handleNextStep"
                    @add-log="addLog"
                />
                <Step5Interaction
                    v-else-if="currentStep === 5"
                    :reportId="currentReportId"
                    :simulationId="currentSimulationId"
                    @add-log="addLog"
                />
            </div>
        </main>
        <MockHealthPanel v-if="isMockMode" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { generateOntology, getProject, buildGraph, getTaskStatus, getGraphData } from '~/api/graph';
import { useProjectStore } from '~/stores/project';
import { useSimulationStore } from '~/stores/simulation';
import { useProjectProcess } from '~/composables/useProjectProcess';

const config = useRuntimeConfig();
const isMockMode = computed(() => config.public.mockMode);

const route = useRoute();
const router = useRouter();
const simulationStore = useSimulationStore();
const isMounted = ref(false);

const {
    loading,
    graphLoading,
    error,
    projectData,
    graphData,
    currentPhase,
    ontologyProgress,
    buildProgress,
    loadProject,
    handleNewProject,
    fetchGraphData,
    stopAllPolling,
} = useProjectProcess();

// Lifecycle
onMounted(() => {
    isMounted.value = true;
    // Let the DOM and store stabilize before starting the project initialization
    nextTick(() => {
        initProject();
    });
});

watch(
    () => route.params.projectId,
    (newVal, oldVal) => {
        if (newVal && newVal !== oldVal) {
            currentProjectId.value = newVal;
            initProject();
        }
    }
);

onUnmounted(() => {
    stopAllPolling();
});

// Layout State

const viewMode = ref('split'); // graph | split | workbench

// Step State
const currentStep = ref(1); // 1: 图谱构建, 2: 环境搭建, 3: 开始模拟, 4: 报告生成, 5: 深度互动
const stepNames = ['图谱构建', '环境搭建', '开始模拟', '报告生成', '深度互动'];
const currentSimulationId = ref(null);
const currentReportId = ref(null);
const selectedMaxRounds = ref(null);

// Data State
const currentProjectId = ref(route.params.projectId);
const systemLogs = ref([]);

// Polling timers are now managed by useTaskPolling

// --- Computed Layout Styles ---
const leftPanelStyle = computed(() => {
    if (viewMode.value === 'graph')
        return { width: '100%', opacity: 1, transform: 'translateX(0)' };
    if (viewMode.value === 'workbench')
        return { width: '0%', opacity: 0, transform: 'translateX(-20px)', border: 'none', padding: 0 };
    return { width: 'calc(50% - 8px)', opacity: 1, transform: 'translateX(0)' };
});

const rightPanelStyle = computed(() => {
    if (viewMode.value === 'workbench')
        return { width: '100%', opacity: 1, transform: 'translateX(0)' };
    if (viewMode.value === 'graph')
        return { width: '0%', opacity: 0, transform: 'translateX(20px)', border: 'none', padding: 0 };
    return { width: 'calc(50% - 8px)', opacity: 1, transform: 'translateX(0)' };
});

// --- Status Computed ---
const statusClass = computed(() => {
    if (error.value) return 'error';
    if (currentPhase.value >= 2) return 'completed';
    return 'processing';
});

const statusText = computed(() => {
    if (error.value) return 'Error';
    if (currentPhase.value >= 2) return 'Ready';
    if (currentPhase.value === 1) return 'Building Graph';
    if (currentPhase.value === 0) return 'Generating Ontology';
    return 'Initializing';
});

// --- Helpers ---
const addLog = (msg) => {
    const time =
        new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }) +
        '.' +
        new Date().getMilliseconds().toString().padStart(3, '0');
    systemLogs.value.push({ time, msg });
    // Keep last 100 logs
    if (systemLogs.value.length > 100) {
        systemLogs.value.shift();
    }
};

// --- Layout Methods ---
const toggleMaximize = (target) => {
    if (viewMode.value === target) {
        viewMode.value = 'split';
        addLog('视图已切换为双栏模式');
    } else {
        viewMode.value = target;
        addLog(`视图已切换为${target === 'graph' ? '图谱' : '工作台'}模式`);
    }
};

const handleNextStep = (params = {}) => {
    if (params.simulationId) {
        currentSimulationId.value = params.simulationId;
        simulationStore.setSimulationId(params.simulationId);
        simulationStore.setSimulationStatus('ready');
        addLog(`模拟实例已创建: ${params.simulationId}`);
    }
    if (params.reportId) {
        currentReportId.value = params.reportId;
        simulationStore.setReportId(params.reportId);
        simulationStore.setReportStatus('generating');
        addLog(`报告任务已创建: ${params.reportId}`);
    }
    if (params.maxRounds) {
        selectedMaxRounds.value = params.maxRounds;
    }
    if (currentStep.value < 5) {
        currentStep.value++;
        if (currentStep.value === 3) simulationStore.setSimulationStatus('running');
        if (currentStep.value === 4) simulationStore.setReportStatus('generating');
        if (currentStep.value === 5) simulationStore.setReportStatus('completed');
        addLog(`进入 Step ${currentStep.value}: ${stepNames[currentStep.value - 1]}`);

        // 如果是从 Step 2 进入 Step 3，记录模拟轮数配置
        if (currentStep.value === 3 && params.maxRounds) {
            addLog(`自定义模拟轮数: ${params.maxRounds} 轮`);
        }
    }
};

const handleGoBack = () => {
    if (currentStep.value > 1) {
        currentStep.value--;
        addLog(`返回 Step ${currentStep.value}: ${stepNames[currentStep.value - 1]}`);
    }
};

// --- Data Logic ---

const initProject = async () => {
    addLog('Project view initialized.');
    currentProjectId.value = route.params.projectId;
    simulationStore.reset();
    currentSimulationId.value = null;
    currentReportId.value = null;
    selectedMaxRounds.value = null;

    if (currentProjectId.value === 'new') {
        const newId = await handleNewProject(addLog);
        if (newId) {
            currentProjectId.value = newId;
            if (newId === 'mock_proj_123') {
                await loadProject(currentProjectId.value, addLog);
            }
        }
    } else {
        await loadProject(currentProjectId.value, addLog);
    }
};

const refreshGraph = () => {
    addLog('Manual graph refresh triggered.');
    fetchGraphData(currentProjectId.value, addLog);
};

// The onUnmounted and other lifecycle methods are already defined above
</script>

<style scoped>
.main-view {
    height: calc(100vh - 64px); /* Adjusted for layout nav */
    display: flex;
    flex-direction: column;
    background: transparent;
    overflow: hidden;
    font-family: var(--font-sans);
}

.view-switcher {
    display: flex;
    background: var(--bg-panel);
    padding: 4px;
    border-radius: var(--radius-sm);
    gap: 4px;
    border: 1px solid var(--border-dim);
}

.switch-btn {
    border: none;
    background: transparent;
    padding: 6px 16px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    border-radius: 4px;
    cursor: pointer;
    transition: var(--transition-fast);
}

.switch-btn.active {
    background: var(--border-dim);
    color: var(--text-primary);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 500;
}

.workflow-step {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
}

.step-num {
    font-family: var(--font-mono);
    font-weight: 700;
    color: var(--text-muted);
}

.step-name {
    font-weight: 700;
    color: var(--text-primary);
}

.step-divider {
    width: 1px;
    height: 14px;
    background-color: var(--border-dim);
}

.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--text-muted);
}

.status-indicator.processing .dot {
    background: var(--accent-success);
    animation: pulse 1s infinite;
}
.status-indicator.completed .dot {
    background: var(--accent-success);
}
.status-indicator.error .dot {
    background: var(--accent-error);
}

@keyframes pulse {
    50% { opacity: 0.5; }
}

/* Content */
.content-area {
    flex: 1;
    display: flex;
    position: relative;
    overflow: hidden;
    gap: 16px;
    padding: 16px;
}

.panel-wrapper {
    height: 100%;
    overflow: hidden;
    transition:
        width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
        opacity 0.3s ease,
        transform 0.3s ease;
    will-change: width, opacity, transform;
}

.panel-wrapper.left {
    /* border-right removed because .panel provides its own borders */
}
</style>
