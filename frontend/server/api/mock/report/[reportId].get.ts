export default defineEventHandler(async (event) => {
    const reportId = getRouterParam(event, 'reportId') || 'mock_report_123';
    return {
        success: true,
        data: {
            report_id: reportId,
            title: 'Mock 舆情推演报告',
            summary: '这是基于 Mock 数据生成的报告摘要。',
            content: 'Mock 报告正文内容，用于联调页面展示。',
        },
    };
});
