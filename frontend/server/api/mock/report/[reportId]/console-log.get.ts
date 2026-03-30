const mockConsoleLogs = [
    {
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: '[System] Loading simulation data for report...',
    },
    {
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: '[System] Found 100 posts and 20 agent profiles.',
    },
    {
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: '[System] Generating section summaries...',
    },
    {
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: '[System] Report rendering completed.',
    },
];

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const fromLine = Number(query.from_line) || 0;
    const limit = 2;
    const logs = mockConsoleLogs.slice(fromLine, fromLine + limit);

    return {
        success: true,
        data: {
            from_line: fromLine,
            logs,
        },
    };
});
