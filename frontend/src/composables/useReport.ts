import { ref, reactive } from 'vue';
import { getAgentLog, getConsoleLog } from '~/api/report';
import { useTaskPolling } from './useTaskPolling';

export function useReport() {
    const { startPolling, stopPolling, stopAllPolling } = useTaskPolling();

    const agentLogs = ref<any[]>([]);
    const consoleLogs = ref<any[]>([]);
    const agentLogLine = ref(0);
    const consoleLogLine = ref(0);
    const reportOutline = ref<any>(null);
    const generatedSections = ref<Record<string, any>>({});
    const currentSectionIndex = ref<number | null>(null);
    const expandedContent = ref(new Set<number>());
    const expandedLogs = ref(new Set<number>());
    const collapsedSections = ref(new Set<number>());
    const isCompleted = ref(false);
    const startTime = ref<Date | null>(null);
    const showRawResult = reactive<Record<string, boolean>>({});

    const formatTime = (isoString: string) => {
        try {
            return new Date(isoString).toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
        } catch {
            return '';
        }
    };

    const fetchAgentLog = async (reportId: string, updateStatusCallback: (status: string) => void, onLogsUpdated: () => void) => {
        if (!reportId) return;

        try {
            const res = await getAgentLog(reportId, agentLogLine.value);

            if (res.success && res.data) {
                const newLogs = res.data.logs || [];

                if (newLogs.length > 0) {
                    newLogs.forEach((log: any) => {
                        agentLogs.value.push(log);

                        if (log.action === 'planning_complete' && log.details?.outline) {
                            reportOutline.value = { ...log.details.outline };
                        }

                        if (log.action === 'section_start') {
                            currentSectionIndex.value = log.section_index;
                        }

                        if (log.action === 'section_complete') {
                            if (log.details?.content) {
                                generatedSections.value = {
                                    ...generatedSections.value,
                                    [log.section_index]: log.details.content,
                                };
                                expandedContent.value.add(log.section_index - 1);
                                currentSectionIndex.value = null;
                            }
                        }

                        if (log.action === 'report_complete') {
                            isCompleted.value = true;
                            currentSectionIndex.value = null;
                            updateStatusCallback('completed');
                        }

                        if (log.action === 'report_start') {
                            startTime.value = new Date(log.timestamp);
                        }
                    });

                    agentLogs.value = [...agentLogs.value];
                    agentLogLine.value = res.data.from_line + newLogs.length;
                    onLogsUpdated();
                }
            }
        } catch (err) {
            console.warn('Failed to fetch agent log:', err);
        }
    };

    const fetchConsoleLog = async (reportId: string, onLogsUpdated: () => void) => {
        if (!reportId) return;

        try {
            const res = await getConsoleLog(reportId, consoleLogLine.value);

            if (res.success && res.data) {
                const newLogs = res.data.logs || [];

                if (newLogs.length > 0) {
                    consoleLogs.value.push(...newLogs);
                    consoleLogs.value = [...consoleLogs.value];
                    consoleLogLine.value = res.data.from_line + newLogs.length;
                    onLogsUpdated();
                }
            }
        } catch (err) {
            console.warn('Failed to fetch console log:', err);
        }
    };

    const startPollingLogs = (reportId: string, updateStatusCallback: (status: string) => void, onAgentLogsUpdated: () => void, onConsoleLogsUpdated: () => void) => {
        stopAllPolling();
        fetchAgentLog(reportId, updateStatusCallback, onAgentLogsUpdated);
        fetchConsoleLog(reportId, onConsoleLogsUpdated);

        startPolling('agentLog', () => fetchAgentLog(reportId, updateStatusCallback, onAgentLogsUpdated), 2000);
        startPolling('consoleLog', () => fetchConsoleLog(reportId, onConsoleLogsUpdated), 1500);
    };

    const resetState = () => {
        agentLogs.value = [];
        consoleLogs.value = [];
        agentLogLine.value = 0;
        consoleLogLine.value = 0;
        reportOutline.value = null;
        currentSectionIndex.value = null;
        generatedSections.value = {};
        expandedContent.value.clear();
        expandedLogs.value.clear();
        collapsedSections.value.clear();
        isCompleted.value = false;
        startTime.value = null;
        for (const key in showRawResult) {
            delete showRawResult[key];
        }
    };

    return {
        agentLogs,
        consoleLogs,
        reportOutline,
        generatedSections,
        currentSectionIndex,
        expandedContent,
        expandedLogs,
        collapsedSections,
        isCompleted,
        startTime,
        showRawResult,
        startPollingLogs,
        stopPollingLogs: stopAllPolling,
        resetState
    };
}
