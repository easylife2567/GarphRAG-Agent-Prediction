import { ref, computed } from 'vue';
import {
    startSimulation,
    stopSimulation,
    getRunStatus,
    getRunStatusDetail,
} from '~/api/simulation';
import { useTaskPolling } from './useTaskPolling';

export function useSimulation() {
    const { startPolling, stopPolling, stopAllPolling } = useTaskPolling();

    const isStarting = ref(false);
    const isStopping = ref(false);
    const startError = ref(null);
    const runStatus = ref<any>({});
    const allActions = ref<any[]>([]);
    const actionIds = ref(new Set());
    const phase = ref(0); // 0: 未开始, 1: 运行中, 2: 已完成

    const prevTwitterRound = ref(0);
    const prevRedditRound = ref(0);

    const resetAllState = () => {
        phase.value = 0;
        runStatus.value = {};
        allActions.value = [];
        actionIds.value = new Set();
        prevTwitterRound.value = 0;
        prevRedditRound.value = 0;
        startError.value = null;
        isStarting.value = false;
        isStopping.value = false;
        stopAllPolling();
    };

    const fetchRunStatus = async (simulationId: string, logCallback: (msg: string) => void, statusCallback: (status: string) => void) => {
        try {
            const res = await getRunStatus(simulationId);
            if (res.success && res.data) {
                const data = res.data;
                runStatus.value = { ...data };

                if (data.twitter_current_round > prevTwitterRound.value) {
                    logCallback(`[Plaza] R${data.twitter_current_round}/${data.total_rounds} | T:${data.twitter_simulated_hours || 0}h | A:${data.twitter_actions_count}`);
                    prevTwitterRound.value = data.twitter_current_round;
                }

                if (data.reddit_current_round > prevRedditRound.value) {
                    logCallback(`[Community] R${data.reddit_current_round}/${data.total_rounds} | T:${data.reddit_simulated_hours || 0}h | A:${data.reddit_actions_count}`);
                    prevRedditRound.value = data.reddit_current_round;
                }

                const isCompleted = data.runner_status === 'completed' || data.runner_status === 'stopped';
                const platformsCompleted = checkPlatformsCompleted(data);

                if (isCompleted || platformsCompleted) {
                    if (platformsCompleted && !isCompleted) {
                        logCallback('✓ 检测到所有平台模拟已结束');
                    }
                    logCallback('✓ 模拟已完成');
                    phase.value = 2;
                    stopAllPolling();
                    statusCallback('completed');
                }
            }
        } catch (err) {
            console.warn('获取运行状态失败:', err);
        }
    };

    const checkPlatformsCompleted = (data: any) => {
        if (!data) return false;
        const twitterCompleted = data.twitter_completed === true;
        const redditCompleted = data.reddit_completed === true;
        const twitterEnabled = data.twitter_actions_count > 0 || data.twitter_running || twitterCompleted;
        const redditEnabled = data.reddit_actions_count > 0 || data.reddit_running || redditCompleted;
        if (!twitterEnabled && !redditEnabled) return false;
        if (twitterEnabled && !twitterCompleted) return false;
        if (redditEnabled && !redditCompleted) return false;
        return true;
    };

    const fetchRunStatusDetail = async (simulationId: string) => {
        try {
            const res = await getRunStatusDetail(simulationId);
            if (res.success && res.data) {
                const serverActions = res.data.all_actions || [];
                let newActionsAdded = 0;
                serverActions.forEach((action: any) => {
                    const actionId = action.id || `${action.timestamp}-${action.platform}-${action.agent_id}-${action.action_type}`;
                    if (!actionIds.value.has(actionId)) {
                        actionIds.value.add(actionId);
                        allActions.value.push({ ...action, _uniqueId: actionId });
                        newActionsAdded++;
                    }
                });
                if (newActionsAdded > 0) {
                    allActions.value = [...allActions.value];
                }
            }
        } catch (err) {
            console.warn('获取详细状态失败:', err);
        }
    };

    const doStartSimulation = async (simulationId: string, maxRounds: number | null, logCallback: (msg: string) => void, statusCallback: (status: string) => void) => {
        resetAllState();
        isStarting.value = true;
        logCallback('正在启动双平台并行模拟...');
        statusCallback('processing');

        try {
            const params: any = {
                simulation_id: simulationId,
                platform: 'parallel',
                force: true,
                enable_graph_memory_update: true,
            };
            if (maxRounds) {
                params.max_rounds = maxRounds;
                logCallback(`设置最大模拟轮数: ${maxRounds}`);
            }

            const res = await startSimulation(params);
            if (res.success && res.data) {
                logCallback('✓ 模拟引擎启动成功');
                phase.value = 1;
                runStatus.value = res.data;
                startPolling('status', () => fetchRunStatus(simulationId, logCallback, statusCallback), 2000);
                startPolling('detail', () => fetchRunStatusDetail(simulationId), 3000);
            } else {
                startError.value = res.error || '启动失败';
                logCallback(`✗ 启动失败: ${res.error || '未知错误'}`);
                statusCallback('error');
            }
        } catch (err: any) {
            startError.value = err.message;
            logCallback(`✗ 启动异常: ${err.message}`);
            statusCallback('error');
        } finally {
            isStarting.value = false;
        }
    };

    const handleStopSimulation = async (simulationId: string, logCallback: (msg: string) => void, statusCallback: (status: string) => void) => {
        isStopping.value = true;
        logCallback('正在停止模拟...');
        try {
            const res = await stopSimulation({ simulation_id: simulationId });
            if (res.success) {
                logCallback('✓ 模拟已停止');
                phase.value = 2;
                stopAllPolling();
                statusCallback('completed');
            } else {
                logCallback(`停止失败: ${res.error || '未知错误'}`);
            }
        } catch (err: any) {
            logCallback(`停止异常: ${err.message}`);
        } finally {
            isStopping.value = false;
        }
    };

    return {
        isStarting,
        isStopping,
        startError,
        runStatus,
        allActions,
        phase,
        doStartSimulation,
        handleStopSimulation,
        stopAllPolling
    };
}
