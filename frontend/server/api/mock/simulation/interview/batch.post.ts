export default defineEventHandler(() => {
    return {
        success: true,
        data: {
            interviews: [
                {
                    agent_id: 'agent_1',
                    answer: 'Mock 采访回答：当前讨论已经进入观点分化阶段。',
                },
            ],
        },
    };
});
