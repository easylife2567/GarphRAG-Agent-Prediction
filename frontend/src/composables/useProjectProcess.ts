import { ref } from 'vue';
import { generateOntology, getProject, buildGraph, getTaskStatus, getGraphData } from '~/api/graph';
import { useTaskPolling } from './useTaskPolling';
import { useProjectStore } from '~/stores/project';
import { useRouter } from 'vue-router';

export function useProjectProcess() {
    const projectStore = useProjectStore();
    const router = useRouter();
    const { startPolling, stopPolling, stopAllPolling } = useTaskPolling();

    const loading = ref(false);
    const graphLoading = ref(false);
    const error = ref('');
    const projectData = ref<any>(null);
    const graphData = ref<any>(null);
    const currentPhase = ref(-1);
    const ontologyProgress = ref<any>(null);
    const buildProgress = ref<any>(null);

    const updatePhaseByStatus = (status: string) => {
        switch (status) {
            case 'created':
            case 'ontology_generated':
                currentPhase.value = 0;
                break;
            case 'graph_building':
                currentPhase.value = 1;
                break;
            case 'graph_completed':
                currentPhase.value = 2;
                break;
            case 'failed':
                error.value = 'Project failed';
                break;
        }
    };

    const fetchGraphData = async (projectId: string, logCallback: (msg: string) => void) => {
        graphLoading.value = true;
        try {
            const projRes = await getProject(projectId);
            if (projRes.success && projRes.data.graph_id) {
                projectData.value = {
                    ...(projectData.value || {}),
                    ...projRes.data,
                };
                const gRes = await getGraphData(projRes.data.graph_id);
                if (gRes.success) {
                    graphData.value = gRes.data;
                    const nodeCount = gRes.data.node_count || gRes.data.nodes?.length || 0;
                    const edgeCount = gRes.data.edge_count || gRes.data.edges?.length || 0;
                    if (nodeCount > 0 && currentPhase.value < 2) {
                        currentPhase.value = 2;
                    }
                    logCallback(`Graph data refreshed. Nodes: ${nodeCount}, Edges: ${edgeCount}`);
                }
            }
        } catch (err) {
            console.warn('Graph fetch error:', err);
        } finally {
            graphLoading.value = false;
        }
    };

    const pollTaskStatus = async (
        taskId: string,
        projectId: string,
        logCallback: (msg: string) => void
    ) => {
        try {
            const res = await getTaskStatus(taskId);
            if (res.success) {
                const task = res.data;

                if (task.message && task.message !== buildProgress.value?.message) {
                    logCallback(task.message);
                }

                buildProgress.value = { progress: task.progress || 0, message: task.message };

                if (task.status === 'completed') {
                    logCallback('Graph build task completed.');
                    stopPolling('taskStatus');
                    stopPolling('graphData');
                    currentPhase.value = 2;

                    const projRes = await getProject(projectId);
                    if (projRes.success && projRes.data.graph_id) {
                        projectData.value = projRes.data;
                        const gRes = await getGraphData(projRes.data.graph_id);
                        if (gRes.success) {
                            graphData.value = gRes.data;
                        }
                    }
                } else if (task.status === 'failed') {
                    stopPolling('taskStatus');
                    error.value = task.error;
                    logCallback(`Graph build task failed: ${task.error}`);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    const startGraphPolling = (projectId: string, logCallback: (msg: string) => void) => {
        logCallback('Started polling for graph data...');
        startPolling('graphData', () => fetchGraphData(projectId, logCallback), 3000);
    };

    const startPollingTask = (
        taskId: string,
        projectId: string,
        logCallback: (msg: string) => void
    ) => {
        startPolling('taskStatus', () => pollTaskStatus(taskId, projectId, logCallback), 2000);
    };

    const startBuildGraph = async (projectId: string, logCallback: (msg: string) => void) => {
        try {
            currentPhase.value = 1;
            buildProgress.value = { progress: 0, message: 'Starting build...' };
            logCallback('Initiating graph build...');

            const res = await buildGraph({ project_id: projectId });
            if (res.success) {
                logCallback(`Graph build task started. Task ID: ${res.data.task_id}`);
                startPollingTask(res.data.task_id, projectId, logCallback);
                startGraphPolling(projectId, logCallback);
            } else {
                error.value = res.error;
                logCallback(`Error starting build: ${res.error}`);
            }
        } catch (err: any) {
            error.value = err.message;
            logCallback(`Exception in startBuildGraph: ${err.message}`);
        }
    };

    const loadProject = async (projectId: string, logCallback: (msg: string) => void) => {
        try {
            loading.value = true;
            logCallback(`Loading project ${projectId}...`);
            const res = await getProject(projectId);
            if (res.success) {
                projectData.value = res.data;
                updatePhaseByStatus(res.data.status);
                logCallback(`Project loaded. Status: ${res.data.status}`);

                if (res.data.status === 'ontology_generated' && !res.data.graph_id) {
                    await startBuildGraph(projectId, logCallback);
                } else if (res.data.status === 'graph_building' && res.data.graph_build_task_id) {
                    currentPhase.value = 1;
                    startPollingTask(res.data.graph_build_task_id, projectId, logCallback);
                    startGraphPolling(projectId, logCallback);
                } else if (res.data.status === 'graph_completed' && res.data.graph_id) {
                    currentPhase.value = 2;
                    const gRes = await getGraphData(res.data.graph_id);
                    if (gRes.success) {
                        graphData.value = gRes.data;
                    }
                }
            } else {
                error.value = res.error;
                logCallback(`Error loading project: ${res.error}`);
            }
        } catch (err: any) {
            error.value = err.message;
            logCallback(`Exception in loadProject: ${err.message}`);
        } finally {
            loading.value = false;
        }
    };

    const handleNewProject = async (logCallback: (msg: string) => void) => {
        const pending = {
            isPending: projectStore.isPending,
            files: projectStore.pendingFiles,
            simulationRequirement: projectStore.pendingRequirement,
        };

        if (!pending.isPending || pending.files.length === 0) {
            logCallback('未检测到待上传文件，尝试恢复到最近的可用项目...');
            return 'mock_proj_123';
        }

        try {
            loading.value = true;
            currentPhase.value = 0;
            ontologyProgress.value = { message: 'Uploading and analyzing docs...' };
            logCallback('Starting ontology generation: Uploading files...');

            const formData = new FormData();
            pending.files.forEach((f: any) => formData.append('files', f));
            formData.append('simulation_requirement', pending.simulationRequirement);

            const res = await generateOntology(formData);
            if (res.success) {
                projectStore.clearPendingUpload();
                projectData.value = res.data;

                router.replace({
                    path: `/process/${res.data.project_id}`,
                    query: { t: Date.now() },
                });

                ontologyProgress.value = null;
                logCallback(`Ontology generated successfully for project ${res.data.project_id}`);
                await startBuildGraph(res.data.project_id, logCallback);
                return res.data.project_id;
            } else {
                error.value = res.error || 'Ontology generation failed';
                logCallback(`Error generating ontology: ${error.value}`);
            }
        } catch (err: any) {
            error.value = err.message;
            logCallback(`Exception in handleNewProject: ${err.message}`);
        } finally {
            loading.value = false;
        }
        return null;
    };

    return {
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
    };
}
