import { mockState, step4SimulatedActions } from '../../_state';

export default defineEventHandler(async (event) => {
    // 模拟增量拉取，每次返回 2 条，直到完毕
    const query = getQuery(event);
    const fromLine = Number(query.from_line) || 0;
    const allLogs =
        Array.isArray(mockState.reportActions) && mockState.reportActions.length > 0
            ? mockState.reportActions
            : step4SimulatedActions;
    const limit = 2; // 每次返回的增量条数

    const logs = allLogs.slice(fromLine, fromLine + limit);

    return {
        success: true,
        data: {
            from_line: fromLine,
            logs: logs,
        },
    };
});
