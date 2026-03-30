import { mockConfig, mockProfiles } from './_state';

const bool = (v: unknown) => !!v;
type ProbeResult = { ok: boolean; data: any };
type HealthCheck = { key: string; name: string; ok: boolean };

export default defineEventHandler(
    async (
        event
    ): Promise<{ success: true; data: { updated_at: string; checks: HealthCheck[] } }> => {
        const protocol = getRequestProtocol(event);
        const host = getRequestHost(event);
        const base = `${protocol}://${host}`;

        const probe = async (
            path: string,
            method: 'GET' | 'POST' = 'GET'
        ): Promise<ProbeResult> => {
            try {
                const res: any = await $fetch(`${base}${path}`, {
                    method,
                });
                return { ok: !!res?.success, data: res?.data };
            } catch (error) {
                return { ok: false, data: null };
            }
        };

        const [
            graphProject,
            simCreate,
            simPrepare,
            simPrepareStatus,
            simConfigRealtime,
            simRunStatus,
            simRunDetail,
            reportGenerate,
            reportChat,
        ] = await Promise.all([
            probe('/api/mock/graph/project'),
            probe('/api/mock/simulation/create', 'POST'),
            probe('/api/mock/simulation/prepare', 'POST'),
            probe('/api/mock/simulation/prepare/status', 'POST'),
            probe('/api/mock/simulation/mock_sim_123/config/realtime'),
            probe('/api/mock/simulation/mock_sim_123/run-status'),
            probe('/api/mock/simulation/mock_sim_123/run-status/detail'),
            probe('/api/mock/report/generate', 'POST'),
            probe('/api/mock/report/chat', 'POST'),
        ]);

        const checks: HealthCheck[] = [
            {
                key: 'graph-core',
                name: '图谱阶段核心 Mock 已配置',
                ok: graphProject.ok,
            },
            {
                key: 'config-time',
                name: 'Step2 时间配置完整',
                ok:
                    bool(mockConfig?.time_config?.total_simulation_hours) &&
                    bool(mockConfig?.time_config?.minutes_per_round),
            },
            {
                key: 'config-event',
                name: 'Step2 事件配置完整',
                ok:
                    Array.isArray(mockConfig?.event_config?.hot_topics) &&
                    Array.isArray(mockConfig?.event_config?.initial_posts),
            },
            {
                key: 'config-platform',
                name: 'Step2 双平台配置完整',
                ok: bool(mockConfig?.twitter_config) && bool(mockConfig?.reddit_config),
            },
            {
                key: 'profiles',
                name: 'Step2 Agent Profiles 可用',
                ok: Array.isArray(mockProfiles) && mockProfiles.length > 0,
            },
            {
                key: 'run-status-shape',
                name: 'Step3 运行状态字段完整',
                ok:
                    simRunStatus.ok &&
                    bool(simRunStatus.data?.runner_status) &&
                    typeof simRunStatus.data?.twitter_actions_count === 'number' &&
                    typeof simRunStatus.data?.reddit_actions_count === 'number',
            },
            {
                key: 'run-detail-shape',
                name: 'Step3 动作时间线字段完整',
                ok: simRunDetail.ok && Array.isArray(simRunDetail.data?.all_actions),
            },
            {
                key: 'report-core',
                name: 'Step4/5 报告与互动 Mock 已配置',
                ok: reportGenerate.ok && reportChat.ok,
            },
            {
                key: 'sim-create',
                name: 'Step2 创建模拟接口可用',
                ok: simCreate.ok,
            },
            {
                key: 'sim-prepare',
                name: 'Step2 准备环境接口可用',
                ok: simPrepare.ok && simPrepareStatus.ok,
            },
            {
                key: 'sim-config',
                name: 'Step2 配置实时接口可用',
                ok: simConfigRealtime.ok,
            },
        ];

        return {
            success: true,
            data: {
                updated_at: new Date().toISOString(),
                checks,
            },
        };
    }
);
